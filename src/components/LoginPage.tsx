import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onOpenTerms,
  onOpenPrivacy,
}) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    resetPassword,
    enterAsGuest,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onSuccess();
      } else if (mode === 'signup') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await signupWithEmail(email, password, name);
        onSuccess();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch {
      // Error is set in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    enterAsGuest();
    onSuccess();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#050814] relative overflow-hidden select-none">
      {/* Background Cosmic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900/80 border border-slate-800/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/60 flex flex-col">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 group">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-500/20 bg-slate-950 p-1 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              <img
                src="/assets/aistudio/IMG_20261030_075419_812ab8ea.jpg"
                alt="MOON AI Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse">
              ★
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>MOON</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              AI
            </span>
          </h1>

          <p className="mt-1 text-xs md:text-sm font-medium text-slate-300">
            Learn Beyond Limits. Reach for the Moon.
          </p>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-400/80 font-mono">
            <span>Created & Owned by</span>
            <span className="font-semibold text-slate-200">Chandrashekhar Singh</span>
          </div>
        </div>

        {/* Tab Switcher: Login / Sign Up */}
        {mode !== 'forgot' && (
          <div className="mt-6 p-1 rounded-2xl bg-slate-950/80 border border-slate-800 flex gap-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearError();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                clearError();
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-950/70 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Password Reset Notice */}
        {resetSent && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Password reset link sent to your email. Check your inbox!</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Student Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Kumar"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      clearError();
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <span>Remember me on this device</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs md:text-sm shadow-lg shadow-indigo-950/60 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : mode === 'login' ? (
              'Log In to MOON AI'
            ) : mode === 'signup' ? (
              'Create Student Account'
            ) : (
              'Send Password Reset Link'
            )}
          </button>
        </form>

        {mode === 'forgot' && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                clearError();
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/80" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-slate-900 px-3 text-slate-500 font-semibold text-[10px]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google & Guest Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs md:text-sm shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleGuestEntry}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-300 font-medium text-xs border border-slate-800/80 transition-all cursor-pointer active:scale-[0.99]"
          >
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span>Continue as Guest (Instant Access)</span>
          </button>
        </div>

        {/* Legal Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800/60 text-center text-[11px] text-slate-500">
          By signing in, you agree to our{' '}
          <button
            type="button"
            onClick={onOpenTerms}
            className="text-slate-400 hover:text-indigo-300 underline cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-slate-400 hover:text-indigo-300 underline cursor-pointer"
          >
            Privacy Policy
          </button>
          .
        </div>
      </div>
    </div>
  );
};
