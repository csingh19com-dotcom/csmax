import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Coins,
  Clock,
  Star,
  Plus,
  GraduationCap,
  Layers,
  ArrowRight,
  Bot,
  Trophy,
  BookOpen,
  FileText,
  FileEdit,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ChevronRight,
  Target,
  TrendingUp,
  Award,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { NavigationTab } from '../types';

interface HomeDashboardProps {
  onNavigate: (tab: NavigationTab) => void;
  onStartSpecificQuiz?: (subject: string, topic: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onStartSpecificQuiz,
}) => {
  const {
    profile,
    stats,
    missions,
    recentQuizzes,
    chapters,
    weakTopics,
    upcomingExams,
    claimMissionReward,
  } = useStudent();

  // Dynamic greeting based on time of day
  const [greeting, setGreeting] = useState('Good Morning');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Live countdown timer for upcoming exam
  const exam = upcomingExams[0];
  const [countdown, setCountdown] = useState({ days: 12, hours: 8, minutes: 45 });

  useEffect(() => {
    if (!exam) return;
    const updateTime = () => {
      const diff = Math.max(0, exam.targetTimestamp - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setCountdown({ days, hours, minutes });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [exam]);

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-5 text-slate-100 max-w-[1600px] mx-auto w-full">
      {/* ================= ROW 1: HERO & STATS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
        {/* Welcome Hero Card (~65% width) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c122c] via-[#10183b] to-[#1a1c4b] border border-indigo-500/20 p-5 md:p-7 shadow-xl shadow-indigo-950/40 flex flex-col justify-between">
          {/* Subtle cosmic glow accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{greeting},</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200">
                    {profile.name}
                  </span>
                  <span className="text-amber-300">☀️</span>
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Keep going! Every small step brings you closer to your big dreams.
                </p>
              </div>

              {/* Student Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs text-indigo-200 font-medium shadow-sm">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {profile.classLevel} • {profile.board}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs text-indigo-200 font-medium shadow-sm">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.subjects?.length || 5} Selected</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs text-indigo-200 font-medium shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
                  <span>
                    Level {profile.level} {profile.levelTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Astronaut & Cosmic Artwork Element */}
            <div className="hidden sm:flex shrink-0 relative items-center justify-center">
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden ring-1 ring-indigo-400/30 shadow-2xl bg-slate-950 flex items-center justify-center group">
                <img
                  src="/assets/aistudio/MOON_AI_Cosmic_Learning_Dashboard_e5f070f6.png"
                  alt="Cosmic Learning"
                  className="w-full h-full object-cover object-top scale-125 transition-transform duration-500 group-hover:scale-130"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-2 text-center pointer-events-none">
                  <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold drop-shadow">
                    Dream • Learn • Achieve
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Statistics Cards (~35% width, 2x2 grid) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3 md:gap-3.5">
          {/* Card 1: Daily Streak */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c122c] to-[#12193b] border border-slate-800/80 p-3.5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400/20" />
              </div>
              <span className="text-sm">📅</span>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Daily Streak</span>
              <div className="text-lg md:text-xl font-bold text-white mt-0.5">
                {stats.streakDays} Days
              </div>
            </div>
          </div>

          {/* Card 2: Virtual Coins */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c122c] to-[#12193b] border border-slate-800/80 p-3.5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                <Coins className="w-4 h-4" />
              </div>
              <button
                onClick={() => onNavigate('missions_rewards')}
                className="w-5 h-5 rounded-full bg-indigo-600/40 hover:bg-indigo-600 border border-indigo-400/40 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Rewards store"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Virtual Coins</span>
              <div className="text-lg md:text-xl font-bold text-yellow-300 mt-0.5">
                {stats.virtualCoins}
              </div>
            </div>
          </div>

          {/* Card 3: Study Minutes */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c122c] to-[#12193b] border border-slate-800/80 p-3.5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400 font-medium">Study Minutes</span>
              <div className="text-lg md:text-xl font-bold text-white mt-0.5">
                {stats.studyMinutes} min
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (stats.studyMinutes / 60) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: XP Points */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c122c] to-[#12193b] border border-slate-800/80 p-3.5 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-[11px] text-slate-400 font-medium">XP Points</span>
              <div className="text-sm md:text-base font-bold text-purple-300 mt-0.5">
                {stats.xp} / {stats.xpTarget}
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-400 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (stats.xp / stats.xpTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROW 2: QUICK ACTIONS & TODAY'S MISSIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
        {/* Quick Actions (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
                Quick Actions
              </h2>
            </div>
            <button
              onClick={() => onNavigate('curriculum')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {/* 1. AI Tutor */}
            <button
              onClick={() => onNavigate('ai_tutor')}
              className="group p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0c142c] border border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-950/50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">AI Tutor</span>
                <span className="block text-[10px] text-slate-400">Ask & Learn</span>
              </div>
            </button>

            {/* 2. Quiz Arena */}
            <button
              onClick={() => onNavigate('quiz_arena')}
              className="group p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-[#140e2d] border border-purple-500/20 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-950/50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Quiz Arena</span>
                <span className="block text-[10px] text-slate-400">Test Knowledge</span>
              </div>
            </button>

            {/* 3. Flashcards */}
            <button
              onClick={() => onNavigate('flashcards')}
              className="group p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e211b] border border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-950/50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Flashcards</span>
                <span className="block text-[10px] text-slate-400">Revise Smart</span>
              </div>
            </button>

            {/* 4. PDF Learning */}
            <button
              onClick={() => onNavigate('pdf_learning')}
              className="group p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-[#231219] border border-rose-500/20 hover:border-rose-400/50 hover:shadow-lg hover:shadow-rose-950/50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">PDF Learning</span>
                <span className="block text-[10px] text-slate-400">Study from PDFs</span>
              </div>
            </button>

            {/* 5. Notes */}
            <button
              onClick={() => onNavigate('notes_library')}
              className="group p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-[#221c0f] border border-amber-500/20 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-950/50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                <FileEdit className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Notes</span>
                <span className="block text-[10px] text-slate-400">Take & Organize</span>
              </div>
            </button>

            {/* 6. Focus Timer */}
            <button
              onClick={() => onNavigate('focus_timer')}
              className="group p-3 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e172a] border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-950/50 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Focus Timer</span>
                <span className="block text-[10px] text-slate-400">Stay Focused</span>
              </div>
            </button>
          </div>
        </div>

        {/* Today's Missions (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm md:text-base font-bold text-white tracking-tight">
                Today's Missions
              </h2>
            </div>
            <button
              onClick={() => onNavigate('missions_rewards')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {missions.slice(0, 5).map((m) => {
              const isDone = m.completed || m.current >= m.target;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800/60 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : '🎯'}
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {m.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400">
                          {m.current}/{m.target}
                        </span>
                        {/* Mini bar */}
                        <div className="w-16 bg-slate-800 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-indigo-400 h-1 rounded-full"
                            style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {m.claimed ? (
                    <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-800">
                      Claimed
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => claimMissionReward(m.id)}
                      className="text-[10px] font-bold text-white px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 shadow-sm cursor-pointer animate-pulse"
                    >
                      Claim +{m.xpReward} XP
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                      +{m.xpReward} XP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= ROW 3: QUIZ RESULTS, CHAPTERS, WEAK TOPICS, EXAMS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* 1. Recent Quiz Results */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs md:text-sm font-bold text-white">Recent Quiz Results</h3>
            </div>
            <button
              onClick={() => onNavigate('quiz_arena')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentQuizzes.slice(0, 3).map((q) => {
              const color =
                q.percentage >= 80
                  ? 'border-emerald-500 text-emerald-400'
                  : q.percentage >= 65
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-pink-500 text-pink-400';

              return (
                <div
                  key={q.id}
                  onClick={() => onNavigate('quiz_arena')}
                  className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950 transition-colors cursor-pointer"
                >
                  {/* Circular Score Badge */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 ${color} flex items-center justify-center font-bold text-xs shrink-0 bg-slate-900`}
                  >
                    {q.percentage}%
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-slate-200 truncate">
                      {q.subject} - {q.quizName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {q.percentage}% • {q.score}/{q.totalQuestions} • {q.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Chapter Completion */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs md:text-sm font-bold text-white">Chapter Completion</h3>
            </div>
            <button
              onClick={() => onNavigate('curriculum')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {chapters.slice(0, 4).map((c) => {
              const pct = (c.completedChapters / c.totalChapters) * 100;
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 truncate">{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.completedChapters}/{c.totalChapters}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Weak Topics */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs md:text-sm font-bold text-white">Weak Topics</h3>
            </div>
            <button
              onClick={() => onNavigate('weak_topics')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {weakTopics.slice(0, 3).map((w) => (
              <div
                key={w.id}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div className="overflow-hidden">
                  <span className="block text-xs font-semibold text-slate-200 truncate">
                    {w.topic}
                  </span>
                  <span className="text-[10px] text-slate-400">Accuracy: {w.accuracy}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      w.priority === 'High Priority'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {w.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (onStartSpecificQuiz && weakTopics[0]) {
                onStartSpecificQuiz(weakTopics[0].subject, weakTopics[0].topic);
              } else {
                onNavigate('weak_topics');
              }
            }}
            className="w-full mt-3 py-1.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Play className="w-3 h-3 fill-rose-300" />
            <span>Practise Now</span>
          </button>
        </div>

        {/* 4. Upcoming Exams */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-4 md:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs md:text-sm font-bold text-white">Upcoming Exams</h3>
            </div>
            <button
              onClick={() => onNavigate('study_planner')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {exam ? (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40">
                <span className="text-xs font-bold text-white block">{exam.name}</span>
                <span className="text-[11px] text-indigo-300">{exam.dateStr}</span>

                {/* Countdown Timer Boxes */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-1.5 rounded-xl bg-slate-950 border border-indigo-500/30">
                    <span className="block text-base font-bold text-white font-mono">
                      {countdown.days}
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase">Days</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-950 border border-indigo-500/30">
                    <span className="block text-base font-bold text-white font-mono">
                      {String(countdown.hours).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase">Hours</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-slate-950 border border-indigo-500/30">
                    <span className="block text-base font-bold text-white font-mono">
                      {String(countdown.minutes).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase">Min</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Preparation Progress</span>
                    <span className="font-semibold text-indigo-300">{exam.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${exam.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No exams added yet.
            </div>
          )}
        </div>
      </div>

      {/* ================= ROW 4: BOTTOM COSMIC BANNER (OVERALL STUDY PROGRESS) ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d1433] via-[#101b44] to-[#1d1b4c] border border-indigo-500/30 p-4 md:p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left: Saturn Illustration & Quote */}
        <div className="flex items-center gap-3.5 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-2xl shrink-0">
            🪐
          </div>
          <div>
            <p className="text-xs md:text-sm text-slate-200 italic leading-snug">
              "Education is not just about getting a degree, it's about building a better version of yourself."
            </p>
            <span className="block text-[11px] text-indigo-400 font-bold mt-1 tracking-wide">
              — MOON AI
            </span>
          </div>
        </div>

        {/* Center: Overall Completion Progress */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-center">
          <div className="relative w-14 h-14 rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-cyan-400 flex items-center justify-center font-bold text-sm text-cyan-300">
            23%
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              Study Progress
            </span>
            <span className="text-sm font-bold text-white block">
              Overall Completion: 5/22 Chapters
            </span>
            <div className="w-48 bg-slate-900 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full w-[23%]" />
            </div>
          </div>
        </div>

        {/* Right: Cute Astronaut with Speech Bubble */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <div className="p-2.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 font-medium shadow-md">
            Small steps every day make big dreams come true. 💖
          </div>
          <div className="text-3xl animate-bounce">
            👨‍🚀
          </div>
        </div>
      </div>
    </div>
  );
};
