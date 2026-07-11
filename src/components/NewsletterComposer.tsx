"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type Stage = "editing" | "reviewing" | "sending" | "sent" | "error";

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<Stage>("editing");
  const [errorMessage, setErrorMessage] = useState("");

  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const handleConfirmSend = async () => {
    setStage("sending");
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStage("error");
        return;
      }
      setStage("sent");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStage("error");
    }
  };

  if (stage === "sent") {
    return (
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-olive-200 bg-olive-100/70 p-6">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-olive-700" />
        <div>
          <p className="font-serif text-lg font-medium text-olive-950">Newsletter sent!</p>
          <p className="mt-1 text-sm text-olive-700">
            Your update is on its way to {subscriberCount} subscriber
            {subscriberCount === 1 ? "" : "s"}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubject("");
              setMessage("");
              setStage("editing");
            }}
            className="mt-4 text-sm font-semibold text-terracotta-600 hover:text-terracotta-700"
          >
            Write another
          </button>
        </div>
      </div>
    );
  }

  if (stage === "reviewing" || stage === "sending") {
    return (
      <div className="mt-8 rounded-2xl border border-olive-200/70 bg-cream-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-terracotta-600">
          Review before sending
        </p>
        <p className="mt-3 text-sm text-olive-600">Subject</p>
        <p className="font-serif text-lg font-medium text-olive-950">{subject}</p>
        <p className="mt-4 text-sm text-olive-600">Message</p>
        <p className="whitespace-pre-wrap text-olive-800">{message}</p>

        <div className="mt-6 rounded-xl bg-olive-100/70 px-4 py-3 text-sm text-olive-800">
          This will be sent to <strong>{subscriberCount}</strong> subscriber
          {subscriberCount === 1 ? "" : "s"}. This can&rsquo;t be undone.
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleConfirmSend}
            disabled={stage === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-600 disabled:opacity-60"
          >
            <Send size={16} />
            {stage === "sending" ? "Sending…" : "Confirm & Send"}
          </button>
          <button
            type="button"
            onClick={() => setStage("editing")}
            disabled={stage === "sending"}
            className="rounded-full border border-olive-300 px-6 py-3 text-sm font-semibold text-olive-800 transition-colors hover:bg-olive-100 disabled:opacity-60"
          >
            Back to edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-5 rounded-xl bg-olive-100/70 px-4 py-3 text-sm text-olive-800">
        You have <strong>{subscriberCount}</strong> subscriber{subscriberCount === 1 ? "" : "s"}.
      </div>

      <label className="text-sm font-medium text-olive-800" htmlFor="subject">
        Subject
      </label>
      <input
        id="subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="What's this update about?"
        className="mt-2 w-full rounded-xl border border-olive-300 bg-cream-100 px-4 py-3 text-sm text-olive-950 outline-none transition-shadow focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/15"
      />

      <label className="mt-5 block text-sm font-medium text-olive-800" htmlFor="message">
        Message
      </label>
      <textarea
        id="message"
        rows={12}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your update here. Start a new paragraph by leaving a blank line."
        className="mt-2 w-full rounded-xl border border-olive-300 bg-cream-100 px-4 py-3 text-sm leading-relaxed text-olive-950 outline-none transition-shadow focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/15"
      />

      {stage === "error" && (
        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-terracotta-600">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        disabled={!canSend}
        onClick={() => setStage("reviewing")}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:-translate-y-0.5 hover:bg-terracotta-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
      >
        Review & Send
      </button>
    </div>
  );
}
