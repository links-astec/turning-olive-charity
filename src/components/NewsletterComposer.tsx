"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
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
  Highlighter,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  RemoveFormatting,
  UploadCloud,
  Eye,
  Pencil,
  Superscript,
  Subscript,
  IndentIncrease,
  IndentDecrease,
  ChevronDown,
} from "lucide-react";
import {
  type NewsletterBlock,
  type SpacerSize,
  type BlockAlign,
  createBlock,
  renderNewsletterHtml,
  BRAND_COLORS,
  TEXT_COLORS,
  HIGHLIGHT_COLORS,
} from "@/lib/newsletterTemplate";

type Stage = "editing" | "reviewing" | "sending" | "sent" | "error";

const SITE_LINKS = [
  { label: "Homepage", url: "https://turningolive.org/" },
  { label: "About Us", url: "https://turningolive.org/about" },
  { label: "Our Programs", url: "https://turningolive.org/programs" },
  { label: "Get Involved / Donate", url: "https://turningolive.org/get-involved" },
  { label: "Our Team", url: "https://turningolive.org/team" },
  { label: "Blog", url: "https://turningolive.org/blog" },
  { label: "Photo Gallery", url: "https://turningolive.org/gallery" },
  { label: "Our Sponsors", url: "https://turningolive.org/sponsors" },
  { label: "Contact Us", url: "https://turningolive.org/contact" },
];

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

