import React, { useState } from 'react';
import { SpeedMatchGame } from './SpeedMatchGame';
import { WordScrambleGame } from './WordScrambleGame';
import { SentenceClozeGame } from './SentenceClozeGame';
import { ChallengeFriendGame } from './ChallengeFriendGame';
import { Zap, Puzzle, CheckSquare, Swords } from 'lucide-react';

interface GamesHubProps {
  initialUnitId?: number | null;
}

export type GameMode = 'challenge' | 'match' | 'scramble' | 'cloze';

export const GamesHub: React.FC<GamesHubProps> = ({ initialUnitId = null }) => {
  const [activeGame, setActiveGame] = useState<GameMode>('challenge');

  return (
    <div className="space-y-6">
      {/* Game Selector Ribbon */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center sm:justify-start gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveGame('challenge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeGame === 'challenge'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-rose-700 bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/60'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Challenge a Friend (Live 1v1)</span>
        </button>

        <button
          onClick={() => setActiveGame('match')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeGame === 'match'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Speed Match (Pairs)</span>
        </button>

        <button
          onClick={() => setActiveGame('scramble')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeGame === 'scramble'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Puzzle className="w-4 h-4" />
          <span>Letter Constructor (Spelling)</span>
        </button>

        <button
          onClick={() => setActiveGame('cloze')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
            activeGame === 'cloze'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Sentence Context Cloze</span>
        </button>
      </div>

      {/* Render selected game */}
      {activeGame === 'challenge' && <ChallengeFriendGame initialUnitId={initialUnitId} />}
      {activeGame === 'match' && <SpeedMatchGame initialUnitId={initialUnitId} />}
      {activeGame === 'scramble' && <WordScrambleGame initialUnitId={initialUnitId} />}
      {activeGame === 'cloze' && <SentenceClozeGame initialUnitId={initialUnitId} />}
    </div>
  );
};
