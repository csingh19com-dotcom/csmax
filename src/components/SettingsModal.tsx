import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Cpu,
  Sliders,
  Database,
  Info,
  LogOut,
  Trash2,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserSettings, AIModel } from '../types';
import { ChatStorageService } from '../services/chatStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  availableModels: AIModel[];
  onClearAllHistory: () => void;
  onOpenAuth: () => void;
  onRequestDeleteAccount: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
  settings,
  onUpdateSettings,
  availableModels,
  onClearAllHistory,
  onOpenAuth,
  onRequestDeleteAccount,
}) => {
  const { currentUser, isGuest, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Ollama local state
  const [ollamaHost, setOllamaHost] = useState(settings.ollamaHost || 'http://127.0.0.1:11434');
  const [checkingOllama, setCheckingOllama] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{
    online: boolean;
    models: Array<{ name: string; size?: number }>;
    message?: string;
  } | null>(null);

  // Import guest data state
  const [hasGuestData, setHasGuestData] = useState(false);
  const [importingGuest, setImportingGuest] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  // Export state
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setHasGuestData(ChatStorageService.hasGuestData());
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const testOllamaConnection = async () => {
    setCheckingOllama(true);
    try {
      const resp = await fetch(`/api/ollama/status?host=${encodeURIComponent(ollamaHost)}`);
      const data = await resp.json();
      setOllamaStatus(data);
    } catch (err: unknown) {
      setOllamaStatus({
        online: false,
        models: [],
        message: err instanceof Error ? err.message : 'Failed to reach Ollama proxy',
      });
    } finally {
      setCheckingOllama(false);
    }
  };

  const handleImportGuestHistory = async () => {
    if (!currentUser || isGuest) return;
    setImportingGuest(true);
    setImportSuccess(null);
    try {
      const count = await ChatStorageService.importGuestData(currentUser.uid, false);
      setImportSuccess(`Successfully imported ${count} conversation(s) to your cloud account!`);
      setHasGuestData(ChatStorageService.hasGuestData());
    } catch (err: unknown) {
      alert('Error importing guest conversations: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setImportingGuest(false);
    }
  };

  const handleExportData = async (format: 'json' | 'markdown') => {
    setExporting(true);
    try {
      const content = await ChatStorageService.exportData(currentUser?.uid, format);
      const blob = new Blob([content], {
        type: format === 'json' ? 'application/json' : 'text/markdown',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moon-ai-chats-${new Date().toISOString().slice(0, 10)}.${format === 'json' ? 'json' : 'md'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Failed to export conversations:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl h-[560px] md:h-[600px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">Settings & Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Tabs & Right Panel */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tab Navigation */}
          <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-slate-800 p-2 md:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 bg-slate-950/60">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              icon={<UserIcon className="w-4 h-4" />}
              label="Account & Profile"
            />
            <TabButton
              active={activeTab === 'ai'}
              onClick={() => setActiveTab('ai')}
              icon={<Sliders className="w-4 h-4" />}
              label="Model & Prompts"
            />
            <TabButton
              active={activeTab === 'ollama'}
              onClick={() => setActiveTab('ollama')}
              icon={<Cpu className="w-4 h-4" />}
              label="Local Ollama AI"
            />
            <TabButton
              active={activeTab === 'data'}
              onClick={() => setActiveTab('data')}
              icon={<Database className="w-4 h-4" />}
              label="Data & Storage"
            />
            <TabButton
              active={activeTab === 'about'}
              onClick={() => setActiveTab('about')}
              icon={<Info className="w-4 h-4" />}
              label="About Moon AI"
            />
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Tab 1: Account & Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 mb-1">
                    User Account
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage your identity and authentication status.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {currentUser?.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/40"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-700/50 flex items-center justify-center font-bold text-lg">
                        {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'G'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">
                        {currentUser?.displayName || (isGuest ? 'Guest User' : 'Authenticated User')}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {isGuest
                          ? 'Not signed in • Local Browser Storage'
                          : currentUser?.email || 'Cloud Account'}
                      </p>
                    </div>
                  </div>

                  {isGuest ? (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuth();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-950 transition-all cursor-pointer"
                    >
                      Sign In
                    </button>
                  ) : (
                    <button
                      onClick={logout}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>

                {/* Import Guest Data Button for Authenticated Users */}
                {!isGuest && (
                  <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-semibold text-indigo-200">
                        Import Guest Conversations
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hasGuestData
                        ? 'You have chats saved locally from your guest session. Would you like to import them into your cloud account?'
                        : 'No pending guest conversations found in this browser.'}
                    </p>

                    {importSuccess && (
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{importSuccess}</span>
                      </p>
                    )}

                    {hasGuestData && (
                      <button
                        onClick={handleImportGuestHistory}
                        disabled={importingGuest}
                        className="mt-2 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        {importingGuest ? 'Importing...' : 'Import to Cloud Account'}
                      </button>
                    )}
                  </div>
                )}

                {/* Danger Zone: Account Deletion */}
                {!isGuest && (
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
                      Danger Zone
                    </h4>
                    <p className="text-xs text-slate-400 mb-3">
                      Permanently delete your account and all associated conversation history from Moon AI.
                    </p>
                    <button
                      onClick={onRequestDeleteAccount}
                      className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span>Delete Moon AI Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Model & Prompts */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 mb-1">
                    AI Model & Persona
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select your preferred default model and personalize instructions.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Default Model
                  </label>
                  <select
                    value={settings.defaultModel}
                    onChange={(e) => onUpdateSettings({ defaultModel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {availableModels.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.provider} - {m.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Custom System Prompt
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Set background instructions for Moon AI across conversations.
                  </p>
                  <textarea
                    rows={4}
                    value={settings.systemPrompt}
                    onChange={(e) => onUpdateSettings({ systemPrompt: e.target.value })}
                    placeholder="e.g. You are a senior software architect with high attention to clean code and testability..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs md:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">
                      Stream AI Responses
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Show real-time tokens as they are generated.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.streamResponses}
                    onChange={(e) => onUpdateSettings({ streamResponses: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Local Ollama AI */}
            {activeTab === 'ollama' && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 mb-1">
                    Ollama Local AI Support
                  </h3>
                  <p className="text-xs text-slate-400">
                    Run open-weight AI models locally on your machine with 100% data privacy.
                  </p>
                </div>

                {/* Host configuration */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ollama Server Host URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ollamaHost}
                      onChange={(e) => {
                        setOllamaHost(e.target.value);
                        onUpdateSettings({ ollamaHost: e.target.value });
                      }}
                      placeholder="http://127.0.0.1:11434"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={testOllamaConnection}
                      disabled={checkingOllama}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${checkingOllama ? 'animate-spin' : ''}`} />
                      <span>{checkingOllama ? 'Checking...' : 'Test Connection'}</span>
                    </button>
                  </div>
                </div>

                {/* Status response */}
                {ollamaStatus && (
                  <div
                    className={`p-3.5 rounded-2xl border text-xs ${
                      ollamaStatus.online
                        ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                        : 'bg-amber-950/40 border-amber-800/50 text-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {ollamaStatus.online ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Connected to Ollama!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          <span>Ollama Not Detected</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                      {ollamaStatus.message}
                    </p>

                    {ollamaStatus.online && ollamaStatus.models?.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-emerald-800/40">
                        <span className="font-semibold text-emerald-200">Installed Models:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {ollamaStatus.models.map((m) => (
                            <span
                              key={m.name}
                              className="px-2 py-0.5 rounded-md bg-emerald-900/60 font-mono text-[10px] text-emerald-200"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step-by-Step Setup Instructions */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>How to run Ollama locally</span>
                  </h4>
                  <ol className="list-decimal ml-4 space-y-2 text-slate-400 leading-relaxed">
                    <li>
                      Download Ollama from{' '}
                      <a
                        href="https://ollama.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 underline"
                      >
                        ollama.com
                      </a>{' '}
                      (available for macOS, Windows, and Linux).
                    </li>
                    <li>
                      Pull any model into Ollama:
                      <code className="block my-1 px-2 py-1 bg-slate-900 rounded font-mono text-slate-200 text-[11px]">
                        ollama run llama3.2
                      </code>
                    </li>
                    <li>
                      To allow web browser apps to communicate with Ollama, enable CORS by running:
                      <code className="block my-1 px-2 py-1 bg-slate-900 rounded font-mono text-indigo-300 text-[11px]">
                        OLLAMA_ORIGINS="*" ollama serve
                      </code>
                    </li>
                    <li>
                      Click "Test Connection" above to verify that Moon AI can connect to your local Ollama server.
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Tab 4: Data & Storage */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 mb-1">
                    Data & Export Controls
                  </h3>
                  <p className="text-xs text-slate-400">
                    Export your conversations or wipe your chat history.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-indigo-400" />
                      <span>Export as JSON</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Download a structured JSON file containing all messages and metadata.
                    </p>
                    <button
                      onClick={() => handleExportData('json')}
                      disabled={exporting}
                      className="mt-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                    >
                      Export JSON
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Export as Markdown</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Download human-readable markdown formatted files for notes.
                    </p>
                    <button
                      onClick={() => handleExportData('markdown')}
                      disabled={exporting}
                      className="mt-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                    >
                      Export Markdown
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Clear All Chat History</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Permanently delete all conversation threads from your current storage (
                    {isGuest ? 'Local browser storage' : 'Cloud Firestore'}). This action cannot be undone.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onClearAllHistory();
                    }}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Clear All Conversations
                  </button>
                </div>
              </div>
            )}

            {/* Tab 5: About Moon AI */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-100 mb-1">
                    About Moon AI
                  </h3>
                  <p className="text-xs text-slate-400">
                    Free-first, multi-model AI chatbot platform.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 via-indigo-600 to-amber-200 p-[1px] flex items-center justify-center">
                      <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-r-transparent -rotate-45" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Moon AI</h4>
                      <p className="text-xs text-indigo-400 font-medium">
                        Created by Chandrashekhar Singh
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Moon AI is engineered to provide a modern, transparent, and private ChatGPT-style chat experience. It integrates Google Gemini via secure server-side routes, supports local on-device LLMs via Ollama, offers true guest exploration with zero forced tracking, and provides Google cloud synchronization with zero-trust Firestore security rules.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-200">Creator</span>
                    <p className="text-slate-400">Chandrashekhar Singh</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-200">Framework</span>
                    <p className="text-slate-400">React 19 + TypeScript + Express</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-200">AI Engine</span>
                    <p className="text-slate-400">@google/genai SDK (Gemini 3.8 Flash)</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-200">Security Model</span>
                    <p className="text-slate-400">Attribute-Based Access Control (ABAC)</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-indigo-300">Free-First Guarantee:</span> Moon AI defaults to eligible free-tier Gemini and local models. No secret charges, no hidden paywalls, and no silent model switching.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap text-left ${
        active
          ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-950'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
