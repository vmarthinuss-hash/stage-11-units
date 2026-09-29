import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { VocabWord } from '../types';
import { UNITS, VOCABULARY_LIST } from '../data/curriculumData';
import { soundManager, speakWord } from '../utils/audio';
import {
  Volume2,
  Sparkles,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Trophy
} from 'lucide-react';

interface WordScrambleGameProps {
  initialUnitId?: number | null;
}

interface LetterTile {
  id: string;
  char: string;
  isUsed: boolean;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ initialUnitId = null }) => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(initialUnitId);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [placedLetters, setPlacedLetters] = useState<{ id: string; char: string }[]>([]);
  const [availableLetters, setAvailableLetters] = useState<LetterTile[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Filter pool
  const pool = useMemo(() => {
    return selectedUnit === null
      ? VOCABULARY_LIST
      : VOCABULARY_LIST.filter((w) => w.unitId === selectedUnit);
  }, [selectedUnit]);

  const currentWord: VocabWord = pool[currentIndex] || pool[0];

  // Initialize letters for current word
  const initWord = useCallback(() => {
    if (!currentWord) return;
    setIsSolved(false);
    setPlacedLetters([]);
    setHintsUsed(0);

    const cleanChars = currentWord.word.toUpperCase().replace(/[^A-Z]/g, '').split('');
    const tiles: LetterTile[] = cleanChars.map((char, index) => ({
      id: `${char}-${index}-${Math.random()}`,
      char,
      isUsed: false,
    }));

    // Shuffle tiles
    setAvailableLetters([...tiles].sort(() => 0.5 - Math.random()));
  }, [currentWord]);

  useEffect(() => {
    initWord();
  }, [initWord, currentIndex, selectedUnit]);

  // Click letter in bank to place into answer
  const handleSelectTile = (tile: LetterTile) => {
    if (tile.isUsed || isSolved) return;
    soundManager.playCardFlip();

    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );

    const nextPlaced = [...placedLetters, { id: tile.id, char: tile.char }];
    setPlacedLetters(nextPlaced);

    // Check if word completed
    const targetClean = currentWord.word.toUpperCase().replace(/[^A-Z]/g, '');
    const currentBuilt = nextPlaced.map((p) => p.char).join('');

    if (currentBuilt.length === targetClean.length) {
      if (currentBuilt === targetClean) {
        // SOLVED!
        soundManager.playCorrect();
        setIsSolved(true);
        const earned = Math.max(50, 150 - hintsUsed * 30);
        setScore((s) => s + earned);
        speakWord(currentWord.word);
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        soundManager.playIncorrect();
      }
    }
  };

  // Click placed letter to return to bank
  const handleReturnTile = (index: number) => {
    if (isSolved) return;
    soundManager.playCardFlip();

    const tileToReturn = placedLetters[index];
    setPlacedLetters((prev) => prev.filter((_, i) => i !== index));
    setAvailableLetters((prev) =>
      prev.map((t) => (t.id === tileToReturn.id ? { ...t, isUsed: false } : t))
    );
  };

  // Reveal next correct letter hint
  const handleHint = () => {
    if (isSolved) return;
    const targetClean = currentWord.word.toUpperCase().replace(/[^A-Z]/g, '');
    const nextIndex = placedLetters.length;

    if (nextIndex < targetClean.length) {
      const neededChar = targetClean[nextIndex];
      // Find an unused tile with this char
      const candidate = availableLetters.find((t) => !t.isUsed && t.char === neededChar);
      if (candidate) {
        setHintsUsed((h) => h + 1);
        handleSelectTile(candidate);
      }
    }
  };

  const handleNextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % pool.length);
  };

  const handleShuffleTiles = () => {
    setAvailableLetters((prev) => {
      const unused = prev.filter((t) => !t.isUsed).sort(() => 0.5 - Math.random());
      const used = prev.filter((t) => t.isUsed);
      return [...unused, ...used];
    });
  };

  if (!currentWord) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Spelling & Word Scramble</span>
            <span aria-hidden="true">·</span>
            <span>Word {currentIndex + 1} of {pool.length}</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            Letter Constructor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assemble the academic word from the clue and letter tiles.
          </p>
        </div>

        {/* Stats & Unit Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedUnit ?? 'all'}
            onChange={(e) => {
              setSelectedUnit(e.target.value === 'all' ? null : Number(e.target.value));
              setCurrentIndex(0);
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Units ({VOCABULARY_LIST.length} words)</option>
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.number}: {u.shortTitle}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 text-center">
        {/* Clue Section */}
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
            Part of Speech: {currentWord.partOfSpeech}
          </span>

          <p className="text-lg sm:text-xl font-medium text-slate-800 leading-snug">
            "{currentWord.definition}"
          </p>

          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-500 font-mono">
            <span>Phonetic Guide: {currentWord.phonetic}</span>
            <button
              onClick={() => speakWord(currentWord.word)}
              className="p-1 text-indigo-600 hover:text-indigo-800 rounded transition-colors"
              title="Hear Pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Placed Word Answer Slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 min-h-[58px] py-2">
          {Array.from({ length: currentWord.word.toUpperCase().replace(/[^A-Z]/g, '').length }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <button
                key={idx}
                onClick={() => placed && handleReturnTile(idx)}
                className={`w-11 h-13 sm:w-13 sm:h-15 rounded-xl font-mono text-xl sm:text-2xl font-bold flex items-center justify-center transition-all ${
                  isSolved
                    ? 'bg-emerald-600 text-white border-2 border-emerald-500 shadow-sm'
                    : placed
                    ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:scale-95'
                    : 'bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400'
                }`}
              >
                {placed ? placed.char : ''}
              </button>
            );
          })}
        </div>

        {/* Success Banner when Solved */}
        {isSolved && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 max-w-lg mx-auto space-y-2 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Correct!</span>
              </div>
              <button
                onClick={() => speakWord(currentWord.exampleSentence)}
                className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen in Context</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 italic">
              "{currentWord.exampleSentence}"
            </p>
          </div>
        )}

        {/* Available Scrambled Letter Bank */}
        {!isSolved && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
              {availableLetters.map((tile) => (
                <button
                  key={tile.id}
                  disabled={tile.isUsed}
                  onClick={() => handleSelectTile(tile)}
                  className={`w-11 h-12 sm:w-12 sm:h-13 rounded-xl font-mono text-lg sm:text-xl font-bold transition-all shadow-2xs ${
                    tile.isUsed
                      ? 'opacity-20 bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-white text-slate-800 border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 hover:-translate-y-0.5'
                  }`}
                >
                  {tile.char}
                </button>
              ))}
            </div>

            {/* Helper Controls: Hint, Shuffle, Clear */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleHint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Hint (Reveal Letter)</span>
              </button>

              <button
                onClick={handleShuffleTiles}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <span>Shuffle Letters</span>
              </button>

              <button
                onClick={() => {
                  setPlacedLetters([]);
                  setAvailableLetters((prev) => prev.map((t) => ({ ...t, isUsed: false })));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + pool.length) % pool.length)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            ← Previous Word
          </button>

          <button
            onClick={handleNextWord}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>{isSolved ? 'Next Word Challenge' : 'Skip to Next Word'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
