"use client";

import { useState } from "react";

interface AISchedulerButtonProps {
  selectedDate: Date;
  onDone?: () => void;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function AISchedulerButton({
  selectedDate,
  onDone,
}: AISchedulerButtonProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [result, setResult] =
    useState<any>(null);
  const [pendingConfirm, setPendingConfirm] =
    useState<any>(null);

  async function runAI(confirm = false) {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "/api/ai/scheduler",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
            confirm,
            context: {
              selectedDate:
                formatDate(selectedDate),
            },
          }),
        }
      );

      const json = await res.json();

      if (
        json.result?.requiresConfirmation
      ) {
        setPendingConfirm(json);
      } else {
        setPendingConfirm(null);
        setResult(json);
        onDone?.();
      }
    } catch (error) {
      setResult({
        success: false,
        message:
          "AI scheduler action failed.",
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
        className="fixed bottom-6 right-6 z-40 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700"
      >
        AI Scheduler
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 p-6">
          <div className="w-[420px] rounded-xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                AI Scheduler
              </h2>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded p-2 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Example: Create a daily standup from 9 to 9:30 starting today until next Friday"
              className="h-28 w-full resize-none rounded-lg border p-3 text-sm"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setMessage("")
                }
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Clear
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => runAI(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {loading
                  ? "Running..."
                  : "Run"}
              </button>
            </div>

            {pendingConfirm && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <p className="font-medium text-amber-800">
                  Confirmation needed
                </p>

                <p className="mt-1 text-amber-700">
                  {
                    pendingConfirm.result
                      ?.message
                  }
                </p>

                <button
                  type="button"
                  onClick={() => runAI(true)}
                  className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Confirm Action
                </button>
              </div>
            )}

            {result && (
              <pre className="mt-4 max-h-52 overflow-auto rounded-lg bg-slate-100 p-3 text-xs">
                {JSON.stringify(
                  result,
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
}