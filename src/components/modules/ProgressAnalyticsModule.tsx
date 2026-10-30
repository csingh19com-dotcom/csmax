import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Clock,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export const ProgressAnalyticsModule: React.FC = () => {
  const { stats, recentQuizzes, chapters, profile } = useStudent();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const studyMinutesPerDay = [35, 45, 60, 40, 55, 75, stats.studyMinutes % 90];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Progress Analytics</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Detailed metrics on study duration, quiz accuracy trends, and chapter completion.
        </p>
      </div>

      {/* Top 3 High Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Study Time</span>
          <div className="text-2xl font-bold text-white">{stats.studyMinutes} Minutes</div>
          <span className="text-[11px] text-emerald-400 font-medium">+15% vs previous week</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Average Quiz Accuracy</span>
          <div className="text-2xl font-bold text-cyan-300">
            {recentQuizzes.length > 0
              ? Math.round(
                  recentQuizzes.reduce((acc, q) => acc + q.percentage, 0) / recentQuizzes.length
                )
              : 82}
            %
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Strong conceptual trend</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Current Level</span>
          <div className="text-2xl font-bold text-amber-300">
            Level {profile.level} ({profile.levelTitle})
          </div>
          <span className="text-[11px] text-purple-300 font-medium">
            {stats.xp} / {stats.xpTarget} XP to next level
          </span>
        </div>
      </div>

      {/* Weekly Study Time Bar Chart */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Weekly Study Activity (Minutes per Day)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">This Week</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
          {daysOfWeek.map((day, idx) => {
            const mins = studyMinutesPerDay[idx];
            const heightPct = Math.min(100, (mins / 80) * 100);
            const isToday = idx === 6;

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] text-slate-400 font-mono">{mins}m</span>
                <div className="w-full max-w-[42px] bg-slate-950 rounded-xl h-full flex items-end p-1 border border-slate-800">
                  <div
                    className={`w-full rounded-lg transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                        : 'bg-indigo-600/40 hover:bg-indigo-600/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${isToday ? 'text-cyan-300' : 'text-slate-500'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Completion Grid */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Syllabus Chapter Breakdown</span>
        </h3>

        <div className="space-y-3">
          {chapters.map((ch) => {
            const pct = Math.round((ch.completedChapters / ch.totalChapters) * 100);
            return (
              <div key={ch.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{ch.name}</span>
                  <span className="text-indigo-400 font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
