export interface VocabWord {
  id: string;
  unitId: number;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  definition: string;
  collocations: string[];
  exampleSentence: string;
  wordForms?: {
    noun?: string;
    verb?: string;
    adjective?: string;
    adverb?: string;
  };
  synonyms: string[];
  antonyms: string[];
  tipsForESL?: string;
}

export interface WritingTask {
  id: string;
  unitId: number;
  loCode: string;
  title: string;
  genre: 'Biography' | 'Formal Essay' | 'Blog Entry' | 'Informal Letter' | 'Opinion Essay' | 'Formal Report' | 'Magazine Article' | 'Reflective Analysis' | 'Website Content';
  prompt: string;
  targetWordCount: { min: number; max: number };
  targetGrammarStructures: string[];
  suggestedDiscourseMarkers: string[];
  outlineSections: {
    title: string;
    guidingQuestions: string[];
    starterSentence: string;
  }[];
  modelText: {
    title: string;
    content: string;
    highlights: {
      type: 'vocabulary' | 'linking' | 'grammar';
      text: string;
      explanation: string;
    }[];
  };
  rubricCriteria: {
    category: string;
    standards: string;
    maxScore: number;
  }[];
}

export interface UnitInfo {
  id: number;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  loTags: string[];
  accentColor: string;
  bgLight: string;
  borderLight: string;
  imagePath: string;
}

export interface ClozeQuestion {
  id: string;
  unitId: number;
  sentence: string;
  blankWord: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint: string;
}

export interface StudentDraft {
  taskId: string;
  unitId: number;
  title: string;
  body: string;
  outlineNotes: Record<string, string>;
  lastSaved: number;
  rubricScores: Record<string, number>;
  peerComments: string;
}

export interface DescriptiveWord {
  id: string;
  word: string;
  partOfSpeech: 'Adjective' | 'Adverb';
  definition: string;
  example: string;
  category: string;
  basicWordUpgrade?: string[];
}

export interface WordUpgrade {
  basicWord: string;
  preciseChoices: string[];
}
