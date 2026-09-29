import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { UnitSelector } from './components/UnitSelector';
import { FlashcardsView } from './components/FlashcardsView';
import { GamesHub } from './components/GamesHub';
import { WritingStudio } from './components/WritingStudio';
import { DiscourseMarkersGuide } from './components/DiscourseMarkersGuide';
import { ProgressDashboard } from './components/ProgressDashboard';
import { GrammarReferenceModal } from './components/GrammarReferenceModal';
import { UnitVocabPage } from './components/UnitVocabPage';
import { DescriptiveVocabPage } from './components/DescriptiveVocabPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('units');
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [grammarModalOpen, setGrammarModalOpen] = useState<boolean>(false);

  const handleStartFlashcards = (unitId: number | null) => {
    setSelectedUnitId(unitId);
    setActiveTab('flashcards');
  };

  const handleStartGames = (unitId: number) => {
    setSelectedUnitId(unitId);
    setActiveTab('games');
  };

  const handleStartWriting = (unitId: number) => {
    setSelectedUnitId(unitId);
    setActiveTab('writing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGrammarModal={() => setGrammarModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'units' && (
          <UnitSelector
            selectedUnitId={selectedUnitId}
            onSelectUnit={(id) => setSelectedUnitId(id)}
            onStartFlashcards={handleStartFlashcards}
            onStartGames={handleStartGames}
            onStartWriting={handleStartWriting}
            onGoToVocab={() => setActiveTab('vocab')}
            onGoToDescriptive={() => setActiveTab('descriptive')}
          />
        )}

        {activeTab === 'vocab' && (
          <UnitVocabPage
            onStartFlashcards={handleStartFlashcards}
            onStartGames={handleStartGames}
          />
        )}

        {activeTab === 'descriptive' && (
          <DescriptiveVocabPage
            onStartGames={handleStartGames}
            onStartFlashcards={handleStartFlashcards}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            initialUnitId={selectedUnitId}
            onSelectUnit={(id) => setSelectedUnitId(id)}
          />
        )}

        {activeTab === 'games' && (
          <GamesHub initialUnitId={selectedUnitId} />
        )}

        {activeTab === 'writing' && (
          <WritingStudio initialUnitId={selectedUnitId} />
        )}

        {activeTab === 'discourse' && (
          <DiscourseMarkersGuide />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard
            onGoToFlashcards={handleStartFlashcards}
            onGoToWriting={handleStartWriting}
          />
        )}
      </main>

      {/* Grammar & Discourse Toolkit Modal */}
      <GrammarReferenceModal
        isOpen={grammarModalOpen}
        onClose={() => setGrammarModalOpen(false)}
      />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-editorial font-bold text-slate-800">Stage 11</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Vocabulary Mastery</span>
            <span aria-hidden="true">·</span>
            <span>Academic Writing</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Games</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
