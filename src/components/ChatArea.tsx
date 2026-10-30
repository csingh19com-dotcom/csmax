import React, { useState, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Trash2,
  Edit3,
  Sparkles,
  FileText,
  AlertCircle,
  Cpu,
  Compass,
  Code2,
  Lightbulb,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Message, Attachment } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useAuth } from '../context/AuthContext';

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onRegenerateResponse: (assistantMsgId: string) => void;
  onDeleteMessage: (msgId: string) => void;
  onEditMessage: (msgId: string, newContent: string) => void;
  onRetryFailedMessage: (msgId: string) => void;
  currentModelName: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isStreaming,
  onSendMessage,
  onRegenerateResponse,
  onDeleteMessage,
  onEditMessage,
  onRetryFailedMessage,
  currentModelName,
}) => {
  const { currentUser } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Auto-scroll on new message or streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Failed to copy text:', err);
    }
  };

  const handleStartEdit = (msg: Message) => {
    setEditingMsgId(msg.id);
    setEditingContent(msg.content);
  };

  const handleSaveEdit = (msgId: string) => {
    if (editingContent.trim()) {
      onEditMessage(msgId, editingContent.trim());
    }
    setEditingMsgId(null);
  };

  const SUGGESTED_PROMPTS = [
    {
      icon: <Code2 className="w-4 h-4 text-indigo-400" />,
      title: 'TypeScript Architecture',
      prompt: 'Draft a clean, production-grade TypeScript API architecture with dependency injection and error handling.',
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
      title: 'Quantum Computing',
      prompt: 'Explain quantum computing and superposition in simple terms that anyone can understand.',
    },
    {
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      title: 'Local Ollama Setup',
      prompt: 'How do I set up and run Ollama with Llama 3.2 or DeepSeek-R1 locally on my computer?',
    },
    {
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      title: 'Analyze CSV & Python',
      prompt: 'Write a Python script using pandas and matplotlib to clean, analyze, and visualize a sales dataset.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-6">
      {messages.length === 0 ? (
        /* Welcome Screen with Suggested Prompts */
        <div className="max-w-3xl mx-auto py-8 md:py-12 flex flex-col items-center text-center">
          {/* Glowing Lunar Avatar */}
          <div className="relative mb-4">
            <div className="w-16 h-16 md:w-20 md:md:h-20 rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-600 to-amber-200 p-[1.5px] shadow-2xl shadow-indigo-900/40">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                <div className="w-9 h-9 rounded-full border-3 border-indigo-400 border-r-transparent -rotate-45" />
                <Sparkles className="w-4 h-4 text-amber-200 absolute top-2 right-2 animate-pulse" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-200">Moon AI</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
            A free-first, privacy-focused, multi-model AI assistant powered by Google Gemini and optional local Ollama.
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Model: {currentModelName}</span>
            <span>•</span>
            <span>Created by Chandrashekhar Singh</span>
          </div>

          {/* Suggested Prompts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-2xl text-left">
            {SUGGESTED_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(item.prompt, [])}
                className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all text-left group cursor-pointer shadow-sm active:scale-[0.99] flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-indigo-950/60 transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Conversation Messages List */
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isLastAssistant =
              !isUser &&
              index === messages.length - 1 &&
              msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${
                  isUser ? 'justify-end' : 'justify-start'
                } group`}
              >
                {!isUser && (
                  /* Assistant Avatar */
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-900 to-indigo-600 p-[1px] shadow-md shrink-0 mt-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-r-transparent -rotate-45" />
                    </div>
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[88%] md:max-w-[80%] ${
                    isUser ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Message Sender Header */}
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400 px-1">
                    <span className="font-semibold text-slate-400">
                      {isUser ? 'You' : 'Moon AI'}
                    </span>
                    {msg.model && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {msg.model}
                      </span>
                    )}
                    <span className="text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 transition-all shadow-sm ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-xs w-full'
                    }`}
                  >
                    {/* User Attachments display */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className={`flex items-center gap-2 p-2 rounded-xl text-xs ${
                              isUser
                                ? 'bg-indigo-700/60 border border-indigo-500/40 text-indigo-100'
                                : 'bg-slate-950 border border-slate-800 text-slate-300'
                            }`}
                          >
                            {att.type.startsWith('image/') && att.base64 ? (
                              <img
                                src={`data:${att.type};base64,${att.base64}`}
                                alt={att.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-amber-300 shrink-0" />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium truncate max-w-[140px]">
                                {att.name}
                              </span>
                              <span className="text-[10px] opacity-75">
                                {Math.round(att.size / 1024)} KB
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Edit Prompt Mode */}
                    {editingMsgId === msg.id ? (
                      <div className="space-y-2 w-full">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full bg-slate-950 border border-indigo-400 rounded-xl p-3 text-sm text-slate-100 focus:outline-none"
                          rows={3}
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingMsgId(null)}
                            className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(msg.id)}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 shadow-sm"
                          >
                            Save & Resend
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                            {msg.content}
                          </p>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}

                        {/* Streaming cursor */}
                        {isLastAssistant && isStreaming && (
                          <span className="inline-block w-2 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                        )}
                      </>
                    )}

                    {/* Error state */}
                    {msg.error && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold">Generation Error</p>
                          <p className="mt-0.5 opacity-90">{msg.error}</p>
                          <button
                            onClick={() => onRetryFailedMessage(msg.id)}
                            className="mt-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-white font-medium text-xs transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry generation</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Action Toolbar */}
                  <div
                    className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-xs ${
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Copy message content */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-900 transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* User Edit Prompt action */}
                    {isUser && (
                      <button
                        onClick={() => handleStartEdit(msg)}
                        className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-900 transition-colors"
                        title="Edit prompt and resend"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Assistant Regenerate action */}
                    {!isUser && !isStreaming && (
                      <button
                        onClick={() => onRegenerateResponse(msg.id)}
                        className="p-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-900 transition-colors"
                        title="Regenerate response"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete Individual Message */}
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-slate-900 transition-colors"
                      title="Delete this message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isUser && (
                  /* User Avatar */
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="You"
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : currentUser?.displayName ? (
                      currentUser.displayName[0].toUpperCase()
                    ) : (
                      'U'
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
