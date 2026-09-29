import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { CLOZE_QUESTIONS, VOCABULARY_LIST, UNITS } from './src/data/curriculumData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Real-time Quiz Game Room Types
interface Player {
  id: string;
  ws?: WebSocket;
  name: string;
  score: number;
  streak: number;
  currentQIndex: number;
  finished: boolean;
  isHost: boolean;
  avatar: string;
  lastActive: number;
}

interface QuizQuestion {
  id: string;
  unitId: number;
  sentence: string;
  blankWord: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

interface Room {
  id: string; // 6-char code
  unitId: number | null;
  unitTitle: string;
  status: 'waiting' | 'starting' | 'in_progress' | 'completed';
  createdAt: number;
  players: Map<string, Player>;
  questions: QuizQuestion[];
  totalQuestions: number;
}

const rooms = new Map<string, Room>();

// Helper to generate room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate questions for a room
function generateQuestionsForRoom(unitId: number | null, count: number = 5): QuizQuestion[] {
  let pool = unitId === null ? [...CLOZE_QUESTIONS] : CLOZE_QUESTIONS.filter((q) => q.unitId === unitId);

  // If cloze pool is small, generate additional questions from VOCABULARY_LIST
  if (pool.length < count) {
    const vocabPool = unitId === null ? [...VOCABULARY_LIST] : VOCABULARY_LIST.filter((w) => w.unitId === unitId);
    const extraQuestions: QuizQuestion[] = vocabPool.map((v) => {
      // create a cloze from example sentence or definition
      const targetWord = v.word;
      const sentence = v.exampleSentence.replace(new RegExp(`\\b${targetWord}\\b`, 'gi'), '________');

      // 3 wrong distractors from other words in VOCABULARY_LIST
      const otherWords = VOCABULARY_LIST.filter((w) => w.word !== targetWord).map((w) => w.word);
      const shuffledOthers = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [targetWord, ...shuffledOthers].sort(() => 0.5 - Math.random());

      return {
        id: `gen-${v.id}`,
        unitId: v.unitId,
        sentence,
        blankWord: targetWord,
        options,
        correctAnswer: targetWord,
        explanation: `${targetWord} (${v.partOfSpeech}): ${v.definition}`,
        hint: `Part of speech: ${v.partOfSpeech}. Collocation: ${v.collocations?.[0] || 'Academic'}`
      };
    });

    pool = [...pool, ...extraQuestions];
  }

  // Shuffle and pick `count`
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Helper to sanitize room state for clients (omit WS instances)
function getRoomPublicState(room: Room) {
  const playersList = Array.from(room.players.values()).map((p) => ({
    id: p.id,
    name: p.name,
    score: p.score,
    streak: p.streak,
    currentQIndex: p.currentQIndex,
    finished: p.finished,
    isHost: p.isHost,
    avatar: p.avatar,
  }));

  // Sanitize questions so correct answers are not leaked during in_progress
  const safeQuestions = room.questions.map((q) => ({
    id: q.id,
    unitId: q.unitId,
    sentence: q.sentence,
    options: q.options,
    hint: q.hint,
    // only expose correctAnswer and explanation if completed
    ...(room.status === 'completed' ? { correctAnswer: q.correctAnswer, explanation: q.explanation } : {})
  }));

  return {
    roomId: room.id,
    unitId: room.unitId,
    unitTitle: room.unitTitle,
    status: room.status,
    createdAt: room.createdAt,
    players: playersList,
    questions: safeQuestions,
    totalQuestions: room.totalQuestions,
  };
}

// Broadcast to all connected players in room
function broadcastToRoom(room: Room, event: string, payload: unknown) {
  const message = JSON.stringify({ event, payload });
  room.players.forEach((player) => {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(message);
    }
  });
}

// WebSocket Connection Management
wss.on('connection', (ws) => {
  let boundPlayerId: string | null = null;
  let boundRoomId: string | null = null;

  ws.on('message', (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      const { action, payload } = data;

      switch (action) {
        case 'room:create': {
          const { playerName, unitId, avatar } = payload;
          let code = generateRoomCode();
          while (rooms.has(code)) {
            code = generateRoomCode();
          }

          const unitObj = UNITS.find((u) => u.id === unitId);
          const unitTitle = unitObj ? `${unitObj.number}: ${unitObj.shortTitle}` : 'All Units';

          const questions = generateQuestionsForRoom(unitId, 5);

          const playerId = `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          boundPlayerId = playerId;
          boundRoomId = code;

          const hostPlayer: Player = {
            id: playerId,
            ws,
            name: playerName || 'Student',
            score: 0,
            streak: 0,
            currentQIndex: 0,
            finished: false,
            isHost: true,
            avatar: avatar || '🦁',
            lastActive: Date.now(),
          };

          const newRoom: Room = {
            id: code,
            unitId: unitId ?? null,
            unitTitle,
            status: 'waiting',
            createdAt: Date.now(),
            players: new Map([[playerId, hostPlayer]]),
            questions,
            totalQuestions: questions.length,
          };

          rooms.set(code, newRoom);

          ws.send(JSON.stringify({
            event: 'room:created',
            payload: {
              roomCode: code,
              playerId,
              roomState: getRoomPublicState(newRoom),
            }
          }));
          break;
        }

        case 'room:join': {
          const { roomCode, playerName, avatar } = payload;
          const cleanCode = (roomCode || '').toUpperCase().trim();
          const room = rooms.get(cleanCode);

          if (!room) {
            ws.send(JSON.stringify({
              event: 'error',
              payload: { message: `Room "${cleanCode}" not found. Please verify the 5-letter code.` }
            }));
            return;
          }

          if (room.status !== 'waiting' && room.status !== 'starting') {
            ws.send(JSON.stringify({
              event: 'error',
              payload: { message: 'This challenge has already started.' }
            }));
            return;
          }

          if (room.players.size >= 4) {
            ws.send(JSON.stringify({
              event: 'error',
              payload: { message: 'Room is full (maximum 4 players).' }
            }));
            return;
          }

          const playerId = `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          boundPlayerId = playerId;
          boundRoomId = cleanCode;

          const newPlayer: Player = {
            id: playerId,
            ws,
            name: playerName || `Player ${room.players.size + 1}`,
            score: 0,
            streak: 0,
            currentQIndex: 0,
            finished: false,
            isHost: false,
            avatar: avatar || '🚀',
            lastActive: Date.now(),
          };

          room.players.set(playerId, newPlayer);

          ws.send(JSON.stringify({
            event: 'room:joined',
            payload: {
              roomCode: cleanCode,
              playerId,
              roomState: getRoomPublicState(room),
            }
          }));

          // Notify everyone in room
          broadcastToRoom(room, 'room:update', getRoomPublicState(room));
          break;
        }

        case 'room:list_open': {
          // List rooms waiting for players
          const openRooms = Array.from(rooms.values())
            .filter((r) => r.status === 'waiting' && r.players.size < 4)
            .map((r) => ({
              roomId: r.id,
              unitTitle: r.unitTitle,
              playerCount: r.players.size,
              hostName: Array.from(r.players.values()).find((p) => p.isHost)?.name || 'Host',
              createdAt: r.createdAt,
            }));

          ws.send(JSON.stringify({
            event: 'room:open_list',
            payload: { rooms: openRooms }
          }));
          break;
        }

        case 'game:start': {
          if (!boundRoomId || !boundPlayerId) return;
          const room = rooms.get(boundRoomId);
          if (!room) return;

          const player = room.players.get(boundPlayerId);
          if (!player || !player.isHost) {
            ws.send(JSON.stringify({
              event: 'error',
              payload: { message: 'Only the match host can start the game.' }
            }));
            return;
          }

          room.status = 'starting';
          broadcastToRoom(room, 'game:starting', { countdown: 3 });

          setTimeout(() => {
            if (room.status === 'starting') {
              room.status = 'in_progress';
              broadcastToRoom(room, 'game:started', getRoomPublicState(room));
            }
          }, 3000);
          break;
        }

        case 'game:submit_answer': {
          if (!boundRoomId || !boundPlayerId) return;
          const room = rooms.get(boundRoomId);
          if (!room || room.status !== 'in_progress') return;

          const player = room.players.get(boundPlayerId);
          if (!player || player.finished) return;

          const { questionIndex, chosenAnswer, responseTimeMs } = payload;
          const question = room.questions[questionIndex];

          if (!question) return;

          const isCorrect = chosenAnswer === question.correctAnswer;
          let pointsEarned = 0;

          if (isCorrect) {
            player.streak += 1;
            // 100 base points + speed bonus (up to 50 pts) + streak bonus (up to 40 pts)
            const speedBonus = Math.max(0, Math.round((10000 - Math.min(responseTimeMs || 3000, 10000)) / 200));
            const streakBonus = Math.min(player.streak * 10, 40);
            pointsEarned = 100 + speedBonus + streakBonus;
            player.score += pointsEarned;
          } else {
            player.streak = 0;
          }

          player.currentQIndex = questionIndex + 1;
          if (player.currentQIndex >= room.totalQuestions) {
            player.finished = true;
          }

          // Send direct private evaluation to this player
          ws.send(JSON.stringify({
            event: 'game:answer_result',
            payload: {
              questionIndex,
              isCorrect,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              pointsEarned,
              playerScore: player.score,
              playerStreak: player.streak,
              nextIndex: player.currentQIndex,
              finished: player.finished,
            }
          }));

          // Check if all players finished
          const allFinished = Array.from(room.players.values()).every((p) => p.finished);
          if (allFinished) {
            room.status = 'completed';
            broadcastToRoom(room, 'game:completed', getRoomPublicState(room));
          } else {
            // Broadcast updated scores and progress to all players
            broadcastToRoom(room, 'room:update', getRoomPublicState(room));
          }
          break;
        }

        case 'game:rematch': {
          if (!boundRoomId || !boundPlayerId) return;
          const room = rooms.get(boundRoomId);
          if (!room) return;

          // Reset all players
          room.players.forEach((p) => {
            p.score = 0;
            p.streak = 0;
            p.currentQIndex = 0;
            p.finished = false;
          });

          // Generate fresh questions
          room.questions = generateQuestionsForRoom(room.unitId, 5);
          room.totalQuestions = room.questions.length;
          room.status = 'waiting';

          broadcastToRoom(room, 'room:update', getRoomPublicState(room));
          break;
        }
      }
    } catch {
      // JSON parse error
    }
  });

  ws.on('close', () => {
    if (boundRoomId && boundPlayerId) {
      const room = rooms.get(boundRoomId);
      if (room) {
        room.players.delete(boundPlayerId);
        if (room.players.size === 0) {
          // Clean up empty room
          rooms.delete(boundRoomId);
        } else {
          // If host left, designate next player as host
          const remaining = Array.from(room.players.values());
          if (!remaining.some((p) => p.isHost)) {
            remaining[0].isHost = true;
          }
          broadcastToRoom(room, 'room:update', getRoomPublicState(room));
        }
      }
    }
  });
});

// Periodic cleanup of stale rooms older than 2 hours
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, code) => {
    if (now - room.createdAt > 2 * 60 * 60 * 1000) {
      rooms.delete(code);
    }
  });
}, 15 * 60 * 1000);

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Stage 11 Server] Listening on http://0.0.0.0:${PORT} (WS on /ws)`);
  });
}

startServer();
