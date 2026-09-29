/**
 * Streak Manager for Flashcard Daily Reviews
 * Tracks consecutive days of completed flashcard reviews
 * and manages visual badges for every 5-day milestone.
 */

export interface StreakMilestone {
  days: number;
  title: string;
  badgeName: string;
  emoji: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface DailyStreakData {
  currentStreak: number;
  bestStreak: number;
  lastReviewDate: string; // 'YYYY-MM-DD'
  cardsReviewedToday: number;
  dailyGoal: number; // default 5 cards
  totalCardsReviewed: number;
  history: Record<string, number>; // date string -> count of cards reviewed
  unlockedMilestones: number[]; // e.g. [5, 10]
}

const STORAGE_KEY = 'lexicraft_flashcard_streak_v2';
const DEFAULT_DAILY_GOAL = 5;

// Defined milestones for every 5 days
export const MILESTONE_DEFINITIONS: Omit<StreakMilestone, 'unlocked' | 'unlockedAt'>[] = [
  {
    days: 5,
    title: '5-Day Streak',
    badgeName: 'Bronze Scholar',
    emoji: '🥉',
    description: 'Completed 5 consecutive days of daily flashcard vocabulary reviews.',
    colorClass: 'text-amber-800',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
  },
  {
    days: 10,
    title: '10-Day Streak',
    badgeName: 'Silver Scholar',
    emoji: '🥈',
    description: 'Completed 10 consecutive days of vocabulary retention and review.',
    colorClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-300',
  },
  {
    days: 15,
    title: '15-Day Streak',
    badgeName: 'Gold Scholar',
    emoji: '🥇',
    description: 'Completed 15 consecutive days of dedicated lexical mastery.',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-400',
  },
  {
    days: 20,
    title: '20-Day Streak',
    badgeName: 'Platinum Master',
    emoji: '💎',
    description: 'Completed 20 consecutive days of elite ESL academic dedication.',
    colorClass: 'text-cyan-800',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-300',
  },
  {
    days: 25,
    title: '25-Day Streak',
    badgeName: 'Diamond Polyglot',
    emoji: '👑',
    description: 'Completed 25 consecutive days of high school vocabulary excellence.',
    colorClass: 'text-purple-800',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-300',
  },
  {
    days: 30,
    title: '30-Day Streak',
    badgeName: 'Stage 11 Grandmaster',
    emoji: '🌌',
    description: 'Completed 30 consecutive days of uninterrupted vocabulary mastery.',
    colorClass: 'text-indigo-800',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-300',
  },
  {
    days: 35,
    title: '35-Day Streak',
    badgeName: 'Century Champion',
    emoji: '⚡',
    description: 'Completed 35 consecutive days of relentless language acquisition.',
    colorClass: 'text-rose-800',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
  },
  {
    days: 40,
    title: '40-Day Streak',
    badgeName: 'Immortal Scholar',
    emoji: '🏆',
    description: 'Completed 40 consecutive days of scholastic persistence.',
    colorClass: 'text-emerald-800',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
  }
];

export function getTodayDateString(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  return getTodayDateString(-1);
}

export function loadStreakData(): DailyStreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: DailyStreakData = JSON.parse(raw);
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      // Check if last review was before yesterday -> streak broken
      if (parsed.lastReviewDate && parsed.lastReviewDate !== today && parsed.lastReviewDate !== yesterday) {
        // Missed at least 1 day
        parsed.currentStreak = 0;
        parsed.cardsReviewedToday = 0;
      } else if (parsed.lastReviewDate !== today) {
        // New calendar day, reset cardsReviewedToday
        parsed.cardsReviewedToday = 0;
      }

      return parsed;
    }
  } catch {
    // ignore
  }

  // Default initial state
  return {
    currentStreak: 0,
    bestStreak: 0,
    lastReviewDate: '',
    cardsReviewedToday: 0,
    dailyGoal: DEFAULT_DAILY_GOAL,
    totalCardsReviewed: 0,
    history: {},
    unlockedMilestones: [],
  };
}

export function saveStreakData(data: DailyStreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Record a flashcard interaction (e.g. card flipped, reviewed, or marked mastered)
 * Returns { streakData, newlyUnlockedMilestone }
 */
export function recordFlashcardInteraction(cardsCount: number = 1): {
  data: DailyStreakData;
  newMilestone: StreakMilestone | null;
} {
  const data = loadStreakData();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  data.cardsReviewedToday += cardsCount;
  data.totalCardsReviewed += cardsCount;
  data.history[today] = (data.history[today] || 0) + cardsCount;

  let newMilestone: StreakMilestone | null = null;

  // Check if daily goal is met today and streak should be updated
  if (data.cardsReviewedToday >= data.dailyGoal) {
    if (data.lastReviewDate !== today) {
      // First time meeting goal today
      if (data.lastReviewDate === yesterday) {
        // Consecutive day
        data.currentStreak += 1;
      } else {
        // First day or streak was broken
        data.currentStreak = 1;
      }

      data.lastReviewDate = today;

      if (data.currentStreak > data.bestStreak) {
        data.bestStreak = data.currentStreak;
      }

      // Check for 5-day milestones
      const currentMilestone = MILESTONE_DEFINITIONS.find((m) => m.days === data.currentStreak);
      if (currentMilestone && !data.unlockedMilestones.includes(currentMilestone.days)) {
        data.unlockedMilestones.push(currentMilestone.days);
        newMilestone = {
          ...currentMilestone,
          unlocked: true,
          unlockedAt: Date.now(),
        };
      }
    }
  }

  saveStreakData(data);
  return { data, newMilestone };
}

/**
 * Manually set or simulate a streak (helpful for teacher testing or demo)
 */
export function setStreakSimulated(days: number): DailyStreakData {
  const data = loadStreakData();
  const today = getTodayDateString();

  data.currentStreak = Math.max(0, days);
  if (data.currentStreak > data.bestStreak) {
    data.bestStreak = data.currentStreak;
  }
  data.lastReviewDate = today;
  data.cardsReviewedToday = Math.max(data.cardsReviewedToday, data.dailyGoal);
  data.history[today] = (data.history[today] || 0) + data.dailyGoal;

  // Unlock all milestones up to this day
  data.unlockedMilestones = MILESTONE_DEFINITIONS
    .filter((m) => m.days <= data.currentStreak)
    .map((m) => m.days);

  saveStreakData(data);
  return data;
}

/**
 * Get all milestone objects with unlocked status
 */
export function getAllMilestones(data: DailyStreakData): StreakMilestone[] {
  return MILESTONE_DEFINITIONS.map((def) => {
    const isUnlocked = data.unlockedMilestones.includes(def.days) || data.currentStreak >= def.days;
    return {
      ...def,
      unlocked: isUnlocked,
    };
  });
}
