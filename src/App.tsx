import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider, useStudent } from './context/StudentContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomeDashboard } from './components/HomeDashboard';
import { LoginPage } from './components/LoginPage';
import { OnboardingModal } from './components/OnboardingModal';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';
import { ConfirmModal } from './components/ConfirmModal';
import { LegalModal } from './components/LegalModals';

// Learning Modules
import { QuizArenaModule } from './components/modules/QuizArenaModule';
import { CurriculumModule } from './components/modules/CurriculumModule';
import { FocusTimerModule } from './components/modules/FocusTimerModule';
import { FlashcardsModule } from './components/modules/FlashcardsModule';
import { StudyPlannerModule } from './components/modules/StudyPlannerModule';
import { PdfLearningModule } from './components/modules/PdfLearningModule';
import { ExamSimulatorModule } from './components/modules/ExamSimulatorModule';
import { NotesLibraryModule } from './components/modules/NotesLibraryModule';
import { VisualLearningModule } from './components/modules/VisualLearningModule';
import { VoiceLearningModule } from './components/modules/VoiceLearningModule';
import { WeakTopicsModule } from './components/modules/WeakTopicsModule';
import { ProgressAnalyticsModule } from './components/modules/ProgressAnalyticsModule';
import { MissionsRewardsModule } from './components/modules/MissionsRewardsModule';
import { AdminPanelModule } from './components/modules/AdminPanelModule';

import { ChatStorageService } from './services/chatStorage';
import { Conversation, Message, AIModel, Attachment, UserSettings, NavigationTab } from './types';

const DEFAULT_MODELS: AIModel[] = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google Gemini',
    tier: 'free',
    badge: 'Recommended',
    description: 'Fast, high-quality multimodal reasoning. Best for daily queries and coding.',
    status: 'available',
    speed: 'Ultra-Fast',
    contextWindow: '1M tokens',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    provider: 'Google Gemini',
    tier: 'free',
    badge: 'Lightweight',
    description: 'Cost-optimized, ultra-low latency model for quick questions and summarization.',
    status: 'available',
    speed: 'Instant',
    contextWindow: '1M tokens',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    provider: 'Google Gemini',
    tier: 'paid',
    badge: 'Deep Reasoning',
    description: 'Flagship reasoning and advanced STEM model for complex logic and math.',
    status: 'available',
    speed: 'Deep Thinker',
    contextWindow: '2M tokens',
  },
  {
    id: 'ollama:llama3.2',
    name: 'Ollama: Llama 3.2',
    provider: 'Ollama Local',
    tier: 'local',
    badge: 'Local AI',
    description: 'Runs privately on your machine with zero data leaving your device.',
    status: 'local_check',
    speed: 'Hardware Dependent',
    contextWindow: '128K tokens',
  },
];

const INITIAL_SETTINGS: UserSettings = {
  theme: 'dark',
  defaultModel: 'gemini-3.8-flash',
  systemPrompt: 'You are Moon AI Tutor, an intelligent, empathetic, and exceptionally patient academic guide created by Chandrashekhar Singh. Explain concepts step by step with clarity, helpful examples, and formulas. Format math clearly and offer follow-up questions to check comprehension.',
  ollamaHost: 'http://127.0.0.1:11434',
  streamResponses: true,
};

