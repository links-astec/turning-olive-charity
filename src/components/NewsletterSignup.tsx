"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

type Status = "idle" | "loading" | "subscribed" | "already" | "error";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus(data.alreadySubscribed ? "already" : "subscribed");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const done = status === "subscribed" || status === "already";

  return (
    <div className="rounded-3xl border border-olive-200/70 bg-cream-50 p-8 shadow-sm sm:p-10">
      <div className="mx-auto max-w-md text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-olive-100 text-olive-700">
          <Mail size={22} />
        </span>
        <h2 className="mt-5 font-serif text-2xl font-medium text-olive-950">
          Stay in the loop
        </h2>
        <p className="mt-3 leading-relaxed text-olive-700">
          Get occasional updates on distribution days, workshops, and stories from the field —
          straight to your inbox.
        </p>

        {done ? (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-olive-100 px-5 py-4 text-sm font-medium text-olive-800">
            <Check size={18} className="shrink-0 text-olive-600" />
            {status === "already"
              ? "You're already on our list — thank you!"
              : "Thanks for subscribing!"}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full flex-1 rounded-full border border-olive-300 bg-cream-100 px-5 py-3 text-sm text-olive-950 outline-none transition-shadow focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/15"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:-translate-y-0.5 hover:bg-terracotta-600 hover:shadow-md disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm font-medium text-terracotta-600">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
