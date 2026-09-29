import { UnitInfo, VocabWord, WritingTask, ClozeQuestion } from '../types';
import { DESCRIPTIVE_WORDS, DESCRIPTIVE_CLOZE_QUESTIONS, BASIC_WORD_UPGRADES, DESCRIPTIVE_CATEGORIES } from './descriptiveVocabData';

export { DESCRIPTIVE_WORDS, DESCRIPTIVE_CLOZE_QUESTIONS, BASIC_WORD_UPGRADES, DESCRIPTIVE_CATEGORIES };

export const UNITS: UnitInfo[] = [
  {
    id: 1,
    number: "Unit 1",
    title: "Personal Goals, Heroes & World Records",
    shortTitle: "Goals & Heroes",
    description: "Formulate opinions, articulate development goals, analyze human feats, and master biographies with past tenses and discourse markers.",
    iconName: "Trophy",
    loTags: ["LO 1.1 Goals", "LO 1.2 Records", "LO 1.6 Biography", "LO 1.7 Profile"],
    accentColor: "indigo",
    bgLight: "bg-indigo-50",
    borderLight: "border-indigo-200",
    imagePath: "/src/assets/images/unit_heroes_achievement_1790653159099.jpg",
  },
  {
    id: 2,
    number: "Unit 2",
    title: "Organizations & Volunteering",
    shortTitle: "Volunteering",
    description: "Explore civic duty, non-profits, and outreach campaigns. Practice relative clauses, formal register, and structured essays.",
    iconName: "HandHeart",
    loTags: ["LO 2.1 Summarizing", "LO 2.2 Context Clues", "LO 2.5 Formal Essay", "LO 2.6 Website"],
    accentColor: "emerald",
    bgLight: "bg-emerald-50",
    borderLight: "border-emerald-200",
    imagePath: "/src/assets/images/unit_eco_sustainability_1790653170961.jpg",
  },
  {
    id: 3,
    number: "Unit 3",
    title: "Fame, Success & Adventure",
    shortTitle: "Fame & Adventure",
    description: "Examine qualities of inspirational figures, evaluate expeditions, and craft compelling blog entries with contrast connectors.",
    iconName: "Compass",
    loTags: ["LO 3.1 Factors", "LO 3.3 Note-taking", "LO 3.5 Blog Entry", "LO 3.6 Adventure"],
    accentColor: "amber",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    imagePath: "/src/assets/images/unit_heroes_achievement_1790653159099.jpg",
  },
  {
    id: 4,
    number: "Unit 4",
    title: "Medical Developments & Healthcare",
    shortTitle: "Healthcare",
    description: "Investigate medical breakthroughs and public sanitation. Master informal correspondence, past habits, and hygiene campaigns.",
    iconName: "Activity",
    loTags: ["LO 4.1 Medical Talk", "LO 4.5 Informal Letter", "LO 4.6 Hygiene Poster"],
    accentColor: "rose",
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    imagePath: "/src/assets/images/hero_esl_academy_1790653144740.jpg",
  },
  {
    id: 5,
    number: "Unit 5",
    title: "Healthy Lifestyles & Well-being",
    shortTitle: "Healthy Living",
    description: "Synthesize perspectives on nutrition and wellness. Compose persuasive opinion essays supported by clear evidence.",
    iconName: "HeartPulse",
    loTags: ["LO 5.2 Extract Details", "LO 5.5 Opinion Essay", "LO 5.6 TV Series"],
    accentColor: "teal",
    bgLight: "bg-teal-50",
    borderLight: "border-teal-200",
    imagePath: "/src/assets/images/unit_eco_sustainability_1790653170961.jpg",
  },
  {
    id: 7,
    number: "Unit 7",
    title: "Artificial Intelligence & Ethics",
    shortTitle: "AI & Ethics",
    description: "Debate societal and environmental impacts of AI. Write reflective problem-solution analyses and ethical user guidelines.",
    iconName: "Cpu",
    loTags: ["LO 7.1 Impact Texts", "LO 7.2 Responsible AI", "LO 7.3 Outline", "LO 7.4 Reflection"],
    accentColor: "cyan",
    bgLight: "bg-cyan-50",
    borderLight: "border-cyan-200",
    imagePath: "/src/assets/images/unit_future_tech_1790653181924.jpg",
  },
  {
    id: 8,
    number: "Unit 8",
    title: "Wildlife & Animal Conservation",
    shortTitle: "Wildlife",
    description: "Discover animal adaptations, threats, and conservation. Compose journalistic magazine features and comparative fact files.",
    iconName: "PawPrint",
    loTags: ["LO 8.1 Animal Life", "LO 8.5 Magazine Article", "LO 8.6 Comparison"],
    accentColor: "orange",
    bgLight: "bg-orange-50",
    borderLight: "border-orange-200",
    imagePath: "/src/assets/images/unit_eco_sustainability_1790653170961.jpg",
  },
  {
    id: 9,
    number: "Unit 9",
    title: "Environment & Water Crisis",
    shortTitle: "Water Crisis",
    description: "Analyze water scarcity, desalination, and conservation. Produce formal technical reports with structured headings and data.",
    iconName: "Droplets",
    loTags: ["LO 9.3 Main Ideas", "LO 9.5 Formal Report", "LO 9.6 Presentation"],
    accentColor: "sky",
    bgLight: "bg-sky-50",
    borderLight: "border-sky-200",
    imagePath: "/src/assets/images/unit_eco_sustainability_1790653170961.jpg",
  },
  {
    id: 10,
    number: "Unit 10",
    title: "Food Security & Sustainable Farming",
    shortTitle: "Food Security",
    description: "Understand global hunger causes, supply chains, and food miles. Draft solutions reports evaluated on content and cohesion.",
    iconName: "Wheat",
    loTags: ["LO 10.1 Hunger Causes", "LO 10.5 Food Crisis Report", "LO 10.6 Food Production"],
    accentColor: "lime",
    bgLight: "bg-lime-50",
    borderLight: "border-lime-200",
    imagePath: "/src/assets/images/unit_eco_sustainability_1790653170961.jpg",
  },
  {
    id: 11,
    number: "Unit 11",
    title: "Fashion & Sustainable Textiles",
    shortTitle: "Fast Fashion",
    description: "Investigate fast fashion's ecological footprint and labor conditions. Craft thought-provoking lifestyle magazine articles.",
    iconName: "Shirt",
    loTags: ["LO 11.1 Concepts", "LO 11.3 Cause & Effect", "LO 11.5 Article", "LO 11.6 Presentation"],
    accentColor: "fuchsia",
    bgLight: "bg-fuchsia-50",
    borderLight: "border-fuchsia-200",
    imagePath: "/src/assets/images/hero_esl_academy_1790653144740.jpg",
  },
  {
    id: 12,
    number: "Unit 12",
    title: "Future Technologies & Robotics",
    shortTitle: "Future Tech",
    description: "Make informed predictions about emerging tech, nanotechnology, and quantum systems using conditional clauses and discourse markers.",
    iconName: "Sparkles",
    loTags: ["LO 12.1 Note-taking", "LO 12.5 Future Tech Essay", "LO 12.6 Predictions"],
    accentColor: "violet",
    bgLight: "bg-violet-50",
    borderLight: "border-violet-200",
    imagePath: "/src/assets/images/unit_future_tech_1790653181924.jpg",
  },
  {
    id: 14,
    number: "Units 14-15",
    title: "Critical Reading & Creative Projects",
    shortTitle: "Literature & Synthesis",
    description: "Interpret author purpose, subtext, and figurative devices. Synthesize multi-source research into collaborative creative presentations.",
    iconName: "BookOpen",
    loTags: ["LO 14.1 Inference", "LO 14.2 Critique", "LO 15.2 Synthesis", "LO 15.4 Reflection"],
    accentColor: "amber",
    bgLight: "bg-amber-50",
    borderLight: "border-amber-200",
    imagePath: "/src/assets/images/hero_esl_academy_1790653144740.jpg",
  },
  {
    id: 99,
    number: "Descriptive",
    title: "Descriptive Lexicon & Style",
    shortTitle: "Descriptive Lexicon",
    description: "Master high-impact descriptive adjectives and adverbs for appearance, feelings, character, atmosphere, and precision vocabulary upgrades.",
    iconName: "Sparkles",
    loTags: ["Sensory Detail", "Precision Upgrades", "Atmosphere & Mood", "Character Traits"],
    accentColor: "rose",
    bgLight: "bg-rose-50",
    borderLight: "border-rose-200",
    imagePath: "/src/assets/images/unit_heroes_achievement_1790653159099.jpg",
  }
];

const DESCRIPTIVE_AS_VOCAB_WORDS: VocabWord[] = DESCRIPTIVE_WORDS.map((dw) => ({
  id: dw.id,
  unitId: 99,
  word: dw.word,
  phonetic: `/${dw.word}/`,
  partOfSpeech: dw.partOfSpeech.toLowerCase() as 'adjective' | 'adverb',
  definition: dw.definition,
  collocations: dw.basicWordUpgrade ? dw.basicWordUpgrade.map((u) => `upgrade for "${u}"`) : ['academic description'],
  exampleSentence: dw.example,
  synonyms: dw.basicWordUpgrade || [],
  antonyms: [],
  tipsForESL: `Category: ${dw.category}. Excellent for descriptive precision.`,
}));