function MainAppShell() {
  const { currentUser, isGuest, deleteAccount } = useAuth();
  const { profile, incrementMission } = useStudent();

  // Navigation state
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [showLoginPage, setShowLoginPage] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  // App UI State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('moon_ai_theme') as 'dark' | 'light') || 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');

  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: 'terms' | 'privacy' }>({
    isOpen: false,
    type: 'terms',
  });

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Targeted quiz launch state
  const [targetedQuiz, setTargetedQuiz] = useState<{ subject: string; topic: string } | null>(null);

  // AI Tutor / Chat State
  const [availableModels, setAvailableModels] = useState<AIModel[]>(DEFAULT_MODELS);
  const [currentModelId, setCurrentModelId] = useState<string>(() => {
    return localStorage.getItem('moon_ai_selected_model') || 'gemini-3.8-flash';
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    const raw = localStorage.getItem('moon_ai_settings');
    return raw ? { ...INITIAL_SETTINGS, ...JSON.parse(raw) } : INITIAL_SETTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Apply theme class
  useEffect(() => {
    localStorage.setItem('moon_ai_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load models from server
  useEffect(() => {
    fetch('/api/models')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.models && Array.isArray(data.models)) {
          setAvailableModels(data.models);
        }
      })
      .catch((err) => console.warn('Could not fetch models:', err));
  }, []);

  // Load chat conversations
  const loadConversations = useCallback(async () => {
    try {
      const list = await ChatStorageService.getConversations(currentUser?.uid);
      setConversations(list);
    } catch (err) {
      console.warn('Failed to load conversations:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    ChatStorageService.getMessages(activeConversationId, currentUser?.uid)
      .then((loaded) => setMessages(loaded))
      .catch((err) => console.warn('Failed to load messages:', err));
  }, [activeConversationId, currentUser]);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('moon_ai_settings', JSON.stringify(updated));
      return updated;
    });
    if (newSettings.defaultModel) {
      setCurrentModelId(newSettings.defaultModel);
      localStorage.setItem('moon_ai_selected_model', newSettings.defaultModel);
    }
  };

  // AI Tutor Streaming
  const streamAIResponse = async (
    targetConvoId: string,
    historyMessages: Message[],
    assistantMsgId: string,
    modelToUse: string
  ) => {
    setIsStreaming(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const isOllama = modelToUse.startsWith('ollama:');
    const endpoint = isOllama ? '/api/ollama/chat' : '/api/gemini/chat';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: modelToUse,
          messages: historyMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          systemInstruction: settings.systemPrompt || undefined,
          host: isOllama ? settings.ollamaHost : undefined,
          stream: settings.streamResponses,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Readable stream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error);
              if (data.text) {
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: accumulatedText, status: 'streaming' } : m
                  )
                );
              }
              if (data.done) break;
            } catch {
              if (dataStr.includes('error')) throw new Error(dataStr);
            }
          }
        }
      }

      const finalMsg: Message = {
        id: assistantMsgId,
        conversationId: targetConvoId,
        userId: currentUser?.uid,
        role: 'assistant',
        content: accumulatedText || 'No response returned from the model.',
        model: modelToUse,
        createdAt: new Date().toISOString(),
        status: 'complete',
      };

      await ChatStorageService.saveMessage(targetConvoId, finalMsg, currentUser?.uid);
      setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? finalMsg : m)));
      await loadConversations();
      incrementMission('m2', 1);
    } catch (err: unknown) {
      if (!controller.signal.aborted) {
        const errorMsg = err instanceof Error ? err.message : 'Generation failure';
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, status: 'error', error: errorMsg } : m))
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleSendMessage = async (content: string, attachments: Attachment[]) => {
    let convoId = activeConversationId;
    const now = new Date().toISOString();

    if (!convoId) {
      const generatedTitle =
        content.length > 38 ? `${content.substring(0, 38).trim()}...` : content || 'Study Query';
      const newConversation: Conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        userId: currentUser?.uid,
        title: generatedTitle,
        model: currentModelId,
        createdAt: now,
        updatedAt: now,
      };

      await ChatStorageService.createConversation(newConversation, currentUser?.uid);
      convoId = newConversation.id;
      setActiveConversationId(convoId);
      await loadConversations();
    }

    const userMsg: Message = {
      id: `msg_u_${Date.now()}`,
      conversationId: convoId,
      userId: currentUser?.uid,
      role: 'user',
      content,
      attachments,
      createdAt: now,
      status: 'complete',
    };

    await ChatStorageService.saveMessage(convoId, userMsg, currentUser?.uid);

    const assistantMsgId = `msg_a_${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      conversationId: convoId,
      userId: currentUser?.uid,
      role: 'assistant',
      content: '',
      model: currentModelId,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    const updatedHistory = [...messages, userMsg];
    setMessages([...updatedHistory, initialAssistantMsg]);

    await streamAIResponse(convoId, updatedHistory, assistantMsgId, currentModelId);
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleRegenerateResponse = async (assistantMsgId: string) => {
    if (!activeConversationId || isStreaming) return;
    const msgIndex = messages.findIndex((m) => m.id === assistantMsgId);
    if (msgIndex === -1) return;
    const historyUpToTarget = messages.slice(0, msgIndex);
    if (historyUpToTarget.length === 0) return;

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantMsgId ? { ...m, content: '', error: undefined, status: 'sending' } : m
      )
    );
    await streamAIResponse(activeConversationId, historyUpToTarget, assistantMsgId, currentModelId);
  };

  const handleRetryFailedMessage = async (failedMsgId: string) => {
    await handleRegenerateResponse(failedMsgId);
  };

  const handleEditMessage = async (msgId: string, newContent: string) => {
    if (!activeConversationId || isStreaming) return;
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) return;

    await ChatStorageService.updateMessage(activeConversationId, msgId, newContent, undefined, currentUser?.uid);
    const updatedUserMsg = { ...messages[msgIndex], content: newContent };
    const historyUpToEdited = [...messages.slice(0, msgIndex), updatedUserMsg];

    const newAssistantMsgId = `msg_a_${Date.now()}`;
    const placeholderAssistant: Message = {
      id: newAssistantMsgId,
      conversationId: activeConversationId,
      userId: currentUser?.uid,
      role: 'assistant',
      content: '',
      model: currentModelId,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    setMessages([...historyUpToEdited, placeholderAssistant]);
    await streamAIResponse(activeConversationId, historyUpToEdited, newAssistantMsgId, currentModelId);
  };

  const handleDeleteMessage = (msgId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Message',
      message: 'Are you sure you want to permanently delete this message?',
      confirmLabel: 'Delete Message',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        if (!activeConversationId) return;
        await ChatStorageService.deleteMessage(activeConversationId, msgId, currentUser?.uid);
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
      },
    });
  };

  const handleStartSpecificQuiz = (subject: string, topic: string) => {
    setTargetedQuiz({ subject, topic });
    setActiveTab('quiz_arena');
  };

  const handleAskTutorPrompt = (prompt: string) => {
    setActiveTab('ai_tutor');
    setTimeout(() => {
      handleSendMessage(prompt, []);
    }, 100);
  };

  // If user requested login screen specifically
  if (showLoginPage) {
    return (
      <LoginPage
        onSuccess={() => setShowLoginPage(false)}
        onOpenTerms={() => setLegalModal({ isOpen: true, type: 'terms' })}
        onOpenPrivacy={() => setLegalModal({ isOpen: true, type: 'privacy' })}
      />
    );
  }

  return (
    <div
      className={`min-h-screen h-screen flex flex-col overflow-hidden select-none ${
        theme === 'dark' ? 'bg-[#050814] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onOpenSettings={(tab) => {
          setSettingsTab(tab || 'profile');
          setSettingsModalOpen(true);
        }}
        onOpenAuth={() => setShowLoginPage(true)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onSearchQuery={(q) => {
          setActiveTab('ai_tutor');
          handleSendMessage(`Search learning resources and summarize: ${q}`, []);
        }}
      />

      {/* Main Body: Sidebar + Active Module */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'settings') {
              setSettingsModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          onOpenRewards={() => setActiveTab('missions_rewards')}
        />

        {/* Dynamic Main View Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.08),rgba(255,255,255,0))]">
          {activeTab === 'home' && (
            <HomeDashboard
              onNavigate={(tab) => setActiveTab(tab)}
              onStartSpecificQuiz={handleStartSpecificQuiz}
            />
          )}

          {activeTab === 'ai_tutor' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <ChatArea
                messages={messages}
                isStreaming={isStreaming}
                onSendMessage={handleSendMessage}
                onRegenerateResponse={handleRegenerateResponse}
                onDeleteMessage={handleDeleteMessage}
                onEditMessage={handleEditMessage}
                onRetryFailedMessage={handleRetryFailedMessage}
                currentModelName="Gemini 3.8 Flash (AI Tutor)"
              />
              <ChatInput
                onSendMessage={handleSendMessage}
                isStreaming={isStreaming}
                onStopGeneration={handleStopGeneration}
                currentModelName="Gemini 3.8 Flash"
              />
            </div>
          )}

          {activeTab === 'curriculum' && (
            <CurriculumModule
              onNavigate={(tab) => setActiveTab(tab)}
              onAskTutor={handleAskTutorPrompt}
              onStartQuiz={handleStartSpecificQuiz}
            />
          )}

          {activeTab === 'quiz_arena' && (
            <QuizArenaModule
              initialSubject={targetedQuiz?.subject}
              initialTopic={targetedQuiz?.topic}
            />
          )}

          {activeTab === 'exam_simulator' && <ExamSimulatorModule />}
          {activeTab === 'flashcards' && <FlashcardsModule />}
          {activeTab === 'study_planner' && <StudyPlannerModule />}
          {activeTab === 'focus_timer' && <FocusTimerModule />}
          {activeTab === 'pdf_learning' && <PdfLearningModule />}
          {activeTab === 'notes_library' && <NotesLibraryModule />}
          {activeTab === 'visual_learning' && <VisualLearningModule />}
          {activeTab === 'voice_learning' && <VoiceLearningModule />}

          {activeTab === 'weak_topics' && (
            <WeakTopicsModule
              onStartPractice={handleStartSpecificQuiz}
              onAskTutor={handleAskTutorPrompt}
            />
          )}

          {activeTab === 'progress_analytics' && <ProgressAnalyticsModule />}
          {activeTab === 'missions_rewards' && <MissionsRewardsModule />}
          {activeTab === 'admin' && <AdminPanelModule />}
        </main>
      </div>

      {/* Onboarding Academic Profile Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        initialTab={settingsTab}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        availableModels={availableModels}
        onClearAllHistory={async () => {
          await ChatStorageService.clearAllConversations(currentUser?.uid);
          setActiveConversationId(null);
          setMessages([]);
          loadConversations();
        }}
        onOpenAuth={() => {
          setSettingsModalOpen(false);
          setShowLoginPage(true);
        }}
        onRequestDeleteAccount={() => {
          setConfirmModal({
            isOpen: true,
            title: 'Delete Account',
            message: 'Are you sure you want to delete your account? This action cannot be reversed.',
            confirmLabel: 'Delete Account',
            isDestructive: true,
            onConfirm: async () => {
              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
              await deleteAccount();
              setSettingsModalOpen(false);
            },
          });
        }}
      />

      {/* Legal & Terms Modal */}
      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
        type={legalModal.type}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <MainAppShell />
      </StudentProvider>
    </AuthProvider>
  );
}
