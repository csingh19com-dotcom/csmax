import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Bot,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

export const PdfLearningModule: React.FC = () => {
  const [fileText, setFileText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setSummary(null);
    setKeyPoints([]);
    setGeneratedQuestions([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileText(content);
    };
    reader.onerror = () => {
      setError('Could not read file. Please ensure it is a valid text or markdown document.');
    };
    reader.readAsText(file);
  };

  const handleProcessWithAI = async () => {
    if (!fileText.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const prompt = `Analyze the following student study material. Provide:
1. A concise, clear summary for exam revision.
2. 5 bullet points of key concepts.
3. 3 practice questions with brief answers.

Document Content:
${fileText.slice(0, 6000)}`;

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          messages: [{ role: 'user', content: prompt }],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed. Please verify network or API status.');
      }

      const data = await response.json();
      const output = data.text || '';
      setSummary(output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleNotes = () => {
    setFileName('sample_photosynthesis_notes.txt');
    setFileText(`Photosynthesis in Higher Plants

Photosynthesis is a physio-chemical process by which green plants use light energy to synthesize organic compounds (glucose).
Chemical Equation: 6CO2 + 12H2O -> C6H12O6 + 6H2O + 6O2

Sites of Photosynthesis:
- Chloroplasts contain chlorophyll pigments trapped in thylakoid membranes.
- Grana are responsible for light-dependent reactions generating ATP and NADPH.
- Stroma contains enzymes for light-independent carbon fixation (Calvin Cycle).

Factors Affecting Rate of Photosynthesis (Blackman's Law of Limiting Factors):
1. Light Intensity: Linear at low light, plateaus at high light.
2. Carbon Dioxide Concentration: Major limiting factor.
3. Temperature: Enzymatic dark reactions are temperature-sensitive.
4. Water: Water stress causes stomatal closure reducing CO2 availability.`);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white">PDF & Document Learning</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload text documents or chapter notes. Gemini AI extracts summaries and revision questions.
          </p>
        </div>

        <button
          onClick={loadSampleNotes}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
        >
          Load Sample Notes
        </button>
      </div>

      {/* Upload Zone */}
      <div className="rounded-3xl bg-slate-900 border border-dashed border-slate-700/80 p-6 md:p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">
            {fileName ? `Uploaded: ${fileName}` : 'Upload chapter notes or document'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports .txt, .md, .csv, code files, and documents up to 5MB.
          </p>
        </div>

        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
          <span>Choose Document</span>
          <input
            type="file"
            accept=".txt,.md,.json,.py,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Text Preview & Trigger */}
      {fileText && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Document Preview ({fileText.length} characters)
            </span>
            <pre className="text-xs text-slate-300 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {fileText}
            </pre>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleProcessWithAI}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'Analyzing with Gemini...' : 'Generate AI Summary & Questions'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error notification */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Output Result */}
      {summary && (
        <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 md:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm md:text-base font-bold text-white">
              Gemini AI Summary & Revision Analysis
            </h3>
          </div>

          <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap space-y-2 font-sans">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};
