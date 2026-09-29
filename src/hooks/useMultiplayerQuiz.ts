import { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../utils/audio';

export interface PlayerPublic {
  id: string;
  name: string;
  score: number;
  streak: number;
  currentQIndex: number;
  finished: boolean;
  isHost: boolean;
  avatar: string;
}

export interface QuestionPublic {
  id: string;
  unitId: number;
  sentence: string;
  options: string[];
  hint: string;
  correctAnswer?: string;
  explanation?: string;
}

export interface RoomPublicState {
  roomId: string;
  unitId: number | null;
  unitTitle: string;
  status: 'waiting' | 'starting' | 'in_progress' | 'completed';
  createdAt: number;
  players: PlayerPublic[];
  questions: QuestionPublic[];
  totalQuestions: number;
}

export interface OpenRoomSummary {
  roomId: string;
  unitTitle: string;
  playerCount: number;
  hostName: string;
  createdAt: number;
}

export interface AnswerResult {
  questionIndex: number;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  pointsEarned: number;
  playerScore: number;
  playerStreak: number;
  nextIndex: number;
  finished: boolean;
}

export function useMultiplayerQuiz() {
  const [connected, setConnected] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<RoomPublicState | null>(null);
  const [openRooms, setOpenRooms] = useState<OpenRoomSummary[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<AnswerResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and maintain WebSocket connection
  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setErrorMessage(null);
        // Refresh open room list
        ws.send(JSON.stringify({ action: 'room:list_open', payload: {} }));
      };

      ws.onmessage = (event) => {
        try {
          const { event: evName, payload } = JSON.parse(event.data);

          switch (evName) {
            case 'room:created':
            case 'room:joined':
              setPlayerId(payload.playerId);
              setRoomState(payload.roomState);
              setLastResult(null);
              setCountdown(null);
              setErrorMessage(null);
              soundManager.playCorrect();
              break;

            case 'room:update':
              setRoomState(payload);
              break;

            case 'room:open_list':
              setOpenRooms(payload.rooms || []);
              break;

            case 'game:starting':
              setCountdown(payload.countdown || 3);
              soundManager.playStreakBonus();
              break;

            case 'game:started':
              setCountdown(null);
              setRoomState(payload);
              setLastResult(null);
              soundManager.playCorrect();
              break;

            case 'game:answer_result':
              setLastResult(payload);
              if (payload.isCorrect) {
                soundManager.playCorrect();
              } else {
                soundManager.playIncorrect();
              }
              break;

            case 'game:completed':
              setRoomState(payload);
              soundManager.playStreakBonus();
              break;

            case 'error':
              setErrorMessage(payload.message || 'An error occurred.');
              soundManager.playIncorrect();
              break;
          }
        } catch {
          // parse error
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Schedule auto-reconnect
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        setConnected(false);
      };
    } catch {
      // ws init error
    }
  }, []);

  useEffect(() => {
    connect();

    // Poll open rooms every 6 seconds when not in active game
    const interval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && (!roomState || roomState.status === 'waiting')) {
        socketRef.current.send(JSON.stringify({ action: 'room:list_open', payload: {} }));
      }
    }, 6000);

    return () => {
      clearInterval(interval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect, roomState]);

  // Actions
  const createRoom = useCallback((playerName: string, unitId: number | null, avatar: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage('Connecting to live game server. Please try again in a moment.');
      connect();
      return;
    }
    setErrorMessage(null);
    socketRef.current.send(JSON.stringify({
      action: 'room:create',
      payload: { playerName, unitId, avatar }
    }));
  }, [connect]);

  const joinRoom = useCallback((roomCode: string, playerName: string, avatar: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage('Connecting to live game server. Please try again in a moment.');
      connect();
      return;
    }
    setErrorMessage(null);
    socketRef.current.send(JSON.stringify({
      action: 'room:join',
      payload: { roomCode: roomCode.trim().toUpperCase(), playerName, avatar }
    }));
  }, [connect]);

  const startGame = useCallback(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({
      action: 'game:start',
      payload: {}
    }));
  }, []);

  const submitAnswer = useCallback((questionIndex: number, chosenAnswer: string, responseTimeMs: number) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({
      action: 'game:submit_answer',
      payload: { questionIndex, chosenAnswer, responseTimeMs }
    }));
  }, []);

  const requestRematch = useCallback(() => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    setLastResult(null);
    socketRef.current.send(JSON.stringify({
      action: 'game:rematch',
      payload: {}
    }));
  }, []);

  const leaveRoom = useCallback(() => {
    setRoomState(null);
    setPlayerId(null);
    setLastResult(null);
    setCountdown(null);
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'room:list_open', payload: {} }));
    }
  }, []);

  const refreshOpenRooms = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'room:list_open', payload: {} }));
    }
  }, []);

  return {
    connected,
    playerId,
    roomState,
    openRooms,
    countdown,
    lastResult,
    errorMessage,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    requestRematch,
    leaveRoom,
    refreshOpenRooms,
  };
}
