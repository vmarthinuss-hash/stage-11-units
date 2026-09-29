import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WritingTask, StudentDraft } from '../types';
import { WRITING_TASKS, VOCABULARY_LIST, DISCOURSE_MARKERS_LIBRARY, UNITS } from '../data/curriculumData';
import { soundManager } from '../utils/audio';
import { analyzeWritingLive } from '../utils/writingFeedback';
import { LiveWritingFeedbackPanel } from './LiveWritingFeedbackPanel';
import {
  PenTool,
  BookOpen,
  CheckCircle2,
  Copy,
  Download,
  Printer,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  MessageSquare,
  Save,
  Check,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Award,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface WritingStudioProps {
  initialUnitId?: number | null;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({ initialUnitId = null }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => {
    if (initialUnitId) {
      const match = WRITING_TASKS.find((t) => t.unitId === initialUnitId);
      if (match) return match.id;
    }
    return WRITING_TASKS[0].id;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'liveFeedback' | 'outline' | 'model' | 'rubric'>('editor');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('Auto-saved');
  const [peerComment, setPeerComment] = useState<string>('');
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [pasteBlockedWarning, setPasteBlockedWarning] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentTask: WritingTask = useMemo(() => {
    return WRITING_TASKS.find((t) => t.id === selectedTaskId) || WRITING_TASKS[0];
  }, [selectedTaskId]);

  const currentUnit = useMemo(() => {
    return UNITS.find((u) => u.id === currentTask.unitId);
  }, [currentTask]);

  // Load existing draft from localStorage
  useEffect(() => {
    try {
      const savedKey = `lexicraft_draft_${currentTask.id}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        const parsed: StudentDraft = JSON.parse(saved);
        setTitle(parsed.title || '');
        setBody(parsed.body || '');
        setRubricScores(parsed.rubricScores || {});
        setPeerComment(parsed.peerComments || '');
      } else {
        setTitle('');
        setBody('');
        setRubricScores({});
        setPeerComment('');
      }
    } catch {
      // ignore
    }
  }, [currentTask.id]);

  // Auto-save changes to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedKey = `lexicraft_draft_${currentTask.id}`;
        const draft: StudentDraft = {
          taskId: currentTask.id,
          unitId: currentTask.unitId,
          title,
          body,
          outlineNotes: {},
          lastSaved: Date.now(),
          rubricScores,
          peerComments: peerComment,
        };
        localStorage.setItem(savedKey, JSON.stringify(draft));
        setSaveStatus('Auto-saved');
      } catch {
        // ignore
      }
    }, 1000);

    setSaveStatus('Saving...');
    return () => clearTimeout(timer);
  }, [title, body, rubricScores, peerComment, currentTask.id, currentTask.unitId]);

  // Relevant vocabulary list for this unit
  const targetVocab = useMemo(() => {
    return VOCABULARY_LIST.filter((w) => w.unitId === currentTask.unitId);
  }, [currentTask.unitId]);

  // LIVE SCORING AND FEEDBACK ENGINE
  const liveAnalysis = useMemo(() => {
    return analyzeWritingLive(body, title, currentTask, targetVocab);
  }, [body, title, currentTask, targetVocab]);

  // Word count & paragraph metrics
  const words = liveAnalysis.stats.wordCount;
  const paragraphCount = liveAnalysis.stats.paragraphCount;

  // Check which target words are used in the text
  const usedVocab = liveAnalysis.stats.targetVocabFound;

  // PASTE BLOCKING LOGIC (Requirement: disable paste in the text block)
  const handleBlockedPaste = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    soundManager.playIncorrect();
    setPasteBlockedWarning(true);
  };

  // Auto dismiss warning after 4.5s
  useEffect(() => {
    if (pasteBlockedWarning) {
      const timer = setTimeout(() => setPasteBlockedWarning(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [pasteBlockedWarning]);

  // Insert a discourse marker at cursor
  const insertMarker = (phrase: string) => {
    soundManager.playCardFlip();
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => (prev ? `${prev} ${phrase} ` : `${phrase} `));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = body.substring(0, start);
    const after = body.substring(end);
    const insertText = (before && !before.endsWith(' ') && !before.endsWith('\n') ? ' ' : '') + phrase + ' ';

    const nextText = before + insertText + after;
    setBody(nextText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertText.length, start + insertText.length);
    }, 50);
  };

  const handleCopy = () => {
    const fullText = `${title}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `# ${title || currentTask.title}\n\nTask: ${currentTask.prompt}\n\n---\n\n${body}`;
    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentTask.title.toLowerCase().replace(/\s+/g, '_')}_draft.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getPillColor = (score: number) => {
    if (score >= 21) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 16) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    if (score >= 11) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Studio Header & Task Selector */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Writing Studio & Rubrics</span>
            <span aria-hidden="true">·</span>
            <span>{currentTask.loCode}</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold text-slate-900">
            {currentTask.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Genre: <span className="font-semibold text-slate-700">{currentTask.genre}</span> · Target: <span className="font-mono">{currentTask.targetWordCount.min}–{currentTask.targetWordCount.max} words</span>
          </p>
        </div>

        {/* Task Dropdown & Tab Navigator */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {WRITING_TASKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.loCode}: {t.title}
              </option>
            ))}
          </select>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'editor' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Writing Canvas
            </button>
            <button
              onClick={() => setActiveTab('liveFeedback')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'liveFeedback' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-indigo-600 hover:text-indigo-900 font-semibold'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Live Evaluation ({liveAnalysis.overallScore}/100)</span>
            </button>
            <button
              onClick={() => setActiveTab('outline')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'outline' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guided Outline
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'model' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Model Essay
            </button>
            <button
              onClick={() => setActiveTab('rubric')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'rubric' ? 'bg-white text-slate-900 font-semibold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rubric Checklist
            </button>
          </div>
        </div>
      </div>

      {/* Task Prompt Overview Card */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 sm:p-5 text-indigo-950 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <PenTool className="w-4 h-4" />
            <span>Official Curriculum Prompt</span>
          </div>
          <p className="text-sm font-medium leading-relaxed">
            {currentTask.prompt}
          </p>
        </div>

        {/* Quick Target Grammar badges */}
        <div className="bg-white/80 backdrop-blur p-3 rounded-lg border border-indigo-100 text-xs shrink-0 max-w-xs space-y-1">
          <span className="font-semibold text-indigo-900 block mb-1">Key Structures:</span>
          {currentTask.targetGrammarStructures.slice(0, 3).map((st, i) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>{st}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PASTE BLOCKED WARNING TOAST */}
      {pasteBlockedWarning && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 text-rose-950 flex items-start justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-rose-900">
                Pasting is Disabled in Writing Section
              </h4>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                As required by your ESL curriculum for authentic assessment, pasting into the composition editor is blocked. Please type your work directly to develop genuine vocabulary retention, spelling accuracy, and sentence-building fluency.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPasteBlockedWarning(false)}
            className="text-xs font-bold text-rose-600 hover:text-rose-900 px-2 py-1 rounded hover:bg-rose-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: WRITING CANVAS */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Writing Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
              {/* Academic Integrity Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium bg-slate-50 border border-slate-200/90 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Academic Integrity Mode: Direct Typing Only (Paste Disabled)</span>
                </div>

                {/* Live Composite Score Indicator */}
                <button
                  type="button"
                  onClick={() => setActiveTab('liveFeedback')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold hover:bg-indigo-100 transition-colors"
                  title="Click to view full feedback breakdown"
                >
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Live Score: {liveAnalysis.overallScore}/100</span>
                  <span className="text-xs font-medium text-indigo-600">· {liveAnalysis.overallBand}</span>
                </button>
              </div>

              {/* Draft Title Input (Paste Disabled) */}
              <div>
                <input
                  type="text"
                  placeholder="Enter your essay title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onPaste={handleBlockedPaste}
                  onDrop={handleBlockedPaste}
                  onKeyDown={(e) => {
                    if (
                      ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) ||
                      (e.shiftKey && e.key === 'Insert')
                    ) {
                      e.preventDefault();
                      handleBlockedPaste();
                    }
                  }}
                  className="w-full text-xl sm:text-2xl font-editorial font-bold text-slate-900 placeholder:text-slate-400 border-b border-slate-200 pb-2 focus:outline-hidden focus:border-indigo-600 transition-colors"
                />
              </div>

              {/* Main Body Textarea (Paste Disabled) */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  rows={14}
                  placeholder="Begin typing your original composition here. Note: Pasting is disabled in this section to support authentic language acquisition. Utilize the target vocabulary and discourse markers from the toolkit on the right..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onPaste={handleBlockedPaste}
                  onDrop={handleBlockedPaste}
                  onKeyDown={(e) => {
                    if (
                      ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) ||
                      (e.shiftKey && e.key === 'Insert')
                    ) {
                      e.preventDefault();
                      handleBlockedPaste();
                    }
                  }}
                  className="w-full p-4 text-base leading-relaxed text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-sans resize-y min-h-[360px]"
                />
              </div>

              {/* Bottom Writing Action Bar & Word Count Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                {/* Metrics */}
                <div className="flex items-center gap-4 text-slate-500 font-mono">
                  <span>
                    Words: <strong className={`text-slate-900 ${words >= currentTask.targetWordCount.min && words <= currentTask.targetWordCount.max ? 'text-emerald-700' : ''}`}>{words}</strong> / {currentTask.targetWordCount.min}–{currentTask.targetWordCount.max}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Paragraphs: {paragraphCount}</span>
                  <span aria-hidden="true">·</span>
                  <span>{saveStatus}</span>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Download as Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Print draft"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE 4-PILLAR SCORING CARD (Grammar & Vocab, Organization, Content, Register & Style) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-lg font-bold text-slate-900">
                    Live Evaluation & Rubric Scores
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scores update in real-time as you compose. Click any pillar to view detailed diagnostic callouts.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('liveFeedback')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Detailed Report</span>
                  <span>→</span>
                </button>
              </div>

              {/* 4 Pillars Horizontal Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {/* 1. Grammar & Vocab */}
                <button
                  type="button"
                  onClick={() => setActiveTab('liveFeedback')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition-all"
                >
                  <span className="font-semibold text-slate-600 block mb-1 truncate">
                    1. Grammar & Vocab
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xl font-bold text-slate-900">
                      {liveAnalysis.grammarVocab.score}
                    </span>
                    <span className="text-slate-400">/ 25</span>
                  </div>
                  <span className={`inline-block mt-1 text-2xs px-1.5 py-0.5 rounded font-bold ${getPillColor(liveAnalysis.grammarVocab.score)}`}>
                    {liveAnalysis.grammarVocab.level}
                  </span>
                </button>

                {/* 2. Organization */}
                <button
                  type="button"
                  onClick={() => setActiveTab('liveFeedback')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition-all"
                >
                  <span className="font-semibold text-slate-600 block mb-1 truncate">
                    2. Organization
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xl font-bold text-slate-900">
                      {liveAnalysis.organization.score}
                    </span>
                    <span className="text-slate-400">/ 25</span>
                  </div>
                  <span className={`inline-block mt-1 text-2xs px-1.5 py-0.5 rounded font-bold ${getPillColor(liveAnalysis.organization.score)}`}>
                    {liveAnalysis.organization.level}
                  </span>
                </button>

                {/* 3. Content */}
                <button
                  type="button"
                  onClick={() => setActiveTab('liveFeedback')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition-all"
                >
                  <span className="font-semibold text-slate-600 block mb-1 truncate">
                    3. Content
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xl font-bold text-slate-900">
                      {liveAnalysis.content.score}
                    </span>
                    <span className="text-slate-400">/ 25</span>
                  </div>
                  <span className={`inline-block mt-1 text-2xs px-1.5 py-0.5 rounded font-bold ${getPillColor(liveAnalysis.content.score)}`}>
                    {liveAnalysis.content.level}
                  </span>
                </button>

                {/* 4. Register & Style */}
                <button
                  type="button"
                  onClick={() => setActiveTab('liveFeedback')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition-all"
                >
                  <span className="font-semibold text-slate-600 block mb-1 truncate">
                    4. Register & Style
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-xl font-bold text-slate-900">
                      {liveAnalysis.registerStyle.score}
                    </span>
                    <span className="text-slate-400">/ 25</span>
                  </div>
                  <span className={`inline-block mt-1 text-2xs px-1.5 py-0.5 rounded font-bold ${getPillColor(liveAnalysis.registerStyle.score)}`}>
                    {liveAnalysis.registerStyle.level}
                  </span>
                </button>
              </div>

              {/* Immediate High-Yield Live Warnings & Tips */}
              {(liveAnalysis.stats.contractionsFound.length > 0 || liveAnalysis.stats.informalWordsFound.length > 0 || liveAnalysis.stats.grammarIssues.length > 0) && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Real-Time Style & Grammar Alerts</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Contraction Alerts */}
                    {liveAnalysis.stats.contractionsFound.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                        <span className="font-bold block mb-0.5">Formal Register Notice:</span>
                        <span>Replace informal contractions: {liveAnalysis.stats.contractionsFound.slice(0, 3).map((c) => `"${c}"`).join(', ')} with uncontracted full forms.</span>
                      </div>
                    )}

                    {/* Informal Words Alerts */}
                    {liveAnalysis.stats.informalWordsFound.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
                        <span className="font-bold block mb-0.5">Vocabulary Upgrade:</span>
                        <span>Replace "{liveAnalysis.stats.informalWordsFound[0].word}" with academic alternative: <em>{liveAnalysis.stats.informalWordsFound[0].suggestion}</em>.</span>
                      </div>
                    )}

                    {/* Syntax / Spacing issues */}
                    {liveAnalysis.stats.grammarIssues.slice(0, 1).map((issue, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 sm:col-span-2">
                        <span className="font-bold block mb-0.5">Grammar Mechanic:</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Target Word Bank & Discourse Markers Arsenal (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Target Word Bank */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Unit Target Word Bank
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {usedVocab.length}/{targetVocab.length} Used
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Incorporate these words into your composition. Badges turn green in real-time as you write!
              </p>

              <div className="flex flex-wrap gap-1.5">
                {targetVocab.map((w) => {
                  const isUsed = usedVocab.includes(w.word);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => insertMarker(w.word)}
                      title={`Click to insert "${w.word}". Definition: ${w.definition}`}
                      className={`text-xs font-medium px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                        isUsed
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                      }`}
                    >
                      {isUsed && <Check className="w-3 h-3 text-emerald-600" />}
                      <span>{w.word}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Discourse Markers Arsenal (Click to Insert) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Discourse Markers Arsenal
                </span>
                <span className="text-xs text-indigo-600 font-semibold">Click to Insert</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {DISCOURSE_MARKERS_LIBRARY.slice(0, 5).map((cat, i) => (
                  <div key={i} className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-500 block">
                      {cat.category}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cat.markers.map((m, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertMarker(m.phrase)}
                          className="px-2 py-0.5 text-xs bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 rounded transition-colors whitespace-nowrap"
                        >
                          {m.phrase}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEDICATED LIVE EVALUATION TAB */}
      {activeTab === 'liveFeedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab('editor')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
            >
              <span>← Return to Writing Canvas</span>
            </button>
            <span className="text-xs text-slate-500 font-mono">
              Word Count: {words} words · Paragraphs: {paragraphCount}
            </span>
          </div>

          <LiveWritingFeedbackPanel
            analysis={liveAnalysis}
            targetMinWords={currentTask.targetWordCount.min}
          />
        </div>
      )}

      {/* TAB 3: GUIDED OUTLINE */}
      {activeTab === 'outline' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-slate-900 mb-1">
              Step-by-Step Writing Outline
            </h3>
            <p className="text-xs text-slate-500">
              Follow this structured blueprint to organize your paragraphs logically.
            </p>
          </div>

          <div className="space-y-4">
            {currentTask.outlineSections.map((section, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {section.title}
                  </h4>
                  <button
                    onClick={() => {
                      insertMarker(section.starterSentence);
                      setActiveTab('editor');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Insert Sentence Starter →
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block">Guiding Questions to Answer:</span>
                  <ul className="space-y-1 pl-4 list-disc marker:text-indigo-500">
                    {section.guidingQuestions.map((q, qIdx) => (
                      <li key={qIdx}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Starter Sentence:
                  </span>
                  <p className="italic text-slate-800">
                    "{section.starterSentence}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab('editor')}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Return to Writing Canvas
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: ANNOTATED MODEL ESSAY */}
      {activeTab === 'model' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
              <span>Band 8+ Academic Exemplar</span>
              <span aria-hidden="true">·</span>
              <span>Annotated for High School ESL</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-slate-900">
              {currentTask.modelText.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Model Text (8 cols) */}
            <div className="lg:col-span-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="font-serif text-base sm:text-lg leading-relaxed text-slate-800 whitespace-pre-line">
                {currentTask.modelText.content}
              </div>
            </div>

            {/* Annotations Legend (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Teacher's Linguistic Annotations
              </span>

              <div className="space-y-2.5">
                {currentTask.modelText.highlights.map((h, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-indigo-700 font-mono">"{h.text}"</span>
                      <span className="text-slate-400 capitalize">{h.type}</span>
                    </div>
                    <p className="text-slate-600 leading-snug">
                      {h.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RUBRIC CHECKLIST & PEER REVIEW */}
      {activeTab === 'rubric' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-slate-900 mb-1">
              Self & Peer Evaluation Rubric
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate this piece against the official course learning objective criteria.
            </p>
          </div>

          {/* Criteria Grid */}
          <div className="space-y-4">
            {currentTask.rubricCriteria.map((crit, idx) => {
              const currentScore = rubricScores[crit.category] ?? 0;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {crit.category}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {crit.standards}
                      </p>
                    </div>

                    {/* Score Selector (1 to maxScore) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setRubricScores((prev) => ({ ...prev, [crit.category]: val }));
                          }}
                          className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                            currentScore === val
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                      <span className="text-xs text-slate-400 font-mono ml-1">/ 5</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Peer Comments Text Box (Paste Disabled) */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Peer Review & Teacher Feedback Notes
            </span>
            <textarea
              rows={3}
              placeholder="Provide constructive feedback analyzing strengths and areas for grammatical or cohesion improvement..."
              value={peerComment}
              onChange={(e) => setPeerComment(e.target.value)}
              onPaste={handleBlockedPaste}
              onDrop={handleBlockedPaste}
              onKeyDown={(e) => {
                if (
                  ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) ||
                  (e.shiftKey && e.key === 'Insert')
                ) {
                  e.preventDefault();
                  handleBlockedPaste();
                }
              }}
              className="w-full p-3 text-xs text-slate-800 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