export const VOCABULARY_LIST: VocabWord[] = [
  // UNIT 1: Personal Goals, Heroes & World Records
  {
    id: "u1-1",
    unitId: 1,
    word: "perseverance",
    phonetic: "/ˌpɜː.sɪˈvɪə.rəns/",
    partOfSpeech: "noun",
    definition: "Continued effort to do or achieve something despite difficulties, failure, or opposition.",
    collocations: ["show great perseverance", "through sheer perseverance", "require perseverance"],
    exampleSentence: "Through perseverance and rigorous training, the athlete shattered the world record in the marathon.",
    wordForms: { verb: "persevere", adjective: "perseverant", adverb: "perseveringly" },
    synonyms: ["persistence", "determination", "tenacity", "dedication"],
    antonyms: ["apathy", "surrender", "lethargy"],
    tipsForESL: "Collocate with verbs like 'demonstrate' or 'require'. Don't confuse with 'preservation' (saving)."
  },
  {
    id: "u1-2",
    unitId: 1,
    word: "trailblazer",
    phonetic: "/ˈtreɪlˌbleɪ.zər/",
    partOfSpeech: "noun",
    definition: "A pioneer; an innovative person who is the first to accomplish something or lead a new path.",
    collocations: ["a true trailblazer", "trailblazer in medical science", "act as a trailblazer"],
    exampleSentence: "Marie Curie was a scientific trailblazer whose discoveries in radioactivity inspired generations of researchers.",
    wordForms: { verb: "blaze (a trail)", adjective: "trailblazing" },
    synonyms: ["pioneer", "innovator", "groundbreaker"],
    antonyms: ["follower", "traditionalist"],
    tipsForESL: "Metaphor from blazing (marking) a trail through an unexplored forest."
  },
  {
    id: "u1-3",
    unitId: 1,
    word: "unprecedented",
    phonetic: "/ʌnˈpres.ɪ.den.tɪd/",
    partOfSpeech: "adjective",
    definition: "Never having happened or existed before in known history.",
    collocations: ["unprecedented achievement", "at an unprecedented rate", "unprecedented success"],
    exampleSentence: "Mountaineers achieved an unprecedented milestone by scaling the summit during severe winter conditions.",
    wordForms: { noun: "precedent", adverb: "unprecedentedly" },
    synonyms: ["unmatched", "extraordinary", "unparalleled"],
    antonyms: ["commonplace", "familiar", "routine"],
    tipsForESL: "Pronounce 'pres' like in 'president'. Great for high-band academic writing when discussing records."
  },
  {
    id: "u1-4",
    unitId: 1,
    word: "commemorate",
    phonetic: "/kəˈmem.ə.reɪt/",
    partOfSpeech: "verb",
    definition: "To recall and show respect for someone or an important event in a public ceremony or monument.",
    collocations: ["commemorate the sacrifice", "monument to commemorate", "gather to commemorate"],
    exampleSentence: "The community erected a statue to commemorate the firefighter who saved dozens of lives during the blaze.",
    wordForms: { noun: "commemoration", adjective: "commemorative" },
    synonyms: ["honor", "celebrate", "remember", "memorialize"],
    antonyms: ["forget", "neglect", "ignore"],
    tipsForESL: "Notice the double 'm'. Often used with preposition 'by' or 'with'."
  },
  {
    id: "u1-5",
    unitId: 1,
    word: "resilient",
    phonetic: "/rɪˈzɪl.i.ənt/",
    partOfSpeech: "adjective",
    definition: "Able to withstand or recover quickly from difficult conditions, adversity, or shock.",
    collocations: ["remarkably resilient", "resilient community", "remain resilient"],
    exampleSentence: "Despite facing systemic poverty, Malala remained resilient and championed girls' education globally.",
    wordForms: { noun: "resilience", adverb: "resiliently" },
    synonyms: ["tough", "adaptable", "hardy", "buoyant"],
    antonyms: ["fragile", "vulnerable", "weak"],
    tipsForESL: "Used for both people (psychological) and materials/ecosystems (physical)."
  },
  {
    id: "u1-6",
    unitId: 1,
    word: "aspire",
    phonetic: "/əˈspaɪər/",
    partOfSpeech: "verb",
    definition: "To direct one's hopes or ambitions toward achieving something meaningful.",
    collocations: ["aspire to become", "aspire to excellence", "aspire towards"],
    exampleSentence: "As high school scholars, we should aspire to combine academic curiosity with genuine empathy.",
    wordForms: { noun: "aspiration", adjective: "aspirational" },
    synonyms: ["aim", "seek", "strive", "yearn"],
    antonyms: ["despair", "disregard"],
    tipsForESL: "Followed by infinitive 'aspire to + verb' or 'aspire to + noun'."
  },

  // UNIT 2: Organizations & Volunteering
  {
    id: "u2-1",
    unitId: 2,
    word: "philanthropy",
    phonetic: "/fɪˈlæn.θrə.pi/",
    partOfSpeech: "noun",
    definition: "The desire to promote the welfare of others, expressed especially by generous donation of money or resources.",
    collocations: ["act of philanthropy", "corporate philanthropy", "engage in philanthropy"],
    exampleSentence: "The foundation's philanthropy funded scholarships for over five hundred underprivileged students this semester.",
    wordForms: { noun: "philanthropist", adjective: "philanthropic" },
    synonyms: ["benevolence", "generosity", "humanitarianism", "charity"],
    antonyms: ["selfishness", "miserliness", "greed"],
    tipsForESL: "From Greek: 'philos' (loving) + 'anthropos' (humankind)."
  },
  {
    id: "u2-2",
    unitId: 2,
    word: "grassroots",
    phonetic: "/ˈɡrɑːs.ruːts/",
    partOfSpeech: "adjective",
    definition: "Originating among ordinary people at a local level rather than from government or major institutions.",
    collocations: ["grassroots movement", "grassroots campaign", "grassroots organization"],
    exampleSentence: "What began as a grassroots initiative among neighborhood teens blossomed into a nationwide anti-litter campaign.",
    wordForms: { noun: "grassroots (plural noun)" },
    synonyms: ["community-based", "local", "bottom-up", "popular"],
    antonyms: ["top-down", "authoritarian", "institutional"],
    tipsForESL: "Always spelled as one compound word with an 's' at the end."
  },
  {
    id: "u2-3",
    unitId: 2,
    word: "empower",
    phonetic: "/ɪmˈpaʊ.ər/",
    partOfSpeech: "verb",
    definition: "To give someone the authority, confidence, or resources to control their life or claim their rights.",
    collocations: ["empower youth", "empower marginalized groups", "empower through education"],
    exampleSentence: "The volunteer workshop seeks to empower young adults with practical digital skills and financial literacy.",
    wordForms: { noun: "empowerment", adjective: "empowering" },
    synonyms: ["enable", "authorize", "equip", "uplift"],
    antonyms: ["disenfranchise", "hinder", "suppress"],
    tipsForESL: "Pattern: 'empower someone to do something'."
  },
  {
    id: "u2-4",
    unitId: 2,
    word: "civic",
    phonetic: "/ˈsɪv.ɪk/",
    partOfSpeech: "adjective",
    definition: "Relating to a city, citizen duties, or communal public engagement.",
    collocations: ["civic duty", "civic engagement", "civic responsibility"],
    exampleSentence: "Participating in local beach clean-ups is a meaningful expression of civic duty and community pride.",
    wordForms: { noun: "civics", adverb: "civically" },
    synonyms: ["municipal", "public", "communal", "societal"],
    antonyms: ["private", "individualistic"],
    tipsForESL: "Related to 'citizen' and 'civil'. Essential for essays on volunteering."
  },
  {
    id: "u2-5",
    unitId: 2,
    word: "marginalized",
    phonetic: "/ˈmɑː.dʒɪ.nəl.aɪzd/",
    partOfSpeech: "adjective",
    definition: "Treated as insignificant or placed in an powerless position within a society.",
    collocations: ["marginalized communities", "marginalized youth", "voices of the marginalized"],
    exampleSentence: "Non-profit organizations provide essential legal aid and shelter to marginalized families facing eviction.",
    wordForms: { verb: "marginalize", noun: "marginalization" },
    synonyms: ["disadvantaged", "sidelined", "underrepresented", "excluded"],
    antonyms: ["privileged", "influential", "integrated"],
    tipsForESL: "Root 'margin' (the border of a page) - pushed to the outer edge."
  },

  // UNIT 3: Fame, Success & Adventure
  {
    id: "u3-1",
    unitId: 3,
    word: "formidable",
    phonetic: "/fɔːˈmɪd.ə.bəl/",
    partOfSpeech: "adjective",
    definition: "Inspiring fear, awe, or intense respect through being impressively large, powerful, or capable.",
    collocations: ["formidable challenge", "formidable opponent", "formidable intellect"],
    exampleSentence: "Cross-continental polar expeditions present formidable obstacles including frostbite and crevasses.",
    wordForms: { adverb: "formidably" },
    synonyms: ["daunting", "imposing", "redoubtable", "tremendous"],
    antonyms: ["trivial", "feeble", "insignificant"],
    tipsForESL: "Stress is usually on the second syllable /mɪd/ or first /ˈfɔː/."
  },
  {
    id: "u3-2",
    unitId: 3,
    word: "acclaim",
    phonetic: "/əˈkleɪm/",
    partOfSpeech: "noun",
    definition: "Enthusiastic and public praise, appreciation, or commendation.",
    collocations: ["critical acclaim", "international acclaim", "win wide acclaim"],
    exampleSentence: "The young director won international acclaim after her documentary about indigenous tribes debuted at the festival.",
    wordForms: { verb: "acclaim", adjective: "acclaimed" },
    synonyms: ["applause", "tribute", "approbation", "commendation"],
    antonyms: ["criticism", "condemnation", "disapproval"],
    tipsForESL: "Frequently paired with the adjective 'critical' (meaning praise from film or book critics)."
  },
  {
    id: "u3-3",
    unitId: 3,
    word: "intrepid",
    phonetic: "/ɪnˈtrep.ɪd/",
    partOfSpeech: "adjective",
    definition: "Fearless and adventurous; showing bold courage in dangerous circumstances.",
    collocations: ["intrepid explorer", "intrepid traveler", "intrepid spirit"],
    exampleSentence: "The intrepid mountaineer pressed on through the blizzard to establish camp above the clouds.",
    wordForms: { noun: "intrepidity", adverb: "intrepidly" },
    synonyms: ["fearless", "dauntless", "valiant", "courageous"],
    antonyms: ["cowardly", "timid", "hesitant"],
    tipsForESL: "Literally means 'not alarmed' (in- + trepidus)."
  },
  {
    id: "u3-4",
    unitId: 3,
    word: "catalyst",
    phonetic: "/ˈkæt.əl.ɪst/",
    partOfSpeech: "noun",
    definition: "A person or thing that precipitates an event or accelerates fundamental change.",
    collocations: ["catalyst for change", "act as a catalyst", "economic catalyst"],
    exampleSentence: "Winning the national science competition served as a catalyst for Maya's acceptance into aerospace engineering.",
    wordForms: { verb: "catalyze", adjective: "catalytic" },
    synonyms: ["spark", "impetus", "trigger", "stimulus"],
    antonyms: ["inhibitor", "deterrent", "obstacle"],
    tipsForESL: "Originates in chemistry, but in writing it's used figuratively for people and events."
  },

  // UNIT 4: Medical Developments & Healthcare
  {
    id: "u4-1",
    unitId: 4,
    word: "breakthrough",
    phonetic: "/ˈbreɪk.θruː/",
    partOfSpeech: "noun",
    definition: "A sudden, dramatic, and important discovery or development in science, medicine, or technology.",
    collocations: ["scientific breakthrough", "major medical breakthrough", "breakthrough treatment"],
    exampleSentence: "The synthesis of penicillin was a monumental breakthrough that transformed bacterial infection mortality rates.",
    wordForms: { verb: "break through" },
    synonyms: ["advance", "stride", "leap forward", "revelation"],
    antonyms: ["setback", "stalemate", "relapse"],
    tipsForESL: "One compound noun. Often used with adjectives like 'historic' or 'groundbreaking'."
  },
  {
    id: "u4-2",
    unitId: 4,
    word: "preventive",
    phonetic: "/prɪˈven.tɪv/",
    partOfSpeech: "adjective",
    definition: "Designed to stop something undesirable, particularly illness or disease, from occurring.",
    collocations: ["preventive medicine", "preventive measures", "preventive healthcare"],
    exampleSentence: "Public health campaigns emphasize preventive measures such as childhood vaccinations and hand sanitization.",
    wordForms: { verb: "prevent", noun: "prevention", adverb: "preventively" },
    synonyms: ["prophylactic", "precautionary", "protective"],
    antonyms: ["reactive", "curative", "harmful"],
    tipsForESL: "'Preventive' and 'preventative' mean the same thing, but 'preventive' is preferred in academic style."
  },
  {
    id: "u4-3",
    unitId: 4,
    word: "eradicate",
    phonetic: "/ɪˈræd.ɪ.keɪt/",
    partOfSpeech: "verb",
    definition: "To destroy completely; put an end to an infectious disease or harmful social condition.",
    collocations: ["eradicate disease", "eradicate extreme poverty", "efforts to eradicate"],
    exampleSentence: "Through coordinated global immunization campaigns, humanity succeeded in eradicating smallpox in 1980.",
    wordForms: { noun: "eradication", adjective: "eradicable" },
    synonyms: ["eliminate", "wipe out", "annihilate", "extinguish"],
    antonyms: ["propagate", "nurture", "spread"],
    tipsForESL: "From Latin 'radix' (root) - literally to pull something out by the roots."
  },
  {
    id: "u4-4",
    unitId: 4,
    word: "pathogen",
    phonetic: "/ˈpæθ.ə.dʒən/",
    partOfSpeech: "noun",
    definition: "A bacterium, virus, or other microorganism that can cause disease.",
    collocations: ["airborne pathogen", "deadly pathogen", "pathogen transmission"],
    exampleSentence: "Hospitals enforce strict sterilization protocols to prevent harmful pathogens from contaminating surgical suites.",
    wordForms: { adjective: "pathogenic", noun: "pathogenicity" },
    synonyms: ["microbe", "infectious agent", "germ"],
    antonyms: ["antibody", "antidote"],
    tipsForESL: "Academic medical term; preferable to the casual word 'germ' in formal ESL writing."
  },

  // UNIT 5: Healthy Lifestyles & Well-being
  {
    id: "u5-1",
    unitId: 5,
    word: "sedentary",
    phonetic: "/ˈsed.ən.tər.i/",
    partOfSpeech: "adjective",
    definition: "Characterized by much sitting and little to no physical exercise or activity.",
    collocations: ["sedentary lifestyle", "sedentary job", "sedentary habits"],
    exampleSentence: "Adopting a sedentary lifestyle during exam periods increases student vulnerability to lethargy and posture strain.",
    wordForms: { noun: "sedentariness", adverb: "sedentarily" },
    synonyms: ["inactive", "desk-bound", "sluggish", "stationary"],
    antonyms: ["active", "athletic", "dynamic"],
    tipsForESL: "From Latin 'sedere' (to sit). Crucial keyword for health and opinion essays."
  },
  {
    id: "u5-2",
    unitId: 5,
    word: "holistic",
    phonetic: "/həʊˈlɪs.tɪk/",
    partOfSpeech: "adjective",
    definition: "Characterized by the treatment or comprehension of the whole person, taking into account mental and social factors, rather than just physical symptoms.",
    collocations: ["holistic approach", "holistic well-being", "holistic health"],
    exampleSentence: "Modern wellness centers favor a holistic approach that integrates mindful meditation, balanced diet, and aerobic exercise.",
    wordForms: { adverb: "holistically", noun: "holism" },
    synonyms: ["comprehensive", "all-inclusive", "integrated", "thorough"],
    antonyms: ["fragmented", "segmented", "partial"],
    tipsForESL: "Think of 'whole' (even though it starts with 'hol-')."
  },
  {
    id: "u5-3",
    unitId: 5,
    word: "deficiency",
    phonetic: "/dɪˈfɪʃ.ən.si/",
    partOfSpeech: "noun",
    definition: "A lack or shortage of an essential substance (such as a vitamin or mineral) or a shortcoming.",
    collocations: ["vitamin deficiency", "iron deficiency", "suffer from a deficiency"],
    exampleSentence: "A severe deficiency of vitamin D can impair bone density and compromise the human immune response.",
    wordForms: { adjective: "deficient", adverb: "deficiently" },
    synonyms: ["scarcity", "shortfall", "insufficiency", "dearth"],
    antonyms: ["surplus", "abundance", "excess"],
    tipsForESL: "Preposition: 'deficiency in' or 'deficiency of'."
  },
  {
    id: "u5-4",
    unitId: 5,
    word: "alleviate",
    phonetic: "/əˈliː.vi.eɪt/",
    partOfSpeech: "verb",
    definition: "To make suffering, deficiency, or a problem less severe or more bearable.",
    collocations: ["alleviate stress", "alleviate symptoms", "alleviate pain"],
    exampleSentence: "Regular aerobic exercise and adequate sleep substantially alleviate chronic anxiety among teenagers.",
    wordForms: { noun: "alleviation", adjective: "alleviative" },
    synonyms: ["relieve", "ease", "mitigate", "lessen"],
    antonyms: ["aggravate", "worsen", "exacerbate"],
    tipsForESL: "Academic synonym for 'make better' or 'reduce pain'."
  },

  // UNIT 7: Artificial Intelligence & Ethics
  {
    id: "u7-1",
    unitId: 7,
    word: "accountability",
    phonetic: "/əˌkaʊn.təˈbɪl.ə.ti/",
    partOfSpeech: "noun",
    definition: "The fact or condition of being responsible for one's decisions and actions and able to explain them.",
    collocations: ["ensure accountability", "hold someone accountable", "moral accountability"],
    exampleSentence: "Software engineers must establish legal accountability when autonomous vehicle algorithms make split-second decisions.",
    wordForms: { adjective: "accountable", verb: "account for" },
    synonyms: ["responsibility", "answerability", "liability"],
    antonyms: ["irresponsibility", "impunity"],
    tipsForESL: "Collocates with 'hold someone accountable' (make them take responsibility)."
  },
  {
    id: "u7-2",
    unitId: 7,
    word: "algorithmic",
    phonetic: "/ˌæl.ɡəˈrɪð.mɪk/",
    partOfSpeech: "adjective",
    definition: "Relating to or using a process or set of automated rules to be followed in calculations or problem-solving.",
    collocations: ["algorithmic bias", "algorithmic recommendation", "algorithmic transparency"],
    exampleSentence: "Unless training datasets are audited carefully, algorithmic bias can amplify historical human prejudices in hiring tools.",
    wordForms: { noun: "algorithm", adverb: "algorithmically" },
    synonyms: ["computational", "automated", "rule-based"],
    antonyms: ["intuitive", "spontaneous"],
    tipsForESL: "Pronounce with 'th' voiced as in 'this'."
  },
  {
    id: "u7-3",
    unitId: 7,
    word: "mitigation",
    phonetic: "/ˌmɪt.ɪˈɡeɪ.ʃən/",
    partOfSpeech: "noun",
    definition: "The action of reducing the severity, seriousness, or painfulness of a harmful consequence.",
    collocations: ["risk mitigation", "environmental mitigation", "strategy for mitigation"],
    exampleSentence: "Cloud data centers require aggressive energy mitigation strategies to curb greenhouse emissions caused by AI compute.",
    wordForms: { verb: "mitigate", adjective: "mitigative" },
    synonyms: ["reduction", "moderation", "alleviation", "abatement"],
    antonyms: ["intensification", "amplification"],
    tipsForESL: "High-band IELTS/TOEFL word. Use 'mitigate the risks' rather than 'make risks smaller'."
  },
  {
    id: "u7-4",
    unitId: 7,
    word: "surveillance",
    phonetic: "/səˈveɪ.ləns/",
    partOfSpeech: "noun",
    definition: "Close observation, especially of a suspected person or public population by video or data tracking.",
    collocations: ["mass surveillance", "surveillance camera", "under close surveillance"],
    exampleSentence: "Civil liberty advocates caution that facial recognition in public squares could usher in unwarranted mass surveillance.",
    wordForms: { adjective: "surveillant" },
    synonyms: ["monitoring", "observation", "scrutiny", "espionage"],
    antonyms: ["privacy", "anonymity"],
    tipsForESL: "From French: 'sur' (over) + 'veiller' (to watch). Notice the double 'l'."
  },

  // UNIT 8: Wildlife & Animal Conservation
  {
    id: "u8-1",
    unitId: 8,
    word: "biodiversity",
    phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sɪ.ti/",
    partOfSpeech: "noun",
    definition: "The variety of plant and animal life in the world or in a particular ecological habitat.",
    collocations: ["preserve biodiversity", "loss of biodiversity", "rich biodiversity"],
    exampleSentence: "Tropical rainforests boast astonishing biodiversity, harboring millions of undiscovered insect and plant species.",
    wordForms: { adjective: "biodiverse" },
    synonyms: ["ecological richness", "biological variety"],
    antonyms: ["monoculture", "ecological impoverishment"],
    tipsForESL: "Prefix 'bio-' (life) + 'diversity' (variety). Uncountable noun."
  },
  {
    id: "u8-2",
    unitId: 8,
    word: "poaching",
    phonetic: "/ˈpəʊ.tʃɪŋ/",
    partOfSpeech: "noun",
    definition: "The illegal practice of trespassing on private or protected land to hunt or steal wild animals or plants.",
    collocations: ["combat illegal poaching", "anti-poaching patrol", "target of poaching"],
    exampleSentence: "Armed wildlife rangers patrol the savannah night and day to safeguard black rhinos from illegal poaching.",
    wordForms: { verb: "poach", noun: "poacher" },
    synonyms: ["illegal hunting", "wildlife trafficking"],
    antonyms: ["conservation", "wildlife protection"],
    tipsForESL: "In wildlife context, it means illegal hunting (distinct from culinary egg poaching)."
  },
  {
    id: "u8-3",
    unitId: 8,
    word: "camouflage",
    phonetic: "/ˈkæm.ə.flɑːʒ/",
    partOfSpeech: "noun",
    definition: "The disguising of military personnel, equipment, or animals by making them blend in with surroundings.",
    collocations: ["natural camouflage", "use as camouflage", "blend in through camouflage"],
    exampleSentence: "The snow leopard's mottled grey-white fur provides exceptional camouflage among Himalayan rocky crags.",
    wordForms: { verb: "camouflage", adjective: "camouflaged" },
    synonyms: ["disguise", "concealment", "mimicry"],
    antonyms: ["exposure", "visibility"],
    tipsForESL: "Final syllable sounds like 'flazh' (/flɑːʒ/). Can be both a noun and a verb."
  },
  {
    id: "u8-4",
    unitId: 8,
    word: "apex predator",
    phonetic: "/ˈeɪ.peks ˈpred.ə.tər/",
    partOfSpeech: "noun",
    definition: "A top-level predator residing at the pinnacle of a food chain upon which no other creatures naturally prey.",
    collocations: ["act as an apex predator", "role of apex predators", "marine apex predator"],
    exampleSentence: "As an apex predator, the grey wolf regulates elk populations, indirectly fostering riverbank vegetation recovery.",
    wordForms: { adjective: "predatory" },
    synonyms: ["top predator", "alpha carnivore"],
    antonyms: ["prey", "herbivore"],
    tipsForESL: "'Apex' means the highest point or peak."
  },

  // UNIT 9: Environment & Water Issues
  {
    id: "u9-1",
    unitId: 9,
    word: "scarcity",
    phonetic: "/ˈskeə.sɪ.ti/",
    partOfSpeech: "noun",
    definition: "The state of being scarce or in short supply; serious insufficiency.",
    collocations: ["water scarcity", "resource scarcity", "face acute scarcity"],
    exampleSentence: "Prolonged droughts exacerbated water scarcity in rural villages, forcing residents to walk miles each dawn.",
    wordForms: { adjective: "scarce", adverb: "scarcely" },
    synonyms: ["dearth", "shortage", "paucity", "deficit"],
    antonyms: ["abundance", "plenty", "surplus"],
    tipsForESL: "Stress on the first syllable: /ˈskeə.sɪ.ti/. Often followed by 'of'."
  },
  {
    id: "u9-2",
    unitId: 9,
    word: "desalination",
    phonetic: "/diːˌsæl.ɪˈneɪ.ʃən/",
    partOfSpeech: "noun",
    definition: "The technical process of removing dissolved mineral salts from seawater to make it potable.",
    collocations: ["desalination plant", "seawater desalination", "cost of desalination"],
    exampleSentence: "Arid coastal municipalities increasingly rely on solar-powered desalination to supply fresh drinking water.",
    wordForms: { verb: "desalinate", adjective: "saline" },
    synonyms: ["salt removal", "water purification"],
    antonyms: ["salinization"],
    tipsForESL: "De- (remove) + saline (salty) + -ation (process)."
  },
  {
    id: "u9-3",
    unitId: 9,
    word: "groundwater",
    phonetic: "/ˈɡraʊndˌwɔː.tər/",
    partOfSpeech: "noun",
    definition: "Water held underground in the soil or in crevices and porous pores in bedrock (aquifers).",
    collocations: ["groundwater depletion", "groundwater contamination", "pump groundwater"],
    exampleSentence: "Excessive industrial extraction has depleted deep groundwater reserves faster than rain can replenish them.",
    wordForms: {},
    synonyms: ["aquifer reserve", "subsurface water"],
    antonyms: ["surface water", "runoff"],
    tipsForESL: "One compound noun. Key concept in formal environmental reports."
  },
  {
    id: "u9-4",
    unitId: 9,
    word: "replenishment",
    phonetic: "/rɪˈplen.ɪʃ.mənt/",
    partOfSpeech: "noun",
    definition: "The restoration of a stock, supply, or reservoir to a former level or full condition.",
    collocations: ["natural replenishment", "reservoir replenishment", "allow for replenishment"],
    exampleSentence: "Constructing artificial wetlands accelerates the natural replenishment of subterranean aquifers.",
    wordForms: { verb: "replenish", adjective: "replenishable" },
    synonyms: ["refill", "restoration", "recharging", "renewal"],
    antonyms: ["exhaustion", "depletion", "drainage"],
    tipsForESL: "Formal academic alternative to 'refilling'."
  },

  // UNIT 10: Food Security & Sustainable Agriculture
  {
    id: "u10-1",
    unitId: 10,
    word: "food miles",
    phonetic: "/ˈfuːd ˌmaɪlz/",
    partOfSpeech: "noun",
    definition: "The distance food is transported from the time of its production until it reaches the consumer.",
    collocations: ["reduce food miles", "calculate food miles", "high food miles"],
    exampleSentence: "Buying seasonal fruit at neighborhood farmers' markets slashes food miles and reduces transport greenhouse emissions.",
    wordForms: {},
    synonyms: ["transit distance", "distribution footprint"],
    antonyms: ["local sourcing"],
    tipsForESL: "Always plural. Critical term for essays on food production sustainability."
  },
  {
    id: "u10-2",
    unitId: 10,
    word: "monoculture",
    phonetic: "/ˈmɒn.əˌkʌl.tʃər/",
    partOfSpeech: "noun",
    definition: "The cultivation of a single crop in a given area over consecutive seasons without rotation.",
    collocations: ["vast monoculture", "dangers of monoculture", "monoculture farming"],
    exampleSentence: "Industrial monoculture exhausts soil nutrients rapidly, necessitating synthetic fertilizers and chemical pesticides.",
    wordForms: { adjective: "monocultural" },
    synonyms: ["single-crop farming", "uniform cultivation"],
    antonyms: ["polyculture", "crop rotation", "biodiverse farming"],
    tipsForESL: "Mono (single) + culture (growing/cultivation)."
  },
  {
    id: "u10-3",
    unitId: 10,
    word: "arable",
    phonetic: "/ˈær.ə.bəl/",
    partOfSpeech: "adjective",
    definition: "Suitable for growing crops; plowable and fertile agricultural land.",
    collocations: ["arable land", "loss of arable soil", "convert to arable fields"],
    exampleSentence: "Urban sprawl and desertification are steadily swallowing prime arable land across developing economies.",
    wordForms: { noun: "arability" },
    synonyms: ["fertile", "cultivable", "tillable", "productive"],
    antonyms: ["barren", "infertile", "arid"],
    tipsForESL: "Used predominantly to describe land and soil: 'arable acreage'."
  },
  {
    id: "u10-4",
    unitId: 10,
    word: "subsistence",
    phonetic: "/səbˈsɪs.təns/",
    partOfSpeech: "noun",
    definition: "The action or fact of maintaining or supporting oneself at a minimal level, yielding only enough food to survive.",
    collocations: ["subsistence farming", "bare subsistence", "subsistence wages"],
    exampleSentence: "Smallholder subsistence farmers bear the heaviest brunt of climate anomalies because they lack financial safety nets.",
    wordForms: { verb: "subsist", adjective: "subsistent" },
    synonyms: ["survival", "livelihood", "basic sustenance"],
    antonyms: ["affluence", "luxury", "commercial surplus"],
    tipsForESL: "Collocates almost universally with 'farming' or 'agriculture'."
  },

  // UNIT 11: Fashion & Sustainable Textiles
  {
    id: "u11-1",
    unitId: 11,
    word: "microplastics",
    phonetic: "/ˈmaɪ.krəʊˌplæs.tɪks/",
    partOfSpeech: "noun",
    definition: "Extremely small pieces of plastic debris in the environment resulting from the disposal and breakdown of consumer products.",
    collocations: ["shed microplastics", "microplastics in oceans", "ingestion of microplastics"],
    exampleSentence: "Laundering synthetic polyester garments sheds thousands of toxic microplastics into municipal waterways.",
    wordForms: {},
    synonyms: ["plastic fragments", "particulate debris"],
    antonyms: ["natural fibers"],
    tipsForESL: "Usually used in plural form. Key for environmental impacts of fashion."
  },
  {
    id: "u11-2",
    unitId: 11,
    word: "upcycling",
    phonetic: "/ˈʌpˌsaɪ.klɪŋ/",
    partOfSpeech: "noun",
    definition: "The process of transforming by-products, waste materials, or unwanted garments into new materials of higher quality or value.",
    collocations: ["art of upcycling", "upcycling vintage denim", "promote upcycling"],
    exampleSentence: "Creative fashion designers embrace upcycling by stitching discarded fabric scraps into bespoke patchwork jackets.",
    wordForms: { verb: "upcycle", adjective: "upcycled" },
    synonyms: ["creative reuse", "repurposing"],
    antonyms: ["downcycling", "landfill disposal"],
    tipsForESL: "Higher value than standard recycling ('downcycling' breaks materials down into lower quality)."
  },
  {
    id: "u11-3",
    unitId: 11,
    word: "biodegradable",
    phonetic: "/ˌbaɪ.əʊ.dɪˈɡreɪ.də.bəl/",
    partOfSpeech: "adjective",
    definition: "Capable of being decomposed by bacteria or other living organisms and thereby avoiding pollution.",
    collocations: ["biodegradable materials", "100% biodegradable", "biodegradable packaging"],
    exampleSentence: "Unlike petroleum-based nylon, organic cotton and hemp are completely biodegradable when returned to the soil.",
    wordForms: { noun: "biodegradability", verb: "biodegrade" },
    synonyms: ["compostable", "decomposable", "eco-friendly"],
    antonyms: ["non-biodegradable", "permanent", "synthetic"],
    tipsForESL: "Bio- (living organisms) + degradable (can break down)."
  },
  {
    id: "u11-4",
    unitId: 11,
    word: "sweatshop",
    phonetic: "/ˈswet.ʃɒp/",
    partOfSpeech: "noun",
    definition: "A factory or workshop where manual workers are employed at very low wages for long hours and under poor conditions.",
    collocations: ["sweatshop labor", "boycott sweatshops", "anti-sweatshop campaign"],
    exampleSentence: "Ethical consumer movements pressure high-street apparel labels to terminate contracts with overseas sweatshops.",
    wordForms: {},
    synonyms: ["exploitative factory", "substandard workshop"],
    antonyms: ["fair-trade workshop", "ethical cooperative"],
    tipsForESL: "Strong negative connotation. Important for social impact analysis."
  },

  // UNIT 12: Future Technologies & Robotics
  {
    id: "u12-1",
    unitId: 12,
    word: "obsolete",
    phonetic: "/ˌɒb.səˈliːt/",
    partOfSpeech: "adjective",
    definition: "No longer produced or used; out of date and superseded by newer technology.",
    collocations: ["render obsolete", "become obsolete", "rapidly obsolete"],
    exampleSentence: "The advent of quantum cryptanalysis could render conventional silicon encryption algorithms completely obsolete.",
    wordForms: { noun: "obsolescence" },
    synonyms: ["outdated", "archaic", "superseded", "defunct"],
    antonyms: ["state-of-the-art", "cutting-edge", "modern"],
    tipsForESL: "Common collocation: 'render something obsolete' (make it outdated)."
  },
  {
    id: "u12-2",
    unitId: 12,
    word: "feasibility",
    phonetic: "/ˌfiː.zəˈbɪl.ə.ti/",
    partOfSpeech: "noun",
    definition: "The state or degree of being easily or conveniently done; practical viability.",
    collocations: ["conduct a feasibility study", "economic feasibility", "assess the feasibility"],
    exampleSentence: "Aerospace engineers are testing the thermodynamic feasibility of commercial nuclear-fusion powered aircraft.",
    wordForms: { adjective: "feasible", adverb: "feasibly" },
    synonyms: ["viability", "practicability", "workability"],
    antonyms: ["impossibility", "unworkability", "impracticability"],
    tipsForESL: "High-level academic word for determining if an invention can actually work."
  },
  {
    id: "u12-3",
    unitId: 12,
    word: "paradigm",
    phonetic: "/ˈpær.ə.daɪm/",
    partOfSpeech: "noun",
    definition: "A typical example, pattern, or overarching conceptual model of something.",
    collocations: ["paradigm shift", "new paradigm", "challenge the paradigm"],
    exampleSentence: "Brain-computer interfaces represent a profound paradigm shift in how paralyzed individuals communicate.",
    wordForms: { adjective: "paradigmatic" },
    synonyms: ["model", "framework", "prototype", "archetype"],
    antonyms: ["anomaly", "aberration"],
    tipsForESL: "The 'g' is silent: /ˈpær.ə.daɪm/. Paired often with 'shift'."
  },
  {
    id: "u12-4",
    unitId: 12,
    word: "speculative",
    phonetic: "/ˈspek.jə.lə.tɪv/",
    partOfSpeech: "adjective",
    definition: "Engaged in, expressing, or based on conjecture rather than knowledge; theoretical.",
    collocations: ["speculative technology", "purely speculative", "speculative fiction"],
    exampleSentence: "While faster-than-light warp propulsion remains purely speculative, ion thrusters are operating in orbit today.",
    wordForms: { verb: "speculate", noun: "speculation", adverb: "speculatively" },
    synonyms: ["conjectural", "hypothetical", "theoretical", "presumptive"],
    antonyms: ["proven", "empirical", "factual"],
    tipsForESL: "Useful when distinguishing between proven science and future possibilities."
  },

  // UNITS 14-15: Critical Reading & Creative Book Projects
  {
    id: "u14-1",
    unitId: 14,
    word: "nuance",
    phonetic: "/ˈnjuː.ɑːns/",
    partOfSpeech: "noun",
    definition: "A subtle difference in or shade of meaning, expression, sound, or color.",
    collocations: ["subtle nuance", "grasp the nuance", "rich with nuance"],
    exampleSentence: "Skillful ESL essayists capture emotional nuance by contrasting cautious modal verbs with emphatic adverbs.",
    wordForms: { adjective: "nuanced" },
    synonyms: ["subtlety", "gradation", "refinement", "shade"],
    antonyms: ["bluntness", "crudity", "oversimplification"],
    tipsForESL: "Adjective form 'nuanced' (e.g. 'a nuanced argument') is highly praised by examiners."
  },
  {
    id: "u14-2",
    unitId: 14,
    word: "subtext",
    phonetic: "/ˈsʌb.tekst/",
    partOfSpeech: "noun",
    definition: "An underlying and often distinct theme or implicit meaning in a piece of writing or conversation.",
    collocations: ["underlying subtext", "political subtext", "read between the subtext"],
    exampleSentence: "Beneath the protagonist's polite banter lies a bitter subtext of resentment toward social inequality.",
    wordForms: {},
    synonyms: ["implicit meaning", "undertone", "hidden message"],
    antonyms: ["explicit statement", "surface meaning"],
    tipsForESL: "Prefix 'sub-' (underneath) + text. Reading between the lines."
  },
  {
    id: "u14-3",
    unitId: 14,
    word: "synthesize",
    phonetic: "/ˈsɪn.θə.saɪz/",
    partOfSpeech: "verb",
    definition: "To combine a range of different ideas, facts, or sources into a coherent, connected whole.",
    collocations: ["synthesize information", "synthesize findings", "ability to synthesize"],
    exampleSentence: "In chapter five, the student must synthesize three historical accounts to reconstruct the timeline accurately.",
    wordForms: { noun: "synthesis", adjective: "synthetic" },
    synonyms: ["integrate", "amalgamate", "harmonize", "blend"],
    antonyms: ["dissect", "separate", "fragment"],
    tipsForESL: "Noun is 'synthesis'. Higher cognitive skill in Bloom's taxonomy."
  },
  {
    id: "u14-4",
    unitId: 14,
    word: "rhetoric",
    phonetic: "/ˈret.ər.ɪk/",
    partOfSpeech: "noun",
    definition: "The art of effective or persuasive speaking or writing, especially the use of figures of speech and composition techniques.",
    collocations: ["persuasive rhetoric", "empty rhetoric", "master the rhetoric"],
    exampleSentence: "The activist employed powerful emotional rhetoric and vivid metaphors to rally public support for the petition.",
    wordForms: { adjective: "rhetorical", adverb: "rhetorically" },
    synonyms: ["oratory", "eloquence", "persuasion", "discourse"],
    antonyms: ["inarticulateness"],
    tipsForESL: "Silent 'h'. 'Rhetorical question' is a question asked for effect, not an answer."
  },
  ...DESCRIPTIVE_AS_VOCAB_WORDS
];

