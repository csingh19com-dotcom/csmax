import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Eye,
  Info,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface DiagramTopic {
  id: string;
  title: string;
  subject: string;
  description: string;
  steps: Array<{ step: number; title: string; detail: string }>;
  diagramSvg: React.ReactNode;
}

const VISUAL_TOPICS: DiagramTopic[] = [
  {
    id: 'photo',
    title: 'Photosynthesis & Solar Energy Conversion',
    subject: 'Biology',
    description: 'How green plants convert photon energy and carbon dioxide into chemical glucose.',
    steps: [
      { step: 1, title: 'Light Absorption', detail: 'Chlorophyll pigments in thylakoids capture blue and red sunlight photons.' },
      { step: 2, title: 'Photolysis of Water', detail: 'H2O molecules are split into H+ protons, free electrons, and oxygen gas (O2).' },
      { step: 3, title: 'ATP & NADPH Generation', detail: 'Electron transport chain generates high-energy chemical ATP and NADPH.' },
      { step: 4, title: 'Calvin Cycle (Stroma)', detail: 'CO2 is fixed using Rubisco enzyme into 3-carbon sugars and ultimately glucose.' },
    ],
    diagramSvg: (
      <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="flex items-center justify-around w-full max-w-md">
          <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <span className="text-2xl block">☀️</span>
            <span className="text-[10px] font-bold">Sunlight</span>
          </div>
          <div className="text-xl text-slate-500">➔</div>
          <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
            <span className="text-2xl block">🌿</span>
            <span className="text-[10px] font-bold">Chloroplast</span>
          </div>
          <div className="text-xl text-slate-500">➔</div>
          <div className="text-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <span className="text-2xl block">🍬</span>
            <span className="text-[10px] font-bold">Glucose + O₂</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'trig',
    title: 'Right-Angled Trigonometric Ratios',
    subject: 'Mathematics',
    description: 'Visual relationship between hypotenuse, perpendicular (opposite), and base (adjacent).',
    steps: [
      { step: 1, title: 'Sine (sin θ)', detail: 'Ratio of Opposite side to Hypotenuse side (Opp / Hyp).' },
      { step: 2, title: 'Cosine (cos θ)', detail: 'Ratio of Adjacent side to Hypotenuse side (Adj / Hyp).' },
      { step: 3, title: 'Tangent (tan θ)', detail: 'Ratio of Opposite side to Adjacent side (Opp / Adj = sin θ / cos θ).' },
      { step: 4, title: 'Pythagorean Theorem', detail: 'Hyp² = Opp² + Adj², giving sin²θ + cos²θ = 1.' },
    ],
    diagramSvg: (
      <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
        <svg className="w-56 h-36" viewBox="0 0 200 140">
          <polygon points="30,120 170,120 170,30" fill="rgba(99,102,241,0.15)" stroke="#6366f1" strokeWidth="2.5" />
          <text x="100" y="135" fill="#94a3b8" fontSize="10" textAnchor="middle">Base (Adjacent)</text>
          <text x="180" y="80" fill="#38bdf8" fontSize="10" textAnchor="middle">Opposite</text>
          <text x="90" y="70" fill="#f59e0b" fontSize="10" textAnchor="middle">Hypotenuse</text>
          <circle cx="55" cy="115" r="3" fill="#ec4899" />
          <text x="65" y="113" fill="#ec4899" fontSize="11" fontWeight="bold">θ</text>
        </svg>
      </div>
    ),
  },
  {
    id: 'heart',
    title: 'Double Circulation in the Human Heart',
    subject: 'Biology',
    description: 'Systemic vs Pulmonary circulation ensuring efficient oxygen delivery.',
    steps: [
      { step: 1, title: 'Deoxygenated Return', detail: 'Vena Cava brings deoxygenated blood from body into Right Atrium.' },
      { step: 2, title: 'Pulmonary Pumping', detail: 'Right Ventricle pumps blood via Pulmonary Artery into Lungs for oxygenation.' },
      { step: 3, title: 'Oxygenated Return', detail: 'Pulmonary Veins return fresh oxygenated blood into Left Atrium.' },
      { step: 4, title: 'Systemic Pumping', detail: 'Left Ventricle contracts strongly, sending blood through Aorta to all tissues.' },
    ],
    diagramSvg: (
      <div className="w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center p-4">
        <div className="grid grid-cols-2 gap-4 text-center text-xs">
          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300">
            <span className="text-xl block">💙</span>
            <span className="font-bold block mt-1">Right Heart</span>
            <span className="text-[10px] text-slate-400">Deoxygenated (To Lungs)</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300">
            <span className="text-xl block">❤️</span>
            <span className="font-bold block mt-1">Left Heart</span>
            <span className="text-[10px] text-slate-400">Oxygenated (To Body)</span>
          </div>
        </div>
      </div>
    ),
  },
];

export const VisualLearningModule: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<DiagramTopic>(VISUAL_TOPICS[0]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Visual Concept Maps</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Interactive educational diagrams, concept maps, and step-by-step flowcharts.
        </p>
      </div>

      {/* Topic Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {VISUAL_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTopic.id === topic.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {topic.title}
          </button>
        ))}
      </div>

      {/* Main Diagram Viewer Card */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md">
              {selectedTopic.subject}
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white mt-1.5">
              {selectedTopic.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">{selectedTopic.description}</p>
          </div>
        </div>

        {/* Visual Graphic */}
        {selectedTopic.diagramSvg}

        {/* Step-by-Step Breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Step-by-Step Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedTopic.steps.map((st) => (
              <div
                key={st.step}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {st.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{st.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
