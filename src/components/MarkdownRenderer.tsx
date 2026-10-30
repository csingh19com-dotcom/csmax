import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-body space-y-3 leading-relaxed break-words text-sm md:text-base">
      {parseMarkdown(content)}
    </div>
  );
};

// Custom lightweight robust Markdown parser designed specifically for AI chatbot responses
function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const elements: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block detection
    if (line.trim().startsWith('```')) {
      const langMatch = line.trim().match(/^```([a-zA-Z0-9_-]*)/);
      const language = langMatch && langMatch[1] ? langMatch[1] : 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const fullCode = codeLines.join('\n');
      elements.push(
        <CodeBlock key={`code-${i}`} language={language} code={fullCode} />
      );
      continue;
    }

    // Markdown Table detection
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const tableLines: string[] = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().length > 0) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={`table-${i}`} rawLines={tableLines} />);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-semibold text-slate-100 mt-4 mb-1">
          {formatInline(line.substring(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-slate-100 mt-4 mb-1 border-b border-slate-700/50 pb-1">
          {formatInline(line.substring(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl font-extrabold text-slate-100 mt-5 mb-2 border-b border-slate-700/50 pb-1">
          {formatInline(line.substring(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-4 border-indigo-500/70 pl-3 py-1 my-2 text-slate-300 italic bg-indigo-950/20 rounded-r"
        >
          {formatInline(line.substring(2))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Unordered List item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <li key={`li-${i}`} className="list-disc ml-5 my-0.5 text-slate-200">
          {formatInline(line.trim().substring(2))}
        </li>
      );
      i++;
      continue;
    }

    // Numbered List item
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      elements.push(
        <li key={`oli-${i}`} className="list-decimal ml-5 my-0.5 text-slate-200">
          {formatInline(numMatch[2])}
        </li>
      );
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} className="my-4 border-slate-700/60" />);
      i++;
      continue;
    }

    // Empty line
    if (line.trim().length === 0) {
      elements.push(<div key={`empty-${i}`} className="h-1.5" />);
      i++;
      continue;
    }

    // Normal paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1.5 leading-relaxed text-slate-200">
        {formatInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

// Inline formatting parser: **bold**, *italic*, `code`, and [link](url)
function formatInline(str: string): React.ReactNode {
  // Regex splitting by bold, italic, inline code, and links
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = str.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={idx} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 text-xs md:text-sm font-mono rounded bg-slate-800 text-indigo-300 border border-slate-700/70"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline hover:text-indigo-300 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

// Code Block Component with Language Pill & Copy Button
const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy code:', err);
    }
  };

  return (
    <div className="my-3 rounded-lg overflow-hidden border border-slate-800 bg-slate-950/90 shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="uppercase tracking-wider font-semibold text-slate-300">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all text-xs cursor-pointer active:scale-95"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs md:text-sm font-mono text-slate-200 leading-relaxed bg-[#0b0f19]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Markdown Table Component
const MarkdownTable: React.FC<{ rawLines: string[] }> = ({ rawLines }) => {
  const parseRow = (line: string) => {
    return line
      .split('|')
      .map((c) => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
  };

  const headers = parseRow(rawLines[0]);
  const rows = rawLines.slice(2).map(parseRow);

  return (
    <div className="my-3 overflow-x-auto border border-slate-800 rounded-lg">
      <table className="min-w-full divide-y divide-slate-800 text-xs md:text-sm">
        <thead className="bg-slate-900/80">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-2 text-left font-semibold text-slate-200 border-r border-slate-800 last:border-r-0"
              >
                {formatInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="px-3 py-2 text-slate-300 border-r border-slate-800/60 last:border-r-0"
                >
                  {formatInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
