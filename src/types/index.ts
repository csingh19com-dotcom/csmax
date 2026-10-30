export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string; // Text content if plain text
  base64?: string; // Base64 data for images
}

export interface Message {
  id: string;
  conversationId: string;
  userId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  createdAt: string; // ISO string
  attachments?: Attachment[];
  status?: 'sending' | 'streaming' | 'complete' | 'error';
  error?: string;
}

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  model: string;
  systemPrompt?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  messageCount?: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'Google Gemini' | 'Ollama Local' | 'OpenAI' | 'Anthropic' | 'DeepSeek';
  tier: 'free' | 'paid' | 'local' | 'unconfigured';
  badge: string;
  description: string;
  status: 'available' | 'requires_key' | 'offline' | 'local_check' | 'coming_soon';
  speed: string;
  contextWindow: string;
}

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isGuest: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  defaultModel: string;
  systemPrompt: string;
  ollamaHost: string;
  streamResponses: boolean;
}

// Student & Cosmic Learning Platform Types
export type NavigationTab =
  | 'home'
  | 'ai_tutor'
  | 'curriculum'
  | 'quiz_arena'
  | 'exam_simulator'
  | 'flashcards'
  | 'study_planner'
  | 'focus_timer'
  | 'pdf_learning'
  | 'notes_library'
  | 'visual_learning'
  | 'voice_learning'
  | 'weak_topics'
  | 'progress_analytics'
  | 'missions_rewards'
  | 'settings'
  | 'admin';

export interface StudentProfile {
  name: string;
  classLevel: string; // e.g. "Class 10"
  board: string; // e.g. "CBSE"
  field?: string; // e.g. "Science / PCM"
  subjects: string[];
  learningLanguage: 'English' | 'Hindi' | 'Hinglish';
  academicGoal: string;
  level: number;
  levelTitle: string;
  onboardingCompleted: boolean;
}

export interface StudentStats {
  streakDays: number;
  virtualCoins: number;
  studyMinutes: number;
  xp: number;
  xpTarget: number;
}

export interface DailyMission {
  id: string;
  title: string;
  icon: string;
  current: number;
  target: number;
  unit: string;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
  actionTab?: NavigationTab;
}

export interface RecentQuizResult {
  id: string;
  subject: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  colorClass: string;
}

export interface ChapterProgress {
  id: string;
  subject: string;
  name: string;
  completedChapters: number;
  totalChapters: number;
}

export interface WeakTopic {
  id: string;
  subject: string;
  topic: string;
  accuracy: number;
  priority: 'High Priority' | 'Medium' | 'Low';
}

export interface UpcomingExam {
  id: string;
  name: string;
  dateStr: string;
  targetTimestamp: number;
  progress: number;
}

export interface FlashcardItem {
  id: string;
  subject: string;
  topic: string;
  question: string;
  answer: string;
  mastered: boolean;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  completed: boolean;
  xpValue: number;
}

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  chapter: string;
}
