"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Bot,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface AISummaryProps {
  prompt: string;
  variables?: Record<string, any>;
  wordLimit?: number;
  title?: string;
  className?: string;
  triggerKey?: string;
}

export default function AISummary({
  prompt,
  variables = {},
  wordLimit = 100,
  title = "Summary",
  className = "",
  triggerKey = "",
}: AISummaryProps) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Cache completed summaries
  const summaryCache = useRef<Record<string, string>>({});

  // Track active request
  const abortControllerRef =
    useRef<AbortController | null>(null);

  // Track latest request id
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!triggerKey || !prompt) {
      return;
    }

    if (summaryCache.current[triggerKey]) {
      setSummary(summaryCache.current[triggerKey]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentRequestId = ++requestIdRef.current;

      try {


        const response = await fetch("/api/ai/ai-generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemPrompt: prompt,
            variables: {
              ...variables,
              wordLimit,
            },
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to generate summary");
        }

        const data = await response.json();

        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        const generatedText = data?.text || data?.response || "";
        summaryCache.current[triggerKey] = generatedText;

        setSummary(generatedText);
      } catch (error: any) {
        if (error.name === "AbortError") {
          return;
        }

        console.error(error);

        setSummary(
          "Failed to generate insights. Please try searching again."
        );
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [prompt, wordLimit, triggerKey, JSON.stringify(variables)]);

  const handleCopy = async () => {
    if (!summary || loading) return;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  if (!triggerKey && !summary) {
    return null;
  }

  return (
    <section
      className={`
        ai-summary group relative mt-6 overflow-hidden rounded-2xl border border-slate-200/80
        bg-gradient-to-b from-white to-slate-50/50 p-5 shadow-sm
        transition-all duration-300 hover:border-blue-200/60 hover:shadow-md md:p-6
        ${className}
      `}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-indigo-400/5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-sm">
            <Bot className="h-5 w-5" />

            {loading && (
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-300" />
              </span>
            )}
          </div>

          <div>
            <h2 className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-base font-bold text-transparent md:text-lg">
              {title}
            </h2>

            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles className="h-3 w-3 text-indigo-500 animate-pulse" />
              AI-generated summary
            </p>
          </div>
        </div>

        {!loading && summary && (
          <button
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="relative min-h-[4.5rem]">
        {loading ? (
          <div className="flex flex-col gap-2.5 animate-pulse py-1">
            <div className="h-4 w-full rounded bg-slate-200/80" />
            <div className="h-4 w-[95%] rounded bg-slate-200/80" />
            <div className="h-4 w-[60%] rounded bg-slate-200/80" />
          </div>
        ) : summary.startsWith("Failed") ? (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-sm text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{summary}</p>
          </div>
        ) : (
          <p className="ai-summary-content text-sm text-slate-600 md:text-base md:leading-8">
            {summary}
          </p>
        )}
      </div>
    </section>
  );
}