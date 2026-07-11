"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FounderLetter({
  paragraphs,
  name,
  role,
}: {
  paragraphs: string[];
  name: string;
  role: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [preview, ...rest] = paragraphs;

  return (
    <div>
      <p className="leading-relaxed text-olive-700">{preview}</p>

      <div
        className={`space-y-4 overflow-hidden text-olive-700 transition-all duration-500 ease-in-out ${
          expanded ? "mt-4 max-h-[4000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {rest.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
        <p className="pt-2 font-serif text-olive-900">
          Sincerely,
          <br />
          {name}
          <br />
          <span className="text-sm text-olive-600">{role}</span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
      >
        {expanded ? "Read less" : "Read more"}
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}
