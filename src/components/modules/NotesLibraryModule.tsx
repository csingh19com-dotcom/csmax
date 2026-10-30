import React, { useState } from 'react';
import {
  FileEdit,
  Plus,
  Search,
  Trash2,
  Edit2,
  BookMarked,
  Tag,
  Save,
  Check,
} from 'lucide-react';
import { useStudent } from '../../context/StudentContext';
import { StudyNote } from '../../types';

export const NotesLibraryModule: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useStudent();

  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New note inputs
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newChapter, setNewChapter] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartEdit = (note: StudyNote) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNote) return;
    updateNote(selectedNote.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
    });
    setSelectedNote((prev) =>
      prev ? { ...prev, title: editTitle.trim(), content: editContent.trim() } : null
    );
    setIsEditing(false);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNote({
      title: newTitle.trim(),
      subject: newSubject,
      chapter: newChapter.trim() || 'General',
      content: newContent.trim(),
      tags: ['Study Notes', newSubject],
    });

    setNewTitle('');
    setNewChapter('');
    setNewContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">Notes Library</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Personal chapter summaries, revision points, and formula sheets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Note</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-[560px]">
        {/* Left: Notes List (4 cols) */}
        <div className="md:col-span-4 rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsEditing(false);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500 text-indigo-100 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      {note.subject}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold truncate text-white">{note.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{note.content.slice(0, 50)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Note Detail / Editor (8 cols) */}
        <div className="md:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between overflow-hidden">
          {selectedNote ? (
            <div className="flex-1 flex flex-col overflow-hidden space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex flex-col">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-slate-950 border border-indigo-500 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-base font-bold text-white">{selectedNote.title}</h2>
                  )}
                  <span className="text-xs text-indigo-400 mt-0.5">
                    {selectedNote.subject} • {selectedNote.chapter}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(selectedNote)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      deleteNote(selectedNote.id);
                      setSelectedNote(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto">
                {isEditing ? (
                  <textarea
                    rows={14}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs md:text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedNote.content}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-xs">
              Select a note on the left or click "Create Note" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-3.5">
            <h3 className="text-base font-bold text-white">Create New Study Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Newton's Three Laws of Motion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Chapter</label>
                  <input
                    type="text"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    placeholder="e.g. Laws of Motion"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content</label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write formulas, summary, key facts..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Save Note (+25 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
