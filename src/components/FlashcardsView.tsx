import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { VocabWord } from '../types';
import { UNITS, VOCABULARY_LIST } from '../data/curriculumData';
import { speakWord, soundManager } from '../utils/audio';
import {
  recordFlashcardInteraction,
  loadStreakData,
  DailyStreakData,
  StreakMilestone,
  getTodayDateString
} from '../utils/streakManager';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  BookOpen,
  Filter,
  Flame,
  Award,
  Check
} from 'lucide-react';

interface FlashcardsViewProps {
  initialUnitId?: number | null;
  onSelectUnit?: (unitId: number | null) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  initialUnitId = null,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(initialUnitId ?? 1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'learning' | 'mastered'>('all');
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('lexicraft_mastered_words');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Daily Streak State
  const [streakData, setStreakData] = useState<DailyStreakData>(() => loadStreakData());
  const [unlockedMilestoneModal, setUnlockedMilestoneModal] = useState<StreakMilestone | null>(null);

  // Filter words by unit and mastery status
  const filteredWords = useMemo(() => {
    let list = selectedUnit === null
      ? VOCABULARY_LIST
      : VOCABULARY_LIST.filter((w) => w.unitId === selectedUnit);

    if (filterMode === 'learning') {
      list = list.filter((w) => !masteredIds.has(w.id));
    } else if (filterMode === 'mastered') {
      list = list.filter((w) => masteredIds.has(w.id));
    }

    return list.length > 0 ? list : (selectedUnit === null ? VOCABULARY_LIST : VOCABULARY_LIST.filter((w) => w.unitId === selectedUnit));
  }, [selectedUnit, filterMode, masteredIds]);

  const currentWord: VocabWord | undefined = filteredWords[currentIndex] || filteredWords[0];

  // Record review activity for daily streak
  const handleRecordReview = useCallback((count: number = 1) => {
    const { data, newMilestone } = recordFlashcardInteraction(count);
    setStreakData({ ...data });

    if (newMilestone) {
      soundManager.playStreakBonus();
      setUnlockedMilestoneModal(newMilestone);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  }, []);

  // Save mastery to localStorage
  const toggleMastery = (id: string) => {
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        soundManager.playCorrect();
        handleRecordReview(1);
      }
      try {
        localStorage.setItem('lexicraft_mastered_words', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleNext = useCallback(() => {
    soundManager.playCardFlip();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    handleRecordReview(1);
  }, [filteredWords.length, handleRecordReview]);

  const handlePrev = useCallback(() => {
    soundManager.playCardFlip();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  }, [filteredWords.length]);

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredWords.length));
  };

  const handleFlip = () => {
    soundManager.playCardFlip();
    setIsFlipped((prev) => !prev);
    handleRecordReview(1);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 's' || e.key === 'S') {
        if (currentWord) speakWord(currentWord.word);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWord, handleNext, handlePrev]);

  // Reset index when unit changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedUnit, filterMode]);

  const currentUnitInfo = UNITS.find((u) => u.id === selectedUnit);
  const totalUnitWords = VOCABULARY_LIST.filter((w) => selectedUnit === null || w.unitId === selectedUnit);
  const masteredCount = totalUnitWords.filter((w) => masteredIds.has(w.id)).length;
  const progressPercent = totalUnitWords.length > 0 ? Math.round((masteredCount / totalUnitWords.length) * 100) : 0;

  const isTodayGoalMet = streakData.lastReviewDate === getTodayDateString() && streakData.cardsReviewedToday >= streakData.dailyGoal;

