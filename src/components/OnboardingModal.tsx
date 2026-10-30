import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  BookOpen,
  Sparkles,
  Check,
  ChevronRight,
  ArrowRight,
  Target,
  Languages,
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4',
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10', 'Class 11', 'Class 12',
];

const BOARDS = [
  { id: 'CBSE', name: 'CBSE (Central Board)' },
  { id: 'ICSE', name: 'ICSE / ISC' },
  { id: 'State Board', name: 'State Board' },
  { id: 'IB', name: 'IB (International)' },
  { id: 'Cambridge', name: 'Cambridge (IGCSE)' },
];

const AVAILABLE_SUBJECTS = [
  'Mathematics',
  'Science',
  'Social Science',
  'English',
  'Hindi',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Economics',
  'History',
  'Geography',
];

const GOALS = [
  'Score 95%+ in Board Exams',
  'Prepare for Competitive Exams (JEE / NEET / Olympiads)',
  'Build Strong Conceptual Fundamentals',
  'Improve Daily Study Consistency & Habits',
  'Overcome Weak Topics with AI Tutor',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, addXP } = useStudent();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [studentName, setStudentName] = useState(profile.name || 'Rohit Kumar');
  const [selectedClass, setSelectedClass] = useState(profile.classLevel || 'Class 10');
  const [selectedBoard, setSelectedBoard] = useState(profile.board || 'CBSE');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    profile.subjects && profile.subjects.length > 0
      ? profile.subjects
      : ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi']
  );
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>(
    profile.learningLanguage || 'English'
  );
  const [goal, setGoal] = useState(profile.academicGoal || 'Score 95%+ in Board Exams');

  if (!isOpen) return null;

  const toggleSubject = (sub: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleFinish = () => {
    updateProfile({
      name: studentName.trim() || 'Student',
      classLevel: selectedClass,
      board: selectedBoard,
      subjects: selectedSubjects.length > 0 ? selectedSubjects : ['Mathematics', 'Science'],
      learningLanguage: language,
      academicGoal: goal,
      onboardingCompleted: true,
    });
    addXP(100);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Student Academic Profile</h2>
              <p className="text-[11px] text-slate-400">Step {step} of 3 • Customize your learning journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 my-4 shrink-0">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-2 space-y-4 pr-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Your Class (1 to 12)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CLASSES.map((cls) => {
                    const isSelected = selectedClass === cls;
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setSelectedClass(cls)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Education Board
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BOARDS.map((b) => {
                    const isSelected = selectedBoard === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBoard(b.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{b.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Select Your Subjects ({selectedSubjects.length} selected)
                  </label>
                  <span className="text-[11px] text-slate-500">Tap to toggle</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_SUBJECTS.map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => toggleSubject(sub)}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate">{sub}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Preferred Learning Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['English', 'Hindi', 'Hinglish'] as const).map((lang) => {
                    const isSelected = language === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Primary Academic Goal
                </label>
                <div className="space-y-2">
                  {GOALS.map((g) => {
                    const isSelected = goal === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGoal(g)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-semibold'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{g}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ready to Launch Your Journey</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {studentName} • {selectedClass} ({selectedBoard}) • {selectedSubjects.length} Subjects
                </p>
                <p className="text-[11px] text-amber-300 font-medium">
                  +100 XP Welcome Bonus upon saving!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 2 | 3)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
