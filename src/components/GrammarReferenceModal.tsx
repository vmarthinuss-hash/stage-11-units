import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Sparkles, Copy, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GrammarReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GrammarReferenceModal: React.FC<GrammarReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTopic, setActiveTopic] = useState<'tenses' | 'relative' | 'passive' | 'register'>('tenses');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-slate-900">
                Academic Grammar & Cohesion Toolkit
              </h3>
              <p className="text-xs text-slate-500">
                Stage 11 reference for grammar, cohesion, and formal register.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTopic('tenses')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTopic === 'tenses' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Achievement Tenses (Past / Perfect)
          </button>
          <button
            onClick={() => setActiveTopic('relative')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTopic === 'relative' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Relative Clauses (Which / Who / Whose)
          </button>
          <button
            onClick={() => setActiveTopic('passive')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTopic === 'passive' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Objective Passive Voice
          </button>
          <button
            onClick={() => setActiveTopic('register')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTopic === 'register' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formal Academic Register
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {activeTopic === 'tenses' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-lg font-bold text-slate-900 mb-1">
                  Mastering Achievement Tenses (LO 1.6 & 1.7)
                </h4>
                <p className="text-xs text-slate-600">
                  When writing biographies of heroes or recounting world records, you must skillfully interweave three tenses:
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-700 block text-xs uppercase tracking-wider mb-1">
                    1. Past Simple: Specific Completed Historical Milestone
                  </span>
                  <p className="text-xs text-slate-700">
                    Use for exact dates or completed past actions.
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200">
                    "In 1969, Neil Armstrong <strong>stepped</strong> onto the lunar surface."
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-700 block text-xs uppercase tracking-wider mb-1">
                    2. Past Perfect: Action Prior to Another Past Event
                  </span>
                  <p className="text-xs text-slate-700">
                    Denotes preparation, previous struggles, or conditions existing before the breakthrough.
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200">
                    "Prior to achieving international fame, the athlete <strong>had endured</strong> years of grueling recovery."
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-700 block text-xs uppercase tracking-wider mb-1">
                    3. Present Perfect: Ongoing Impact & Enduring Legacy
                  </span>
                  <p className="text-xs text-slate-700">
                    Connects historical heroism to the contemporary world today.
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200">
                    "Katherine Johnson's historic mathematical work <strong>has inspired</strong> thousands of young women in STEM."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'relative' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-lg font-bold text-slate-900 mb-1">
                  Relative Clauses for Syntactic Complexity (LO 2.5)
                </h4>
                <p className="text-xs text-slate-600">
                  Elevate simple sentences into complex sentences by embedding relative clauses.
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-700 block text-xs uppercase tracking-wider mb-1">
                    Defining Relative Clauses (Essential Identifying Information)
                  </span>
                  <p className="text-xs text-slate-600 mb-1.5">No commas needed.</p>
                  <p className="font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200">
                    "Volunteers <strong>who dedicate their weekends to animal shelters</strong> provide indispensable civic support."
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-700 block text-xs uppercase tracking-wider mb-1">
                    Non-Defining Relative Clauses (Extra Parenthetical Information)
                  </span>
                  <p className="text-xs text-slate-600 mb-1.5">Must be enclosed in commas.</p>
                  <p className="font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200">
                    "The local youth center<strong>, which was founded in 2012,</strong> offers free digital literacy classes."
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-700 block text-xs uppercase tracking-wider mb-1">
                    Possessive Relative Pronoun: 'whose'
                  </span>
                  <p className="font-mono text-xs text-slate-900 bg-white p-2 rounded border border-slate-200">
                    "We collaborated with a grassroots charity <strong>whose primary mission</strong> is combating urban food insecurity."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'passive' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-lg font-bold text-slate-900 mb-1">
                  Objective Passive Voice for Formal Reports (LO 9.5 & 10.5)
                </h4>
                <p className="text-xs text-slate-600">
                  In formal scientific and environmental reports, the focus is placed on the phenomenon or recommendation rather than personal pronouns ('I' or 'we').
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                  <span className="font-bold text-rose-800 block mb-1">❌ Informal Active:</span>
                  <p className="text-rose-900 italic">
                    "We saw that farmers pumped too much groundwater out of the wells."
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <span className="font-bold text-emerald-800 block mb-1">✅ Formal Objective Passive:</span>
                  <p className="text-emerald-950 italic">
                    "Subterranean groundwater reserves <strong>have been critically depleted</strong> by uncontrolled agricultural withdrawal."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTopic === 'register' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-editorial text-lg font-bold text-slate-900 mb-1">
                  Formal Academic Register Checklist
                </h4>
                <p className="text-xs text-slate-600">
                  Avoid conversational habits in academic essays and formal reports:
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Eliminate Contractions:</strong> Use "cannot", "do not", and "it is" rather than "can't", "don't", and "it's".
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Replace Phrasal Verbs with Academic Latinate Verbs:</strong> Instead of "look into" use <em>investigate</em>; instead of "give up" use <em>relinquish</em>; instead of "get rid of" use <em>eradicate</em>.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Avoid Absolute Generalizations:</strong> Use hedging adverbs (<em>frequently, substantially, arguably</em>) rather than blanket claims ("always", "nobody").
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it, return to practice
          </button>
        </div>
      </div>
    </div>
  );
};
