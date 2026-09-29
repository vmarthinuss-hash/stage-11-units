import React, { useState, useMemo } from 'react';
import { UNITS, VOCABULARY_LIST } from '../data/curriculumData';
import { VocabWord, UnitInfo } from '../types';
import { speakWord, soundManager } from '../utils/audio';
import {
  BookOpen,
  Search,
  Volume2,
  RotateCw,
  CheckCircle2,
  Sparkles,
  Layers,
  Play,
  Check,
  Filter,
  ArrowRight
} from 'lucide-react';

interface UnitVocabPageProps {
  onStartFlashcards: (unitId: number | null) => void;
  onStartGames: (unitId: number) => void;
}

export const UnitVocabPage: React.FC<UnitVocabPageProps> = ({
  onStartFlashcards,
  onStartGames,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [masteredIds, setMasteredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('lexicraft_mastered_words');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const toggleMastery = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        soundManager.playCorrect();
      }
      try {
        localStorage.setItem('lexicraft_mastered_words', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleFlipCard = (id: string) => {
    soundManager.playCardFlip();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter words by search and unit
  const filteredWords = useMemo(() => {
    return VOCABULARY_LIST.filter((w) => {
      const matchesUnit = selectedUnitId === null || w.unitId === selectedUnitId;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        w.word.toLowerCase().includes(q) ||
        w.definition.toLowerCase().includes(q) ||
        w.exampleSentence.toLowerCase().includes(q) ||
        w.partOfSpeech.toLowerCase().includes(q);

      return matchesUnit && matchesSearch;
    });
  }, [selectedUnitId, searchQuery]);

  // Group filtered words by unit
  const groupedByUnit = useMemo(() => {
    const groups: { unit: UnitInfo; words: VocabWord[] }[] = [];

    UNITS.forEach((unit) => {
      if (selectedUnitId !== null && unit.id !== selectedUnitId) return;

      const wordsForUnit = filteredWords.filter((w) => w.unitId === unit.id);
      if (wordsForUnit.length > 0) {
        groups.push({ unit, words: wordsForUnit });
      }
    });

    return groups;
  }, [filteredWords, selectedUnitId]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Unit Lexicon Repository</span>
            <span aria-hidden="true">·</span>
            <span>Stage 11</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900">
            Vocabulary by Unit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete list of vocabulary flashcards organized unit-by-unit with audio pronunciations, collocations, and contextual sentences.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onStartFlashcards(selectedUnitId)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Study Flashcard Deck</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search any vocabulary term, definition, or example..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>{filteredWords.length} words found</span>
            <span aria-hidden="true">·</span>
            <span>{masteredIds.size} mastered</span>
          </div>
        </div>

        {/* Unit Selector Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedUnitId(null)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedUnitId === null
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Units
          </button>
          {UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUnitId(u.id)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedUnitId === u.id
                  ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {u.number}
            </button>
          ))}
        </div>
      </div>

      {/* UNIT-BY-UNIT FLASHCARD LISTS */}
      {groupedByUnit.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
          No vocabulary words match your search criteria.
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByUnit.map(({ unit, words }) => (
            <section key={unit.id} className="space-y-4">
              {/* Unit Section Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {unit.number}
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-slate-900">
                    {unit.title}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    ({words.length} Flashcards)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartFlashcards(unit.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Launch Deck</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => onStartGames(unit.id)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>Play Games</span>
                    <Play className="w-3 h-3 fill-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Flashcards Grid for this Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {words.map((word) => {
                  const isFlipped = flippedCards[word.id] || false;
                  const isMastered = masteredIds.has(word.id);

                  return (
                    <div
                      key={word.id}
                      className="perspective-1000 min-h-[250px] relative"
                    >
                      <div
                        onClick={() => handleFlipCard(word.id)}
                        className={`w-full h-full min-h-[250px] transition-transform duration-500 transform-style-3d cursor-pointer select-none rounded-xl ${
                          isFlipped ? 'rotate-y-180' : ''
                        }`}
                      >
                        {/* FRONT OF CARD */}
                        <div className="absolute inset-0 backface-hidden bg-white border border-slate-200 rounded-xl shadow-2xs p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-xs transition-all">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="font-semibold text-2xs uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {word.partOfSpeech}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => toggleMastery(word.id, e)}
                                className={`text-2xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  isMastered
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                              >
                                <Check className={`w-3 h-3 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
                                <span>{isMastered ? 'Mastered' : 'Mark Known'}</span>
                              </button>
                            </div>

                            <div className="text-center my-3">
                              <h4 className="font-editorial text-2xl font-bold text-slate-900 tracking-tight">
                                {word.word}
                              </h4>
                              <p className="text-xs font-mono text-slate-400 mt-0.5">
                                {word.phonetic}
                              </p>
                            </div>

                            {/* Collocations preview */}
                            {word.collocations && word.collocations.length > 0 && (
                              <div className="text-2xs text-slate-500 space-y-0.5">
                                <span className="font-semibold text-slate-400 block">Collocation:</span>
                                <span className="italic text-slate-700">{word.collocations[0]}</span>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-2xs text-slate-400">
                            <span className="flex items-center gap-1 text-slate-500">
                              <RotateCw className="w-3 h-3" />
                              <span>Click to flip definition</span>
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakWord(word.word);
                              }}
                              className="p-1 text-indigo-600 hover:text-indigo-800 rounded"
                              title="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* BACK OF CARD */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-indigo-200 rounded-xl shadow-xs p-5 flex flex-col justify-between overflow-y-auto">
                          <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                              <span className="font-editorial text-base font-bold text-indigo-900">
                                {word.word}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakWord(word.word);
                                }}
                                className="p-1 text-indigo-600 hover:text-indigo-800 rounded"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-xs font-medium text-slate-800 leading-snug mb-2">
                              {word.definition}
                            </p>

                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-2xs space-y-0.5">
                              <div className="flex items-center justify-between font-semibold text-indigo-700">
                                <span>Example:</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakWord(word.exampleSentence);
                                  }}
                                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                                >
                                  <Volume2 className="w-3 h-3" />
                                  <span>Listen</span>
                                </button>
                              </div>
                              <p className="italic text-slate-700">
                                "{word.exampleSentence}"
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-2xs text-slate-400">
                            <span>Click to flip back</span>
                            <span className="font-mono text-indigo-600 font-bold">{unit.number}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
