import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { VocabWord } from '../types';
import { UNITS, VOCABULARY_LIST } from '../data/curriculumData';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Timer,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Tile {
  id: string;
  type: 'word' | 'definition';
  wordId: string;
  text: string;
  isMatched: boolean;
  isSelected: boolean;
}

interface SpeedMatchGameProps {
  initialUnitId?: number | null;
}

export const SpeedMatchGame: React.FC<SpeedMatchGameProps> = ({ initialUnitId = null }) => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(initialUnitId);
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedWordTile, setSelectedWordTile] = useState<Tile | null>(null);
  const [selectedDefTile, setSelectedDefTile] = useState<Tile | null>(null);

  // Filter pool based on unit
  const poolWords = useMemo(() => {
    return selectedUnit === null
      ? VOCABULARY_LIST
      : VOCABULARY_LIST.filter((w) => w.unitId === selectedUnit);
  }, [selectedUnit]);

  // Initialize a new round of 6 pairs
  const initRound = useCallback(() => {
    setSelectedWordTile(null);
    setSelectedDefTile(null);

    // Pick 6 random words from pool
    const shuffledPool = [...poolWords].sort(() => 0.5 - Math.random());
    const roundWords = shuffledPool.slice(0, Math.min(6, shuffledPool.length));

    const wordTiles: Tile[] = roundWords.map((w) => ({
      id: `w-${w.id}`,
      type: 'word',
      wordId: w.id,
      text: w.word,
      isMatched: false,
      isSelected: false,
    }));

    const defTiles: Tile[] = roundWords.map((w) => ({
      id: `d-${w.id}`,
      type: 'definition',
      wordId: w.id,
      text: w.definition,
      isMatched: false,
      isSelected: false,
    }));

    // Shuffle word and definition columns separately
    setTiles([
      ...wordTiles.sort(() => 0.5 - Math.random()),
      ...defTiles.sort(() => 0.5 - Math.random()),
    ]);

    setTimerActive(true);
    setIsGameOver(false);
  }, [poolWords]);

  useEffect(() => {
    initRound();
  }, [initRound, selectedUnit, round]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && !isGameOver) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, isGameOver]);

  // Handle tile click
  const handleTileClick = (tile: Tile) => {
    if (tile.isMatched) return;

    soundManager.playCardFlip();

    if (tile.type === 'word') {
      if (selectedWordTile?.id === tile.id) {
        // Deselect
        setSelectedWordTile(null);
      } else {
        setSelectedWordTile(tile);
        if (selectedDefTile) {
          checkMatch(tile, selectedDefTile);
        }
      }
    } else {
      if (selectedDefTile?.id === tile.id) {
        // Deselect
        setSelectedDefTile(null);
      } else {
        setSelectedDefTile(tile);
        if (selectedWordTile) {
          checkMatch(selectedWordTile, tile);
        }
      }
    }
  };

  const checkMatch = (wTile: Tile, dTile: Tile) => {
    if (wTile.wordId === dTile.wordId) {
      // MATCH!
      soundManager.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) setBestStreak(nextStreak);

      const pointsEarned = 100 + nextStreak * 25;
      setScore((prev) => prev + pointsEarned);

      if (nextStreak % 3 === 0) {
        soundManager.playStreakBonus();
      }

      setTiles((prev) =>
        prev.map((t) =>
          t.id === wTile.id || t.id === dTile.id
            ? { ...t, isMatched: true, isSelected: false }
            : t
        )
      );

      setSelectedWordTile(null);
      setSelectedDefTile(null);

      // Check if all matched
      setTimeout(() => {
        setTiles((currentTiles) => {
          const allDone = currentTiles.every((t) => t.isMatched);
          if (allDone) {
            setIsGameOver(true);
            setTimerActive(false);
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch {
              // ignore
            }
          }
          return currentTiles;
        });
      }, 250);
    } else {
      // INCORRECT
      soundManager.playIncorrect();
      setStreak(0);
      setSelectedWordTile(null);
      setSelectedDefTile(null);
    }
  };

  const wordTiles = tiles.filter((t) => t.type === 'word');
  const defTiles = tiles.filter((t) => t.type === 'definition');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <span>Vocabulary Speed Match</span>
            <span aria-hidden="true">·</span>
            <span>Round {round}</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            Rapid Definition Match
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pair each academic vocabulary word with its precise dictionary definition.
          </p>
        </div>

        {/* Stats & Unit Filter */}
        <div className="flex items-center flex-wrap gap-4 text-xs">
          <select
            value={selectedUnit ?? 'all'}
            onChange={(e) => {
              setSelectedUnit(e.target.value === 'all' ? null : Number(e.target.value));
              setRound(1);
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Units ({VOCABULARY_LIST.length} words)</option>
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.number}: {u.shortTitle}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-1 font-mono text-slate-700">
              <Timer className="w-3.5 h-3.5 text-slate-500" />
              <span>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1 font-mono font-bold text-emerald-700">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{score} pts</span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1 font-mono text-orange-600">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>Streak: {streak}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      {isGameOver ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-md space-y-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto">
            <h3 className="font-editorial text-3xl font-bold text-slate-900 mb-2">
              Round Complete!
            </h3>
            <p className="text-sm text-slate-600">
              Outstanding work! You paired all 6 academic words in {seconds} seconds with a high streak of {bestStreak}.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 py-4 border-y border-slate-100 max-w-sm mx-auto font-mono text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Total Score</span>
              <span className="text-xl font-bold text-slate-900">{score}</span>
            </div>
            <div className="border-r border-slate-200 h-8" />
            <div>
              <span className="text-xs text-slate-400 block">Time</span>
              <span className="text-xl font-bold text-slate-900">{seconds}s</span>
            </div>
            <div className="border-r border-slate-200 h-8" />
            <div>
              <span className="text-xs text-slate-400 block">Best Streak</span>
              <span className="text-xl font-bold text-orange-600">{bestStreak}x</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setRound((r) => r + 1);
                initRound();
              }}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next Round (6 New Words)</span>
            </button>
            <button
              onClick={() => {
                setScore(0);
                setSeconds(0);
                setStreak(0);
                initRound();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Game</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: Word Tiles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold uppercase tracking-wider text-indigo-700">Vocabulary Words</span>
              <span>Select a term</span>
            </div>

            <div className="space-y-2.5">
              {wordTiles.map((tile) => {
                const isSelected = selectedWordTile?.id === tile.id;
                if (tile.isMatched) {
                  return (
                    <div
                      key={tile.id}
                      className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-800 flex items-center justify-between opacity-60 transition-all"
                    >
                      <span className="font-editorial text-lg font-bold line-through decoration-emerald-500">
                        {tile.text}
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  );
                }

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    className={`w-full p-4 rounded-xl text-left border transition-all shadow-2xs flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-indigo-300 text-slate-900 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="font-editorial text-lg font-bold">
                      {tile.text}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {isSelected ? 'Selected' : 'Match'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Definition Tiles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold uppercase tracking-wider text-emerald-700">Definitions & Context</span>
              <span>Select the matching meaning</span>
            </div>

            <div className="space-y-2.5">
              {defTiles.map((tile) => {
                const isSelected = selectedDefTile?.id === tile.id;
                if (tile.isMatched) {
                  return (
                    <div
                      key={tile.id}
                      className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-800 opacity-60 transition-all text-xs leading-relaxed"
                    >
                      <span className="line-through decoration-emerald-500">{tile.text}</span>
                    </div>
                  );
                }

                return (
                  <button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    className={`w-full p-3.5 rounded-xl text-left border transition-all shadow-2xs ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-emerald-300 text-slate-800 hover:bg-slate-50/50'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {tile.text}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
