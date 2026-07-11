"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  Heading as HeadingIcon,
  Type,
  Image as ImageIcon,
  MousePointerClick,
  Quote as QuoteIcon,
  Minus,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Palette,
  Eye,
  Pencil,
} from "lucide-react";
import {
  type NewsletterBlock,
  type SpacerSize,
  createBlock,
  renderNewsletterHtml,
  BRAND_COLORS,
  TEXT_COLORS,
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
    case "quote":
      return block.text.trim().length > 0;
    case "spacer":
    case "divider":
      return true;
  }
}

const INSERTABLE: { type: NewsletterBlock["type"]; label: string; icon: React.ReactNode }[] = [
  { type: "heading", label: "Heading", icon: <HeadingIcon size={15} /> },
  { type: "paragraph", label: "Paragraph", icon: <Type size={15} /> },
  { type: "image", label: "Image", icon: <ImageIcon size={15} /> },
  { type: "button", label: "Button", icon: <MousePointerClick size={15} /> },
  { type: "quote", label: "Quote", icon: <QuoteIcon size={15} /> },
  { type: "divider", label: "Divider", icon: <Minus size={15} /> },
  { type: "spacer", label: "Spacer", icon: <MoveVertical size={15} /> },
];

const SPACER_LABELS: { size: SpacerSize; label: string }[] = [
  { size: "small", label: "S" },
  { size: "medium", label: "M" },
  { size: "large", label: "L" },
];

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

function RibbonButton({
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
      title={label}
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-olive-700 transition-colors hover:bg-olive-100 hover:text-olive-950"
    >
      {children}
    </button>
  );
}

function IconBtn({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="rounded p-1 text-olive-500 transition-colors hover:bg-olive-100 hover:text-olive-900 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function ColorSwatchPicker({
  value,
  onChange,
  options,
  allowCustom = true,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  allowCustom?: boolean;
}) {
  const isPreset = options.some((o) => o.value.toLowerCase() === value.toLowerCase());
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          title={opt.label}
          aria-label={opt.label}
          onClick={() => onChange(opt.value)}
          className={`h-6 w-6 shrink-0 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${
            value.toLowerCase() === opt.value.toLowerCase() ? "border-terracotta-500 scale-110" : "border-white"
          }`}
          style={{ backgroundColor: opt.value }}
        />
      ))}
      {allowCustom && (
        <input
          type="color"
          value={/^#([0-9a-f]{6})$/i.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          title="Custom color"
          aria-label="Custom color"
          className={`h-6 w-6 shrink-0 cursor-pointer rounded-full border-2 shadow-sm ${
            !isPreset ? "border-terracotta-500" : "border-white"
          }`}
        />
      )}
    </div>
  );
}

function ColorPopoverButton({
  label,
  value,
  onChange,
  options,
  allowCustom = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  allowCustom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        title={label}
        aria-label={label}
        className="flex items-center gap-0.5 rounded p-1 text-olive-500 transition-colors hover:bg-olive-100 hover:text-olive-900"
      >
        <Palette size={13} />
        <span className="h-2.5 w-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: value }} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 rounded-lg border border-olive-200 bg-white p-2 shadow-lg">
          <ColorSwatchPicker
            value={value}
            onChange={(next) => {
              onChange(next);
              setOpen(false);
            }}
            options={options}
            allowCustom={allowCustom}
          />
        </div>
      )}
    </div>
  );
}

function BlockControls({
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDelete,
  extra,
}: {
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 rounded-md border border-olive-200/70 bg-cream-50/95 px-1 py-0.5 opacity-80 shadow-sm transition-opacity group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
      {extra}
      <IconBtn label="Move up" disabled={isFirst} onClick={onMoveUp}>
        <ArrowUp size={13} />
      </IconBtn>
      <IconBtn label="Move down" disabled={isLast} onClick={onMoveDown}>
        <ArrowDown size={13} />
      </IconBtn>
      <IconBtn label="Delete block" onClick={onDelete}>
        <Trash2 size={13} />
      </IconBtn>
    </div>
  );
}

