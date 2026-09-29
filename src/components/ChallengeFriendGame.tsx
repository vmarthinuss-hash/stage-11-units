import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useMultiplayerQuiz, PlayerPublic, QuestionPublic } from '../hooks/useMultiplayerQuiz';
import { UNITS } from '../data/curriculumData';
import { speakWord, soundManager } from '../utils/audio';
import {
  Users,
  Trophy,
  Swords,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Volume2,
  AlertCircle,
  Clock,
  Flame,
  ArrowRight,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface ChallengeFriendGameProps {
  initialUnitId?: number | null;
}

const AVATARS = ['🦁', '🚀', '⚡', '🦉', '🎓', '🌟', '🦊', '🐯', '🦅', '🎯'];

export const ChallengeFriendGame: React.FC<ChallengeFriendGameProps> = ({ initialUnitId = null }) => {
  const {
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
  } = useMultiplayerQuiz();

  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('lexicraft_player_name') || 'Student';
    } catch {
      return 'Student';
    }
  });

  const [selectedAvatar, setSelectedAvatar] = useState<string>('🦁');
  const [selectedUnit, setSelectedUnit] = useState<number | null>(initialUnitId);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Question response timer
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState<number>(15);

  const me: PlayerPublic | undefined = roomState?.players.find((p) => p.id === playerId);
  const isHost = me?.isHost || false;

  // Persist player name
  const handleNameChange = (name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('lexicraft_player_name', name);
    } catch {
      // ignore
    }
  };

  // Timer for current question
  useEffect(() => {
    if (roomState?.status === 'in_progress' && me && !me.finished) {
      setQuestionStartTime(Date.now());
      setTimeLeft(15);
      setSelectedOption(null);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [roomState?.status, me?.currentQIndex, me?.finished]);

  // Handle victory confetti
  useEffect(() => {
    if (roomState?.status === 'completed') {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, [roomState?.status]);

  const handleCopyCode = () => {
    if (!roomState) return;
    navigator.clipboard.writeText(roomState.roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOptionClick = (option: string) => {
    if (!me || me.finished || selectedOption !== null) return;
    const responseTimeMs = Date.now() - questionStartTime;
    setSelectedOption(option);
    submitAnswer(me.currentQIndex, option, responseTimeMs);
  };

  // -------------------------------------------------------------
  // SCREEN 1: LOBBY & MATCHMAKING
  // -------------------------------------------------------------
  if (!roomState) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
              <Swords className="w-3.5 h-3.5" />
              <span>Multiplayer Arena</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 font-mono">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span>{connected ? 'Live Connected' : 'Connecting to Server...'}</span>
              </span>
            </div>
            <h2 className="font-editorial text-2xl font-bold text-slate-900">
              Challenge a Classmate
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compete in real-time head-to-head vocabulary quizzes and climb the classroom leaderboard.
            </p>
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            1. Player Profile
          </span>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Your Nickname
              </label>
              <input
                type="text"
                maxLength={18}
                value={playerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Choose Avatar
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                      selectedAvatar === av
                        ? 'bg-rose-100 border-2 border-rose-500 scale-110 shadow-xs'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matchmaking Options Grid (Create Room vs Join with Code) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A: Create a Match Room */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
                  <Play className="w-4 h-4 fill-rose-600 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-slate-900">
                    Host a Match
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose a unit, create a private room, and invite a friend.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Vocabulary Topic
                </label>
                <select
                  value={selectedUnit ?? 'all'}
                  onChange={(e) => setSelectedUnit(e.target.value === 'all' ? null : Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">All Curriculum Units (Mixed Challenge)</option>
                  {UNITS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.number}: {u.shortTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => createRoom(playerName, selectedUnit, selectedAvatar)}
              disabled={!connected}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50"
            >
              <Swords className="w-4 h-4" />
              <span>Create Challenge Room</span>
            </button>
          </div>

          {/* Option B: Join with Code */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-slate-900">
                    Join with Code
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the 5-letter invite code from your classmate.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  5-Letter Room Code
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. KV79P"
                  className="w-full font-mono uppercase tracking-widest text-center text-lg font-bold px-3 py-2 text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={() => joinRoom(joinCodeInput, playerName, selectedAvatar)}
              disabled={!connected || joinCodeInput.trim().length === 0}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50"
            >
              <span>Enter Match</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Public Classrooms Waiting List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <h3 className="font-editorial text-base font-bold text-slate-900">
                Active Classmate Lobbies ({openRooms.length})
              </h3>
            </div>
            <button
              onClick={refreshOpenRooms}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {openRooms.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
              No open challenges waiting right now. Host a room above and share your code with a classmate!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {openRooms.map((r) => (
                <div key={r.roomId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {r.roomId}
                      </span>
                      <span className="font-bold text-slate-800">{r.hostName}'s Challenge</span>
                    </div>
                    <p className="text-slate-500 text-xs">
                      Topic: {r.unitTitle} · {r.playerCount}/4 Players
                    </p>
                  </div>

                  <button
                    onClick={() => joinRoom(r.roomId, playerName, selectedAvatar)}
                    className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Join Room
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: WAITING ROOM (Pre-match Lobby & Countdown)
  // -------------------------------------------------------------
  if (roomState.status === 'waiting' || roomState.status === 'starting') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-center">
          {/* Room Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded">
              Challenge Lobby · {roomState.unitTitle}
            </span>
            <h3 className="font-editorial text-3xl font-bold text-slate-900">
              Waiting for Players
            </h3>
            <p className="text-xs text-slate-500">
              Share the room code below with your friend so they can join.
            </p>
          </div>

          {/* Large Invite Code Box */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-5 max-w-sm mx-auto space-y-2">
            <span className="text-xs text-slate-400 font-medium">Room Invite Code:</span>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-slate-900">
              {roomState.roomId}
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mx-auto"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Connected Players Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Challengers ({roomState.players.length} / 4)
            </span>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {roomState.players.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-left ${
                    p.id === playerId
                      ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="overflow-hidden">
                    <span className="font-bold text-sm text-slate-900 block truncate">
                      {p.name} {p.id === playerId ? '(You)' : ''}
                    </span>
                    <span className="text-2xs text-slate-400 font-mono">
                      {p.isHost ? '★ Host' : 'Ready'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countdown Display if starting */}
          {countdown !== null && (
            <div className="py-4 bg-rose-600 text-white rounded-xl shadow-lg animate-bounce">
              <span className="text-xs uppercase tracking-widest block font-bold">Match Starting In</span>
              <span className="font-mono text-5xl font-black">{countdown}</span>
            </div>
          )}

          {/* Host Controls */}
          {countdown === null && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={leaveRoom}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave Room</span>
              </button>

              {isHost ? (
                <button
                  onClick={startGame}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-md"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Vocabulary Match ({roomState.players.length} Players)</span>
                </button>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Waiting for host ({roomState.players.find((p) => p.isHost)?.name}) to start the match...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 3: LIVE HEAD-TO-HEAD MATCH ARENA
  // -------------------------------------------------------------
  if (roomState.status === 'in_progress') {
    const currentQIndex = me?.currentQIndex ?? 0;
    const currentQuestion: QuestionPublic | undefined = roomState.questions[currentQIndex];

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Live Scoreboard Race Track */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <Swords className="w-4 h-4" />
              <span>Live Race Track · {roomState.unitTitle}</span>
            </span>
            <span className="font-mono">
              Question {Math.min(currentQIndex + 1, roomState.totalQuestions)} of {roomState.totalQuestions}
            </span>
          </div>

          {/* Player Progress Bars */}
          <div className="space-y-3">
            {roomState.players.map((p) => {
              const progressPct = Math.round((p.currentQIndex / roomState.totalQuestions) * 100);
              const isMe = p.id === playerId;
              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span>{p.avatar}</span>
                      <span className={`font-bold ${isMe ? 'text-rose-900' : 'text-slate-800'}`}>
                        {p.name} {isMe ? '(You)' : ''}
                      </span>
                      {p.streak >= 2 && (
                        <span className="flex items-center text-orange-600 font-mono text-2xs font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                          <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
                          {p.streak}x
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-slate-900">{p.score} pts</span>
                      {p.finished && <span className="text-emerald-600 font-bold">✓ Finished</span>}
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isMe ? 'bg-rose-600' : 'bg-slate-700'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* If this player finished but waiting for others */}
        {me?.finished ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-md space-y-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-slate-900">
              You've Finished All Questions!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your final score: <strong className="font-mono text-slate-900">{me.score} pts</strong>. Waiting for your classmate to complete the final round...
            </p>
          </div>
        ) : currentQuestion ? (
          /* Active Question Card */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
            {/* Question Header & Timer */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentQIndex + 1}
              </span>

              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${
                  timeLeft <= 4 ? 'bg-rose-50 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s (Speed Bonus)</span>
                </div>
              </div>
            </div>

            {/* Sentence with blank */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80">
              <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
                {currentQuestion.sentence}
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt;
                let btnStyle = 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 text-slate-800';

                if (selectedOption !== null) {
                  if (lastResult?.correctAnswer === opt) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                  } else if (isSelected && !lastResult?.isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                  } else {
                    btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt}
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionClick(opt)}
                    className={`p-4 rounded-xl border font-editorial text-base sm:text-lg transition-all shadow-2xs flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && lastResult?.correctAnswer === opt && (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result callout if answered */}
            {lastResult && selectedOption !== null && (
              <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
                lastResult.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>{lastResult.isCorrect ? `✓ Correct! +${lastResult.pointsEarned} pts` : `✗ Incorrect`}</span>
                  <button
                    onClick={() => speakWord(lastResult.correctAnswer)}
                    className="flex items-center gap-1 font-semibold text-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Pronounce</span>
                  </button>
                </div>
                <p className="italic">
                  {lastResult.explanation}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 4: GAME OVER & PODIUM
  // -------------------------------------------------------------
  if (roomState.status === 'completed') {
    // Rank players by score
    const ranked = [...roomState.players].sort((a, b) => b.score - a.score);
    const winner = ranked[0];
    const isWinner = winner.id === playerId;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-md space-y-6 text-center">
          {/* Winner Badge */}
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500 border border-amber-200 shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
              Match Completed · {roomState.unitTitle}
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900">
              {isWinner ? '🎉 Victory! You Won!' : `${winner.name} Takes the Win!`}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Great academic effort from both competitors! Review your performance below.
            </p>
          </div>

          {/* Podium Scoreboard */}
          <div className="space-y-2 max-w-md mx-auto">
            {ranked.map((p, idx) => (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                  idx === 0
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm w-5 text-slate-500">
                    #{idx + 1}
                  </span>
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="text-left">
                    <span className="font-bold text-slate-900 block">
                      {p.name} {p.id === playerId ? '(You)' : ''}
                    </span>
                    <span className="text-slate-400 text-2xs">
                      {idx === 0 ? '🏆 1st Place Champion' : 'Runner-Up'}
                    </span>
                  </div>
                </div>

                <div className="font-mono text-right">
                  <span className="text-base font-bold text-slate-900 block">{p.score} pts</span>
                  <span className="text-2xs text-slate-400">Best Streak: {p.streak}x</span>
                </div>
              </div>
            ))}
          </div>

          {/* Rematch & Navigation Controls */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={requestRematch}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch with New Words</span>
            </button>

            <button
              onClick={leaveRoom}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <span>Back to Lobby</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
