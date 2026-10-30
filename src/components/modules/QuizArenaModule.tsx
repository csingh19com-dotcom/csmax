import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { QuizQuestion } from '../../types';

interface QuizArenaModuleProps {
  initialSubject?: string;
  initialTopic?: string;
}

const SAMPLE_QUIZZES: Record<string, QuizQuestion[]> = {
  'Quadratic Equations': [
    {
      id: 'q1',
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      question: 'What is the condition for a quadratic equation ax² + bx + c = 0 to have two distinct real roots?',
      options: ['b² - 4ac > 0', 'b² - 4ac = 0', 'b² - 4ac < 0', 'b² + 4ac > 0'],
      correctIndex: 0,
      explanation: 'When the discriminant D = b² - 4ac is strictly greater than 0, the equation yields two distinct real solutions.',
    },
    {
      id: 'q2',
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      question: 'If α and β are the roots of x² - 5x + 6 = 0, what is the value of α + β?',
      options: ['-5', '5', '6', '-6'],
      correctIndex: 1,
      explanation: 'For equation x² - bx + c = 0, sum of roots α + β = -(-5)/1 = 5.',
    },
    {
      id: 'q3',
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      question: 'Find the roots of the equation 2x² - 8 = 0.',
      options: ['x = 4', 'x = ±2', 'x = ±4', 'x = 2'],
      correctIndex: 1,
      explanation: '2x² = 8 => x² = 4 => x = ±2.',
    },
    {
      id: 'q4',
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      question: 'What is the product of the roots for 3x² + 7x - 12 = 0?',
      options: ['-4', '4', '-7/3', '12/3'],
      correctIndex: 0,
      explanation: 'Product of roots α · β = c / a = -12 / 3 = -4.',
    },
  ],
  'Trigonometry': [
    {
      id: 't1',
      subject: 'Mathematics',
      chapter: 'Trigonometry',
      question: 'What is the exact value of sin(30°) + cos(60°)?',
      options: ['1', '√3', '1/2', '0'],
      correctIndex: 0,
      explanation: 'sin(30°) = 1/2 and cos(60°) = 1/2. Their sum is 1/2 + 1/2 = 1.',
    },
    {
      id: 't2',
      subject: 'Mathematics',
      chapter: 'Trigonometry',
      question: 'Simplify the expression: (1 - sin²(θ)) * sec²(θ).',
      options: ['tan²(θ)', 'cos²(θ)', '1', 'sin(θ)'],
      correctIndex: 2,
      explanation: '1 - sin²(θ) = cos²(θ). Since sec²(θ) = 1/cos²(θ), the product is cos²(θ) * (1/cos²(θ)) = 1.',
    },
    {
      id: 't3',
      subject: 'Mathematics',
      chapter: 'Trigonometry',
      question: 'In a right-angled triangle, if tan(A) = 3/4, what is sin(A)?',
      options: ['3/5', '4/5', '5/3', '4/3'],
      correctIndex: 0,
      explanation: 'Opposite = 3, Adjacent = 4, Hypotenuse = √(3² + 4²) = 5. Therefore sin(A) = 3/5.',
    },
  ],
  'Chemical Reactions': [
    {
      id: 'c1',
      subject: 'Science',
      chapter: 'Chemical Reactions',
      question: 'What type of reaction is represented by: 2Mg + O₂ -> 2MgO?',
      options: ['Decomposition reaction', 'Combination reaction', 'Displacement reaction', 'Double displacement'],
      correctIndex: 1,
      explanation: 'Two reactants (Mg and O₂) combine to form a single product (MgO), which defines a combination reaction.',
    },
    {
      id: 'c2',
      subject: 'Science',
      chapter: 'Chemical Reactions',
      question: 'What precipitate forms when aqueous lead nitrate is mixed with potassium iodide?',
      options: ['White precipitate of KNO₃', 'Yellow precipitate of PbI₂', 'Blue precipitate of PbO', 'Red precipitate of KI'],
      correctIndex: 1,
      explanation: 'Lead iodide (PbI₂) precipitates out as a characteristic bright yellow solid.',
    },
    {
      id: 'c3',
      subject: 'Science',
      chapter: 'Chemical Reactions',
      question: 'Rusting of iron is an example of which chemical process?',
      options: ['Reduction only', 'Redox reaction (Corrosion)', 'Endothermic neutralization', 'Physical change'],
      correctIndex: 1,
      explanation: 'Iron is oxidized to Fe²⁺/Fe³⁺ while oxygen is reduced in the presence of moisture, making it a redox corrosion reaction.',
    },
  ],
};

