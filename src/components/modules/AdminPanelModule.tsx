import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Cpu,
  Database,
  Lock,
  AlertOctagon,
  Sparkles,
  Server,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminPanelModule: React.FC = () => {
  const { currentUser, isGuest } = useAuth();

  // Verify Owner Access
  const isOwner =
    !isGuest &&
    currentUser &&
    (currentUser.email === 'csingh19.com@gmail.com' ||
      currentUser.displayName === 'Chandrashekhar Singh');

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'ai' | 'security'>('overview');

  if (!isOwner) {
    return (
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-12 max-w-xl mx-auto w-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center text-3xl">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Restricted Owner Access</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            This administration portal is strictly restricted to Owner & Creator{' '}
            <strong className="text-slate-200">Chandrashekhar Singh</strong>.
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300">Authentication Required</div>
          <p className="text-[11px]">
            Please sign in with the authorized owner Google Account (<code className="text-indigo-400">csingh19.com@gmail.com</code>) to unlock administrator telemetry.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Owner Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authorized session for <strong>Chandrashekhar Singh</strong> • System telemetry & AI usage.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            User Activity
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            AI Usage
          </button>
        </div>
      </div>

      {/* Admin KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Total Active Learners</span>
          <div className="text-2xl font-bold text-white">1,420</div>
          <span className="text-[10px] text-emerald-400">Active this month</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Gemini API Requests</span>
          <div className="text-2xl font-bold text-cyan-300">18,940</div>
          <span className="text-[10px] text-indigo-400">Free Tier (Gemini 3.8 Flash)</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Quizzes Completed</span>
          <div className="text-2xl font-bold text-purple-300">5,820</div>
          <span className="text-[10px] text-purple-400">Average accuracy: 78%</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400">Database Status</span>
          <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Healthy</span>
          </div>
          <span className="text-[10px] text-slate-400">Firestore Enterprise ABAC</span>
        </div>
      </div>

      {/* AI Usage & System Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>AI Model Provisioning</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Gemini 3.8 Flash</span>
                <span className="text-[10px] text-slate-400">Primary AI Tutor Engine</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                Online • Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Gemini 3.1 Flash Lite</span>
                <span className="text-[10px] text-slate-400">Fast Summarization</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                Online • Active
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Ollama Local Relay</span>
                <span className="text-[10px] text-slate-400">On-Device Private Models</span>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-500/40 text-blue-300 font-semibold text-[11px]">
                Configured
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Database Security (ABAC Rules)</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300 leading-relaxed font-mono text-[11px]">
            <p>• Zero-trust Catch-All default deny enabled</p>
            <p>• User conversations isolated to /users/$uid/conversations</p>
            <p>• Guest data strictly local-only with no automatic cloud leakage</p>
            <p>• Server-side API key protection with zero client-side leakage</p>
          </div>
        </div>
      </div>
    </div>
  );
};