export const WRITING_TASKS: WritingTask[] = [
  {
    id: "task-u1",
    unitId: 1,
    loCode: "LO 1.6.a & 1.7.a",
    title: "Biography & Profile of a Real-Life Hero",
    genre: "Biography",
    prompt: "Write a biographical profile (180–240 words) about an inspiring figure or role model. Detail their early obstacles, major achievements, and why they deserve admiration. Use past simple, past perfect, and present perfect tenses accurately, alongside cohesive linking devices.",
    targetWordCount: { min: 180, max: 240 },
    targetGrammarStructures: [
      "Past Simple for completed historic events",
      "Past Perfect for actions prior to other past events",
      "Present Perfect for lasting legacy and contemporary impact",
      "Reference words (this trailblazer, such tenacity, their endeavor)"
    ],
    suggestedDiscourseMarkers: [
      "Prior to this milestone",
      "Furthermore",
      "Despite severe adversity",
      "As a direct consequence",
      "Ultimately"
    ],
    outlineSections: [
      {
        title: "Paragraph 1: Introduction & Thesis",
        guidingQuestions: [
          "Who is this role model, and in what field did they make history?",
          "What core character trait (e.g. perseverance, resilience) defines their legacy?"
        ],
        starterSentence: "Few figures in modern history embody resilience more profoundly than..."
      },
      {
        title: "Paragraph 2: Early Struggles & Historic Breakthrough",
        guidingQuestions: [
          "What formidable barriers did they face before achieving recognition?",
          "What specific unprecedented milestone or world record did they achieve?"
        ],
        starterSentence: "Prior to achieving widespread acclaim, they had endured..."
      },
      {
        title: "Paragraph 3: Enduring Impact & Personal Reflection",
        guidingQuestions: [
          "How has their achievement transformed their community or discipline today?",
          "What personal takeaway can high school students apply to their own aspirations?"
        ],
        starterSentence: "Their enduring legacy continues to serve as an indispensable beacon for..."
      }
    ],
    modelText: {
      title: "Model Biography: The Tenacity of Katherine Johnson",
      content: "Few figures in aerospace history embody resilience more profoundly than mathematician Katherine Johnson. Born during an era of systemic racial and gender discrimination in the United States, she demonstrated an extraordinary aptitude for geometry from childhood.\n\nPrior to joining NASA's Space Task Group, Katherine had taught at segregated schools while persistently refining her computational craft. Her unprecedented calculations of orbital mechanics proved paramount when astronaut John Glenn refused to launch into orbit until Johnson had verified the computer's calculations by hand. Despite facing formidable social prejudices, her unwavering perseverance shattered barriers for generations of women in STEM.\n\nUltimately, Katherine Johnson has left an indelible legacy that transcends aeronautics. Today, her inspiring life exemplifies how intellect and moral courage can overcome the steepest odds.",
      highlights: [
        { type: "vocabulary", text: "resilience", explanation: "High-value Unit 1 academic noun indicating ability to recover from hardship." },
        { type: "linking", text: "Prior to joining", explanation: "Time-clause connective establishing chronological sequence." },
        { type: "grammar", text: "had taught", explanation: "Past perfect tense used to denote an action prior to her NASA appointment." },
        { type: "vocabulary", text: "unprecedented", explanation: "Target Unit 1 adjective describing something never seen before." }
      ]
    },
    rubricCriteria: [
      { category: "Idea Layout & Outline", standards: "Clear 3-paragraph structure with hook, chronological struggle, and lasting legacy.", maxScore: 5 },
      { category: "Target Vocabulary", standards: "Employs at least 3-4 target terms (perseverance, trailblazer, milestone, resilient).", maxScore: 5 },
      { category: "Grammar & Tenses", standards: "Accurate contrast between past simple, past perfect, and present perfect.", maxScore: 5 },
      { category: "Cohesion & Markers", standards: "Effective discourse markers (prior to this, despite, ultimately) and reference pronouns.", maxScore: 5 }
    ]
  },
  {
    id: "task-u2",
    unitId: 2,
    loCode: "LO 2.5.a & 2.6.a",
    title: "Formal Essay on Youth Civic Engagement",
    genre: "Formal Essay",
    prompt: "Plan and write a formal essay (200–260 words) examining why high school students should participate in non-profit volunteering. Analyze both personal growth benefits and wider societal impact, incorporating relative clauses and formal transitions.",
    targetWordCount: { min: 200, max: 260 },
    targetGrammarStructures: [
      "Defining and non-defining relative clauses (who, which, whose)",
      "Formal register (avoiding contractions and conversational slang)",
      "Cause-and-effect transitions (Consequently, Hence, As a result)"
    ],
    suggestedDiscourseMarkers: [
      "From a societal perspective",
      "Furthermore",
      "In addition to personal enrichment",
      "Consequently",
      "In conclusion"
    ],
    outlineSections: [
      {
        title: "Paragraph 1: Introduction & Stance",
        guidingQuestions: [
          "What is the role of volunteer organizations in modern civil society?",
          "What is your clear thesis statement regarding teenage civic participation?"
        ],
        starterSentence: "In an increasingly interconnected world, youth participation in grassroots non-profit organizations has become indispensable."
      },
      {
        title: "Paragraph 2: Benefits to Marginalized Communities",
        guidingQuestions: [
          "How do volunteer initiatives empower vulnerable local populations?",
          "Use a relative clause: 'volunteers, whose dedication...'"
        ],
        starterSentence: "First and foremost, philanthropic outreach directly uplifts marginalized communities that lack institutional support."
      },
      {
        title: "Paragraph 3: Youth Empowerment & Conclusion",
        guidingQuestions: [
          "How does volunteering cultivate empathy, leadership, and collaboration in students?",
          "What is your final call to action for high schools?"
        ],
        starterSentence: "Equally significant is the profound transformative impact volunteering exerts upon students themselves."
      }
    ],
    modelText: {
      title: "Model Essay: The Transformative Value of Youth Volunteering",
      content: "In an increasingly interconnected world, youth participation in grassroots non-profit organizations has become indispensable. Beyond mere altruism, civic engagement equips adolescents with leadership skills while reinforcing social cohesion.\n\nFirst and foremost, philanthropic outreach directly uplifts marginalized communities, which frequently lack adequate municipal resources. Student volunteers, whose efforts range from tutoring underprivileged children to organizing food banks, provide vital assistance that alleviates daily hardship. By actively participating in these humanitarian initiatives, teenagers foster a culture of solidarity and bridge socio-economic divides.\n\nEqually significant is the profound transformative impact volunteering exerts upon young individuals themselves. Engaging in collaborative community service develops emotional intelligence and civic responsibility—attributes that cannot be cultivated solely through textbooks. Consequently, students cultivate empathy and acquire organizational problem-solving skills.\n\nIn conclusion, school-based volunteering is not merely an extracurricular leisure pursuit; it is a catalyst for personal maturity and societal betterment.",
      highlights: [
        { type: "grammar", text: "which frequently lack adequate municipal resources", explanation: "Non-defining relative clause providing essential elaboration." },
        { type: "vocabulary", text: "marginalized", explanation: "Target Unit 2 adjective representing vulnerable groups." },
        { type: "linking", text: "First and foremost", explanation: "Organizing discourse marker ordering the primary argument." },
        { type: "vocabulary", text: "civic engagement", explanation: "Key collocation from curriculum objectives." }
      ]
    },
    rubricCriteria: [
      { category: "Formal Register", standards: "Consistently formal academic tone, sophisticated vocabulary, no slang/contractions.", maxScore: 5 },
      { category: "Relative Clauses", standards: "At least two correctly punctuated defining or non-defining relative clauses.", maxScore: 5 },
      { category: "Topic Vocabulary", standards: "Incorporates philanthropy, grassroots, empower, marginalized, or civic duty.", maxScore: 5 },
      { category: "Cohesion & Structure", standards: "Clear paragraph transitions and logical evidence progression.", maxScore: 5 }
    ]
  },
  {
    id: "task-u7",
    unitId: 7,
    loCode: "LO 7.3.b & 7.4.a",
    title: "Analytical Essay: Ethical Dimensions of AI",
    genre: "Reflective Analysis",
    prompt: "Write a balanced analytical essay (200–260 words) examining the societal, economic, and environmental impacts of artificial intelligence. Conclude with concrete actions students must take to remain responsible technology users.",
    targetWordCount: { min: 200, max: 260 },
    targetGrammarStructures: [
      "Complex sentence structures balancing contrasting viewpoints (While..., Whereas...)",
      "Modal verbs of obligation and responsibility (must, should, ought to)",
      "Discourse markers of concession (Notwithstanding, Despite, On the other hand)"
    ],
    suggestedDiscourseMarkers: [
      "On a global scale",
      "From an environmental standpoint",
      "While proponents highlight",
      "Nevertheless",
      "In summary, responsible usage dictates that"
    ],
    outlineSections: [
      {
        title: "Paragraph 1: The Dual Nature of AI",
        guidingQuestions: [
          "How is AI transforming daily productivity and research?",
          "What overarching ethical challenge arises from rapid automation?"
        ],
        starterSentence: "Artificial intelligence has undoubtedly emerged as the most consequential technological frontier of the twenty-first century."
      },
      {
        title: "Paragraph 2: Societal & Environmental Concerns",
        guidingQuestions: [
          "What are the risks of algorithmic bias and mass surveillance?",
          "What environmental footprint stems from energy-intensive data centers?"
        ],
        starterSentence: "Notwithstanding its remarkable potential, algorithmic systems introduce substantial ethical complications."
      },
      {
        title: "Paragraph 3: User Responsibility & Mitigation",
        guidingQuestions: [
          "How can students protect intellectual integrity when using AI tools?",
          "What personal pledge can you formulate for academic honesty?"
        ],
        starterSentence: "To mitigate these hazards, users must exercise critical awareness and digital accountability."
      }
    ],
    modelText: {
      title: "Model Analysis: Navigating the Ethical Frontier of AI",
      content: "Artificial intelligence has undoubtedly emerged as the most consequential technological frontier of the twenty-first century. While automated models accelerate scientific discovery and linguistic translation, their proliferation presents pressing societal, economic, and ecological dilemmas.\n\nNotwithstanding its remarkable efficiency, unregulated algorithmic deployment introduces formidable ethical challenges. On a societal level, training datasets often harbor historical prejudices, thereby perpetuating algorithmic bias in academic admissions and corporate hiring. Concurrently, facial recognition technologies raise legitimate civil liberty alarms concerning mass surveillance. From an environmental standpoint, the colossal compute power required to train large neural architectures generates an alarming carbon footprint and consumes massive water reserves for server cooling.\n\nTo mitigate these systemic hazards, students must cultivate rigorous digital accountability. Rather than outsourcing independent thought or plagiarizing synthetically generated text, learners should employ AI exclusively as an interactive tutor to critique drafts. Ultimately, the future of artificial intelligence rests not merely on silicon engineering, but on human moral integrity.",
      highlights: [
        { type: "vocabulary", text: "algorithmic bias", explanation: "Target Unit 7 ethical vocabulary term." },
        { type: "linking", text: "Notwithstanding its remarkable efficiency", explanation: "Sophisticated concession discourse marker." },
        { type: "vocabulary", text: "mitigate", explanation: "Academic verb meaning to reduce the severity of a negative consequence." },
        { type: "grammar", text: "Rather than outsourcing... learners should employ", explanation: "Complex parallel structure expressing prescriptive user behavior." }
      ]
    },
    rubricCriteria: [
      { category: "Comprehensive Scope", standards: "Addresses societal, economic, and environmental aspects as specified in LO 7.3.", maxScore: 5 },
      { category: "Ethical Vocabulary", standards: "Accurately applies terms such as accountability, mitigation, bias, surveillance.", maxScore: 5 },
      { category: "Syntactic Complexity", standards: "Skillful use of concession markers and complex clauses.", maxScore: 5 },
      { category: "Reflective Action", standards: "Proposes actionable, specific guidelines for responsible student usage.", maxScore: 5 }
    ]
  },
  {
    id: "task-u9",
    unitId: 9,
    loCode: "LO 9.5.a & 9.6.a",
    title: "Formal Environmental Report: Water Crisis Solutions",
    genre: "Formal Report",
    prompt: "Draft an environmental report (200–260 words) on regional water shortage. Utilize formal report format: clear section headings, structured bullet points for proposed solutions, and objective factual data.",
    targetWordCount: { min: 200, max: 260 },
    targetGrammarStructures: [
      "Passive voice for objective scientific reporting (has been depleted, are recommended)",
      "Headings and bullet points layout standard for formal reports",
      "Sequencing and reporting transitions (According to, As detailed below)"
    ],
    suggestedDiscourseMarkers: [
      "According to recent hydrological surveys",
      "As a direct consequence of",
      "Specifically, the following measures are proposed:",
      "In conclusion, immediate implementation is vital"
    ],
    outlineSections: [
      {
        title: "Section 1: Introduction & Current Scope",
        guidingQuestions: [
          "What causes groundwater depletion and scarcity in the region?",
          "What is the objective of this report?"
        ],
        starterSentence: "1.0 Overview of Regional Scarcity\nThis report investigates the accelerating depletion of local aquifers caused by protracted droughts and industrial over-extraction."
      },
      {
        title: "Section 2: Key Environmental Findings",
        guidingQuestions: [
          "What data illustrates the crisis (e.g. reservoir levels, agricultural impact)?",
          "Use passive voice to maintain an objective tone."
        ],
        starterSentence: "2.0 Hydrological Findings\nSurveys demonstrate that subsurface groundwater reserves have declined by 38% over the preceding decade."
      },
      {
        title: "Section 3: Recommended Action Plan",
        guidingQuestions: [
          "What 2-3 concrete initiatives can be adopted (e.g. desalination, rainwater harvesting)?",
          "Format as clear numbered or bulleted items."
        ],
        starterSentence: "3.0 Strategic Recommendations\nTo restore sustainable equilibrium, municipal planners should execute the following interventions:"
      }
    ],
    modelText: {
      title: "Model Report: Sustainable Water Management Protocol",
      content: "1.0 Overview of Regional Scarcity\nThis report investigates the critical depletion of regional aquifers resulting from prolonged climatic drought and uncontrolled agricultural withdrawal.\n\n2.0 Hydrological Findings\nRecent hydrological assessments confirm that local groundwater tables have receded by 42% over the past eight years. Consequently, neighboring wetland ecosystems have suffered severe degradation, threatening indigenous biodiversity and drinking reservoirs.\n\n3.0 Strategic Recommendations\nTo reverse this trajectory and guarantee potable access, the following measures are urgently proposed:\n• Solar Desalination: Construct energy-efficient reverse-osmosis coastal facilities to alleviate demand on inland reservoirs.\n• Groundwater Replenishment: Implement permeable urban pavements and catchment wetlands to direct storm runoff back into subterranean aquifers.\n• Smart Agricultural Irrigation: Subsidize precision drip irrigation systems, thereby curtailing agricultural water waste by an estimated 35%.\n\n4.0 Conclusion\nThrough prompt financial investment in these sustainable technologies, water security can be decisively restored.",
      highlights: [
        { type: "grammar", text: "have suffered severe degradation", explanation: "Present perfect passive/active expressing long-term cumulative result." },
        { type: "vocabulary", text: "desalination", explanation: "Target Unit 9 vocabulary word for converting seawater." },
        { type: "vocabulary", text: "replenishment", explanation: "Key term for recharging underground reservoirs." },
        { type: "linking", text: "Consequently", explanation: "Cause-effect linking device connecting drought to ecosystem harm." }
      ]
    },
    rubricCriteria: [
      { category: "Report Layout", standards: "Proper formal structure featuring numbered headings, concise bullets, and summary.", maxScore: 5 },
      { category: "Objective Register", standards: "Scientific, neutral tone utilizing appropriate passive voice and precise data.", maxScore: 5 },
      { category: "Technical Vocabulary", standards: "Accurate usage of scarcity, groundwater, desalination, replenishment, runoff.", maxScore: 5 },
      { category: "Logical Recommendations", standards: "Feasible and practical solutions directly addressing the identified causes.", maxScore: 5 }
    ]
  },
  {
    id: "task-u11",
    unitId: 11,
    loCode: "LO 11.5.a & 11.6.a",
    title: "Magazine Feature: The Real Cost of Fast Fashion",
    genre: "Magazine Article",
    prompt: "Write an engaging, semi-formal magazine article (200–250 words) exposing the hidden human and ecological tolls of ultra-fast fashion. Include a catchy headline, an evocative hook, and a persuasive call to action for conscious teen consumers.",
    targetWordCount: { min: 200, max: 250 },
    targetGrammarStructures: [
      "Inversion and emphatic sentence structures (Not only does... but it also...)",
      "Engaging descriptive vocabulary and vivid journalistic rhetoric",
      "Contrast transitions (On the contrary, Whereas, Conversely)"
    ],
    suggestedDiscourseMarkers: [
      "Behind the glitter of runway trends",
      "Not only does fast fashion deplete",
      "In stark contrast",
      "Consequently",
      "The choice ultimately rests in our hands"
    ],
    outlineSections: [
      {
        title: "Headline & Hook (Catchy & Engaging)",
        guidingQuestions: [
          "What compelling headline grabs the reader's attention?",
          "How many cheap garments end up discarded in landfills every year?"
        ],
        starterSentence: "Threadbare Ethics: The Hidden Environmental Price Tag in Your Closet"
      },
      {
        title: "Body: Ecological Damage & Sweatshops",
        guidingQuestions: [
          "How do synthetic textiles pollute oceans with microplastics?",
          "What labor conditions do factory workers endure?"
        ],
        starterSentence: "Behind the irresistible allure of five-dollar online tops lies an unsustainable production vortex."
      },
      {
        title: "Conclusion: Conscious Alternatives",
        guidingQuestions: [
          "How can upcycling and thrifting revolutionize youth fashion habits?",
          "What thought-provoking statement leaves a lasting impression?"
        ],
        starterSentence: "Fortunately, a burgeoning wave of youth activists is reimagining style through ethical upcycling and mindful curation."
      }
    ],
    modelText: {
      title: "Model Article: Threadbare Ethics in the Age of Fast Fashion",
      content: "Behind the sparkling allure of five-dollar tops and weekly micro-trends lies an unsustainable ecological crisis. As apparel corporations flood consumer markets with disposable garments, our planet pays the ultimate price.\n\nNot only does fast fashion consume billions of cubic meters of fresh water annually, but it also contaminates global waterways with hazardous synthetic dyes. Furthermore, every laundering of cheap polyester apparel unleashes millions of microplastics directly into marine ecosystems. On a human level, this frantic speed relies on overseas sweatshops where underpaid textile laborers toil in hazardous conditions with neither fair wages nor fundamental safety protections.\n\nIn stark contrast to this throwaway culture, conscious youth are championing a radical style renaissance. By embracing upcycling, thrifting vintage garments, and demanding supply chain transparency, teenagers are proving that authentic individuality cannot be bought off a mass-production conveyor belt. The next time you reach for a cheap impulse purchase, pause and ask yourself: is a fleeting trend truly worth the permanent cost?",
      highlights: [
        { type: "grammar", text: "Not only does fast fashion consume... but it also", explanation: "Emphatic negative inversion structure adding stylistic variety." },
        { type: "vocabulary", text: "microplastics", explanation: "Target Unit 11 scientific vocabulary." },
        { type: "vocabulary", text: "upcycling", explanation: "Unit 11 sustainable design terminology." },
        { type: "linking", text: "In stark contrast to", explanation: "High-level comparative connective." }
      ]
    },
    rubricCriteria: [
      { category: "Journalistic Layout", standards: "Catchy headline, lively opening hook, and thought-provoking closing question.", maxScore: 5 },
      { category: "Syntactic Variety", standards: "Use of inversion, emphatic phrasing, and varied sentence lengths.", maxScore: 5 },
      { category: "Domain Vocabulary", standards: "Textile, microplastics, sweatshop, upcycling, supply chain.", maxScore: 5 },
      { category: "Cohesion & Tone", standards: "Persuasive, engaging tone balanced with factual evidence.", maxScore: 5 }
    ]
  }
];

