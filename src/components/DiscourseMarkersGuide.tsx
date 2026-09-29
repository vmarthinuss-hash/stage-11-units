import React, { useState } from 'react';
import { DISCOURSE_MARKERS_LIBRARY } from '../data/curriculumData';
import { speakWord, soundManager } from '../utils/audio';
import { Volume2, Copy, Check, BookOpen, Sparkles, Filter } from 'lucide-react';

export const DiscourseMarkersGuide: React.FC = () => {
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleCopy = (phrase: string) => {
    soundManager.playCardFlip();
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 1800);
  };

  const filteredCategories = selectedCategory === 'all'
    ? DISCOURSE_MARKERS_LIBRARY
    : DISCOURSE_MARKERS_LIBRARY.filter((c) => c.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Cohesion & Academic Rhetoric</span>
            <span aria-hidden="true">·</span>
            <span>High School ESL Toolkit</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            Discourse Markers & Linking Devices
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential transitions and connectors to elevate coherence and syntactic complexity across essays and reports.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories ({DISCOURSE_MARKERS_LIBRARY.length})</option>
            {DISCOURSE_MARKERS_LIBRARY.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-6">
        {filteredCategories.map((cat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
          >
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h3 className="font-editorial text-lg font-bold text-slate-900">
                {cat.category}
              </h3>
              <p className="text-xs text-slate-500">
                {cat.description}
              </p>
            </div>

            <div className="p-5 divide-y divide-slate-100">
              {cat.markers.map((item, mIdx) => {
                const isCopied = copiedPhrase === item.phrase;
                return (
                  <div
                    key={mIdx}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group hover:bg-slate-50/50 rounded-lg px-2 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-editorial text-base font-bold text-indigo-900">
                          {item.phrase}
                        </span>
                        <button
                          onClick={() => speakWord(item.phrase)}
                          className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
                          title="Pronounce phrase"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 italic">
                        "{item.example}"
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(item.phrase)}
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
