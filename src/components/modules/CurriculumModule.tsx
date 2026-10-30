import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Bot,
  Layers,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { NavigationTab } from '../../types';

interface CurriculumModuleProps {
  onNavigate: (tab: NavigationTab) => void;
  onAskTutor?: (question: string) => void;
  onStartQuiz?: (subject: string, topic: string) => void;
}

const CURRICULUM_DATA: Record<string, Array<{ id: string; name: string; chaptersCount: number; chapters: string[] }>> = {
  'Mathematics': [
    {
      id: 'm_ch1',
      name: 'Real Numbers',
      chaptersCount: 4,
      chapters: ['Euclid’s Division Lemma', 'Fundamental Theorem of Arithmetic', 'Revisiting Irrational Numbers', 'Decimal Expansions of Rational Numbers'],
    },
    {
      id: 'm_ch2',
      name: 'Polynomials',
      chaptersCount: 3,
      chapters: ['Geometrical Meaning of Zeroes', 'Relationship between Zeroes and Coefficients', 'Division Algorithm for Polynomials'],
    },
    {
      id: 'm_ch3',
      name: 'Pair of Linear Equations in Two Variables',
      chaptersCount: 4,
      chapters: ['Graphical Method of Solution', 'Substitution Method', 'Elimination Method', 'Cross-Multiplication Method'],
    },
    {
      id: 'm_ch4',
      name: 'Quadratic Equations',
      chaptersCount: 4,
      chapters: ['Standard Form of Quadratic Equation', 'Solution by Factorisation', 'Solution by Completing the Square', 'Nature of Roots & Discriminant'],
    },
    {
      id: 'm_ch5',
      name: 'Introduction to Trigonometry',
      chaptersCount: 4,
      chapters: ['Trigonometric Ratios', 'Ratios of Specific Angles (0°, 30°, 45°, 60°, 90°)', 'Complementary Angles', 'Fundamental Trigonometric Identities'],
    },
  ],
  'Science': [
    {
      id: 's_ch1',
      name: 'Chemical Reactions and Equations',
      chaptersCount: 4,
      chapters: ['Chemical Equations & Balancing', 'Types of Chemical Reactions', 'Corrosion & Rancidity', 'Oxidation & Reduction'],
    },
    {
      id: 's_ch2',
      name: 'Acids, Bases and Salts',
      chaptersCount: 4,
      chapters: ['Properties of Acids and Bases', 'pH Scale and Everyday Applications', 'Salts & Bleaching Powder', 'Plaster of Paris & Washing Soda'],
    },
    {
      id: 's_ch3',
      name: 'Life Processes',
      chaptersCount: 4,
      chapters: ['Autotrophic & Heterotrophic Nutrition', 'Human Respiration System', 'Circulatory System & Transportation', 'Excretion in Humans and Plants'],
    },
    {
      id: 's_ch4',
      name: 'Electricity',
      chaptersCount: 4,
      chapters: ['Electric Current and Potential Difference', 'Ohm’s Law & Resistance Factors', 'Resistors in Series and Parallel', 'Heating Effect & Electric Power'],
    },
  ],
  'Social Science': [
    {
      id: 'ss_ch1',
      name: 'Rise of Nationalism in Europe',
      chaptersCount: 4,
      chapters: ['The French Revolution and the Idea of the Nation', 'The Making of Nationalism in Europe', 'The Age of Revolutions: 1830-1848', 'Visualizing the Nation & Imperialism'],
    },
    {
      id: 'ss_ch2',
      name: 'Nationalism in India',
      chaptersCount: 4,
      chapters: ['The First World War, Khilafat and Non-Cooperation', 'Differing Strands within the Movement', 'Towards Civil Disobedience', 'The Sense of Collective Belonging'],
    },
    {
      id: 'ss_ch3',
      name: 'Resources and Development',
      chaptersCount: 3,
      chapters: ['Types and Planning of Resources', 'Land Resources & Utilization in India', 'Soil as a Resource & Soil Erosion'],
    },
  ],
};

export const CurriculumModule: React.FC<CurriculumModuleProps> = ({
  onNavigate,
  onAskTutor,
  onStartQuiz,
}) => {
  const { profile } = useStudent();
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [expandedChapter, setExpandedChapter] = useState<string | null>('m_ch4');

  const subjectUnits = CURRICULUM_DATA[activeSubject] || CURRICULUM_DATA['Mathematics'];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Curriculum & Syllabus</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {profile.classLevel} • {profile.board} Board syllabus, chapter breakdowns, and practice.
          </p>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {Object.keys(CURRICULUM_DATA).map((subj) => (
            <button
              key={subj}
              onClick={() => {
                setActiveSubject(subj);
                setExpandedChapter(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSubject === subj
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters Accordion / List */}
      <div className="space-y-3.5">
        {subjectUnits.map((unit, idx) => {
          const isExpanded = expandedChapter === unit.id;
          return (
            <div
              key={unit.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800/80 overflow-hidden shadow-lg transition-all"
            >
              {/* Unit Header Bar */}
              <div
                onClick={() => setExpandedChapter(isExpanded ? null : unit.id)}
                className="p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/50 flex items-center justify-center font-bold text-xs text-indigo-300">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-white">{unit.name}</h3>
                    <span className="text-[11px] text-slate-400">
                      {unit.chapters.length} core topics covered
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onStartQuiz) onStartQuiz(activeSubject, unit.name);
                      else onNavigate('quiz_arena');
                    }}
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-indigo-300" />
                    <span>Practice Quiz</span>
                  </button>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Sub-topics list */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/60 bg-slate-950/40 space-y-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {unit.chapters.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs font-medium text-slate-200 truncate">
                            {sub}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (onAskTutor) onAskTutor(`Explain ${sub} from ${unit.name} step by step with formulas.`);
                            else onNavigate('ai_tutor');
                          }}
                          className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                          title="Ask AI Tutor about this topic"
                        >
                          <Bot className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (onAskTutor) onAskTutor(`Explain the complete chapter ${unit.name} with key formulas and summary.`);
                        else onNavigate('ai_tutor');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ask AI Tutor Full Summary</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