export const QuizArenaModule: React.FC<QuizArenaModuleProps> = ({
  initialSubject,
  initialTopic,
}) => {
  const { recordQuizResult } = useStudent();

  const [selectedTopic, setSelectedTopic] = useState<string>(
    initialTopic && SAMPLE_QUIZZES[initialTopic] ? initialTopic : 'Quadratic Equations'
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const questions = SAMPLE_QUIZZES[selectedTopic] || SAMPLE_QUIZZES['Quadratic Equations'];
  const currentQ = questions[currentIndex];

  // Question timer
  useEffect(() => {
    if (!isPlaying || isAnswerSubmitted || quizFinished) return;
    if (timeLeft <= 0) {
      handleOptionSelect(-1); // timeout
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isAnswerSubmitted, quizFinished, timeLeft]);

  const handleStartQuiz = (topic: string) => {
    setSelectedTopic(topic);
    setIsPlaying(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setTimeLeft(30);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(30);
    } else {
      // Quiz finished
      setQuizFinished(true);
      const total = questions.length;
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);
      const pct = Math.round((finalScore / total) * 100);

      recordQuizResult({
        subject: currentQ.subject,
        quizName: selectedTopic,
        score: finalScore,
        totalQuestions: total,
        percentage: pct,
        date: 'Just now',
        colorClass: pct >= 80 ? 'emerald' : pct >= 60 ? 'cyan' : 'pink',
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Quiz Arena</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test your chapter mastery with timed MCQs, earn XP, and conquer weak areas.
          </p>
        </div>

        {!isPlaying && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Available Topics:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 cursor-pointer focus:outline-none focus:border-indigo-500"
            >
              {Object.keys(SAMPLE_QUIZZES).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {!isPlaying ? (
        /* Quiz Selection Grid */
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Featured Chapter Quizzes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(SAMPLE_QUIZZES).map((topic) => {
              const qList = SAMPLE_QUIZZES[topic];
              return (
                <div
                  key={topic}
                  className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded-md">
                      {qList[0]?.subject}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {topic}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {qList.length} challenging questions with 30s per-question timer.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Reward: +{qList.length * 10} XP
                    </span>
                    <button
                      onClick={() => handleStartQuiz(topic)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <span>Start Quiz</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : quizFinished ? (
        /* Results Screen */
        <div className="max-w-md mx-auto rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 md:p-8 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto text-2xl">
            🏆
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Quiz Completed!</h2>
            <p className="text-xs text-slate-400 mt-1">{selectedTopic}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              {score} / {questions.length}
            </span>
            <span className="block text-xs font-semibold text-slate-300">
              Score: {Math.round((score / questions.length) * 100)}% Accuracy
            </span>
            <div className="flex justify-center gap-3 pt-2 text-xs text-amber-300 font-medium">
              <span>+{score * 10} XP Earned</span>
              <span>•</span>
              <span>+{score * 5} Coins</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleStartQuiz(selectedTopic)}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => setIsPlaying(false)}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to Arena
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Session */
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-5 md:p-7 shadow-2xl space-y-6">
          {/* Progress & Timer bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              Question {currentIndex + 1} of {questions.length}
            </span>

            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-xl">
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              {currentQ.chapter}
            </span>
            <h3 className="text-sm md:text-base font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let style = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';
              if (isAnswerSubmitted) {
                if (isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                style = 'bg-indigo-950/60 border-indigo-500 text-indigo-200';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xs text-slate-400">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/50 text-xs text-indigo-200 space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Explanation</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Bottom Next Button */}
          {isAnswerSubmitted && (
            <div className="pt-2 text-right">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
              >
                {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
