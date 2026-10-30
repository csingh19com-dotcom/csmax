import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  StudentProfile,
  StudentStats,
  DailyMission,
  RecentQuizResult,
  ChapterProgress,
  WeakTopic,
  UpcomingExam,
  FlashcardItem,
  StudyTask,
  StudyNote,
} from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface StudentContextType {
  profile: StudentProfile;
  stats: StudentStats;
  missions: DailyMission[];
  recentQuizzes: RecentQuizResult[];
  chapters: ChapterProgress[];
  weakTopics: WeakTopic[];
  upcomingExams: UpcomingExam[];
  flashcards: FlashcardItem[];
  tasks: StudyTask[];
  notes: StudyNote[];
  updateProfile: (updates: Partial<StudentProfile>) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  addStudyMinutes: (minutes: number) => void;
  incrementMission: (id: string, count?: number) => void;
  claimMissionReward: (id: string) => void;
  recordQuizResult: (res: Omit<RecentQuizResult, 'id'>) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  deleteTask: (id: string) => void;
  addNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<StudyNote>) => void;
  deleteNote: (id: string) => void;
  toggleFlashcardMastered: (id: string) => void;
  addFlashcard: (card: Omit<FlashcardItem, 'id' | 'mastered'>) => void;
  addExam: (exam: Omit<UpcomingExam, 'id'>) => void;
  updateChapterProgress: (id: string, completed: number) => void;
  resetToDefaults: () => void;
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Rohit Kumar',
  classLevel: 'Class 10',
  board: 'CBSE',
  field: 'General Secondary',
  subjects: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  learningLanguage: 'English',
  academicGoal: 'Score 95%+ in Board Exams',
  level: 3,
  levelTitle: 'Explorer',
  onboardingCompleted: true,
};

const DEFAULT_STATS: StudentStats = {
  streakDays: 2,
  virtualCoins: 150,
  studyMinutes: 45,
  xp: 320,
  xpTarget: 500,
};

const DEFAULT_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Complete a focus session',
    icon: 'timer',
    current: 0,
    target: 1,
    unit: 'session',
    xpReward: 50,
    completed: false,
    claimed: false,
    actionTab: 'focus_timer',
  },
  {
    id: 'm2',
    title: 'Answer 10 questions',
    icon: 'bot',
    current: 3,
    target: 10,
    unit: 'questions',
    xpReward: 75,
    completed: false,
    claimed: false,
    actionTab: 'ai_tutor',
  },
  {
    id: 'm3',
    title: 'Review 5 flashcards',
    icon: 'cards',
    current: 1,
    target: 5,
    unit: 'cards',
    xpReward: 50,
    completed: false,
    claimed: false,
    actionTab: 'flashcards',
  },
  {
    id: 'm4',
    title: 'Complete a chapter quiz',
    icon: 'quiz',
    current: 0,
    target: 1,
    unit: 'quiz',
    xpReward: 100,
    completed: false,
    claimed: false,
    actionTab: 'quiz_arena',
  },
  {
    id: 'm5',
    title: 'Practise a weak topic',
    icon: 'lightbulb',
    current: 0,
    target: 1,
    unit: 'topic',
    xpReward: 75,
    completed: false,
    claimed: false,
    actionTab: 'weak_topics',
  },
];

const DEFAULT_RECENT_QUIZZES: RecentQuizResult[] = [
  {
    id: 'q1',
    subject: 'Mathematics',
    quizName: 'Quadratic Equations',
    score: 8,
    totalQuestions: 10,
    percentage: 82,
    date: '2 days ago',
    colorClass: 'emerald',
  },
  {
    id: 'q2',
    subject: 'Science',
    quizName: 'Life Processes',
    score: 6,
    totalQuestions: 10,
    percentage: 60,
    date: '3 days ago',
    colorClass: 'pink',
  },
  {
    id: 'q3',
    subject: 'Social Science',
    quizName: 'Nationalism',
    score: 9,
    totalQuestions: 10,
    percentage: 90,
    date: '4 days ago',
    colorClass: 'cyan',
  },
];

