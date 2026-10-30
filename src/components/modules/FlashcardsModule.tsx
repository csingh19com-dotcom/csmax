import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle2,
  XCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export const FlashcardsModule: React.FC = () => {
  const { flashcards, toggleFlashcardMastered, addFlashcard } = useStudent();

  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New card inputs
  const [newSubject, setNewSubject] = useState('Science');
  const [newTopic, setNewTopic] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const subjects = ['All', ...Array.from(new Set(flashcards.map((f) => f.subject)))];
  const filteredCards =
    activeSubject === 'All'
      ? flashcards
      : flashcards.filter((f) => f.subject === activeSubject);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i + 1 < filteredCards.length ? i + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((i) => (i - 1 >= 0 ? i - 1 : filteredCards.length - 1));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    addFlashcard({
      subject: newSubject,
      topic: newTopic.trim() || 'General',
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    });

    setNewQuestion('');
    setNewAnswer('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Smart Flashcards</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active recall and spaced repetition for formulas, definitions, and facts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Card</span>
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => {
              setActiveSubject(sub);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubject === sub
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Main Flashcard Flip Area */}
      {currentCard ? (
        <div className="max-w-xl mx-auto space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              {currentCard.subject} • {currentCard.topic}
            </span>
          </div>

          {/* Card element with click to flip */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[260px] md:min-h-[300px] rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0e1c26] border border-slate-800 p-6 md:p-8 shadow-2xl flex flex-col justify-between cursor-pointer select-none transition-all hover:border-emerald-500/40 relative group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isFlipped ? 'Answer' : 'Question'}
              </span>
              <span className="text-[11px] text-indigo-400 flex items-center gap-1 group-hover:underline">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap to flip</span>
              </span>
            </div>

            <div className="my-auto py-4 text-center">
              <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
                {isFlipped ? currentCard.answer : currentCard.question}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs">
              <span className="text-[11px] text-slate-500">
                {currentCard.mastered ? 'Status: Mastered ⭐' : 'Status: In Review'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlashcardMastered(currentCard.id);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  currentCard.mastered
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {currentCard.mastered ? 'Mastered' : 'Mark Mastered'}
              </button>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400">
          No flashcards found in this subject. Click "New Card" to create one.
        </div>
      )}

      {/* Modal to create a new card */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create New Flashcard</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Science"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Chemistry"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Question / Prompt</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What is..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Answer / Explanation</label>
                <textarea
                  required
                  rows={2}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="The answer is..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Save Flashcard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