export const CLOZE_QUESTIONS: ClozeQuestion[] = [
  {
    id: "cloze-1",
    unitId: 1,
    sentence: "Through sheer ________ and relentless practice, the young gymnast managed to qualify for the Olympic squad despite her earlier knee injury.",
    blankWord: "perseverance",
    options: ["complacency", "indifference", "perseverance", "fragility"],
    correctAnswer: "perseverance",
    explanation: "'Perseverance' signifies continuing steadfastly despite formidable hardship or pain.",
    hint: "Think of an abstract noun meaning persistent determination."
  },
  {
    id: "cloze-2",
    unitId: 1,
    sentence: "The sprinter established an ________ record that sports commentators believe will remain unbroken for decades.",
    blankWord: "unprecedented",
    options: ["ordinary", "unprecedented", "obsolete", "superficial"],
    correctAnswer: "unprecedented",
    explanation: "'Unprecedented' means never having happened or been seen before in recorded history.",
    hint: "Starts with the prefix 'un-' and rhymes with 'evident'."
  },
  {
    id: "cloze-3",
    unitId: 2,
    sentence: "The NGO organized an intensive training seminar to ________ young women from rural areas with coding and web development skills.",
    blankWord: "empower",
    options: ["suppress", "neglect", "constrain", "empower"],
    correctAnswer: "empower",
    explanation: "To 'empower' means to provide individuals with the agency, means, and confidence to succeed.",
    hint: "A verb meaning to give power or capability to someone."
  },
  {
    id: "cloze-4",
    unitId: 2,
    sentence: "What began as a modest ________ initiative in our neighborhood soon attracted thousands of active volunteers across the province.",
    blankWord: "grassroots",
    options: ["top-down", "grassroots", "authoritarian", "bureaucratic"],
    correctAnswer: "grassroots",
    explanation: "'Grassroots' refers to social movements initiated by regular citizens at the local community level.",
    hint: "Compound adjective referencing blades of grass and roots in the soil."
  },
  {
    id: "cloze-5",
    unitId: 3,
    sentence: "Scaling Mount Everest in mid-winter presents a ________ challenge even for the most seasoned mountaineers.",
    blankWord: "formidable",
    options: ["trivial", "formidable", "laughable", "mediocre"],
    correctAnswer: "formidable",
    explanation: "'Formidable' describes an obstacle or opponent that inspires awe or deep respect due to size or difficulty.",
    hint: "Adjective starting with 'f', meaning daunting or awe-inspiring."
  },
  {
    id: "cloze-6",
    unitId: 4,
    sentence: "Rather than merely prescribing antibiotics after patients fall ill, modern clinics champion ________ healthcare through diet and exercise.",
    blankWord: "preventive",
    options: ["negligent", "lethal", "preventive", "speculative"],
    correctAnswer: "preventive",
    explanation: "'Preventive' healthcare stops illness or disease before it has the opportunity to develop.",
    hint: "Related to the verb 'prevent'."
  },
  {
    id: "cloze-7",
    unitId: 5,
    sentence: "Health specialists advise that maintaining a strictly ________ lifestyle is a leading risk factor for cardiovascular conditions.",
    blankWord: "sedentary",
    options: ["athletic", "sedentary", "strenuous", "invigorating"],
    correctAnswer: "sedentary",
    explanation: "'Sedentary' characterizes a mode of living involving prolonged sitting and minimal physical exertion.",
    hint: "Begins with 'sed-', from Latin for sitting."
  },
  {
    id: "cloze-8",
    unitId: 7,
    sentence: "Software developers must establish independent auditing mechanisms to identify and eliminate ________ bias in facial recognition tools.",
    blankWord: "algorithmic",
    options: ["accidental", "spontaneous", "algorithmic", "instinctive"],
    correctAnswer: "algorithmic",
    explanation: "'Algorithmic' bias describes systemic, repeatable errors in a computer system that generate unfair outcomes.",
    hint: "Adjective derived from the noun 'algorithm'."
  },
  {
    id: "cloze-9",
    unitId: 8,
    sentence: "Tropical coral reefs support an immense amount of marine ________, housing a quarter of all known oceanic species.",
    blankWord: "biodiversity",
    options: ["monoculture", "biodiversity", "pollution", "sterility"],
    correctAnswer: "biodiversity",
    explanation: "'Biodiversity' refers to the variety and richness of living organisms within an ecological habitat.",
    hint: "Bio (life) + diversity (variety)."
  },
  {
    id: "cloze-10",
    unitId: 9,
    sentence: "As groundwater levels plunge, desert cities have invested in nuclear-powered ________ plants to turn sea water into clean drinking supplies.",
    blankWord: "desalination",
    options: ["contamination", "combustion", "desalination", "deforestation"],
    correctAnswer: "desalination",
    explanation: "'Desalination' is the process of extracting salt and minerals from saline ocean water.",
    hint: "Prefix 'de-' meaning remove + 'saline' (salty)."
  },
  {
    id: "cloze-11",
    unitId: 10,
    sentence: "Advocates of sustainable gastronomy urge shoppers to reduce ________ by purchasing locally harvested produce rather than imported air-freighted fruit.",
    blankWord: "food miles",
    options: ["organic yield", "soil nutrients", "cash crops", "food miles"],
    correctAnswer: "food miles",
    explanation: "'Food miles' measures the distance food must travel from the farm to reach your kitchen plate.",
    hint: "Two-word term consisting of 'food' and a unit of distance."
  },
  {
    id: "cloze-12",
    unitId: 11,
    sentence: "Every wash cycle of synthetic fleece coats dislodges thousands of microscopic ________ that slip past water filtration filters into marine ecosystems.",
    blankWord: "microplastics",
    options: ["minerals", "microplastics", "biodegradables", "fertilizers"],
    correctAnswer: "microplastics",
    explanation: "'Microplastics' are minuscule synthetic polymer particles shed by nylon and polyester clothes.",
    hint: "Micro (tiny) + plastics."
  },
  {
    id: "cloze-13",
    unitId: 12,
    sentence: "The widespread adoption of touchscreens rendered mechanical mobile keyboards practically ________ in consumer markets within three years.",
    blankWord: "obsolete",
    options: ["indispensable", "obsolete", "futuristic", "vibrant"],
    correctAnswer: "obsolete",
    explanation: "'Obsolete' means no longer produced or useful because something superior and newer has replaced it.",
    hint: "Starts with 'ob-', meaning outdated."
  },
  {
    id: "cloze-14",
    unitId: 14,
    sentence: "To compose an outstanding research paper, high school students must ________ insights from multiple peer-reviewed academic publications.",
    blankWord: "synthesize",
    options: ["plagiarize", "disintegrate", "synthesize", "contradict"],
    correctAnswer: "synthesize",
    explanation: "To 'synthesize' means to combine diverse ideas or data into a coherent and integrated thesis.",
    hint: "Verb meaning to unite separate elements into a unified whole."
  },
  ...DESCRIPTIVE_CLOZE_QUESTIONS
];

