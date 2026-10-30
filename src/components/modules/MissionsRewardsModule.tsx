import React, { useState } from 'react';
import {
  Trophy,
  Coins,
  Star,
  Flame,
  Award,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Lock,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

interface StoreItem {
  id: string;
  name: string;
  category: 'avatar' | 'badge' | 'theme';
  cost: number;
  icon: string;
  unlocked: boolean;
  description: string;
}

const STORE_ITEMS: StoreItem[] = [
  { id: 'av_astro', name: 'Golden Astronaut Avatar', category: 'avatar', cost: 100, icon: '👨‍🚀', unlocked: true, description: 'Exclusive cosmic astronaut helmet.' },
  { id: 'av_saturn', name: 'Saturn Explorer Avatar', category: 'avatar', cost: 200, icon: '🪐', unlocked: false, description: 'Ringed celestial avatar profile.' },
  { id: 'bg_quizmaster', name: 'Master Scholar Badge', category: 'badge', cost: 150, icon: '🎖️', unlocked: false, description: 'Awarded for scoring 90%+ in 5 quizzes.' },
  { id: 'bg_streak', name: 'Flame Master 7-Day', category: 'badge', cost: 300, icon: '🔥', unlocked: false, description: 'Maintain a 7-day study streak.' },
];

export const MissionsRewardsModule: React.FC = () => {
  const { stats, missions, claimMissionReward, addCoins } = useStudent();
  const [items, setItems] = useState<StoreItem[]>(STORE_ITEMS);

  const handlePurchase = (item: StoreItem) => {
    if (item.unlocked || stats.virtualCoins < item.cost) return;
    addCoins(-item.cost);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, unlocked: true } : i))
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Missions & Rewards</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete daily study goals, earn XP, and unlock cosmic badges and rewards.
          </p>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-bold text-xs">
            <Coins className="w-4 h-4" />
            <span>{stats.virtualCoins} Coins</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs">
            <Star className="w-4 h-4 fill-purple-300/30" />
            <span>{stats.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Today's Missions Board */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>🎯 Active Daily Missions</span>
        </h2>

        <div className="space-y-3">
          {missions.map((m) => {
            const isDone = m.completed || m.current >= m.target;
            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : '🎯'}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-bold text-white">{m.title}</span>
                    <span className="text-[11px] text-slate-400">
                      Progress: {m.current} / {m.target} {m.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-semibold text-cyan-300">+{m.xpReward} XP</span>

                  {m.claimed ? (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-[11px] text-slate-500 font-semibold border border-slate-800">
                      Claimed ✓
                    </span>
                  ) : isDone ? (
                    <button
                      onClick={() => claimMissionReward(m.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md animate-pulse cursor-pointer transition-all"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-950 text-[11px] text-slate-500 border border-slate-800">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards & Unlockables Shop */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-6 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-indigo-400" />
          <span>Cosmic Rewards Shop</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div className="text-center space-y-1">
                <span className="text-3xl block">{item.icon}</span>
                <h4 className="text-xs font-bold text-white">{item.name}</h4>
                <p className="text-[10px] text-slate-400">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                <span className="text-xs font-bold text-yellow-300 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>{item.cost}</span>
                </span>

                {item.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-400">Unlocked ✓</span>
                ) : (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={stats.virtualCoins < item.cost}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-[11px] font-semibold cursor-pointer"
                  >
                    Unlock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
