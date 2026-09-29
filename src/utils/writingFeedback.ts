import { WritingTask, VocabWord } from '../types';
import { DISCOURSE_MARKERS_LIBRARY } from '../data/curriculumData';

export interface CategoryFeedback {
  category: 'grammar_vocab' | 'organization' | 'content' | 'register_style';
  title: string;
  score: number; // 0 - 25
  maxScore: 25;
  level: 'Needs Development' | 'Emerging' | 'Competent' | 'Advanced' | 'Exemplary';
  strengths: string[];
  recommendations: string[];
  detections: {
    type: 'success' | 'warning' | 'info';
    message: string;
    details?: string;
  }[];
}

export interface LiveWritingAnalysis {
  overallScore: number; // 0 - 100
  overallBand: 'Developing (0-59)' | 'Competent (60-74)' | 'Proficient (75-89)' | 'Exemplary (90-100)';
  summaryText: string;
  grammarVocab: CategoryFeedback;
  organization: CategoryFeedback;
  content: CategoryFeedback;
  registerStyle: CategoryFeedback;
  stats: {
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    paragraphCount: number;
    avgWordsPerSentence: number;
    targetVocabFound: string[];
    targetVocabMissing: string[];
    discourseMarkersFound: string[];
    contractionsFound: string[];
    informalWordsFound: { word: string; suggestion: string }[];
    grammarIssues: string[];
  };
}

// List of common informal contractions banned in formal academic writing
const CONTRACTIONS_MAP: Record<string, string> = {
  "don't": "do not",
  "doesn't": "does not",
  "didn't": "did not",
  "can't": "cannot",
  "couldn't": "could not",
  "won't": "will not",
  "wouldn't": "would not",
  "shouldn't": "should not",
  "isn't": "is not",
  "aren't": "are not",
  "wasn't": "was not",
  "weren't": "were not",
  "haven't": "have not",
  "hasn't": "has not",
  "hadn't": "had not",
  "it's": "it is",
  "that's": "that is",
  "there's": "there is",
  "they're": "they are",
  "we're": "we are",
  "you're": "you are",
  "i'm": "I am",
  "i've": "I have",
  "we've": "we have",
  "they've": "they have",
  "gonna": "going to",
  "wanna": "want to",
  "gotta": "must / have to",
};

// Common informal words to replace in formal academic essays
const INFORMAL_WORDS: Record<string, string> = {
  "kids": "children / adolescents / youth",
  "stuff": "materials / elements / factors",
  "things": "aspects / issues / factors",
  "a lot of": "a substantial amount of / numerous",
  "lots of": "numerous / considerable",
  "awesome": "remarkable / outstanding",
  "huge": "significant / substantial / vast",
  "guy": "individual / person",
  "guys": "individuals / people",
  "cool": "appealing / innovative",
  "ok": "acceptable",
  "okay": "acceptable",
  "bad": "detrimental / adverse / unfavorable",
  "good": "beneficial / advantageous",
  "big": "major / extensive / profound",
  "crazy": "unprecedented / extreme",
};

