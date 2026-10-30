import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  Play,
  RotateCcw,
} from 'lucide-react';

export const VoiceLearningModule: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiSpeechOutput, setAiSpeechOutput] = useState(
    'Welcome to Moon AI Voice Learning! You can speak your questions or listen to step-by-step audio explanations of formulas and concepts.'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleToggleMic = () => {
    // Check Web Speech API
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: unknown; webkitSpeechRecognition: unknown })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition: unknown; webkitSpeechRecognition: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. You can type or use audio playback.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      // @ts-ignore
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      // @ts-ignore
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        // Automatically ask Gemini
        handleAskVoiceQuery(text);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAskVoiceQuery = async (queryText: string) => {
    try {
      const resp = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          messages: [{ role: 'user', content: `Explain concisely in 2 sentences for audio playback: ${queryText}` }],
          stream: false,
        }),
      });
      const data = await resp.json();
      const answer = data.text || 'Could not process audio query.';
      setAiSpeechOutput(answer);
      handleSpeak(answer);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-indigo-400" />
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Voice Learning & Speech Tutor</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Listen to spoken chapter explanations or speak directly to Moon AI for hands-free study.
        </p>
      </div>

      {/* Voice Assistant Centerpiece */}
      <div className="max-w-md mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        {/* Pulsing Voice Avatar */}
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-600/30 ring-8 ring-rose-500/20 animate-pulse'
                : isSpeaking
                ? 'bg-indigo-600/30 ring-8 ring-indigo-500/20 animate-pulse'
                : 'bg-slate-950 border border-slate-800'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-900 via-indigo-600 to-amber-200 p-[1.5px] shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-3xl">
                {isListening ? '🎙️' : isSpeaking ? '🔊' : '🌙'}
              </div>
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            {isListening ? 'Listening to your question...' : isSpeaking ? 'Speaking explanation...' : 'Ready'}
          </span>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {isListening ? 'Speak now clearly...' : 'Tap the microphone or choose a concept below.'}
          </p>
        </div>

        {/* Audio Content Card */}
        <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed text-left space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-[10px] font-bold uppercase">
            <span>Audio Transcript</span>
            {isSpeaking ? (
              <button onClick={handleStopSpeaking} className="text-rose-400 hover:text-rose-300">
                Stop Audio
              </button>
            ) : (
              <button onClick={() => handleSpeak(aiSpeechOutput)} className="text-indigo-400 hover:text-indigo-300">
                Play Audio
              </button>
            )}
          </div>
          <p>{aiSpeechOutput}</p>
        </div>

        {/* Voice Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMic}
            className={`p-4 rounded-full transition-all cursor-pointer shadow-lg active:scale-95 ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/60'
            }`}
            title="Toggle Voice Input"
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>

        {/* Quick Voice Topics */}
        <div className="pt-2 w-full space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block text-left">
            Quick Audio Explanations:
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {['Explain Pythagoras Theorem', 'Explain Mitosis vs Meiosis', 'What is Ohm’s Law?'].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setTranscript(q);
                  handleAskVoiceQuery(q);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
