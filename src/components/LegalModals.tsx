import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            {type === 'privacy' ? (
              <Shield className="w-5 h-5 text-indigo-400" />
            ) : (
              <FileText className="w-5 h-5 text-amber-400" />
            )}
            <h3 className="text-base font-bold text-slate-100">
              {type === 'privacy' ? 'Moon AI — Privacy Policy' : 'Moon AI — Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed pr-1">
          {type === 'privacy' ? (
            <>
              <section>
                <h4 className="font-semibold text-slate-100 mb-1">1. Overview</h4>
                <p>
                  Moon AI, created by <strong>Chandrashekhar Singh</strong>, respects your personal privacy. We prioritize free, open, and local alternatives alongside cloud features.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">2. Guest Storage</h4>
                <p>
                  If you use Moon AI without logging in, your chats and prompts are stored strictly in your browser's Local Storage. We never upload your guest history to any cloud server unless you explicitly click "Import Guest Conversations" after logging into a Google account.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">3. Cloud Account History</h4>
                <p>
                  When signed in with Google or Email, your conversations and messages are stored in an isolated Firebase Firestore database protected by zero-trust Attribute-Based Access Control (ABAC) rules. Only your authenticated user ID can read, modify, or delete your data.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">4. AI Processing & Secrets</h4>
                <p>
                  API requests are processed through server-side routes using Google's official Gemini API. Your API keys are kept securely on the server and are never exposed to the client bundle.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">5. Data Deletion</h4>
                <p>
                  When you delete an individual message or an entire chat, it is immediately deleted from the accessible database. When you delete your account, your user record and all associated cloud conversations are wiped permanently.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h4 className="font-semibold text-slate-100 mb-1">1. Acceptance of Terms</h4>
                <p>
                  By accessing or using Moon AI, you agree to these Terms. Moon AI is a demonstration and productivity web app created by Chandrashekhar Singh.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">2. Use of AI Outputs</h4>
                <p>
                  AI model responses are generated probabilistically. Moon AI does not guarantee the accuracy, completeness, or suitability of outputs for medical, legal, or financial decisions.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">3. Acceptable Use</h4>
                <p>
                  You agree not to use Moon AI to generate harmful, illegal, or abusive content, or attempt to compromise server infrastructure.
                </p>
              </section>

              <section>
                <h4 className="font-semibold text-slate-100 mb-1">4. Free-First Commitment</h4>
                <p>
                  Moon AI will not bill you or require paid subscriptions. Usage of external APIs is governed by the respective providers' free-tier limits and terms.
                </p>
              </section>
            </>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
