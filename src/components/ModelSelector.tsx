import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Sparkles,
  Cpu,
  Zap,
  Check,
  AlertCircle,
  HelpCircle,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import { AIModel } from '../types';

interface ModelSelectorProps {
  currentModelId: string;
  onSelectModel: (modelId: string) => void;
  onOpenSettings: (tab?: string) => void;
  availableModels: AIModel[];
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModelId,
  onSelectModel,
  onOpenSettings,
  availableModels,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    availableModels.find((m) => m.id === currentModelId) || availableModels[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'free':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Free Tier
          </span>
        );
      case 'paid':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Advanced / Paid
          </span>
        );
      case 'local':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Local Ollama
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
            External
          </span>
        );
    }
  };

  const getStatusIndicator = (model: AIModel) => {
    if (model.tier === 'local') {
      return (
        <span className="flex items-center gap-1 text-[11px] text-blue-400 font-medium">
          <HardDrive className="w-3 h-3" />
          <span>Local Device</span>
        </span>
      );
    }
    if (model.status === 'available') {
      return (
        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online</span>
        </span>
      );
    }
    if (model.status === 'requires_key') {
      return (
        <span className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>Config required</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
        <span>Offline</span>
      </span>
    );
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 shadow-sm transition-all text-xs md:text-sm font-medium cursor-pointer group"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          {selectedModel?.tier === 'local' ? (
            <Cpu className="w-4 h-4 text-blue-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
          )}
          <span className="font-semibold text-slate-100">{selectedModel?.name}</span>
          {selectedModel && getTierBadge(selectedModel.tier)}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 md:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select AI Model
            </span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenSettings('ollama');
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Ollama Guide</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto py-1 space-y-1">
            {availableModels.map((model) => {
              const isSelected = model.id === currentModelId;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/50 border border-indigo-700/60 shadow-sm'
                      : 'hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">
                        {model.name}
                      </span>
                      {getTierBadge(model.tier)}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                  </div>

                  <p className="text-xs text-slate-400 leading-snug">
                    {model.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/60 mt-1">
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                      {model.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{model.speed}</span>
                      <span className="text-slate-600">•</span>
                      {getStatusIndicator(model)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 mt-1 border-t border-slate-800 bg-slate-950/50 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Free-First Philosophy:</span>{' '}
              Gemini 3.8 Flash is configured by default for free, ultra-fast responses. Local models run completely offline via Ollama.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