function justify(align: BlockAlign): string {
  return align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";
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
  active,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors disabled:pointer-events-none disabled:opacity-30 ${
        active ? "bg-olive-800 text-cream-50" : "text-olive-700 hover:bg-olive-100 hover:text-olive-950"
      }`}
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

/** Block-level color picker (heading text, button fill, quote accent) — just sets a plain field, no selection to preserve. */
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

/** Character-level color/highlight for selected text — must preserve the selection across the popover click. */
function FormatColorPopover({
  label,
  icon,
  options,
  onOpen,
  onPick,
}: {
  label: string;
  icon: React.ReactNode;
  options: { label: string; value: string }[];
  onOpen: () => void;
  onPick: (value: string) => void;
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
        onMouseDown={(e) => {
          e.preventDefault();
          onOpen();
        }}
        onClick={() => setOpen((o) => !o)}
        title={label}
        aria-label={label}
        className="inline-flex items-center rounded-md px-2 py-1.5 text-olive-700 transition-colors hover:bg-olive-100 hover:text-olive-950"
      >
        {icon}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 flex gap-1.5 rounded-lg border border-olive-200 bg-white p-2 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.label}
              onClick={() => {
                onPick(opt.value);
                setOpen(false);
              }}
              className="h-6 w-6 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: opt.value }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LinkPopover({
  onOpen,
  onInsert,
}: {
  onOpen: () => void;
  onInsert: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
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
        onMouseDown={(e) => {
          e.preventDefault();
          onOpen();
        }}
        onClick={() => setOpen((o) => !o)}
        title="Insert link"
        aria-label="Insert link"
        className="inline-flex items-center rounded-md px-2 py-1.5 text-olive-700 transition-colors hover:bg-olive-100 hover:text-olive-950"
      >
        <LinkIcon size={15} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-72 rounded-lg border border-olive-200 bg-white p-3 shadow-lg">
          <p className="mb-1.5 text-xs font-semibold text-olive-700">Link to a page on the site</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {SITE_LINKS.map((l) => (
              <button
                key={l.url}
                type="button"
                onClick={() => setUrl(l.url)}
                className={`rounded-full px-2 py-1 text-[11px] font-medium transition-colors ${
                  url === l.url ? "bg-olive-800 text-cream-50" : "bg-olive-100 text-olive-700 hover:bg-olive-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Or paste any link (https://...)"
            className="w-full rounded-md border border-olive-300 px-2 py-1.5 text-sm outline-none focus:border-terracotta-500"
          />
          <button
            type="button"
            disabled={!url.trim()}
            onClick={() => {
              onInsert(url.trim());
              setOpen(false);
              setUrl("");
            }}
            className="mt-2 w-full rounded-md bg-terracotta-500 px-3 py-1.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-600 disabled:opacity-50"
          >
            Insert Link
          </button>
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
  align,
  onChange,
  onFocus,
  onEnter,
  onBackspaceEmpty,
  registerRef,
}: {
  html: string;
  align: BlockAlign;
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

  const isInsideList = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    let node: Node | null = sel.getRangeAt(0).startContainer;
    while (node && node !== ref.current) {
      if (node instanceof HTMLElement && (node.tagName === "LI" || node.tagName === "UL" || node.tagName === "OL")) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

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
            if (isInsideList()) return;
            e.preventDefault();
            onEnter();
          } else if (e.key === "Backspace" && isEmpty) {
            e.preventDefault();
            onBackspaceEmpty();
          }
        }}
        style={{ textAlign: align }}
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
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<{ id: string; message: string } | null>(null);
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const pendingFocusId = useRef<string | null>(null);
  const didAutoFocus = useRef(false);
  const savedRange = useRef<Range | null>(null);
  const savedBlockId = useRef<string | null>(null);

  const html = useMemo(
    () => renderNewsletterHtml(subject.trim() || "Your subject line", blocks),
    [subject, blocks]
  );

  const canSend = subject.trim().length > 0 && blocks.some(blockHasContent);

  const plainText = useMemo(() => {
    return blocks
      .map((b) => {
        if (b.type === "heading" || b.type === "quote" || b.type === "button") return b.text;
        if (b.type === "paragraph") return b.html.replace(/<[^>]+>/g, " ");
        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }, [blocks]);
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.replace(/ /g, "").length;
  const activeBlock = blocks.find((b) => b.id === activeBlockId);
  const canAlign = !!activeBlock && activeBlock.type !== "divider" && activeBlock.type !== "spacer";

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

  const setAlign = (align: BlockAlign) => {
    if (!activeBlock || activeBlock.type === "divider" || activeBlock.type === "spacer") return;
    updateBlock({ ...activeBlock, align });
  };

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    savedRange.current = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
    savedBlockId.current = activeBlockId;
  };

  const execWithSavedSelection = (command: string, value?: string) => {
    const id = savedBlockId.current;
    const el = id ? blockRefs.current[id] : null;
    if (el) el.focus();
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    // Color/highlight need CSS-based output (span+style) instead of legacy <font> tags;
    // every other command should keep producing plain semantic tags (<b>, <u>, <a>...).
    if (command === "foreColor" || command === "hiliteColor" || command === "fontSize") {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand(command, false, value);
      document.execCommand("styleWithCSS", false, "false");
    } else {
      document.execCommand(command, false, value);
    }
  };

  const handleImageUpload = async (blockId: string, file: File | undefined) => {
    if (!file) return;
    setUploadingId(blockId);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setUploadError({ id: blockId, message: data.error || "Upload failed. Please try again." });
        return;
      }
      const block = blocks.find((b) => b.id === blockId);
      if (block && block.type === "image") {
        updateBlock({ ...block, url: data.url });
      }
    } catch {
      setUploadError({ id: blockId, message: "Upload failed. Please try again." });
    } finally {
      setUploadingId(null);
    }
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
            <RibbonButton label="Strikethrough" onClick={() => exec("strikeThrough")}>
              <Strikethrough size={15} />
            </RibbonButton>
            <FormatColorPopover
              label="Text color"
              icon={<Palette size={15} />}
              options={BRAND_COLORS}
              onOpen={saveSelection}
              onPick={(v) => execWithSavedSelection("foreColor", v)}
            />
            <FormatColorPopover
              label="Highlight"
              icon={<Highlighter size={15} />}
              options={HIGHLIGHT_COLORS}
              onOpen={saveSelection}
              onPick={(v) => execWithSavedSelection("hiliteColor", v)}
            />
            <LinkPopover onOpen={saveSelection} onInsert={(url) => execWithSavedSelection("createLink", url)} />
            <span className="mx-1 h-5 w-px shrink-0 bg-olive-200" />
            <div className="relative">
              <select
                defaultValue=""
                onMouseDown={saveSelection}
                onChange={(e) => {
                  if (e.target.value) execWithSavedSelection("fontSize", e.target.value);
                  e.target.value = "";
                }}
                title="Text size"
                aria-label="Text size"
                className="appearance-none rounded-md bg-transparent py-1.5 pl-2 pr-6 text-xs font-medium text-olive-700 outline-none transition-colors hover:bg-olive-100"
              >
                <option value="" disabled>
                  Size
                </option>
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="6">Extra large</option>
              </select>
              <ChevronDown size={11} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-olive-500" />
            </div>
            <RibbonButton label="Superscript" onClick={() => exec("superscript")}>
              <Superscript size={15} />
            </RibbonButton>
            <RibbonButton label="Subscript" onClick={() => exec("subscript")}>
              <Subscript size={15} />
            </RibbonButton>
            <span className="mx-1 h-5 w-px shrink-0 bg-olive-200" />
            <RibbonButton label="Bulleted list" onClick={() => exec("insertUnorderedList")}>
              <List size={15} />
            </RibbonButton>
            <RibbonButton label="Numbered list" onClick={() => exec("insertOrderedList")}>
              <ListOrdered size={15} />
            </RibbonButton>
            <RibbonButton label="Decrease indent" onClick={() => exec("outdent")}>
              <IndentDecrease size={15} />
            </RibbonButton>
            <RibbonButton label="Increase indent" onClick={() => exec("indent")}>
              <IndentIncrease size={15} />
            </RibbonButton>
            <span className="mx-1 h-5 w-px shrink-0 bg-olive-200" />
            <RibbonButton
              label="Align left"
              disabled={!canAlign}
              active={canAlign && (activeBlock as { align?: BlockAlign })?.align === "left"}
              onClick={() => setAlign("left")}
            >
              <AlignLeft size={15} />
            </RibbonButton>
            <RibbonButton
              label="Align center"
              disabled={!canAlign}
              active={canAlign && (activeBlock as { align?: BlockAlign })?.align === "center"}
              onClick={() => setAlign("center")}
            >
              <AlignCenter size={15} />
            </RibbonButton>
            <RibbonButton
              label="Align right"
              disabled={!canAlign}
              active={canAlign && (activeBlock as { align?: BlockAlign })?.align === "right"}
              onClick={() => setAlign("right")}
            >
              <AlignRight size={15} />
            </RibbonButton>
            <span className="mx-1 h-5 w-px shrink-0 bg-olive-200" />
            <RibbonButton label="Undo" onClick={() => exec("undo")}>
              <Undo2 size={15} />
            </RibbonButton>
            <RibbonButton label="Redo" onClick={() => exec("redo")}>
              <Redo2 size={15} />
            </RibbonButton>
            <RibbonButton label="Clear formatting" onClick={() => exec("removeFormat")}>
              <RemoveFormatting size={15} />
            </RibbonButton>
            <span className="mx-1 h-5 w-px shrink-0 bg-olive-200" />
            {INSERTABLE.map((def) => (
              <RibbonButton
                key={def.type}
                label={`Insert ${def.label}`}
                onClick={() => insertBlockAfter(activeBlockId, def.type)}
              >
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
                const activeRing = activeBlockId === block.id ? "ring-1 ring-terracotta-400/40" : "";

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
                        style={{ color: block.color, textAlign: block.align }}
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
                        align={block.align}
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
                      <div
                        tabIndex={0}
                        onFocus={() => setActiveBlockId(block.id)}
                        ref={registerBlockRef(block.id)}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[block.id]?.click()}
                          disabled={uploadingId === block.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-olive-100 px-3 py-1.5 text-xs font-semibold text-olive-700 transition-colors hover:bg-olive-200 disabled:opacity-50"
                        >
                          <UploadCloud size={13} /> {uploadingId === block.id ? "Uploading…" : "Upload from device"}
                        </button>
                        <span className="text-xs text-olive-400">or paste a link below</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => {
                            fileInputRefs.current[block.id] = el;
                          }}
                          onChange={(e) => {
                            handleImageUpload(block.id, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </div>
                      <input
                        value={block.url}
                        onChange={(e) => updateBlock({ ...block, url: e.target.value })}
                        placeholder="Paste an image link (https://...)"
                        className="mt-2 w-full rounded-md bg-transparent px-1.5 py-1 text-sm text-olive-800 outline-none transition-colors hover:bg-olive-50 focus:bg-cream-100"
                      />
                      {uploadError?.id === block.id && (
                        <p className="mt-1 text-xs text-terracotta-600">{uploadError.message}</p>
                      )}
                      {block.url.trim() && (
                        <div style={{ display: "flex", justifyContent: justify(block.align) }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={block.url}
                            alt={block.alt}
                            className="mt-2 max-h-56 rounded-lg border border-olive-100 object-cover"
                          />
                        </div>
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
                  const matchedPreset = SITE_LINKS.find((l) => l.url === block.url);
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
                      <div style={{ display: "flex", justifyContent: justify(block.align) }}>
                        <input
                          ref={registerBlockRef(block.id)}
                          onFocus={() => setActiveBlockId(block.id)}
                          value={block.text}
                          onChange={(e) => updateBlock({ ...block, text: e.target.value })}
                          placeholder="Button text"
                          style={{ background: block.bgColor, color: block.textColor }}
                          className="rounded-full px-5 py-2.5 text-sm font-semibold outline-none placeholder:opacity-70"
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <select
                            value={matchedPreset ? matchedPreset.url : "__custom__"}
                            onChange={(e) =>
                              updateBlock({ ...block, url: e.target.value === "__custom__" ? "" : e.target.value })
                            }
                            className="appearance-none rounded-full bg-olive-100 py-1.5 pl-3 pr-7 text-xs font-medium text-olive-700 outline-none transition-colors hover:bg-olive-200 focus:bg-olive-200"
                          >
                            <option value="__custom__">Custom link…</option>
                            {SITE_LINKS.map((l) => (
                              <option key={l.url} value={l.url}>
                                {l.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={12}
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-olive-500"
                          />
                        </div>
                        {!matchedPreset && (
                          <input
                            value={block.url}
                            onChange={(e) => updateBlock({ ...block, url: e.target.value })}
                            placeholder="https://..."
                            className="min-w-[180px] flex-1 border-none bg-transparent text-sm text-olive-600 outline-none placeholder:text-olive-400"
                          />
                        )}
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
                        style={{ borderLeftColor: block.accentColor, textAlign: block.align }}
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

          <p className="mt-2 px-1 text-xs text-olive-400">
            {wordCount} word{wordCount === 1 ? "" : "s"} &middot; {charCount} character
            {charCount === 1 ? "" : "s"}
          </p>

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
