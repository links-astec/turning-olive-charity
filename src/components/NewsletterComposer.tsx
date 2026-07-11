"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Heading as HeadingIcon,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  Bold,
  Italic,
  Link as LinkIcon,
  Eye,
  Pencil,
} from "lucide-react";
import {
  type NewsletterBlock,
  createBlock,
  renderNewsletterHtml,
} from "@/lib/newsletterTemplate";

type Stage = "editing" | "reviewing" | "sending" | "sent" | "error";

function blockHasContent(block: NewsletterBlock): boolean {
  switch (block.type) {
    case "heading":
      return block.text.trim().length > 0;
    case "paragraph":
      return block.html.replace(/<[^>]+>/g, "").trim().length > 0;
    case "image":
      return block.url.trim().length > 0;
    case "button":
      return block.text.trim().length > 0 && block.url.trim().length > 0;
    case "divider":
      return true;
  }
}

function EmailPreviewFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let doc = iframe.contentDocument;
    if (doc && !doc.body) {
      doc.open();
      doc.write(
        "<!doctype html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>body{margin:0;}</style></head><body></body></html>"
      );
      doc.close();
      doc = iframe.contentDocument;
    }
    if (doc?.body) doc.body.innerHTML = html;
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      title="Email preview"
      className="h-full min-h-[420px] w-full rounded-xl border border-olive-200 bg-white"
    />
  );
}

function ToolbarButton({
  onClick,
  children,
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="rounded-md border border-olive-200 bg-cream-50 p-1.5 text-olive-700 transition-colors hover:bg-olive-100 hover:text-olive-950"
    >
      {children}
    </button>
  );
}

