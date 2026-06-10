"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles, Bot, AlertCircle, Copy, Check } from "lucide-react";

interface AISummaryProps {
  prompt: string;
  args?: string[];
  wordLimit?: number;
  title?: string;
  className?: string;
  triggerKey?: string;
}

export default function AISummary({
  prompt,
  args = [],
  wordLimit = 100,
  title = "Summary",
  className = "",
  triggerKey = "",
}: AISummaryProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const lastFetchedKey = useRef("");

  useEffect(() => {
    if (!triggerKey || triggerKey === lastFetchedKey.current) {
      // If we already have a summary for this key, make sure loading is false
      if (triggerKey === lastFetchedKey.current && summary) {
        setLoading(false);
      }
      return;
    }

    const generateSummary = async () => {
      try {
        setLoading(true);
        lastFetchedKey.current = triggerKey;

        const finalPrompt = `
${prompt}

Arguments:
${args.join(", ")}

Please keep the response within approximately ${wordLimit} words.
`;

        const response = await fetch("/api/ai-generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: finalPrompt,
          }),
        });

        const data = await response.json();
        setSummary(data.text);
      } catch (error) {
        console.error(error);
        setSummary("Failed to generate insights. Please try searching again.");
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [triggerKey, prompt, args, summary]);

  const handleCopy = async () => {
    if (!summary || loading) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  if (!triggerKey && !summary) return null;

  return (
    <section 
      className={`
        ai-summary group relative mt-6 overflow-hidden rounded-2xl border border-slate-200/80 
        bg-gradient-to-b from-white to-slate-50/50 p-5 shadow-sm 
        transition-all duration-300 hover:border-blue-200/60 hover:shadow-md md:p-6 ${className}
      `}
    >
      {/* Decorative Top Ambient Glow Effect */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl transition-all duration-500 group-hover:bg-blue-400/15 pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-indigo-400/5 blur-2xl pointer-events-none" />

      {/* Header Container */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Animated Icon Ring */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
            <Bot className="h-5 w-5" />
            {loading && (
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-300" />
              </span>
            )}
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-base font-bold tracking-tight text-transparent md:text-lg">
              {title}
            </h2>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" />
              AI-generated climate summary
            </p>
          </div>
        </div>

        {/* Action Button Container */}
        {!loading && summary && (
          <button
            onClick={handleCopy}
            title="Copy insights to clipboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Content Rendering Body Area */}
      <div className="relative min-h-[4.5rem]">
        {loading ? (
          /* Premium Bone Skeleton Pulse Loader */
          <div className="flex flex-col gap-2.5 animate-pulse py-1">
            <div className="h-4 w-full rounded bg-slate-200/80" />
            <div className="h-4 w-[95%] rounded bg-slate-200/80" />
            <div className="h-4 w-[60%] rounded bg-slate-200/80" />
          </div>
        ) : summary.startsWith("Failed") ? (
          /* Error State Feedback Presentation */
          <div className="flex items-center gap-2 rounded-xl bg-rose-50/50 border border-rose-100 p-3.5 text-sm text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="font-medium">{summary}</p>
          </div>
        ) : (
          /* Main Text Typography Wrapper */
          <p className="ai-summary-content text-sm leading-7 text-slate-600/95 font-medium md:text-base md:leading-8 transition-opacity duration-300">
            {summary}
          </p>
        )}
      </div>
    </section>
  );
}
