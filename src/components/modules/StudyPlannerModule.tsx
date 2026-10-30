import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';

export const StudyPlannerModule: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask } = useStudent();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Mathematics');
  const [newTaskTime, setNewTaskTime] = useState('5:00 PM');
  const [newTaskDate, setNewTaskDate] = useState('Today');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      date: newTaskDate,
      time: newTaskTime,
      completed: false,
      xpValue: 35,
    });

    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Study Planner & Routine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize daily revision, stay consistent, and earn XP for completed tasks.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Progress Metric */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 font-medium">Daily Task Progress</span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {completedCount} of {tasks.length} Tasks Completed
          </h3>
        </div>
        <div className="w-32 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 rounded-full transition-all"
            style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/40 space-y-3 animate-in fade-in"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Create Schedule Item
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-3">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Solve 10 Trigonometry word problems"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <input
                type="text"
                value={newTaskSubject}
                onChange={(e) => setNewTaskSubject(e.target.value)}
                placeholder="Subject (e.g. Science)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <input
                type="text"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                placeholder="Time (e.g. 5:30 PM)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <input
                type="text"
                value={newTaskDate}
                onChange={(e) => setNewTaskDate(e.target.value)}
                placeholder="Date (e.g. Today)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Add Task (+35 XP)
            </button>
          </div>
        </form>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              task.completed
                ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <button
                onClick={() => toggleTask(task.id)}
                className="text-slate-400 hover:text-emerald-400 cursor-pointer shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <div className="flex flex-col overflow-hidden">
                <span
                  className={`text-xs md:text-sm font-semibold truncate ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                  <span className="font-medium text-indigo-400">{task.subject}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{task.time}</span>
                  </span>
                  <span>•</span>
                  <span>{task.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-md">
                +{task.xpValue} XP
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