function ParagraphEditor({
  html,
  onChange,
}: {
  html: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const isEmpty = html.replace(/<[^>]+>/g, "").trim().length === 0;

  useEffect(() => {
    if (!initialized.current && ref.current) {
      ref.current.innerHTML = html;
      initialized.current = true;
    }
  }, [html]);

  const exec = (command: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, value);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div>
      <div className="mb-1.5 flex gap-1">
        <ToolbarButton label="Bold" onClick={() => exec("bold")}>
          <Bold size={13} />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => exec("italic")}>
          <Italic size={13} />
        </ToolbarButton>
        <ToolbarButton
          label="Add link"
          onClick={() => {
            const url = window.prompt("Link URL (https://...)");
            if (url) exec("createLink", url);
          }}
        >
          <LinkIcon size={13} />
        </ToolbarButton>
      </div>
      <div className="relative">
        {isEmpty && (
          <span className="pointer-events-none absolute left-3 top-2 text-sm text-olive-400">
            Write a paragraph…
          </span>
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          className="min-h-[90px] w-full rounded-lg border border-olive-300 bg-cream-100 px-3 py-2 text-sm leading-relaxed text-olive-950 outline-none transition-shadow focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/15"
        />
      </div>
    </div>
  );
}

function BlockShell({
  label,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  children,
}: {
  label: string;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-olive-200/70 bg-cream-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-olive-500">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            aria-label="Move block up"
            className="rounded-md p-1 text-olive-500 transition-colors hover:bg-olive-100 hover:text-olive-900 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            aria-label="Move block down"
            className="rounded-md p-1 text-olive-500 transition-colors hover:bg-olive-100 hover:text-olive-900 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete block"
            className="rounded-md p-1 text-terracotta-500 transition-colors hover:bg-terracotta-500/10"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-olive-300 bg-cream-100 px-3 py-2 text-sm text-olive-950 outline-none transition-shadow focus:border-terracotta-500 focus:ring-4 focus:ring-terracotta-500/15";

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState<NewsletterBlock[]>(() => [createBlock("paragraph")]);
  const [stage, setStage] = useState<Stage>("editing");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const html = useMemo(
    () => renderNewsletterHtml(subject.trim() || "Your subject line", blocks),
    [subject, blocks]
  );

  const canSend = subject.trim().length > 0 && blocks.some(blockHasContent);

  const updateBlock = (updated: NewsletterBlock) => {
    setBlocks((bs) => bs.map((b) => (b.id === updated.id ? updated : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks((bs) => bs.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, direction: -1 | 1) => {
    setBlocks((bs) => {
      const index = bs.findIndex((b) => b.id === id);
      const swapWith = index + direction;
      if (index === -1 || swapWith < 0 || swapWith >= bs.length) return bs;
      const next = [...bs];
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  };

  const addBlock = (type: NewsletterBlock["type"]) => {
    setBlocks((bs) => [...bs, createBlock(type)]);
  };

  const reset = () => {
    setSubject("");
    setBlocks([createBlock("paragraph")]);
    setStage("editing");
  };

  const handleConfirmSend = async () => {
    setStage("sending");
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, blocks }),
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
            onClick={reset}
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
        <div className="mt-4 rounded-xl border border-olive-200 bg-cream-100 px-4 py-3 text-sm text-olive-800">
          <p>
            <span className="text-olive-500">From:</span> Turning Olive Charity
            &lt;info@turningolive.org&gt;
          </p>
          <p className="mt-1">
            <span className="text-olive-500">Subject:</span> {subject}
          </p>
        </div>
        <div className="mt-4 h-[480px]">
          <EmailPreviewFrame html={html} />
        </div>

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
        className={`mt-2 ${fieldClass}`}
      />

      <div className="mt-6 flex gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mobileTab === "edit"
              ? "bg-olive-800 text-cream-50"
              : "bg-olive-100 text-olive-700 hover:bg-olive-200"
          }`}
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mobileTab === "preview"
              ? "bg-olive-800 text-cream-50"
              : "bg-olive-100 text-olive-700 hover:bg-olive-200"
          }`}
        >
          <Eye size={14} /> Preview
        </button>
      </div>

      <div className="mt-5 lg:grid lg:grid-cols-2 lg:gap-8">
        <div className={mobileTab === "edit" ? "block" : "hidden lg:block"}>
          <div className="space-y-4">
            {blocks.map((block, i) => {
              const shellProps = {
                onDelete: () => deleteBlock(block.id),
                onMoveUp: () => moveBlock(block.id, -1),
                onMoveDown: () => moveBlock(block.id, 1),
                isFirst: i === 0,
                isLast: i === blocks.length - 1,
              };

              if (block.type === "heading") {
                return (
                  <BlockShell key={block.id} label="Heading" {...shellProps}>
                    <input
                      value={block.text}
                      onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                      placeholder="Section heading"
                      className={fieldClass}
                    />
                  </BlockShell>
                );
              }
              if (block.type === "paragraph") {
                return (
                  <BlockShell key={block.id} label="Paragraph" {...shellProps}>
                    <ParagraphEditor
                      html={block.html}
                      onChange={(nextHtml) => updateBlock({ ...block, html: nextHtml })}
                    />
                  </BlockShell>
                );
              }
              if (block.type === "image") {
                return (
                  <BlockShell key={block.id} label="Image" {...shellProps}>
                    <input
                      value={block.url}
                      onChange={(e) => updateBlock({ ...block, url: e.target.value })}
                      placeholder="Image URL (https://...)"
                      className={fieldClass}
                    />
                    <input
                      value={block.alt}
                      onChange={(e) => updateBlock({ ...block, alt: e.target.value })}
                      placeholder="Describe the image (for accessibility)"
                      className={`mt-2 ${fieldClass}`}
                    />
                    {block.url.trim() && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={block.url}
                        alt=""
                        className="mt-3 max-h-32 rounded-lg border border-olive-200 object-cover"
                      />
                    )}
                  </BlockShell>
                );
              }
              if (block.type === "button") {
                return (
                  <BlockShell key={block.id} label="Button" {...shellProps}>
                    <input
                      value={block.text}
                      onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                      placeholder="Button text, e.g. Donate Now"
                      className={fieldClass}
                    />
                    <input
                      value={block.url}
                      onChange={(e) => updateBlock({ ...block, url: e.target.value })}
                      placeholder="Button link (https://...)"
                      className={`mt-2 ${fieldClass}`}
                    />
                  </BlockShell>
                );
              }
              return (
                <BlockShell key={block.id} label="Divider" {...shellProps}>
                  <p className="text-xs text-olive-500">A thin line to separate sections.</p>
                </BlockShell>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addBlock("heading")}
              className="inline-flex items-center gap-1.5 rounded-full border border-olive-300 px-3 py-1.5 text-xs font-semibold text-olive-700 transition-colors hover:bg-olive-100"
            >
              <HeadingIcon size={13} /> Heading
            </button>
            <button
              type="button"
              onClick={() => addBlock("paragraph")}
              className="inline-flex items-center gap-1.5 rounded-full border border-olive-300 px-3 py-1.5 text-xs font-semibold text-olive-700 transition-colors hover:bg-olive-100"
            >
              <Type size={13} /> Paragraph
            </button>
            <button
              type="button"
              onClick={() => addBlock("image")}
              className="inline-flex items-center gap-1.5 rounded-full border border-olive-300 px-3 py-1.5 text-xs font-semibold text-olive-700 transition-colors hover:bg-olive-100"
            >
              <ImageIcon size={13} /> Image
            </button>
            <button
              type="button"
              onClick={() => addBlock("button")}
              className="inline-flex items-center gap-1.5 rounded-full border border-olive-300 px-3 py-1.5 text-xs font-semibold text-olive-700 transition-colors hover:bg-olive-100"
            >
              <MousePointerClick size={13} /> Button
            </button>
            <button
              type="button"
              onClick={() => addBlock("divider")}
              className="inline-flex items-center gap-1.5 rounded-full border border-olive-300 px-3 py-1.5 text-xs font-semibold text-olive-700 transition-colors hover:bg-olive-100"
            >
              <Minus size={13} /> Divider
            </button>
            <span className="inline-flex items-center gap-1 pl-1 text-xs text-olive-400">
              <Plus size={12} /> add a block
            </span>
          </div>

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

        <div className={mobileTab === "preview" ? "mt-6 block lg:mt-0" : "mt-6 hidden lg:mt-0 lg:block"}>
          <div className="lg:sticky lg:top-6">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-olive-500">
              <Eye size={13} /> Live preview
            </p>
            <div className="h-[520px]">
              <EmailPreviewFrame html={html} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
