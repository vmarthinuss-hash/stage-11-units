import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UNITS, VOCABULARY_LIST, WRITING_TASKS } from '../data/curriculumData';
import { StudentDraft } from '../types';
import {
  loadStreakData,
  saveStreakData,
  getAllMilestones,
  setStreakSimulated,
  recordFlashcardInteraction,
  DailyStreakData,
  StreakMilestone,
  getTodayDateString,
  getYesterdayDateString
} from '../utils/streakManager';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  CheckCircle2,
  PenTool,
  RotateCcw,
  Sparkles,
  BookOpen,
  Layers,
  FileText,
  Flame,
  Award,
  Lock,
  Calendar,
  Check,
  ArrowRight,
  TrendingUp,
  Sliders
} from 'lucide-react';

interface ProgressDashboardProps {
  onGoToFlashcards: (unitId: number | null) => void;
  onGoToWriting: (unitId: number) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  onGoToFlashcards,
  onGoToWriting,
}) => {
  const [masteredWords, setMasteredWords] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<StudentDraft[]>([]);
  const [streakData, setStreakData] = useState<DailyStreakData>(() => loadStreakData());
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  useEffect(() => {
    // Read mastered words
    try {
      const savedMastered = localStorage.getItem('lexicraft_mastered_words');
      if (savedMastered) {
        setMasteredWords(JSON.parse(savedMastered));
      }
    } catch {
      // ignore
    }

    // Refresh streak data
    setStreakData(loadStreakData());

    // Read saved drafts
    const loadedDrafts: StudentDraft[] = [];
    WRITING_TASKS.forEach((t) => {
      try {
        const d = localStorage.getItem(`lexicraft_draft_${t.id}`);
        if (d) {
          const parsed = JSON.parse(d);
          if (parsed.body && parsed.body.trim().length > 0) {
            loadedDrafts.push(parsed);
          }
        }
      } catch {
        // ignore
      }
    });
    setDrafts(loadedDrafts);
  }, []);

  const totalWords = VOCABULARY_LIST.length;
  const masteredCount = masteredWords.length;
  const masteryPercentage = totalWords > 0 ? Math.round((masteredCount / totalWords) * 100) : 0;

  const milestones = getAllMilestones(streakData);
  const unlockedCount = milestones.filter((m) => m.unlocked).length;

  const today = getTodayDateString();
  const isGoalMetToday = streakData.lastReviewDate === today && streakData.cardsReviewedToday >= streakData.dailyGoal;

  // Streak simulation handler for testing 5-day milestone unlocks
  const handleSimulateDays = (days: number) => {
    soundManager.playStreakBonus();
    const updated = setStreakSimulated(days);
    setStreakData({ ...updated });
    if (days >= 5) {
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
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your mastered vocabulary progress and streak?')) {
      localStorage.removeItem('lexicraft_mastered_words');
      localStorage.removeItem('lexicraft_flashcard_streak_v2');
      setMasteredWords([]);
      setStreakData(loadStreakData());
    }
  };

  // 7-day rolling activity window for the calendar track
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = streakData.history[dateStr] || 0;
    const isToday = dateStr === today;
    const completed = count >= streakData.dailyGoal || (isToday && isGoalMetToday);

    return { dateStr, dayName, count, isToday, completed };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Student Portfolio</span>
            <span aria-hidden="true">·</span>
            <span>Academic Performance Dashboard</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            My Learning Progress & Milestones
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor daily consecutive review streaks, unlock 5-day milestone badges, and review active drafts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulator((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Toggle streak simulator"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Streak Testing</span>
          </button>

          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* STREAK SIMULATOR TOOLBAR (FOR TESTING 5-DAY MILESTONES) */}
      {showSimulator && (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teacher Streak Simulator (Quick-Test 5-Day Milestones)</span>
            </span>
            <span className="text-slate-400">Click to instantly test badge unlocking</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => handleSimulateDays(streakData.currentStreak + 1)}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded font-semibold text-xs"
            >
              +1 Day
            </button>
            <button
              onClick={() => handleSimulateDays(5)}
              className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 rounded font-semibold text-xs"
            >
              Set 5 Days (🥉 Bronze)
            </button>
            <button
              onClick={() => handleSimulateDays(10)}
              className="px-2.5 py-1 bg-slate-500/20 text-slate-300 border border-slate-400/40 hover:bg-slate-500/30 rounded font-semibold text-xs"
            >
              Set 10 Days (🥈 Silver)
            </button>
            <button
              onClick={() => handleSimulateDays(15)}
              className="px-2.5 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 hover:bg-yellow-500/30 rounded font-semibold text-xs"
            >
              Set 15 Days (🥇 Gold)
            </button>
            <button
              onClick={() => handleSimulateDays(20)}
              className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 rounded font-semibold text-xs"
            >
              Set 20 Days (💎 Platinum)
            </button>
            <button
              onClick={() => handleSimulateDays(30)}
              className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 rounded font-semibold text-xs"
            >
              Set 30 Days (🌌 Grandmaster)
            </button>
            <button
              onClick={() => handleSimulateDays(0)}
              className="px-2.5 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded font-semibold text-xs"
            >
              Reset to 0
            </button>
          </div>
        </div>
      )}

      {/* PROMINENT DAILY STREAK SHOWCASE CARD */}
      <div className="bg-gradient-to-br from-orange-50 via-amber-50/60 to-white rounded-2xl border border-orange-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Flame className="w-10 h-10 fill-white" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full">
                  Flashcard Review Streak
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Best: {streakData.bestStreak} Days
                </span>
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {streakData.currentStreak} Days Consecutive
              </h3>
              <p className="text-xs text-slate-600">
                {isGoalMetToday
                  ? "✓ Today's daily flashcard review goal is completed! Your streak is safely secured."
                  : `Review ${Math.max(0, streakData.dailyGoal - streakData.cardsReviewedToday)} more cards today to keep your streak burning!`}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:items-end gap-2">
            <button
              onClick={() => onGoToFlashcards(null)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>{isGoalMetToday ? 'Practice More Cards' : 'Review Cards Today (+1 Streak)'}</span>
            </button>
            <span className="text-2xs text-slate-400 font-mono text-center sm:text-right">
              Daily Target: {streakData.cardsReviewedToday}/{streakData.dailyGoal} cards reviewed today
            </span>
          </div>
        </div>

        {/* 7-Day Rolling Calendar Track */}
        <div className="bg-white/90 backdrop-blur p-4 rounded-xl border border-orange-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>Last 7 Days Activity</span>
            </span>
            <span className="text-2xs font-mono text-orange-700">
              {last7Days.filter((d) => d.completed).length} / 7 days active
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-1">
            {last7Days.map((day) => (
              <div
                key={day.dateStr}
                className={`p-2 rounded-xl border text-center transition-all ${
                  day.completed
                    ? 'bg-orange-50 border-orange-300 text-orange-950 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200 text-slate-400'
                } ${day.isToday ? 'ring-2 ring-orange-500/30' : ''}`}
              >
                <span className="text-2xs font-bold uppercase block">{day.dayName}</span>
                <div className="my-1 flex items-center justify-center">
                  {day.completed ? (
                    <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  )}
                </div>
                <span className="text-2xs font-mono font-medium block">
                  {day.isToday ? 'Today' : `${day.count} cards`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5-DAY MILESTONE BADGES SHOWCASE GRID */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              <Award className="w-4 h-4 text-amber-600" />
              <span>5-Day Milestone Badges ({unlockedCount} / {milestones.length} Unlocked)</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-slate-900">
              Consecutive Review Milestones
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Achieve consistent daily reviews to unlock permanent visual scholar badges for every 5-day streak milestone.
            </p>
          </div>
        </div>

        {/* Milestones 2-Column / 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => {
            const daysRemaining = Math.max(0, m.days - streakData.currentStreak);
            const progress = Math.min(100, Math.round((streakData.currentStreak / m.days) * 100));

            return (
              <div
                key={m.days}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  m.unlocked
                    ? `${m.bgClass} ${m.borderClass} shadow-xs ring-1 ring-black/5`
                    : 'bg-slate-50/60 border-slate-200/90 text-slate-400'
                }`}
              >
                <div>
                  {/* Badge Header & Emoji */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl filter drop-shadow-xs">
                      {m.emoji}
                    </span>
                    {m.unlocked ? (
                      <span className="flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{daysRemaining}d to go</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Requirement */}
                  <h4 className={`font-editorial text-base font-bold leading-tight ${m.unlocked ? 'text-slate-900' : 'text-slate-600'}`}>
                    {m.badgeName}
                  </h4>
                  <span className={`text-xs font-mono font-bold block mt-0.5 ${m.unlocked ? m.colorClass : 'text-slate-400'}`}>
                    {m.days}-Day Milestone
                  </span>

                  <p className="text-2xs text-slate-500 mt-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                {/* Progress Bar for Locked Badges */}
                {!m.unlocked && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1">
                    <div className="flex items-center justify-between text-2xs font-mono text-slate-500">
                      <span>Progress</span>
                      <span>{streakData.currentStreak} / {m.days} days</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Vocabulary Mastery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-900">{masteredCount}</span>
            <span className="text-xs text-slate-400">/ {totalWords} words</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${masteryPercentage}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Writing Drafts</span>
            <PenTool className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-900">{drafts.length}</span>
            <span className="text-xs text-slate-400">/ {WRITING_TASKS.length} tasks started</span>
          </div>
          <p className="text-xs text-slate-500">
            Auto-saved drafts in browser
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Curriculum Units</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-slate-900">{UNITS.length}</span>
            <span className="text-xs text-slate-400">thematic modules</span>
          </div>
          <p className="text-xs text-slate-500">
            Core Curriculum Modules
          </p>
        </div>
      </div>

      {/* Breakdown by Curriculum Unit */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h3 className="font-editorial text-lg font-bold text-slate-900">
            Unit-by-Unit Lexical Mastery
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {UNITS.map((unit) => {
            const unitWords = VOCABULARY_LIST.filter((w) => w.unitId === unit.id);
            const unitMastered = unitWords.filter((w) => masteredWords.includes(w.id)).length;
            const pct = unitWords.length > 0 ? Math.round((unitMastered / unitWords.length) * 100) : 0;

            return (
              <div
                key={unit.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 font-mono">{unit.number}</span>
                    <span className="font-bold text-slate-900 text-sm">{unit.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{unitMastered} of {unitWords.length} words mastered</span>
                    <span aria-hidden="true">·</span>
                    <span>{pct}% complete</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onGoToFlashcards(unit.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    Practice Cards
                  </button>
                  <button
                    onClick={() => onGoToWriting(unit.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Write Essay
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Drafts List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-editorial text-lg font-bold text-slate-900">
            Saved Writing Drafts ({drafts.length})
          </h3>
        </div>

        {drafts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No writing drafts started yet. Open the Writing Studio to draft your first biography, report, or essay!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {drafts.map((draft) => {
              const task = WRITING_TASKS.find((t) => t.id === draft.taskId);
              const wordCount = draft.body.trim().split(/\s+/).length;
              const dateStr = new Date(draft.lastSaved).toLocaleDateString();

              return (
                <div key={draft.taskId} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {draft.title || task?.title || 'Untitled Composition'}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Task: {task?.loCode}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{wordCount} words</span>
                      <span aria-hidden="true">·</span>
                      <span>Last edited: {dateStr}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onGoToWriting(draft.unitId)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors self-start sm:self-auto"
                  >
                    Resume Writing
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
