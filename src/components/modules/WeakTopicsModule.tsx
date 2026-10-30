import React, { useState } from 'react';
import {
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Brain,
  Bot,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

interface WeakTopicsModuleProps {
  onStartPractice: (subject: string, topic: string) => void;
  onAskTutor: (prompt: string) => void;
}

export const WeakTopicsModule: React.FC<WeakTopicsModuleProps> = ({
  onStartPractice,
  onAskTutor,
}) => {
  const { weakTopics } = useStudent();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(weakTopics[0]?.topic || null);

  const activeWeak = weakTopics.find((w) => w.topic === selectedTopic) || weakTopics[0];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Weak Topics Diagnostic</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Identified from quiz accuracy and error patterns. Master these to boost your overall percentage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* List of Weak Topics (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Detected Focus Areas
          </h2>

          <div className="space-y-2.5">
            {weakTopics.map((item) => {
              const isSelected = activeWeak?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTopic(item.topic)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500/60 shadow-lg text-rose-100'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {item.subject}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.priority === 'High Priority'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.topic}</h3>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Current Accuracy</span>
                      <span className="font-bold text-rose-400">{item.accuracy}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-rose-500 h-1.5 rounded-full"
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Detail Card (7 cols) */}
        <div className="md:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
          {activeWeak ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {activeWeak.subject} Analysis
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  {activeWeak.topic}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Accuracy: {activeWeak.accuracy}% • Targeted intervention recommended.
                </p>
              </div>

              {/* Common Pitfalls Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Why Students Frequently Lose Marks Here</span>
                </h4>
                <ul className="list-disc ml-4 space-y-1 text-slate-300 leading-relaxed text-[11px]">
                  <li>Confusing fundamental formulas and sign conventions.</li>
                  <li>Skipping intermediate steps in word problems or equation balancing.</li>
                  <li>Inadequate timed practice on multi-step application questions.</li>
                </ul>
              </div>

              {/* Recommended Action Plan */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 text-xs space-y-2">
                <h4 className="font-bold text-indigo-200">Recommended 3-Step Fix:</h4>
                <ol className="list-decimal ml-4 space-y-1 text-slate-300 text-[11px]">
                  <li>Ask AI Tutor to break down key formulas step-by-step.</li>
                  <li>Review 5 dedicated flashcards to lock in definitions.</li>
                  <li>Take a 5-question timed quiz drill to raise accuracy above 80%.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => onStartPractice(activeWeak.subject, activeWeak.topic)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Practice Drill (+50 XP)</span>
                </button>

                <button
                  onClick={() => onAskTutor(`I am struggling with ${activeWeak.topic} in ${activeWeak.subject}. Please explain the fundamental rules, common mistakes to avoid, and 2 solved examples.`)}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No weak topics detected. Great job!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
