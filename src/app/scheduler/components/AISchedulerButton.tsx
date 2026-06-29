"use client";

import { useState, useCallback } from "react";
import { useSpeechToText } from "../hooks/useSpeechToText";

interface AISchedulerButtonProps {
  selectedDate: Date;
  onDone?: () => void;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AISchedulerButton({
  selectedDate,
  onDone,
}: AISchedulerButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [pendingConfirm, setPendingConfirm] = useState<any>(null);
  const [showRawResponse, setShowRawResponse] = useState(false);

  const appendSpeechText = useCallback((text: string) => {
    setMessage((prev) => {
      const cleanPrev = prev.trim();
      const cleanText = text.trim();
      if (!cleanPrev) return cleanText;
      return `${cleanPrev} ${cleanText}`;
    });
  }, []);

  const {
    isSupported,
    isListening,
    toggleListening,
    error: speechError,
  } = useSpeechToText({
    onText: appendSpeechText,
  });

  async function runAI(confirm = false) {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/scheduler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          confirm,
          context: {
            selectedDate: formatDate(selectedDate),
          },
        }),
      });

      const json = await res.json();

      if (json.result?.requiresConfirmation) {
        setPendingConfirm(json);
      } else {
        setPendingConfirm(null);
        setResult(json);
        onDone?.();
      }
    } catch (error) {
      setResult({
        success: false,
        message: "AI scheduler action failed.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dynamic-transition"
      >
        AI Scheduler
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-end sm:justify-end sm:p-6">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 shadow-2xl transition-all border border-gray-100">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">AI Scheduler</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Input Field */}
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: Create a daily standup from 9 to 9:30 starting today until next Friday"
                className="h-28 w-full resize-none rounded-xl border border-gray-200 p-3 pr-12 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {isSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white transition-all focus:outline-none ${
                    isListening ? "bg-red-500 hover:bg-red-600 ring-4 ring-red-100" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice typing"}
                >
                  {isListening ? (
                    <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"></path>
                      <path d="M17 11a6.9 6.9 0 0 1-2.12 4.88M12 19v3"></path>
                      <path d="M5 10a7 7 0 0 0 3.92 6.26"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v1a7 7 0 0 1-14 0v-1"></path>
                      <line x1="12" y1="19" x2="12" y2="22"></line>
                    </svg>
                  )}
                </button>
              )}
            </div>

            {speechError && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {speechError}
              </p>
            )}

            {/* Action Bar */}
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMessage("")}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none"
              >
                Clear
              </button>

              <button
                type="button"
                disabled={loading || !message.trim()}
                onClick={() => runAI(false)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none focus:outline-none"
              >
                {loading ? "Running..." : "Run"}
              </button>
            </div>

            {/* Confirmation Alert */}
            {pendingConfirm && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm shadow-sm">
                <p className="font-semibold text-amber-800">
                  Confirmation needed
                </p>
                <p className="mt-1 text-amber-700">
                  {pendingConfirm.result?.message}
                </p>
                <button
                  type="button"
                  onClick={() => runAI(true)}
                  className="mt-3 w-full rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none"
                >
                  Confirm Action
                </button>
              </div>
            )}

            {/* Interactive Response View */}
            {result && (
              <div className="mt-4 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRawResponse((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <span>{showRawResponse ? "Hide" : "Show"} API Server Result</span>
                  <span className="text-gray-400">{showRawResponse ? "▲" : "▼"}</span>
                </button>
                
                {showRawResponse && (
                  <pre className="mt-2 max-h-44 overflow-y-auto rounded-xl bg-slate-900 p-3 text-left font-mono text-[11px] leading-relaxed text-emerald-400 shadow-inner">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
