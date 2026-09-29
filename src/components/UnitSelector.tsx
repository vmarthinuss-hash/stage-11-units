import React from 'react';
import { UNITS, VOCABULARY_LIST, WRITING_TASKS } from '../data/curriculumData';
import { UnitInfo } from '../types';
import { Trophy, HandHeart, Compass, Activity, HeartPulse, Cpu, PawPrint, Droplets, Wheat, Shirt, Sparkles, BookOpen, Layers, PenTool, Play } from 'lucide-react';

interface UnitSelectorProps {
  selectedUnitId: number | null;
  onSelectUnit: (unitId: number | null) => void;
  onStartFlashcards: (unitId: number | null) => void;
  onStartGames: (unitId: number) => void;
  onStartWriting: (unitId: number) => void;
  onGoToVocab?: () => void;
  onGoToDescriptive?: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  HandHeart,
  Compass,
  Activity,
  HeartPulse,
  Cpu,
  PawPrint,
  Droplets,
  Wheat,
  Shirt,
  Sparkles,
  BookOpen,
};

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  selectedUnitId,
  onSelectUnit,
  onStartFlashcards,
  onStartGames,
  onStartWriting,
  onGoToVocab,
  onGoToDescriptive,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Banner Section */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-lg">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_esl_academy_1790653144740.jpg"
            alt="ESL Language Studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            <span>Stage 11 Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>Academic Lexis & Composition</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 text-balance">
            Master Target Vocabulary & Academic Writing
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            Practice academic vocabulary with interactive flashcards and fast-paced games. Build essays, reports, and biographical profiles.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectUnit(null)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedUnitId === null
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Browse All Units ({UNITS.length} Units)
            </button>
            {onGoToVocab && (
              <button
                onClick={onGoToVocab}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Unit Vocabulary Lists</span>
              </button>
            )}
            {onGoToDescriptive && (
              <button
                onClick={onGoToDescriptive}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-500/20 text-white border border-indigo-400/30 hover:bg-indigo-500/30 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>Descriptive Vocabulary</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Unit Filter Ribbon */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Curriculum Units</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a unit to access focused vocabulary flashcards, match challenges, and structured writing rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Filter:</span>
          <button
            onClick={() => onSelectUnit(null)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedUnitId === null
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Units
          </button>
          {UNITS.slice(0, 4).map((u) => (
            <button
              key={u.id}
              onClick={() => onSelectUnit(u.id)}
              className={`hidden sm:inline-block px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedUnitId === u.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {u.number}
            </button>
          ))}
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UNITS.filter((u) => selectedUnitId === null || u.id === selectedUnitId).map((unit) => {
          const Icon = iconMap[unit.iconName] || Trophy;
          const unitWords = VOCABULARY_LIST.filter((w) => w.unitId === unit.id);
          const unitTasks = WRITING_TASKS.filter((t) => t.unitId === unit.id);

          return (
            <div
              key={unit.id}
              className="group flex flex-col justify-between bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden"
            >
              <div>
                {/* Visual Header with fallback */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={unit.imagePath}
                    alt={unit.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                    {unit.number}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-editorial text-lg font-bold leading-tight drop-shadow-sm">
                      {unit.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {unit.description}
                  </p>

                  {/* Clean unboxed LO tags with typographic separators */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                    <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                    <span className="font-medium">{unit.loTags.join(' · ')}</span>
                  </div>

                  {/* Key metrics without pills */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span>{unitWords.length > 0 ? unitWords.length : '4+'} Academic Words</span>
                    <span aria-hidden="true">·</span>
                    <span>{unitTasks.length > 0 ? `${unitTasks.length} Writing Task` : 'Guided Writing'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 grid grid-cols-3 gap-2">
                <button
                  onClick={() => onStartFlashcards(unit.id)}
                  className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-2xs whitespace-nowrap"
                  title="Study Flashcards"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Cards</span>
                </button>

                <button
                  onClick={() => onStartGames(unit.id)}
                  className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-2xs whitespace-nowrap"
                  title="Play Vocabulary Games"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Games</span>
                </button>

                <button
                  onClick={() => onStartWriting(unit.id)}
                  className="flex items-center justify-center gap-1 py-2 px-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
                  title="Open Writing Practice"
                >
                  <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Writing</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