export function analyzeWritingLive(
  body: string,
  title: string,
  task: WritingTask,
  targetVocabList: VocabWord[]
): LiveWritingAnalysis {
  const cleanBody = body.trim();
  const lowerBody = cleanBody.toLowerCase();

  // Word tokenization
  const words = cleanBody ? cleanBody.replace(/\s+/g, ' ').split(' ') : [];
  const wordCount = words.length;
  const charCount = cleanBody.length;

  // Sentences tokenization
  const rawSentences = cleanBody
    ? cleanBody.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0)
    : [];
  const sentenceCount = rawSentences.length;

  // Paragraphs
  const paragraphs = cleanBody
    ? cleanBody.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0)
    : [];
  const paragraphCount = paragraphs.length;

  const avgWordsPerSentence = sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  // 1. TARGET VOCABULARY DETECTION
  const targetVocabFound: string[] = [];
  const targetVocabMissing: string[] = [];

  targetVocabList.forEach((v) => {
    const vWord = v.word.toLowerCase();
    if (lowerBody.includes(vWord)) {
      targetVocabFound.push(v.word);
    } else {
      targetVocabMissing.push(v.word);
    }
  });

  // 2. DISCOURSE MARKERS DETECTION
  const discourseMarkersFound: string[] = [];
  DISCOURSE_MARKERS_LIBRARY.forEach((cat) => {
    cat.markers.forEach((m) => {
      const cleanPhrase = m.phrase.toLowerCase().replace(/[,.…]/g, '').trim();
      if (lowerBody.includes(cleanPhrase)) {
        if (!discourseMarkersFound.includes(m.phrase)) {
          discourseMarkersFound.push(m.phrase);
        }
      }
    });
  });

  // 3. CONTRACTIONS CHECK
  const contractionsFound: string[] = [];
  Object.keys(CONTRACTIONS_MAP).forEach((contr) => {
    const regex = new RegExp(`\\b${contr}\\b`, 'gi');
    if (regex.test(cleanBody)) {
      contractionsFound.push(contr);
    }
  });

  // 4. INFORMAL WORDS CHECK
  const informalWordsFound: { word: string; suggestion: string }[] = [];
  Object.keys(INFORMAL_WORDS).forEach((inf) => {
    const regex = new RegExp(`\\b${inf}\\b`, 'gi');
    if (regex.test(cleanBody)) {
      informalWordsFound.push({ word: inf, suggestion: INFORMAL_WORDS[inf] });
    }
  });

  // 5. GRAMMAR HEURISTICS & DETECTIONS
  const grammarIssues: string[] = [];

  // Check lowercase "i"
  if (/\b[i]\b/.test(cleanBody)) {
    grammarIssues.push('Capitalize the singular subject pronoun "I".');
  }

  // Check punctuation spacing errors: "word ,word" or "word.word"
  if (/\s[,.!?;:]/.test(cleanBody)) {
    grammarIssues.push('Space placed before punctuation marks (e.g. "word , next"). Punctuation should immediately follow the word.');
  }
  if (/[a-zA-Z][,.!?;:][a-zA-Z]/.test(cleanBody)) {
    grammarIssues.push('Missing space after punctuation marks (e.g. "word,next"). Add a space after commas and periods.');
  }

  // Check sentence start capitalization
  rawSentences.forEach((s) => {
    if (s.length > 0) {
      const firstChar = s.charAt(0);
      if (firstChar === firstChar.toLowerCase() && firstChar !== firstChar.toUpperCase()) {
        if (!grammarIssues.includes('Every sentence must begin with an uppercase capital letter.')) {
          grammarIssues.push('Every sentence must begin with an uppercase capital letter.');
        }
      }
    }
  });

  // Check repeated consecutive words ("very very", "the the")
  if (/\b(\w+)\s+\1\b/i.test(cleanBody)) {
    grammarIssues.push('Accidental duplicate word detected (e.g., repeated words like "the the").');
  }

  // Check run-on sentences (> 45 words)
  rawSentences.forEach((s) => {
    const wordsInSentence = s.split(/\s+/).length;
    if (wordsInSentence > 45) {
      if (!grammarIssues.includes('Long run-on sentence detected (>40 words). Split complex thoughts with periods or semi-colons.')) {
        grammarIssues.push('Long run-on sentence detected (>40 words). Split complex thoughts with periods or semi-colons.');
      }
    }
  });

  // ==========================================
  // SCORING PILLARS (0 to 25 points each)
  // ==========================================

  // --- PILLAR 1: GRAMMAR & VOCABULARY ---
  let gvScore = 0;
  const gvStrengths: string[] = [];
  const gvRecs: string[] = [];
  const gvDetections: CategoryFeedback['detections'] = [];

  if (wordCount >= 20) {
    // Target vocab points (0-9)
    if (targetVocabFound.length >= 4) {
      gvScore += 9;
      gvStrengths.push(`Rich use of target academic vocabulary (${targetVocabFound.length} terms used).`);
      gvDetections.push({
        type: 'success',
        message: `Applied ${targetVocabFound.length} target vocabulary items: ${targetVocabFound.join(', ')}.`,
      });
    } else if (targetVocabFound.length >= 2) {
      gvScore += 6;
      gvStrengths.push(`Incorporated target vocabulary (${targetVocabFound.join(', ')}).`);
      gvRecs.push(`Add 2 more words from the Unit Target Word Bank to demonstrate higher lexical range.`);
      gvDetections.push({
        type: 'info',
        message: `Target words applied: ${targetVocabFound.join(', ')}. Try adding: ${targetVocabMissing.slice(0, 3).join(', ')}.`,
      });
    } else if (targetVocabFound.length === 1) {
      gvScore += 3;
      gvRecs.push(`Integrate at least 3-4 words from the unit word bank.`);
      gvDetections.push({
        type: 'warning',
        message: `Only 1 target vocabulary term used. Integrate words like ${targetVocabMissing.slice(0, 3).join(', ')}.`,
      });
    } else {
      gvScore += 1;
      gvRecs.push(`Incorporate target vocabulary from this unit (e.g., ${targetVocabMissing.slice(0, 3).join(', ')}).`);
      gvDetections.push({
        type: 'warning',
        message: `No target unit vocabulary detected yet. Check the Word Bank on the right!`,
      });
    }

    // Syntactic complexity & Unit grammar target (0-9 pts)
    const hasRelativeClauses = /\b(who|which|whose|that)\b/i.test(cleanBody);
    const hasPastPerfect = /\b(had\s+\w+ed|had\s+been|had\s+seen|had\s+taught|had\s+endured)\b/i.test(cleanBody);
    const hasPresentPerfect = /\b(has\s+\w+ed|have\s+\w+ed|has\s+been|have\s+been)\b/i.test(cleanBody);
    const hasPassiveVoice = /\b(is|are|was|were|been|being)\s+\w+(ed|en)\b/i.test(cleanBody);
    const hasConditionals = /\b(if|unless|provided that|were this to)\b/i.test(cleanBody);

    let grammarFeaturesCount = 0;
    if (hasRelativeClauses) grammarFeaturesCount++;
    if (hasPastPerfect || hasPresentPerfect) grammarFeaturesCount++;
    if (hasPassiveVoice) grammarFeaturesCount++;
    if (hasConditionals) grammarFeaturesCount++;

    if (grammarFeaturesCount >= 3) {
      gvScore += 9;
      gvStrengths.push('Demonstrates a wide range of complex grammatical structures and clauses.');
    } else if (grammarFeaturesCount >= 2) {
      gvScore += 7;
      gvStrengths.push('Applies complex grammatical forms (relative clauses or perfect tenses).');
    } else if (grammarFeaturesCount === 1) {
      gvScore += 5;
      gvRecs.push('Experiment with relative clauses (who/which/whose) or passive voice to enhance complexity.');
    } else {
      gvScore += 3;
      gvRecs.push('Combine simple sentences into complex sentences using relative pronouns or subordinating conjunctions.');
    }

    // Grammar hygiene (0-7 pts)
    let grammarHygiene = 7;
    if (grammarIssues.length > 0) {
      grammarHygiene = Math.max(1, 7 - grammarIssues.length * 2);
      grammarIssues.forEach((issue) => {
        gvDetections.push({ type: 'warning', message: issue });
        gvRecs.push(issue);
      });
    } else {
      gvStrengths.push('Accurate sentence boundaries, capitalization, and punctuation.');
      gvDetections.push({ type: 'success', message: 'Clean grammar mechanics and punctuation formatting.' });
    }
    gvScore += grammarHygiene;
  } else if (wordCount > 0) {
    gvScore = 5;
    gvRecs.push('Write more sentences to enable full grammatical and lexical diagnosis.');
  }

  gvScore = Math.min(25, Math.max(0, gvScore));

  // --- PILLAR 2: ORGANIZATION & COHESION ---
  let orgScore = 0;
  const orgStrengths: string[] = [];
  const orgRecs: string[] = [];
  const orgDetections: CategoryFeedback['detections'] = [];

  if (wordCount >= 20) {
    // Paragraph division (0-11 pts)
    if (paragraphCount >= 3) {
      orgScore += 11;
      orgStrengths.push(`Well-structured outline with ${paragraphCount} distinct paragraphs (Introduction, Body, Conclusion).`);
      orgDetections.push({
        type: 'success',
        message: `Clear structural separation: ${paragraphCount} paragraphs identified.`,
      });
    } else if (paragraphCount === 2) {
      orgScore += 7;
      orgRecs.push('Add a separate concluding paragraph to synthesize your main findings.');
      orgDetections.push({
        type: 'info',
        message: 'Currently 2 paragraphs. High-band essays require a distinct 3-4 paragraph layout.',
      });
    } else {
      orgScore += 3;
      orgRecs.push('Break this single wall of text into 3 paragraphs: Introduction, Body, and Conclusion.');
      orgDetections.push({
        type: 'warning',
        message: 'Single continuous paragraph detected. Press Enter twice between main ideas.',
      });
    }

    // Discourse markers & cohesive devices (0-10 pts)
    if (discourseMarkersFound.length >= 4) {
      orgScore += 10;
      orgStrengths.push(`Rich use of discourse markers (${discourseMarkersFound.length} markers used).`);
      orgDetections.push({
        type: 'success',
        message: `Excellent cohesive flow using: ${discourseMarkersFound.slice(0, 4).join(', ')}.`,
      });
    } else if (discourseMarkersFound.length >= 2) {
      orgScore += 7;
      orgStrengths.push(`Uses transition connectors (${discourseMarkersFound.join(', ')}).`);
      orgRecs.push('Incorporate contrast connectors (e.g. "On the other hand,", "In contrast,") or cause/effect connectors ("Consequently,").');
      orgDetections.push({
        type: 'info',
        message: `Used markers: ${discourseMarkersFound.join(', ')}. Add 1-2 more from the Discourse Arsenal.`,
      });
    } else if (discourseMarkersFound.length === 1) {
      orgScore += 4;
      orgRecs.push('Insert formal transitions (e.g. "Furthermore,", "Consequently,") to link paragraphs smoothly.');
      orgDetections.push({
        type: 'warning',
        message: 'Only 1 discourse connector detected. Use the Discourse Markers toolkit.',
      });
    } else {
      orgScore += 1;
      orgRecs.push('Use linking phrases from the Discourse Arsenal to connect ideas logically.');
      orgDetections.push({
        type: 'warning',
        message: 'No formal discourse markers detected yet.',
      });
    }

    // Paragraph balance (0-4 pts)
    const shortParagraphs = paragraphs.filter((p) => p.split(/\s+/).length < 15);
    if (shortParagraphs.length === 0 && paragraphCount >= 3) {
      orgScore += 4;
      orgStrengths.push('Balanced paragraph lengths with thorough idea development.');
    } else if (shortParagraphs.length > 0) {
      orgScore += 2;
      orgRecs.push('Avoid one-sentence orphan paragraphs; elaborate each paragraph with supporting details.');
    } else {
      orgScore += 2;
    }
  } else if (wordCount > 0) {
    orgScore = 4;
    orgRecs.push('Develop paragraphs to evaluate organization.');
  }

  orgScore = Math.min(25, Math.max(0, orgScore));

  // --- PILLAR 3: CONTENT & TASK FULFILLMENT ---
  let contentScore = 0;
  const contentStrengths: string[] = [];
  const contentRecs: string[] = [];
  const contentDetections: CategoryFeedback['detections'] = [];

  const { min, max } = task.targetWordCount;

  if (wordCount >= min && wordCount <= max + 50) {
    contentScore += 12;
    contentStrengths.push(`Met target word count requirement (${wordCount} words; target ${min}–${max}).`);
    contentDetections.push({
      type: 'success',
      message: `Ideal length: ${wordCount} words within target window (${min}–${max}).`,
    });
  } else if (wordCount >= min * 0.8 && wordCount < min) {
    contentScore += 9;
    const needed = min - wordCount;
    contentRecs.push(`Add ${needed} more words to reach the required minimum of ${min} words.`);
    contentDetections.push({
      type: 'info',
      message: `Approaching target: ${wordCount}/${min} words (need ~${needed} more).`,
    });
  } else if (wordCount >= min * 0.5) {
    contentScore += 6;
    contentRecs.push(`Expand supporting arguments with examples to reach the ${min}-word requirement.`);
    contentDetections.push({
      type: 'warning',
      message: `Currently at ${wordCount} words. Target is ${min}–${max} words.`,
    });
  } else if (wordCount > 0) {
    contentScore += Math.max(2, Math.round((wordCount / min) * 6));
    contentRecs.push(`Expand draft significantly. Minimum target is ${min} words.`);
    contentDetections.push({
      type: 'warning',
      message: `Draft in progress: ${wordCount}/${min} words.`,
    });
  }

  // Supporting evidence markers (for example, to illustrate, such as, data, studies) (0-7 pts)
  const evidenceMatches = lowerBody.match(/\b(for example|for instance|to illustrate|such as|according to|specifically|case in point|data demonstrates|studies show|evidence suggests)\b/g);
  const evidenceCount = evidenceMatches ? evidenceMatches.length : 0;

  if (evidenceCount >= 2) {
    contentScore += 7;
    contentStrengths.push('Claims are supported with concrete examples, illustrations, and evidence.');
    contentDetections.push({
      type: 'success',
      message: `Substantiated reasoning: ${evidenceCount} evidence markers found.`,
    });
  } else if (evidenceCount === 1) {
    contentScore += 5;
    contentStrengths.push('Includes specific illustration to support claims.');
    contentRecs.push('Add another supporting example (use "For instance," or "To illustrate,").');
  } else if (wordCount >= 50) {
    contentScore += 2;
    contentRecs.push('Back up assertions with concrete evidence or examples (e.g., "A poignant case in point is...").');
    contentDetections.push({
      type: 'info',
      message: 'Consider adding verifiable examples or case studies to reinforce arguments.',
    });
  }

  // Title presence & prompt alignment (0-6 pts)
  if (title.trim().length >= 4) {
    contentScore += 6;
    contentStrengths.push(`Clear, relevant title provided: "${title.trim()}".`);
  } else {
    contentScore += 2;
    contentRecs.push('Provide an informative, engaging title for your composition.');
    contentDetections.push({
      type: 'info',
      message: 'Add an academic title at the top of the canvas.',
    });
  }

  contentScore = Math.min(25, Math.max(0, contentScore));

  // --- PILLAR 4: REGISTER AND STYLE ---
  let regScore = 0;
  const regStrengths: string[] = [];
  const regRecs: string[] = [];
  const regDetections: CategoryFeedback['detections'] = [];

  if (wordCount >= 20) {
    // Contractions evaluation (0-9 pts)
    if (contractionsFound.length === 0) {
      regScore += 9;
      regStrengths.push('Strict formal academic register maintained with zero colloquial contractions.');
      regDetections.push({
        type: 'success',
        message: 'No informal contractions found (clean formal standard).',
      });
    } else if (contractionsFound.length === 1) {
      regScore += 5;
      const c = contractionsFound[0];
      const repl = CONTRACTIONS_MAP[c.toLowerCase()] || 'uncontracted form';
      regRecs.push(`Replace contraction "${c}" with "${repl}" to preserve formal academic tone.`);
      regDetections.push({
        type: 'warning',
        message: `Contraction found: "${c}". Replace with "${repl}".`,
      });
    } else {
      regScore += 2;
      const examples = contractionsFound.slice(0, 3).map((c) => `"${c}" → "${CONTRACTIONS_MAP[c.toLowerCase()] || ''}"`).join(', ');
      regRecs.push(`Eliminate contractions in formal writing: replace ${examples}.`);
      regDetections.push({
        type: 'warning',
        message: `${contractionsFound.length} contractions detected (${contractionsFound.slice(0, 3).join(', ')}). Formal essays require full forms.`,
      });
    }

    // Informal lexis evaluation (0-8 pts)
    if (informalWordsFound.length === 0) {
      regScore += 8;
      regStrengths.push('Formal, sophisticated vocabulary free of conversational slang.');
      regDetections.push({
        type: 'success',
        message: 'Vocabulary choices respect academic register.',
      });
    } else {
      regScore += Math.max(1, 8 - informalWordsFound.length * 3);
      informalWordsFound.slice(0, 3).forEach((inf) => {
        regRecs.push(`Upgrade informal word "${inf.word}" to academic equivalent: ${inf.suggestion}.`);
        regDetections.push({
          type: 'warning',
          message: `Informal term "${inf.word}" found. Suggestion: ${inf.suggestion}.`,
        });
      });
    }

    // Sentence variety and cadence (0-8 pts)
    if (avgWordsPerSentence >= 14 && avgWordsPerSentence <= 26) {
      regScore += 8;
      regStrengths.push(`Sophisticated sentence length (averaging ${avgWordsPerSentence} words/sentence).`);
      regDetections.push({
        type: 'success',
        message: `Sentence cadence is well-calibrated for academic writing (${avgWordsPerSentence} words/sentence).`,
      });
    } else if (avgWordsPerSentence < 12 && sentenceCount >= 3) {
      regScore += 4;
      regRecs.push(`Average sentence length is short (${avgWordsPerSentence} words). Combine ideas using coordinating conjunctions or relative clauses.`);
      regDetections.push({
        type: 'info',
        message: `Sentences lean short and choppy (avg ${avgWordsPerSentence} words). Join related clauses with "whereas", "although", or "because".`,
      });
    } else {
      regScore += 6;
    }
  } else if (wordCount > 0) {
    regScore = 4;
    regRecs.push('Write more to calibrate academic register.');
  }

  regScore = Math.min(25, Math.max(0, regScore));

  // ==========================================
  // COMPOSITE SCORE & BAND ASSIGNMENT
  // ==========================================
  const totalScore = gvScore + orgScore + contentScore + regScore;

  const getLevel = (s: number): CategoryFeedback['level'] => {
    if (s >= 23) return 'Exemplary';
    if (s >= 19) return 'Advanced';
    if (s >= 15) return 'Competent';
    if (s >= 10) return 'Emerging';
    return 'Needs Development';
  };

  let overallBand: LiveWritingAnalysis['overallBand'] = 'Developing (0-59)';
  if (totalScore >= 90) overallBand = 'Exemplary (90-100)';
  else if (totalScore >= 75) overallBand = 'Proficient (75-89)';
  else if (totalScore >= 60) overallBand = 'Competent (60-74)';

  let summaryText = 'Begin writing your draft to generate live evaluation feedback.';
  if (wordCount >= min) {
    if (totalScore >= 85) {
      summaryText = 'Outstanding composition! Excellent academic vocabulary, clean multi-paragraph organization, and consistent formal register.';
    } else if (totalScore >= 70) {
      summaryText = 'Strong draft meeting the core objectives. Refine the suggested transitions and eliminate minor register inconsistencies to reach top marks.';
    } else {
      summaryText = 'Good progress. Follow the recommendations below to improve cohesion, vocabulary density, and sentence complexity.';
    }
  } else if (wordCount >= 30) {
    summaryText = `Promising start (${wordCount} words). Continue drafting your body and conclusion to reach the target length of ${min} words.`;
  }

  return {
    overallScore: totalScore,
    overallBand,
    summaryText,
    grammarVocab: {
      category: 'grammar_vocab',
      title: 'Grammar & Vocabulary',
      score: gvScore,
      maxScore: 25,
      level: getLevel(gvScore),
      strengths: gvStrengths,
      recommendations: gvRecs,
      detections: gvDetections,
    },
    organization: {
      category: 'organization',
      title: 'Organization & Cohesion',
      score: orgScore,
      maxScore: 25,
      level: getLevel(orgScore),
      strengths: orgStrengths,
      recommendations: orgRecs,
      detections: orgDetections,
    },
    content: {
      category: 'content',
      title: 'Content & Task Fulfillment',
      score: contentScore,
      maxScore: 25,
      level: getLevel(contentScore),
      strengths: contentStrengths,
      recommendations: contentRecs,
      detections: contentDetections,
    },
    registerStyle: {
      category: 'register_style',
      title: 'Register & Style',
      score: regScore,
      maxScore: 25,
      level: getLevel(regScore),
      strengths: regStrengths,
      recommendations: regRecs,
      detections: regDetections,
    },
    stats: {
      wordCount,
      charCount,
      sentenceCount,
      paragraphCount,
      avgWordsPerSentence,
      targetVocabFound,
      targetVocabMissing,
      discourseMarkersFound,
      contractionsFound,
      informalWordsFound,
      grammarIssues,
    },
  };
}