const DEFAULT_CHAPTERS: ChapterProgress[] = [
  {
    id: 'c1',
    subject: 'Mathematics',
    name: 'Real Numbers',
    completedChapters: 3,
    totalChapters: 5,
  },
  {
    id: 'c2',
    subject: 'Mathematics',
    name: 'Polynomials',
    completedChapters: 2,
    totalChapters: 5,
  },
  {
    id: 'c3',
    subject: 'Mathematics',
    name: 'Linear Equations',
    completedChapters: 1,
    totalChapters: 5,
  },
  {
    id: 'c4',
    subject: 'Mathematics',
    name: 'Triangles',
    completedChapters: 0,
    totalChapters: 5,
  },
];

const DEFAULT_WEAK_TOPICS: WeakTopic[] = [
  {
    id: 'wt1',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    accuracy: 45,
    priority: 'High Priority',
  },
  {
    id: 'wt2',
    subject: 'Science',
    topic: 'Chemical Reactions',
    accuracy: 52,
    priority: 'High Priority',
  },
  {
    id: 'wt3',
    subject: 'Social Science',
    topic: 'World War II',
    accuracy: 60,
    priority: 'Medium',
  },
];

const DEFAULT_EXAMS: UpcomingExam[] = [
  {
    id: 'ex1',
    name: 'Half Yearly Exam',
    dateStr: '15 Nov 2026',
    // 12 days, 8 hours, 45 minutes from now
    targetTimestamp: Date.now() + (12 * 24 * 60 + 8 * 60 + 45) * 60 * 1000,
    progress: 65,
  },
];

const DEFAULT_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc1',
    subject: 'Science',
    topic: 'Life Processes',
    question: 'What is the primary function of xylem in vascular plants?',
    answer: 'Xylem transports water and dissolved mineral nutrients from roots to leaves and aerial plant structures.',
    mastered: true,
  },
  {
    id: 'fc2',
    subject: 'Mathematics',
    topic: 'Quadratic Equations',
    question: 'What is the quadratic formula to solve ax² + bx + c = 0?',
    answer: 'x = (-b ± √(b² - 4ac)) / (2a)',
    mastered: false,
  },
  {
    id: 'fc3',
    subject: 'Science',
    topic: 'Chemical Reactions',
    question: 'What is an exothermic reaction? Give one daily example.',
    answer: 'A reaction that releases energy in the form of heat or light. Example: Respiration, combustion of natural gas.',
    mastered: false,
  },
  {
    id: 'fc4',
    subject: 'Social Science',
    topic: 'Nationalism in India',
    question: 'When was the Non-Cooperation Movement launched and under whose leadership?',
    answer: 'Launched in 1920 under the leadership of Mahatma Gandhi with support from the Indian National Congress.',
    mastered: true,
  },
  {
    id: 'fc5',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    question: 'State the fundamental trigonometric identity relating sin and cos.',
    answer: 'sin²(θ) + cos²(θ) = 1 for all angles θ.',
    mastered: false,
  },
];

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 't1',
    title: 'Solve 10 Trigonometry word problems',
    subject: 'Mathematics',
    date: 'Today',
    time: '4:00 PM',
    completed: false,
    xpValue: 40,
  },
  {
    id: 't2',
    title: 'Revise Chemical Equation balancing',
    subject: 'Science',
    date: 'Today',
    time: '5:30 PM',
    completed: true,
    xpValue: 30,
  },
  {
    id: 't3',
    title: 'Read Nationalism in India Chapter 2',
    subject: 'Social Science',
    date: 'Tomorrow',
    time: '6:00 PM',
    completed: false,
    xpValue: 35,
  },
];

