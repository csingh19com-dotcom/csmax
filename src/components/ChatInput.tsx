import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Attachment } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  isStreaming: boolean;
  onStopGeneration: () => void;
  currentModelName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
  onStopGeneration,
  currentModelName,
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStreaming) {
      onStopGeneration();
      return;
    }

    const trimmed = input.trim();
    if (!trimmed && attachments.length === 0) return;

    onSendMessage(trimmed, attachments);
    setInput('');
    setAttachments([]);
    setFileError(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFileError(null);
    const newAttachments: Attachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Limit size to 5MB
      if (file.size > 5 * 1024 * 1024) {
        setFileError(`File "${file.name}" exceeds the 5MB limit.`);
        continue;
      }

      const id = `att_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

      if (file.type.startsWith('image/')) {
        try {
          const base64 = await readFileAsBase64(file);
          newAttachments.push({
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            base64,
          });
        } catch {
          setFileError(`Failed to read image file "${file.name}".`);
        }
      } else {
        // Read as text
        try {
          const text = await readFileAsText(file);
          newAttachments.push({
            id,
            name: file.name,
            size: file.size,
            type: file.type || 'text/plain',
            content: text,
          });
        } catch {
          setFileError(`Could not read text from "${file.name}".`);
        }
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 md:px-4 pb-3 pt-1 shrink-0">
      {/* File error notice */}
      {fileError && (
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{fileError}</span>
          </div>
          <button
            onClick={() => setFileError(null)}
            className="text-rose-400 hover:text-rose-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-2 mb-2 overflow-x-auto py-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 shrink-0 shadow-sm"
            >
              {att.type.startsWith('image/') ? (
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span className="truncate max-w-[120px] font-medium">{att.name}</span>
              <span className="text-[10px] text-slate-500">
                ({Math.round(att.size / 1024)} KB)
              </span>
              <button
                onClick={() => removeAttachment(att.id)}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-md transition-colors"
                title="Remove attachment"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box */}
      <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-indigo-500/70 shadow-xl transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message Moon AI (${currentModelName})...`}
          rows={1}
          className="w-full bg-transparent px-4 pt-3.5 pb-12 text-sm md:text-base text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-48 leading-relaxed"
        />

        {/* Action buttons inside textarea */}
        <div className="absolute left-3 bottom-2.5 flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".txt,.md,.json,.js,.ts,.tsx,.jsx,.py,.html,.css,.csv,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Attach file or image (txt, md, json, py, js, csv, img)"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Enter to send • Shift+Enter for new line
          </span>
        </div>

        <div className="absolute right-3 bottom-2.5 flex items-center gap-2">
          {isStreaming ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition-all cursor-pointer active:scale-95 animate-pulse"
              title="Stop generation"
            >
              <Square className="w-3 h-3 fill-white" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!input.trim() && attachments.length === 0}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                input.trim() || attachments.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-1.5 text-center">
        <p className="text-[11px] text-slate-400">
          Moon AI may produce inaccurate information. Verify crucial facts.
        </p>
      </div>
    </div>
  );
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
