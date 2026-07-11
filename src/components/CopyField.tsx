"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-olive-300 bg-cream-100 px-4 py-3.5 text-left transition-colors hover:border-terracotta-400"
    >
      <span className="font-serif text-lg font-medium text-olive-950">{value}</span>
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-olive-600 group-hover:text-terracotta-600">
        {copied ? (
          <>
            <Check size={14} /> Copied
          </>
        ) : (
          <>
            <Copy size={14} /> Copy
          </>
        )}
      </span>
    </button>
  );
}
