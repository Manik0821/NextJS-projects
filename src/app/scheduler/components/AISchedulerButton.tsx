"use client";

import { useState, useCallback } from "react";
import { useSpeechToText } from "../hooks/useSpeechToText";
import './AISchedulerButton.css';

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
    {/* Floating Trigger Button (Hidden on mobile when open to prevent overlap) */}
    {(!open || window.innerWidth >= 640) && (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="scheduler-trigger"
      >
        AI Scheduler
      </button>
    )}

    {open && (
      <div className="fixed inset-0 z-50 scheduler-overlay">
        <div className="scheduler-modal">
          
          {/* Header */}
          <div className="scheduler-header">
            <h2>AI Scheduler</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="close-btn"
            >
              ✕
            </button>
          </div>

          {/* Input Field Container */}
          <div className="relative input-container">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: Create a daily standup from 9 to 9:30 starting today until next Friday"
              className="w-full text-input"
            />

            {isSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-3 top-3 mic-btn ${isListening ? "listening" : ""}`}
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

          {/* Speech Error */}
          {speechError && <p className="error-message">{speechError}</p>}

          {/* Action Bar */}
          <div className="flex justify-end action-bar">
            <button
              type="button"
              onClick={() => setMessage("")}
              className="btn btn-secondary"
            >
              Clear
            </button>

            <button
              type="button"
              disabled={loading || !message.trim()}
              onClick={() => runAI(false)}
              className="btn btn-primary"
            >
              {loading ? "Running..." : "Run"}
            </button>
          </div>

          {/* Confirmation Alert */}
          {pendingConfirm && (
            <div className="confirm-box animate-pulse-subtle">
              <p className="confirm-title">Confirmation needed</p>
              <p className="confirm-msg">{pendingConfirm.result?.message}</p>
              <button
                type="button"
                onClick={() => runAI(true)}
                className="w-full btn btn-warning"
              >
                Confirm Action
              </button>
            </div>
          )}

          {/* Interactive Response View */}
          {result && (
            <div className="response-section">
              <button
                type="button"
                onClick={() => setShowRawResponse((prev) => !prev)}
                className="flex w-full items-center justify-between toggle-raw-btn"
              >
                <span>{showRawResponse ? "Hide" : "Show"} API Server Result</span>
                <span>{showRawResponse ? "▲" : "▼"}</span>
              </button>
              
              {showRawResponse && (
                <pre className="w-full raw-output">
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
