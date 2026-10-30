import React from 'react';
import {
  Home,
  Bot,
  BookOpen,
  Trophy,
  Award,
  Layers,
  Calendar,
  Timer,
  FileText,
  FileEdit,
  Eye,
  Mic,
  AlertTriangle,
  TrendingUp,
  Star,
  Settings,
  ShieldCheck,
  Crown,
  ChevronRight,
  X,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenRewards: () => void;
}

interface NavItem {
  tab: NavigationTab;
  label: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenRewards,
}) => {
  const { currentUser, isGuest } = useAuth();

  const isOwner =
    !isGuest &&
    currentUser &&
    (currentUser.email === 'csingh19.com@gmail.com' ||
      currentUser.displayName === 'Chandrashekhar Singh');

  const navItems: NavItem[] = [
    { tab: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { tab: 'ai_tutor', label: 'AI Tutor', icon: <Bot className="w-4 h-4" /> },
    { tab: 'curriculum', label: 'Curriculum', icon: <BookOpen className="w-4 h-4" /> },
    { tab: 'quiz_arena', label: 'Quiz Arena', icon: <Trophy className="w-4 h-4" /> },
    { tab: 'exam_simulator', label: 'Exam Simulator', icon: <Award className="w-4 h-4" /> },
    { tab: 'flashcards', label: 'Flashcards', icon: <Layers className="w-4 h-4" /> },
    { tab: 'study_planner', label: 'Study Planner', icon: <Calendar className="w-4 h-4" /> },
    { tab: 'focus_timer', label: 'Focus Timer', icon: <Timer className="w-4 h-4" /> },
    { tab: 'pdf_learning', label: 'PDF Learning', icon: <FileText className="w-4 h-4" /> },
    { tab: 'notes_library', label: 'Notes Library', icon: <FileEdit className="w-4 h-4" /> },
    { tab: 'visual_learning', label: 'Visual Learning', icon: <Eye className="w-4 h-4" /> },
    { tab: 'voice_learning', label: 'Voice Learning', icon: <Mic className="w-4 h-4" /> },
    { tab: 'weak_topics', label: 'Weak Topics', icon: <AlertTriangle className="w-4 h-4" /> },
    { tab: 'progress_analytics', label: 'Progress Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { tab: 'missions_rewards', label: 'Missions & Rewards', icon: <Star className="w-4 h-4" /> },
    { tab: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (isOwner) {
    navItems.push({
      tab: 'admin',
      label: 'Admin Panel',
      icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#070b18] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'
        }`}
      >
        {/* Top Header on mobile */}
        <div className="p-3 md:hidden flex items-center justify-between border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Navigation</span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-950/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <span
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Level Up Card matching reference dashboard */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070b18] shrink-0">
          <div className="rounded-2xl bg-gradient-to-br from-[#12163b] to-[#1c184c] border border-indigo-500/30 p-3.5 space-y-2.5 shadow-xl relative overflow-hidden group">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                <Crown className="w-4 h-4 fill-amber-300" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">
                Level Up Your Journey
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">
              Complete missions, earn XP and unlock rewards!
            </p>

            <button
              onClick={() => {
                onOpenRewards();
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-all shadow-md cursor-pointer flex items-center justify-center gap-1 active:scale-95"
            >
              <span>View Rewards</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-500">
              Created by <strong className="text-slate-400">Chandrashekhar Singh</strong>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
