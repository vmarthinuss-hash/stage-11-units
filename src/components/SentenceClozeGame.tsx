import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ClozeQuestion } from '../types';
import { UNITS, CLOZE_QUESTIONS } from '../data/curriculumData';
import { soundManager, speakWord } from '../utils/audio';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  RotateCcw,
  Trophy,
  Sparkles,
  Shuffle
} from 'lucide-react';

interface SentenceClozeGameProps {
  initialUnitId?: number | null;
}

export const SentenceClozeGame: React.FC<SentenceClozeGameProps> = ({ initialUnitId = null }) => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(initialUnitId);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Filter pool
  const pool = useMemo(() => {
    return selectedUnit === null
      ? CLOZE_QUESTIONS
      : CLOZE_QUESTIONS.filter((q) => q.unitId === selectedUnit);
  }, [selectedUnit]);

  const activeQuestions = pool.length > 0 ? pool : CLOZE_QUESTIONS;
  const currentQ: ClozeQuestion = activeQuestions[currentIndex] || activeQuestions[0];

  // Shuffled options for current question ensuring answers are randomized across A, B, C, D
  const shuffledOptions = useMemo(() => {
    if (!currentQ || !currentQ.options) return [];
    const arr = [...currentQ.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentQ.id, currentIndex, selectedUnit]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      soundManager.playCorrect();
      setStreak((s) => s + 1);
      const points = 100 + streak * 20;
      setScore((s) => s + points);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch {
        // ignore
      }
    } else {
      soundManager.playIncorrect();
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % activeQuestions.length);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
  };

  // Keyboard navigation for options A, B, C, D (or 1, 2, 3, 4) and Space for Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (!isAnswered) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') {
          if (shuffledOptions[0]) handleSelectOption(shuffledOptions[0]);
        } else if (e.key === '2' || e.key === 'b' || e.key === 'B') {
          if (shuffledOptions[1]) handleSelectOption(shuffledOptions[1]);
        } else if (e.key === '3' || e.key === 'c' || e.key === 'C') {
          if (shuffledOptions[2]) handleSelectOption(shuffledOptions[2]);
        } else if (e.key === '4' || e.key === 'd' || e.key === 'D') {
          if (shuffledOptions[3]) handleSelectOption(shuffledOptions[3]);
        }
      } else {
        if (e.code === 'Space' || e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, shuffledOptions]);

  // Render sentence with blank highlighted
  const renderSentenceWithBlank = () => {
    const parts = currentQ.sentence.split('________');
    return (
      <p className="text-lg sm:text-xl text-slate-800 leading-relaxed">
        {parts[0]}
        <span
          className={`inline-block mx-1 px-3 py-0.5 rounded-lg border font-mono font-bold transition-all ${
            isAnswered
              ? selectedAnswer === currentQ.correctAnswer
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}
        >
          {isAnswered ? currentQ.correctAnswer : '_______'}
        </span>
        {parts[1]}
      </p>
    );
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 mb-1">
            <span>Context Cloze Challenge</span>
            <span aria-hidden="true">·</span>
            <span>Question {currentIndex + 1} of {activeQuestions.length}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 font-normal flex items-center gap-1">
              <Shuffle className="w-3 h-3" />
              <span>Shuffled Options</span>
            </span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            Sentence Context Challenge
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deduce the fitting academic word or discourse connector from surrounding clues.
          </p>
        </div>

        {/* Stats & Unit Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedUnit ?? 'all'}
            onChange={(e) => {
              setSelectedUnit(e.target.value === 'all' ? null : Number(e.target.value));
              setCurrentIndex(0);
              setIsAnswered(false);
              setSelectedAnswer(null);
            }}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Units ({CLOZE_QUESTIONS.length} questions)</option>
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.number}: {u.shortTitle}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-2 rounded-lg">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Sentence Text with Audio Read button */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Read the sentence and choose the target word (press A, B, C, or D):
            </span>
            <button
              onClick={() => speakWord(currentQ.sentence.replace('________', 'blank'))}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200/80">
            {renderSentenceWithBlank()}
          </div>

          {/* Hint Disclosure */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowHint((h) => !h)}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Hide Grammar Clue' : 'Need a clue?'}</span>
            </button>
          </div>

          {showHint && (
            <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900">
              <span className="font-semibold">Context Clue: </span>
              <span>{currentQ.hint}</span>
            </div>
          )}
        </div>

        {/* 4 Shuffled Multiple Choice Options (A, B, C, D) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shuffledOptions.map((option, optIdx) => {
            const letter = optionLetters[optIdx] || '';
            const isCorrect = option === currentQ.correctAnswer;
            const isSelected = selectedAnswer === option;

            let buttonStyle = 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 text-slate-800';
            let badgeStyle = 'bg-slate-100 border-slate-200 text-slate-700';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                badgeStyle = 'bg-emerald-600 border-emerald-600 text-white';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                badgeStyle = 'bg-rose-600 border-rose-600 text-white';
              } else {
                buttonStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                badgeStyle = 'bg-slate-200 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={option}
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-xl text-left border font-editorial text-base sm:text-lg transition-all shadow-2xs flex items-center justify-between ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${badgeStyle}`}>
                    {letter}
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Card upon Answer */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border text-left space-y-1.5 ${
              selectedAnswer === currentQ.correctAnswer
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>
                {selectedAnswer === currentQ.correctAnswer ? 'Well reasoned!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Set</span>
          </button>

          <button
            disabled={!isAnswered}
            onClick={handleNext}
            className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm ${
              isAnswered
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Next Question (Space)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