export const DISCOURSE_MARKERS_LIBRARY = [
  {
    category: "Addition & Elaboration",
    description: "Use to introduce an additional corroborating point or deepen an explanation.",
    markers: [
      { phrase: "Furthermore,", example: "Furthermore, volunteer initiatives cultivate invaluable empathy in adolescents." },
      { phrase: "Moreover,", example: "Moreover, the physical benefits of daily exercise are reinforced by mental clarity." },
      { phrase: "In addition to this,", example: "In addition to this, solar desalination plants produce zero carbon emissions." },
      { phrase: "Not only... but also...", example: "Not only does fast fashion waste clean water, but it also exploits textile workers." }
    ]
  },
  {
    category: "Contrast & Concession",
    description: "Crucial for demonstrating balanced reasoning, counterarguments, and nuance in high-band ESL writing.",
    markers: [
      { phrase: "In contrast,", example: "In contrast to conventional agriculture, permaculture enhances topsoil fertility." },
      { phrase: "On the other hand,", example: "On the other hand, rapid automation threatens to displace millions of manual positions." },
      { phrase: "Notwithstanding these benefits,", example: "Notwithstanding these benefits, unchecked AI deployment poses surveillance risks." },
      { phrase: "Whereas...", example: "Whereas synthetic fabrics shed microplastics, organic linen decomposes harmlessly." },
      { phrase: "Despite facing formidable barriers,", example: "Despite facing formidable barriers, the trailblazer completed her arctic journey." }
    ]
  },
  {
    category: "Cause, Effect & Result",
    description: "Link actions and events to their logical consequences.",
    markers: [
      { phrase: "Consequently,", example: "Consequently, aquifer levels plummeted to historically critical thresholds." },
      { phrase: "As a direct consequence of this,", example: "As a direct consequence of this, endangered species lost their natural nesting grounds." },
      { phrase: "Hence,", example: "Municipalities must upgrade wastewater networks; hence, new funding is vital." },
      { phrase: "This inevitably leads to...", example: "Excessive screen immersion inevitably leads to acute sleep disruption." }
    ]
  },
  {
    category: "Time & Chronological Sequence",
    description: "Essential for biographies, reports, and historic world record narratives.",
    markers: [
      { phrase: "Prior to this breakthrough,", example: "Prior to this breakthrough, physicians had possessed no cure for bacterial sepsis." },
      { phrase: "Subsequently,", example: "Subsequently, the committee unveiled a comprehensive wildlife preservation charter." },
      { phrase: "Simultaneously,", example: "Simultaneously, grassroots community volunteers coordinated emergency shelter." },
      { phrase: "In due course,", example: "In due course, public attitudes shifted toward ecological accountability." }
    ]
  },
  {
    category: "Exemplification & Evidence",
    description: "Ground your assertions with verifiable facts, real-world case studies, and citations.",
    markers: [
      { phrase: "To illustrate this phenomenon,", example: "To illustrate this phenomenon, recent climate data shows a 40% glacier retreat." },
      { phrase: "A poignant case in point is...", example: "A poignant case in point is the historic eradication of the smallpox virus." },
      { phrase: "This can be substantiated by...", example: "This can be substantiated by peer-reviewed studies published in medical journals." }
    ]
  },
  {
    category: "Conclusion & Final Reflection",
    description: "Wrap up essays, biographies, and reports with punchy, thought-provoking closures.",
    markers: [
      { phrase: "Ultimately,", example: "Ultimately, moral responsibility must guide technological advancement." },
      { phrase: "In summary,", example: "In summary, sustainable food security demands international collaboration." },
      { phrase: "Bearing all these factors in mind,", example: "Bearing all these factors in mind, high schools should mandate civic volunteering." }
    ]
  }
];
