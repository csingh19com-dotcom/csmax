import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Coffee,
  Brain,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export const FocusTimerModule: React.FC = () => {
  const { addStudyMinutes, incrementMission, addXP, addCoins } = useStudent();

  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Set time when mode changes
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  }, [mode]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        setCompletedSessions((s) => s + 1);
        addStudyMinutes(25);
        addXP(50);
        addCoins(15);
        incrementMission('m1', 1);
        setMode('shortBreak');
      } else {
        setMode('focus');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Focus Timer</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pomodoro focus technique: Deep focus intervals with restorative pauses.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setMode('focus')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="max-w-md mx-auto rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative mb-6">
          {/* Circular Progress Ring */}
          <div className="w-56 h-56 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-500 border-r-indigo-500 transition-all duration-1000 -rotate-90"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(99,102,241,0.5))',
              }}
            />

            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold mt-2 flex items-center gap-1">
                {mode === 'focus' ? (
                  <>
                    <Brain className="w-3.5 h-3.5" />
                    <span>Deep Study</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Break Time</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-950 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Session</span>
              </>
            )}
          </button>
        </div>

        {/* Session Count & Motivation */}
        <div className="mt-8 pt-4 border-t border-slate-800 w-full flex items-center justify-between text-xs text-slate-400">
          <span>Completed Sessions:</span>
          <span className="font-bold text-indigo-300">{completedSessions} 🍅 (+50 XP per focus)</span>
        </div>
      </div>
    </div>
  );
};