function ParagraphEditor({
  html,
  onChange,
  onFocus,
  onEnter,
  onBackspaceEmpty,
  registerRef,
}: {
  html: string;
  onChange: (html: string) => void;
  onFocus: () => void;
  onEnter: () => void;
  onBackspaceEmpty: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
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

  return (
    <div className="relative">
      {isEmpty && (
        <span className="pointer-events-none absolute left-1 top-1.5 text-[15px] text-olive-300">
          Type something, or use Insert above…
        </span>
      )}
      <div
        ref={(el) => {
          ref.current = el;
          registerRef(el);
        }}
        contentEditable
        suppressContentEditableWarning
        onFocus={onFocus}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter();
          } else if (e.key === "Backspace" && isEmpty) {
            e.preventDefault();
            onBackspaceEmpty();
          }
        }}
        className="min-h-[28px] w-full px-1 py-1.5 text-[15px] leading-relaxed text-olive-900 outline-none"
      />
    </div>
  );
}

export default function NewsletterComposer({ subscriberCount }: { subscriberCount: number }) {
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState<NewsletterBlock[]>(() => [createBlock("paragraph")]);
  const [stage, setStage] = useState<Stage>("editing");
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});
  const pendingFocusId = useRef<string | null>(null);
  const didAutoFocus = useRef(false);

  const html = useMemo(
    () => renderNewsletterHtml(subject.trim() || "Your subject line", blocks),
    [subject, blocks]
  );

  const canSend = subject.trim().length > 0 && blocks.some(blockHasContent);

  const registerBlockRef = (id: string) => (el: HTMLElement | null) => {
    blockRefs.current[id] = el;
    if (el && pendingFocusId.current === id) {
      el.focus();
      pendingFocusId.current = null;
    }
  };

  useEffect(() => {
    if (!didAutoFocus.current && blocks.length > 0) {
      blockRefs.current[blocks[0].id]?.focus();
      didAutoFocus.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const insertBlockAfter = (afterId: string | null, type: NewsletterBlock["type"]) => {
    const newBlock = createBlock(type);
    setBlocks((bs) => {
      const index = afterId ? bs.findIndex((b) => b.id === afterId) : bs.length - 1;
      const insertAt = index === -1 ? bs.length : index + 1;
      const next = [...bs];
      next.splice(insertAt, 0, newBlock);
      return next;
    });
    pendingFocusId.current = newBlock.id;
  };

  const handleParagraphBackspace = (id: string) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index <= 0) return;
    const prev = blocks[index - 1];
    setBlocks((bs) => bs.filter((b) => b.id !== id));
    if (prev.type === "paragraph") pendingFocusId.current = prev.id;
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const insertLink = () => {
    const url = window.prompt("Link URL (https://...)");
    if (url) exec("createLink", url);
  };

  const reset = () => {
    setSubject("");
    setBlocks([createBlock("paragraph")]);
    setStage("editing");
    didAutoFocus.current = false;
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
        <div className="mt-4 h-[480px] max-w-xl">
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

      <div className="flex gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mobileTab === "edit" ? "bg-olive-800 text-cream-50" : "bg-olive-100 text-olive-700 hover:bg-olive-200"
          }`}
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mobileTab === "preview" ? "bg-olive-800 text-cream-50" : "bg-olive-100 text-olive-700 hover:bg-olive-200"
          }`}
        >
          <Eye size={14} /> Preview
        </button>
      </div>

      <div className="mt-5 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-8">
        <div className={mobileTab === "edit" ? "block" : "hidden lg:block"}>
          {/* Ribbon toolbar */}
          <div className="sticky top-2 z-10 mb-4 flex flex-wrap items-center gap-0.5 rounded-xl border border-olive-200 bg-cream-50/95 px-2 py-1.5 shadow-sm backdrop-blur">
            <RibbonButton label="Bold" onClick={() => exec("bold")}>
              <Bold size={15} />
            </RibbonButton>
            <RibbonButton label="Italic" onClick={() => exec("italic")}>
              <Italic size={15} />
            </RibbonButton>
            <RibbonButton label="Underline" onClick={() => exec("underline")}>
              <Underline size={15} />
            </RibbonButton>
            <RibbonButton label="Insert link" onClick={insertLink}>
              <LinkIcon size={15} />
            </RibbonButton>
            <span className="mx-1.5 h-5 w-px shrink-0 bg-olive-200" />
            {INSERTABLE.map((def) => (
              <RibbonButton key={def.type} label={`Insert ${def.label}`} onClick={() => insertBlockAfter(activeBlockId, def.type)}>
                {def.icon}
              </RibbonButton>
            ))}
          </div>

          {/* Document canvas */}
          <div className="rounded-2xl border border-olive-200/70 bg-white p-6 shadow-sm sm:p-10">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
              className="w-full border-none bg-transparent font-serif text-3xl font-semibold text-olive-950 outline-none placeholder:text-olive-300"
            />
            <p className="mb-6 mt-1 text-xs text-olive-400">
              This is the subject line your reader sees in their inbox.
            </p>

            <div className="space-y-1">
              {blocks.map((block, i) => {
                const controlProps = {
                  isFirst: i === 0,
                  isLast: i === blocks.length - 1,
                  onMoveUp: () => moveBlock(block.id, -1),
                  onMoveDown: () => moveBlock(block.id, 1),
                  onDelete: () => deleteBlock(block.id),
                };
                const activeRing = activeBlockId === block.id ? "ring-1 ring-terracotta-200" : "";

                if (block.type === "heading") {
                  return (
                    <div key={block.id} className={`group relative rounded-md px-1 py-2 ${activeRing}`}>
                      <BlockControls
                        {...controlProps}
                        extra={
                          <ColorPopoverButton
                            label="Heading color"
                            value={block.color}
                            onChange={(color) => updateBlock({ ...block, color })}
                            options={BRAND_COLORS}
                          />
                        }
                      />
                      <input
                        ref={registerBlockRef(block.id)}
                        onFocus={() => setActiveBlockId(block.id)}
                        value={block.text}
                        onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                        placeholder="Heading"
                        style={{ color: block.color }}
                        className="w-full border-none bg-transparent font-serif text-2xl font-semibold outline-none placeholder:text-olive-300"
                      />
                    </div>
                  );
                }

                if (block.type === "paragraph") {
                  return (
                    <div key={block.id} className={`group relative rounded-md px-1 py-1 ${activeRing}`}>
                      <BlockControls {...controlProps} />
                      <ParagraphEditor
                        html={block.html}
                        onChange={(nextHtml) => updateBlock({ ...block, html: nextHtml })}
                        onFocus={() => setActiveBlockId(block.id)}
                        onEnter={() => insertBlockAfter(block.id, "paragraph")}
                        onBackspaceEmpty={() => handleParagraphBackspace(block.id)}
                        registerRef={registerBlockRef(block.id)}
                      />
                    </div>
                  );
                }

                if (block.type === "image") {
                  return (
                    <div key={block.id} className={`group relative rounded-md px-1 py-2 ${activeRing}`}>
                      <BlockControls {...controlProps} />
                      <input
                        ref={registerBlockRef(block.id)}
                        onFocus={() => setActiveBlockId(block.id)}
                        value={block.url}
                        onChange={(e) => updateBlock({ ...block, url: e.target.value })}
                        placeholder="Paste an image link (https://...)"
                        className="w-full rounded-md border border-transparent bg-transparent px-1 py-1 text-sm text-olive-800 outline-none transition-colors hover:border-olive-200 focus:border-terracotta-400 focus:bg-cream-50"
                      />
                      {block.url.trim() && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={block.url}
                          alt={block.alt}
                          className="mt-2 max-h-56 w-full rounded-lg border border-olive-100 object-cover"
                        />
                      )}
                      <input
                        value={block.alt}
                        onChange={(e) => updateBlock({ ...block, alt: e.target.value })}
                        placeholder="Alt text, for readers who can't see the image"
                        className="mt-1 w-full border-none bg-transparent px-1 text-xs text-olive-500 outline-none placeholder:text-olive-400"
                      />
                    </div>
                  );
                }

                if (block.type === "button") {
                  return (
                    <div key={block.id} className={`group relative rounded-md px-1 py-3 ${activeRing}`}>
                      <BlockControls
                        {...controlProps}
                        extra={
                          <>
                            <ColorPopoverButton
                              label="Button color"
                              value={block.bgColor}
                              onChange={(bgColor) => updateBlock({ ...block, bgColor })}
                              options={BRAND_COLORS}
                            />
                            <ColorPopoverButton
                              label="Button text color"
                              value={block.textColor}
                              onChange={(textColor) => updateBlock({ ...block, textColor })}
                              options={TEXT_COLORS}
                              allowCustom={false}
                            />
                          </>
                        }
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          ref={registerBlockRef(block.id)}
                          onFocus={() => setActiveBlockId(block.id)}
                          value={block.text}
                          onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                          placeholder="Button text"
                          style={{ background: block.bgColor, color: block.textColor }}
                          className="rounded-full px-5 py-2.5 text-sm font-semibold outline-none placeholder:opacity-70"
                        />
                        <input
                          value={block.url}
                          onChange={(e) => updateBlock({ ...block, url: e.target.value })}
                          placeholder="https://... (where it links to)"
                          className="min-w-[180px] flex-1 border-none bg-transparent text-sm text-olive-600 outline-none placeholder:text-olive-400"
                        />
                      </div>
                    </div>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <div key={block.id} className={`group relative rounded-md px-1 py-3 ${activeRing}`}>
                      <BlockControls
                        {...controlProps}
                        extra={
                          <ColorPopoverButton
                            label="Accent color"
                            value={block.accentColor}
                            onChange={(accentColor) => updateBlock({ ...block, accentColor })}
                            options={BRAND_COLORS}
                          />
                        }
                      />
                      <textarea
                        ref={registerBlockRef(block.id)}
                        onFocus={() => setActiveBlockId(block.id)}
                        value={block.text}
                        onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                        placeholder="Write a quote or callout…"
                        rows={2}
                        style={{ borderLeftColor: block.accentColor }}
                        className="w-full resize-none border-l-4 bg-transparent pl-4 text-base italic leading-relaxed text-olive-800 outline-none placeholder:text-olive-300"
                      />
                    </div>
                  );
                }

                if (block.type === "spacer") {
                  return (
                    <div
                      key={block.id}
                      tabIndex={0}
                      ref={registerBlockRef(block.id)}
                      onFocus={() => setActiveBlockId(block.id)}
                      className={`group relative flex items-center gap-2 rounded-md px-1 py-2 ${activeRing}`}
                    >
                      <BlockControls {...controlProps} />
                      <MoveVertical size={13} className="text-olive-300" />
                      <div className="flex gap-1">
                        {SPACER_LABELS.map(({ size, label }) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => updateBlock({ ...block, size })}
                            title={`${label === "S" ? "Small" : label === "M" ? "Medium" : "Large"} space`}
                            className={`h-6 w-6 rounded-full text-xs font-semibold transition-colors ${
                              block.size === size
                                ? "bg-olive-800 text-cream-50"
                                : "bg-olive-100 text-olive-600 hover:bg-olive-200"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={block.id}
                    tabIndex={0}
                    ref={registerBlockRef(block.id)}
                    onFocus={() => setActiveBlockId(block.id)}
                    className={`group relative rounded-md px-1 py-3 ${activeRing}`}
                  >
                    <BlockControls {...controlProps} />
                    <hr className="border-olive-200" />
                  </div>
                );
              })}
            </div>
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
            <div className="h-[560px]">
              <EmailPreviewFrame html={html} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
