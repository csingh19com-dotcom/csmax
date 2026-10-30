import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  GraduationCap,
  Sparkles,
  Settings,
  ShieldCheck,
  LogOut,
  LogIn,
  X,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudent } from '../context/StudentContext';
import { NavigationTab } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenOnboarding: () => void;
  onOpenSettings: (tab?: string) => void;
  onOpenAuth: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSearchQuery?: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onNavigate,
  onOpenOnboarding,
  onOpenSettings,
  onOpenAuth,
  theme,
  onToggleTheme,
  onSearchQuery,
}) => {
  const { currentUser, isGuest, logout } = useAuth();
  const { profile } = useStudent();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchQuery && search.trim()) {
      onSearchQuery(search.trim());
    }
  };

  const isOwner =
    !isGuest &&
    currentUser &&
    (currentUser.email === 'csingh19.com@gmail.com' ||
      currentUser.displayName === 'Chandrashekhar Singh');

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070b18]/90 backdrop-blur-md px-3 sm:px-4 md:px-6 flex items-center justify-between shrink-0 z-30 sticky top-0 transition-colors">
      {/* Left: Brand & Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
          title="Toggle Navigation Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo & Tagline */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-indigo-500/40 shadow-md bg-slate-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/assets/aistudio/IMG_20261030_075419_812ab8ea.jpg"
              alt="MOON AI Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-base tracking-tight text-white">MOON</span>
              <span className="font-extrabold text-base text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:inline mt-0.5">
              Learn • Practice • Grow
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex flex-1 max-w-md mx-6 relative items-center"
      >
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything... (chapters, topics, notes, etc.)"
          className="w-full bg-[#0c1228] border border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-colors shadow-inner"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Right Controls: Theme Pill, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Light/Dark Toggle Pill */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-all cursor-pointer relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 p-3 shadow-2xl z-50 text-xs animate-in fade-in">
              <div className="font-bold text-white mb-2 flex items-center justify-between pb-2 border-b border-slate-800">
                <span>Notifications</span>
                <span className="text-[10px] text-cyan-400 font-mono">1 New</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-1">
                <span className="font-bold text-white block">🎯 Daily Mission Ready</span>
                <p className="text-[11px] text-slate-300">
                  Complete today's focus session to earn +50 XP and virtual coins!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Student Profile Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-[#0c1228] hover:bg-slate-850 border border-slate-800 transition-all cursor-pointer select-none"
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Student Profile"
                className="w-7 h-7 rounded-xl object-cover ring-1 ring-indigo-500/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-900 to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-1 ring-indigo-500/40">
                {profile.name ? profile.name[0].toUpperCase() : 'S'}
              </div>
            )}

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-100 leading-tight truncate max-w-[110px]">
                {profile.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {profile.classLevel} • {profile.board}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-1">
              <div className="p-2.5 border-b border-slate-800">
                <span className="text-xs font-bold text-white block truncate">{profile.name}</span>
                <span className="text-[10px] text-slate-400 block">
                  {isGuest ? 'Guest Session (Local Mode)' : currentUser?.email}
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold block mt-0.5">
                  {profile.classLevel} • {profile.board}
                </span>
              </div>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 cursor-pointer text-left font-medium"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Edit Class & Board</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onOpenSettings('profile');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 cursor-pointer text-left font-medium"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>

              {isOwner && (
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('admin');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-slate-800 cursor-pointer text-left font-semibold"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Owner Admin Panel</span>
                </button>
              )}

              <div className="pt-1 border-t border-slate-800">
                {isGuest ? (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-indigo-400 hover:bg-slate-800 cursor-pointer font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Google</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-slate-800 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
