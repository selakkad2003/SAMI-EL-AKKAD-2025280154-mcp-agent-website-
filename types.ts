
export interface VoiceConfig {
  pitch: number; // Keep for fallback or future use
  rate: number;  // Keep for fallback
  gender: 'male' | 'female';
  geminiVoice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'; // Specific Gemini Model Voices
}

export interface Hero {
  id: string;
  name: string;
  role: string;
  culture: string;
  description: string;
  stylePrompt: string;
  emoji: string;
  themeColor: string;
  bgGradient: string;
  voiceConfig: VoiceConfig;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  // FILL_BLANK = 'fill_blank', // REMOVED
  TRUE_FALSE = 'true_false',
  ORDERING = 'ordering',
  MATCHING = 'matching',
  // CORRECT_THE_SENTENCE = 'correct_the_sentence' // REMOVED
}

export interface Quiz {
  question: string;
  type: QuestionType;
  options?: string[];
  matchOptions?: string[]; // For the second column in a matching question
  correctAnswer: string;
  explanation: string;
}

export interface StoryChapter {
  chapterNumber: number;
  totalChapters: number;
  chapterTitle: string;
  storyContent: string;
  educationalConcept: string;
  imagePrompt: string;
  quiz: Quiz;
  isFinal: boolean;
}

export interface UserPreferences {
  userName: string;
  gender: string;
  interests: string;
  difficulty: string;
  chapterCount: number;
  language: string;
}

export interface UserInput {
  topic: string;
  fileData?: string;
  mimeType?: string;
  preferences: UserPreferences;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolCall?: ToolCallInfo;
  media?: {
    type: 'image' | 'audio' | 'video';
    url: string;
  };
}

export interface ToolCallInfo {
  name: string;
  args: any;
  output?: string;
}

export type GameState = 'LOGIN' | 'HERO_SELECTION' | 'SETUP_PROFILE' | 'GENERATING_STORY' | 'PLAYING' | 'COMPLETED';

// --- NEW TYPES FOR COPILOT ---
export interface PerformanceRecord {
  chapter: StoryChapter;
  userAnswer: string;
  isCorrect: boolean;
}

export interface CopilotReportData {
  grade: string;
  summary: string;
  focusAreas: string[];
  studyPlan: string[];
}
