import React, { useState, useMemo } from 'react';
import {
  DESCRIPTIVE_WORDS,
  DESCRIPTIVE_CATEGORIES,
  BASIC_WORD_UPGRADES
} from '../data/descriptiveVocabData';
import { DescriptiveWord, WordUpgrade } from '../types';
import { speakWord, soundManager } from '../utils/audio';
import {
  Sparkles,
  Volume2,
  Search,
  RotateCw,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Filter,
  Check,
  Copy,
  Lightbulb,
  Play
} from 'lucide-react';

interface DescriptiveVocabPageProps {
  onStartGames?: (unitId: number) => void;
  onStartFlashcards?: (unitId: number) => void;
}

export const DescriptiveVocabPage: React.FC<DescriptiveVocabPageProps> = ({
  onStartGames,
  onStartFlashcards,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'flashcards' | 'matrix' | 'table'>('flashcards');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [copiedWord, setCopiedWord] = useState<string | null>(null);
  const [selectedBasicWord, setSelectedBasicWord] = useState<string | null>('good');

  // Toggle card flip
  const handleFlipCard = (id: string) => {
    soundManager.playCardFlip();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyWord = (word: string) => {
    soundManager.playCardFlip();
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 1800);
  };

  // Filtered descriptive words
  const filteredWords = useMemo(() => {
    return DESCRIPTIVE_WORDS.filter((item) => {
      const matchesCat =
        selectedCategory === 'All Categories' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.word.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q) ||
        item.partOfSpeech.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeUpgrade = BASIC_WORD_UPGRADES.find((u) => u.basicWord === selectedBasicWord);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-rose-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 rounded-2xl border border-rose-900/50 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Descriptive Lexicon & Style</span>
            <span aria-hidden="true">·</span>
            <span>Stage 11</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Descriptive Vocabulary Studio
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Elevate basic words into precise, evocative adjectives and adverbs. Master sensory descriptions across appearance, emotions, setting, sound, and evaluation.
          </p>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-rose-200">
            <span>74 Descriptive Lexical Terms</span>
            <span aria-hidden="true">·</span>
            <span>10 Thematic Sensory Categories</span>
            <span aria-hidden="true">·</span>
            <span>20 Precision Word Upgraders</span>
          </div>
        </div>
      </div>

      {/* Navigation View Switcher (Flashcards / Upgrade Matrix / Full Reference Table) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'flashcards'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Flashcards & Audio ({filteredWords.length})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-white text-rose-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            <span>Upgrade Basic Words (20 Pairs)</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              activeTab === 'table'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Complete Lexicon Table
          </button>
        </div>

        {/* Quick Practice Launcher */}
        <div className="flex items-center gap-2">
          {onStartGames && (
            <button
              onClick={() => onStartGames(99)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-rose-600" />
              <span>Practice in Games</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search descriptive word, definition, or example..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing {filteredWords.length} of {DESCRIPTIVE_WORDS.length} terms
          </span>
        </div>

        {/* Categories Horizontal Scroll Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {DESCRIPTIVE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: FLASHCARDS GRID */}
      {activeTab === 'flashcards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWords.map((item) => {
            const isFlipped = flippedCards[item.id] || false;
            const isCopied = copiedWord === item.word;

            return (
              <div
                key={item.id}
                className="perspective-1000 min-h-[260px] relative"
              >
                <div
                  onClick={() => handleFlipCard(item.id)}
                  className={`w-full h-full min-h-[260px] transition-transform duration-500 transform-style-3d cursor-pointer select-none rounded-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT */}
                  <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-2xl shadow-xs p-6 flex flex-col justify-between hover:border-rose-300 hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-2xs">
                          {item.partOfSpeech}
                        </span>
                        <span className="text-2xs text-slate-400 truncate max-w-[150px]">
                          {item.category}
                        </span>
                      </div>

                      <div className="my-4 text-center">
                        <h3 className="font-editorial text-3xl font-bold text-slate-900 tracking-tight">
                          {item.word}
                        </h3>

                        {item.basicWordUpgrade && item.basicWordUpgrade.length > 0 && (
                          <div className="mt-2 inline-flex items-center gap-1 text-2xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span>Upgrades:</span>
                            <span className="font-bold">{item.basicWordUpgrade.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1 text-slate-500">
                        <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Click to see definition</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(item.word);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-rose-200 rounded-2xl shadow-md p-5 flex flex-col justify-between overflow-y-auto">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="font-editorial text-lg font-bold text-rose-900">
                          {item.word}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyWord(item.word);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Copy word"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(item.word);
                            }}
                            className="p-1 text-rose-600 hover:text-rose-800 rounded"
                            title="Listen"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Definition */}
                      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-snug mb-3">
                        {item.definition}
                      </p>

                      {/* Example in Context */}
                      <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-2xs font-semibold text-rose-800 uppercase tracking-wider">
                          <span>Example in Context</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(item.example);
                            }}
                            className="text-rose-600 hover:text-rose-800 flex items-center gap-0.5"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </button>
                        </div>
                        <p className="italic text-slate-800 leading-relaxed">
                          "{item.example}"
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-2xs text-slate-400">
                      <span>Click to flip back</span>
                      <span className="font-mono text-rose-600 font-bold">{item.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: PRECISION WORD UPGRADE MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Vocabulary Precision Tool</span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-slate-900">
                Upgrade Your Basic Words
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any common word below to reveal precise, evocative academic alternatives with native pronunciations and definitions.
              </p>
            </div>

            {/* Basic Words Selector Grid */}
            <div className="flex flex-wrap gap-2 pt-1">
              {BASIC_WORD_UPGRADES.map((u) => (
                <button
                  key={u.basicWord}
                  onClick={() => setSelectedBasicWord(u.basicWord)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedBasicWord === u.basicWord
                      ? 'bg-rose-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  "{u.basicWord}"
                </button>
              ))}
            </div>

            {/* Active Word Upgrade Showcase */}
            {activeUpgrade && (
              <div className="bg-gradient-to-r from-rose-50/70 to-amber-50/60 rounded-xl border border-rose-200 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-rose-200/80 pb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-500">Instead of writing:</span>
                    <h4 className="font-editorial text-2xl font-black text-rose-950">
                      "{activeUpgrade.basicWord}"
                    </h4>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                    {activeUpgrade.preciseChoices.length} Precise Choices
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeUpgrade.preciseChoices.map((choice) => {
                    const wordObj = DESCRIPTIVE_WORDS.find((dw) => dw.word.toLowerCase() === choice.toLowerCase());

                    return (
                      <div
                        key={choice}
                        className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-2xs space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-editorial text-lg font-bold text-slate-900">
                              {choice}
                            </span>
                            <button
                              onClick={() => speakWord(choice)}
                              className="p-1 text-rose-600 hover:text-rose-800 rounded transition-colors"
                              title="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {wordObj && (
                            <p className="text-2xs text-slate-600 leading-snug mt-1">
                              {wordObj.definition}
                            </p>
                          )}
                        </div>

                        {wordObj && (
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-2xs text-slate-500 italic">
                              "{wordObj.example}"
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Full Upgrade Matrix Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <h4 className="font-editorial text-lg font-bold text-slate-900">
                Complete Word Upgrade Matrix
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {BASIC_WORD_UPGRADES.map((item) => (
                <div
                  key={item.basicWord}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="w-36 font-bold text-slate-900 text-sm">
                    "{item.basicWord}"
                  </div>

                  <div className="flex-1 flex flex-wrap gap-1.5">
                    {item.preciseChoices.map((choice) => (
                      <button
                        key={choice}
                        onClick={() => speakWord(choice)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition-colors flex items-center gap-1"
                      >
                        <span>{choice}</span>
                        <Volume2 className="w-3 h-3 text-rose-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FULL REFERENCE TABLE */}
      {activeTab === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Word</th>
                  <th className="py-3 px-3">Part of Speech</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4">Definition</th>
                  <th className="py-3 px-4">Example in Context</th>
                  <th className="py-3 px-3 text-right">Listen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredWords.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-editorial text-sm whitespace-nowrap">
                      {row.word}
                    </td>
                    <td className="py-3 px-3 font-mono text-2xs text-rose-600">
                      {row.partOfSpeech}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-2xs whitespace-nowrap">
                      {row.category}
                    </td>
                    <td className="py-3 px-4 font-medium leading-snug">
                      {row.definition}
                    </td>
                    <td className="py-3 px-4 italic text-slate-600">
                      "{row.example}"
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => speakWord(row.word)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Pronounce"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
