import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  Bookmark,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { QuizQuestion } from '../../types';

const MOCK_EXAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 'ex_1',
    subject: 'Mathematics',
    chapter: 'Real Numbers',
    question: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x and y are prime numbers, then HCF(a, b) is:',
    options: ['xy', 'xy²', 'x³y³', 'x²y²'],
    correctIndex: 1,
    explanation: 'HCF is the product of the smallest power of each common prime factor. Min power of x is 1, min power of y is 2. Thus HCF = xy².',
  },
  {
    id: 'ex_2',
    subject: 'Mathematics',
    chapter: 'Polynomials',
    question: 'The zeroes of the quadratic polynomial x² + 99x + 127 are:',
    options: ['Both positive', 'Both negative', 'One positive and one negative', 'Both equal'],
    correctIndex: 1,
    explanation: 'Since sum of roots is -99 (negative) and product is +127 (positive), both roots must be negative.',
  },
  {
    id: 'ex_3',
    subject: 'Science',
    chapter: 'Chemical Reactions',
    question: 'Which of the following gases can be used for storage of fresh sample of an oil for a long time?',
    options: ['Carbon dioxide or oxygen', 'Nitrogen or helium', 'Helium or oxygen', 'Nitrogen or oxygen'],
    correctIndex: 1,
    explanation: 'Helium or nitrogen are unreactive inert gases that prevent oxidation and rancidity of oils.',
  },
  {
    id: 'ex_4',
    subject: 'Science',
    chapter: 'Life Processes',
    question: 'The filtration units of kidneys are called:',
    options: ['Ureter', 'Urethra', 'Neurons', 'Nephrons'],
    correctIndex: 3,
    explanation: 'Nephrons are the structural and functional filtration units of the human kidney.',
  },
  {
    id: 'ex_5',
    subject: 'Social Science',
    chapter: 'Nationalism in India',
    question: 'Why was the Simon Commission boycotted by Indians in 1928?',
    options: [
      'It supported British military expansion',
      'There was no Indian member on the commission',
      'It banned civil protests in Calcutta',
      'It raised import duties on salt',
    ],
    correctIndex: 1,
    explanation: 'The commission did not include a single Indian member, which was seen as a direct insult to India’s self-respect.',
  },
];

export const ExamSimulatorModule: React.FC = () => {
  const { recordQuizResult } = useStudent();

  const [isExamRunning, setIsExamRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isExamRunning && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isExamRunning && !isSubmitted) {
      handleSubmit();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamRunning, isSubmitted, timeLeft]);

  const handleStartExam = () => {
    setIsExamRunning(true);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setTimeLeft(15 * 60);
    setIsSubmitted(false);
  };

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const toggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    MOCK_EXAM_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const total = MOCK_EXAM_QUESTIONS.length;
    const pct = Math.round((correctCount / total) * 100);

    recordQuizResult({
      subject: 'Combined Board Prep',
      quizName: 'Full Mock Exam 1',
      score: correctCount,
      totalQuestions: total,
      percentage: pct,
      date: 'Just now',
      colorClass: pct >= 80 ? 'emerald' : pct >= 60 ? 'cyan' : 'pink',
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate score
  let correctCount = 0;
  if (isSubmitted) {
    MOCK_EXAM_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correctCount++;
    });
  }

  const currentQ = MOCK_EXAM_QUESTIONS[currentIndex];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Full-Length Exam Simulator</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real board exam test conditions with question palettes, review markers, and diagnostics.
          </p>
        </div>

        {isExamRunning && !isSubmitted && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-300 font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} remaining
            </span>
          </div>
        )}
      </div>

      {!isExamRunning ? (
        /* Exam Intro & Rules */
        <div className="max-w-xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-5 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto text-3xl">
            📝
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">Class 10 CBSE Board Simulator</h2>
            <p className="text-xs text-slate-400 mt-1">Standard Comprehensive Mock Test</p>
          </div>

          <div className="text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
            <div className="font-semibold text-white">Exam Guidelines:</div>
            <p>• {MOCK_EXAM_QUESTIONS.length} Questions covering Mathematics, Science, and Social Science.</p>
            <p>• Total Time: 15 minutes. Automatic submission upon timer expiry.</p>
            <p>• Mark questions for review to revisit before submitting.</p>
            <p>• Earn +10 XP per correct response and identify weak chapters.</p>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-indigo-950 cursor-pointer transition-all active:scale-95"
          >
            Start Mock Examination
          </button>
        </div>
      ) : isSubmitted ? (
        /* Results Report */
        <div className="max-w-xl mx-auto rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 md:p-8 space-y-6 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Exam Report & Analysis</h2>
            <p className="text-xs text-slate-400 mt-1">Class 10 Mock Examination</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {correctCount} / {MOCK_EXAM_QUESTIONS.length}
            </span>
            <span className="block text-xs font-semibold text-slate-300">
              Overall Score: {Math.round((correctCount / MOCK_EXAM_QUESTIONS.length) * 100)}%
            </span>
          </div>

          {/* Question Review List */}
          <div className="text-left space-y-2 max-h-60 overflow-y-auto">
            {MOCK_EXAM_QUESTIONS.map((q, idx) => {
              const userAns = answers[idx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Q{idx + 1}. {q.chapter}</span>
                    <span
                      className={`text-[10px] font-bold ${
                        isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isCorrect ? 'Correct (+10 XP)' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setIsExamRunning(false)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Finish & Return
          </button>
        </div>
      ) : (
        /* Active Exam Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Question View (8 cols) */}
          <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {currentQ.subject} • {currentQ.chapter}
              </span>
              <button
                onClick={toggleReview}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  markedForReview[currentIndex]
                    ? 'bg-amber-950/80 border border-amber-500 text-amber-300'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{markedForReview[currentIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h3 className="text-sm md:text-base font-semibold text-white leading-relaxed">
                Q{currentIndex + 1}. {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentIndex] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs md:text-sm font-medium transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-400 shrink-0">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 text-xs font-medium cursor-pointer"
              >
                Previous
              </button>

              {currentIndex + 1 < MOCK_EXAM_QUESTIONS.length ? (
                <button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save & Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  Submit Exam
                </button>
              )}
            </div>
          </div>

          {/* Question Palette (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {MOCK_EXAM_QUESTIONS.map((_, idx) => {
                  const isAnswered = answers[idx] !== undefined;
                  const isMarked = markedForReview[idx];
                  const isCurrent = currentIndex === idx;

                  let bg = 'bg-slate-950 border-slate-800 text-slate-400';
                  if (isCurrent) bg = 'bg-indigo-600 text-white font-bold border-indigo-400';
                  else if (isMarked) bg = 'bg-amber-950/80 border-amber-500 text-amber-300';
                  else if (isAnswered) bg = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-xl border flex items-center justify-center text-xs font-mono transition-all cursor-pointer ${bg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700" />
                  <span>Not Answered</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold text-xs transition-colors cursor-pointer"
            >
              Finish & Submit Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
