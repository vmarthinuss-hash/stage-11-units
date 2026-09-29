import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type ActiveTab = 'units' | 'vocab' | 'descriptive' | 'flashcards' | 'games' | 'writing' | 'discourse' | 'progress';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenGrammarModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGrammarModal,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(soundManager.isEnabled());

  const handleToggleSound = () => {
    const nextState = soundManager.toggleSound();
    setSoundOn(nextState);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('units')}
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-xs group-hover:bg-indigo-700 transition-colors">
              11
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors hidden sm:inline">
              Stage 11
            </span>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('units')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'units'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Units
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'vocab'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vocabulary
            </button>
            <button
              onClick={() => setActiveTab('descriptive')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'descriptive'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Descriptive Vocab
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'flashcards'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flashcards
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'games'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Word Games
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'writing'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Writing Studio
            </button>
            <button
              onClick={() => setActiveTab('discourse')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'discourse'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Discourse
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-2.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Progress
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Mute game audio' : 'Unmute game audio'}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle game audio"
            >
              {soundOn ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            <button
              onClick={onOpenGrammarModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Grammar Toolkit</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar for small screens */}
        <div className="lg:hidden flex items-center justify-start border-t border-slate-100 py-2 overflow-x-auto gap-2 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'units' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Units
          </button>
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'vocab' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => setActiveTab('descriptive')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'descriptive' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Descriptive
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'flashcards' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('games')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'games' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Games
          </button>
          <button
            onClick={() => setActiveTab('writing')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'writing' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Writing
          </button>
          <button
            onClick={() => setActiveTab('discourse')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'discourse' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Discourse
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-2.5 py-1 font-medium rounded whitespace-nowrap ${
              activeTab === 'progress' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600'
            }`}
          >
            Progress
          </button>
        </div>
      </div>
    </header>
  );
};