  if (!currentWord) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <p className="text-slate-500 mb-4">No words found in this category.</p>
        <button
          onClick={() => setFilterMode('all')}
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Reset Filter to All Words
        </button>
      </div>
    );
  }

  const isMastered = masteredIds.has(currentWord.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 5-DAY MILESTONE UNLOCK MODAL CELEBRATION */}
      {unlockedMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border-2 border-amber-300 shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-4">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-4xl border border-amber-200 shadow-md">
              {unlockedMilestoneModal.emoji}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Streak Milestone Unlocked!
              </span>
              <h3 className="font-editorial text-2xl font-bold text-slate-900">
                {unlockedMilestoneModal.badgeName}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {unlockedMilestoneModal.description}
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-mono font-bold text-amber-900">
              🔥 {unlockedMilestoneModal.days}-Day Consecutive Flashcard Streak Achieved!
            </div>

            <button
              onClick={() => setUnlockedMilestoneModal(null)}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Continue Practicing
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Unit Selector Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Vocabulary Flashcards</span>
            <span aria-hidden="true">·</span>
            <span>{currentUnitInfo ? currentUnitInfo.number : 'All Curriculum Units'}</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            {currentUnitInfo ? currentUnitInfo.title : 'Comprehensive Lexicon'}
          </h2>
        </div>

        {/* Controls: Unit Dropdown & Filter */}
        <div className="flex items-center flex-wrap gap-2.5">
          <select
            value={selectedUnit ?? 'all'}
            onChange={(e) => setSelectedUnit(e.target.value === 'all' ? null : Number(e.target.value))}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Units ({VOCABULARY_LIST.length} words)</option>
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.number}: {u.shortTitle}
              </option>
            ))}
          </select>

          {/* Segmented Filter Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('learning')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'learning' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Learning
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-2.5 py-1 rounded transition-colors ${
                filterMode === 'mastered' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mastered
            </button>
          </div>
        </div>
      </div>

      {/* DAILY STREAK BANNER */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-white p-4 rounded-xl border border-orange-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-base font-bold text-slate-900">
                {streakData.currentStreak}-Day Review Streak
              </span>
              {isTodayGoalMet ? (
                <span className="text-2xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Today Completed!</span>
                </span>
              ) : (
                <span className="text-2xs font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full">
                  {Math.max(0, streakData.dailyGoal - streakData.cardsReviewedToday)} cards left today
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Review at least {streakData.dailyGoal} cards daily to keep your consecutive streak alive and unlock 5-day milestone badges.
            </p>
          </div>
        </div>

        {!isTodayGoalMet && (
          <button
            onClick={() => handleRecordReview(streakData.dailyGoal)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-orange-950 bg-orange-200/80 hover:bg-orange-300 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            title="Mark today's review goal complete"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-700" />
            <span>Complete Today's Quota</span>
          </button>
        )}
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          <span className="font-medium">Unit Vocabulary Mastery</span>
          <span className="font-mono tabular-nums font-semibold text-slate-900">
            {masteredCount} of {totalUnitWords.length} Words Mastered ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard Viewport with 3D Flip */}
      <div className="perspective-1000 min-h-[380px] sm:min-h-[420px] relative">
        <div
          onClick={handleFlip}
          className={`w-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-3d cursor-pointer select-none rounded-2xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 backface-hidden bg-white border border-slate-200/90 rounded-2xl shadow-md p-6 sm:p-10 flex flex-col justify-between hover:border-indigo-300 transition-colors">
            {/* Front Header */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono tabular-nums font-medium text-slate-400">
                Card {currentIndex + 1} of {filteredWords.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMastery(currentWord.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    isMastered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{isMastered ? 'Mastered' : 'Mark as Known'}</span>
                </button>
              </div>
            </div>

            {/* Front Center: Word & Phonetic */}
            <div className="text-center my-auto py-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-indigo-600 mb-2 block">
                {currentWord.partOfSpeech}
              </span>
              <h3 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-3">
                {currentWord.word}
              </h3>
              <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-sm sm:text-base">
                <span>{currentWord.phonetic}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentWord.word);
                  }}
                  className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-full transition-colors"
                  title="Pronounce Word"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Front Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4">
              <span className="flex items-center gap-1.5 text-slate-500">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card or press Space to reveal definition</span>
              </span>
              <span className="hidden sm:inline text-slate-400">Shortcut: [S] to Listen</span>
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-indigo-200 rounded-2xl shadow-md p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-editorial text-xl font-bold text-indigo-900">
                  {currentWord.word}
                </span>
                <span className="text-xs text-indigo-600 font-mono">({currentWord.partOfSpeech})</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentWord.word);
                }}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Pronounce Word"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Back Content */}
            <div className="space-y-4 my-2 text-left">
              {/* Definition */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Definition
                </span>
                <p className="text-base text-slate-900 font-medium leading-snug">
                  {currentWord.definition}
                </p>
              </div>

              {/* Example Sentence with Audio */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Context in Academic Writing
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentWord.exampleSentence);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Sentence</span>
                  </button>
                </div>
                <p className="text-sm text-slate-800 italic leading-relaxed">
                  "{currentWord.exampleSentence}"
                </p>
              </div>

              {/* Collocations & Synonyms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {currentWord.collocations && currentWord.collocations.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">Common Collocations:</span>
                    <ul className="space-y-0.5 text-slate-700">
                      {currentWord.collocations.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-500 block mb-1">Academic Synonyms:</span>
                    <p className="text-slate-700">
                      {currentWord.synonyms.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* ESL Learner Tip */}
              {currentWord.tipsForESL && (
                <div className="flex items-start gap-2 text-xs bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-lg text-amber-900">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-semibold">ESL Writing Tip: </span>
                    <span>{currentWord.tipsForESL}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Back Footer */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Click to flip back to word</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastery(currentWord.id);
                }}
                className={`font-semibold ${isMastered ? 'text-emerald-600' : 'text-indigo-600'}`}
              >
                {isMastered ? '✓ Mastered' : '+ Mark as Mastered'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Shuffle Card Deck"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            onClick={handleFlip}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            <span>Flip Card</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <div className="text-center text-xs text-slate-400">
        <span className="font-mono">Shortcuts: [←] Previous · [Space] Flip · [→] Next · [S] Pronounce</span>
      </div>
    </div>
  );
};
