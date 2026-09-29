import React, { useState } from 'react';
import { LiveWritingAnalysis, CategoryFeedback } from '../utils/writingFeedback';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Layers,
  FileText,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface LiveWritingFeedbackPanelProps {
  analysis: LiveWritingAnalysis;
  targetMinWords: number;
}

export const LiveWritingFeedbackPanel: React.FC<LiveWritingFeedbackPanelProps> = ({
  analysis,
  targetMinWords,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('grammar_vocab');

  const getPillarColor = (score: number) => {
    if (score >= 21) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 16) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 11) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const categories: CategoryFeedback[] = [
    analysis.grammarVocab,
    analysis.organization,
    analysis.content,
    analysis.registerStyle,
  ];

  // Collect all immediate recommendations across all 4 pillars
  const allRecommendations: { category: string; tip: string }[] = [];
  categories.forEach((cat) => {
    cat.recommendations.forEach((rec) => {
      allRecommendations.push({ category: cat.title, tip: rec });
    });
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
      {/* Top Score Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Real-Time Evaluation Engine</span>
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
            Overall Score: {analysis.overallScore} / 100
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            {analysis.summaryText}
          </p>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-6">
          <span className="text-xs text-slate-400 font-medium">Curriculum Band</span>
          <span className="font-editorial text-lg font-bold text-indigo-200">
            {analysis.overallBand}
          </span>
        </div>
      </div>

      {/* 4 Pillar Mini-Cards Grid */}
      <div className="px-5 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isSelected = expandedCategory === cat.category;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => setExpandedCategory(isSelected ? null : cat.category)}
              className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs bg-indigo-50/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold truncate">{cat.title}</span>
                  <span className="font-mono text-slate-400">/ 25</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl font-bold text-slate-900">{cat.score}</span>
                  <span className="text-xs font-medium text-slate-500">pts</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPillarColor(cat.score)}`}>
                  {cat.level}
                </span>
                <span className="text-slate-400 text-xs">
                  {isSelected ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Immediate "How to Boost Your Score" Action List */}
      {allRecommendations.length > 0 && (
        <div className="mx-5 sm:mx-6 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span>High-Yield Revision Actions ({allRecommendations.length} recommendations)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-amber-950">
            {allRecommendations.slice(0, 4).map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>
                  <strong>[{rec.category}]:</strong> {rec.tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expanded Detail Section for Selected Pillar */}
      <div className="px-5 sm:px-6 pb-6 space-y-4">
        {categories.map((cat) => {
          if (expandedCategory !== cat.category) return null;

          return (
            <div key={cat.category} className="border border-slate-200 rounded-xl p-5 bg-slate-50/60 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-editorial text-lg font-bold text-slate-900">
                    {cat.title} Analysis
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${getPillarColor(cat.score)}`}>
                    Score: {cat.score} / 25 ({cat.level})
                  </span>
                </div>
              </div>

              {/* Strengths */}
              {cat.strengths.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Demonstrated Strengths</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 pl-5 list-disc marker:text-emerald-500">
                    {cat.strengths.map((str, sIdx) => (
                      <li key={sIdx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Recommendations */}
              {cat.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Areas to Enhance</span>
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 pl-5 list-disc marker:text-amber-500">
                    {cat.recommendations.map((rec, rIdx) => (
                      <li key={rIdx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Live Diagnostic Findings */}
              {cat.detections.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Diagnostic Details
                  </span>
                  <div className="space-y-1.5">
                    {cat.detections.map((det, dIdx) => (
                      <div
                        key={dIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                          det.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : det.type === 'warning'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                        }`}
                      >
                        {det.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                        ) : det.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                        )}
                        <span>{det.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