const DEFAULT_NOTES: StudyNote[] = [
  {
    id: 'n1',
    title: 'Key Quadratic Formula & Discriminant Rules',
    subject: 'Mathematics',
    chapter: 'Quadratic Equations',
    content: `# Quadratic Equations Summary
- Standard form: ax² + bx + c = 0 (a ≠ 0)
- Discriminant D = b² - 4ac
  - D > 0: Two distinct real roots
  - D = 0: Two equal real roots (-b/2a)
  - D < 0: No real roots (complex roots)
- Sum of roots: α + β = -b/a
- Product of roots: α · β = c/a`,
    tags: ['Formulas', 'Exam Tips'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    title: 'Photosynthesis Stages & Light Reactions',
    subject: 'Science',
    chapter: 'Life Processes',
    content: `# Photosynthesis Overview
6CO₂ + 6H₂O + Sunlight -> C₆H₁₂O₆ + 6O₂

1. Light-Dependent Reactions: Occur in thylakoid membranes, produce ATP and NADPH.
2. Calvin Cycle (Light-Independent): Occurs in stroma, fixes CO₂ into glucose.
3. Stomata Regulation: Guard cells swell with water to open pore for gas exchange.`,
    tags: ['Biology', 'Diagrams'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'moon_ai_student_master_data_v1';

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isGuest } = useAuth();

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [stats, setStats] = useState<StudentStats>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stats`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STATS;
  });

  const [missions, setMissions] = useState<DailyMission[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_missions`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MISSIONS;
  });

  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuizResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quizzes`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RECENT_QUIZZES;
  });

  const [chapters, setChapters] = useState<ChapterProgress[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_chapters`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CHAPTERS;
  });

  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_weak_topics`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_WEAK_TOPICS;
  });

  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EXAMS;
  });

  const [flashcards, setFlashcards] = useState<FlashcardItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_flashcards`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_FLASHCARDS;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_TASKS;
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_NOTES;
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY}_stats`, JSON.stringify(stats));
      localStorage.setItem(`${STORAGE_KEY}_missions`, JSON.stringify(missions));
      localStorage.setItem(`${STORAGE_KEY}_quizzes`, JSON.stringify(recentQuizzes));
      localStorage.setItem(`${STORAGE_KEY}_chapters`, JSON.stringify(chapters));
      localStorage.setItem(`${STORAGE_KEY}_weak_topics`, JSON.stringify(weakTopics));
      localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(upcomingExams));
      localStorage.setItem(`${STORAGE_KEY}_flashcards`, JSON.stringify(flashcards));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [profile, stats, missions, recentQuizzes, chapters, weakTopics, upcomingExams, flashcards, tasks, notes]);

  // Sync from user profile if signed in
  useEffect(() => {
    if (currentUser && !currentUser.isGuest) {
      if (currentUser.displayName && profile.name === 'Rohit Kumar') {
        setProfile((prev) => ({ ...prev, name: currentUser.displayName || prev.name }));
      }
    }
  }, [currentUser]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addXP = (amount: number) => {
    setStats((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = profile.level;
      let newTarget = prev.xpTarget;
      let newLevelTitle = profile.levelTitle;

      if (newXp >= prev.xpTarget) {
        newLevel += 1;
        newXp = newXp - prev.xpTarget;
        newTarget = Math.round(prev.xpTarget * 1.4);
        if (newLevel >= 5) newLevelTitle = 'Master Scholar';
        else if (newLevel >= 4) newLevelTitle = 'Cosmic Achiever';
        else newLevelTitle = 'Explorer';

        setProfile((p) => ({ ...p, level: newLevel, levelTitle: newLevelTitle }));
      }

      return {
        ...prev,
        xp: newXp,
        xpTarget: newTarget,
      };
    });
  };

  const addCoins = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      virtualCoins: Math.max(0, prev.virtualCoins + amount),
    }));
  };

  const addStudyMinutes = (minutes: number) => {
    setStats((prev) => ({
      ...prev,
      studyMinutes: prev.studyMinutes + minutes,
    }));
  };

  const incrementMission = (id: string, count = 1) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id && !m.completed) {
          const updated = Math.min(m.target, m.current + count);
          return {
            ...m,
            current: updated,
            completed: updated >= m.target,
          };
        }
        return m;
      })
    );
  };

  const claimMissionReward = (id: string) => {
    const target = missions.find((m) => m.id === id);
    if (!target || !target.completed || target.claimed) return;

    addXP(target.xpReward);
    addCoins(Math.round(target.xpReward / 2));

    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, claimed: true } : m))
    );
  };

  const recordQuizResult = (res: Omit<RecentQuizResult, 'id'>) => {
    const newResult: RecentQuizResult = {
      ...res,
      id: `quiz_${Date.now()}`,
    };
    setRecentQuizzes((prev) => [newResult, ...prev.slice(0, 5)]);

    // Check if score is low -> add/update weak topic
    if (res.percentage < 65) {
      setWeakTopics((prev) => {
        const existing = prev.find((w) => w.topic.toLowerCase() === res.quizName.toLowerCase());
        if (existing) {
          return prev.map((w) =>
            w.id === existing.id
              ? { ...w, accuracy: res.percentage, priority: res.percentage < 50 ? 'High Priority' : 'Medium' }
              : w
          );
        }
        return [
          {
            id: `wt_${Date.now()}`,
            subject: res.subject,
            topic: res.quizName,
            accuracy: res.percentage,
            priority: res.percentage < 50 ? 'High Priority' : 'Medium',
          },
          ...prev,
        ];
      });
    }

    // Award XP
    addXP(Math.round(res.score * 10));
    addCoins(Math.round(res.score * 5));
    incrementMission('m4', 1);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) {
            addXP(t.xpValue);
            addCoins(10);
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const addTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addNote = (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: StudyNote = {
      ...note,
      id: `note_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    addXP(25);
  };

  const updateNote = (id: string, updates: Partial<StudyNote>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleFlashcardMastered = (id: string) => {
    setFlashcards((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextMastered = !f.mastered;
          if (nextMastered) {
            addXP(15);
            addCoins(5);
            incrementMission('m3', 1);
          }
          return { ...f, mastered: nextMastered };
        }
        return f;
      })
    );
  };

  const addFlashcard = (card: Omit<FlashcardItem, 'id' | 'mastered'>) => {
    const newCard: FlashcardItem = {
      ...card,
      id: `fc_${Date.now()}`,
      mastered: false,
    };
    setFlashcards((prev) => [newCard, ...prev]);
    addXP(20);
  };

  const addExam = (exam: Omit<UpcomingExam, 'id'>) => {
    const newExam: UpcomingExam = {
      ...exam,
      id: `exam_${Date.now()}`,
    };
    setUpcomingExams((prev) => [...prev, newExam]);
  };

  const updateChapterProgress = (id: string, completed: number) => {
    setChapters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completedChapters: Math.min(c.totalChapters, completed) } : c))
    );
  };

  const resetToDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setStats(DEFAULT_STATS);
    setMissions(DEFAULT_MISSIONS);
    setRecentQuizzes(DEFAULT_RECENT_QUIZZES);
    setChapters(DEFAULT_CHAPTERS);
    setWeakTopics(DEFAULT_WEAK_TOPICS);
    setUpcomingExams(DEFAULT_EXAMS);
    setFlashcards(DEFAULT_FLASHCARDS);
    setTasks(DEFAULT_TASKS);
    setNotes(DEFAULT_NOTES);
  };

  return (
    <StudentContext.Provider
      value={{
        profile,
        stats,
        missions,
        recentQuizzes,
        chapters,
        weakTopics,
        upcomingExams,
        flashcards,
        tasks,
        notes,
        updateProfile,
        addXP,
        addCoins,
        addStudyMinutes,
        incrementMission,
        claimMissionReward,
        recordQuizResult,
        toggleTask,
        addTask,
        deleteTask,
        addNote,
        updateNote,
        deleteNote,
        toggleFlashcardMastered,
        addFlashcard,
        addExam,
        updateChapterProgress,
        resetToDefaults,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return ctx;
};
