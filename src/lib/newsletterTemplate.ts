export type SpacerSize = "small" | "medium" | "large";
export type BlockAlign = "left" | "center" | "right";

export type NewsletterBlock =
  | { id: string; type: "heading"; text: string; color: string; align: BlockAlign }
  | { id: string; type: "paragraph"; html: string; align: BlockAlign }
  | { id: string; type: "image"; url: string; alt: string; align: BlockAlign }
  | {
      id: string;
      type: "button";
      text: string;
      url: string;
      bgColor: string;
      textColor: string;
      align: BlockAlign;
    }
  | { id: string; type: "quote"; text: string; accentColor: string; align: BlockAlign }
  | { id: string; type: "spacer"; size: SpacerSize }
  | { id: string; type: "divider" };

export const BRAND_COLORS = [
  { label: "Olive", value: "#363b25" },
  { label: "Moss", value: "#626d38" },
  { label: "Terracotta", value: "#c9793f" },
  { label: "Charcoal", value: "#1c1f13" },
];

export const TEXT_COLORS = [
  { label: "Cream", value: "#fffdf9" },
  { label: "Charcoal", value: "#1c1f13" },
];

export const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fdf0b0" },
  { label: "Terracotta", value: "#f3d8c0" },
  { label: "Moss", value: "#dbe3c4" },
];

export function createBlock(type: NewsletterBlock["type"]): NewsletterBlock {
  const id = Math.random().toString(36).slice(2, 10);
  switch (type) {
    case "heading":
      return { id, type, text: "", color: "#1c1f13", align: "left" };
    case "paragraph":
      return { id, type, html: "", align: "left" };
    case "image":
      return { id, type, url: "", alt: "", align: "left" };
    case "button":
      return { id, type, text: "", url: "", bgColor: "#626d38", textColor: "#fffdf9", align: "left" };
    case "quote":
      return { id, type, text: "", accentColor: "#c9793f", align: "left" };
    case "spacer":
      return { id, type, size: "medium" };
    case "divider":
      return { id, type };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(url: string): string {
  return /^(https?:|mailto:)/i.test(url.trim()) ? url.trim() : "#";
}

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function safeColor(color: string | undefined, fallback: string): string {
  return color && HEX_RE.test(color) ? color : fallback;
}

const SAFE_COLOR_VALUE_RE = /^(#[0-9a-f]{3,8}|rgba?\([\d.,\s%]+\)|[a-z]+)$/i;

const ALLOWED_INLINE_TAGS = new Set([
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "S",
  "STRIKE",
  "BR",
  "A",
  "SPAN",
  "UL",
  "OL",
  "LI",
  "DIV",
  "SUP",
  "SUB",
]);

const SAFE_FONT_SIZE_RE = /^(xx-small|x-small|small|medium|large|x-large|xx-large)$/i;

/** Strips a contentEditable block's HTML down to a small safe allowlist before it can reach an email. */
export function sanitizeInlineHtml(html: string): string {
  let out = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  out = out.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag, attrs) => {
    const tag = String(rawTag).toUpperCase();
    const isClosing = match.startsWith("</");
    if (!ALLOWED_INLINE_TAGS.has(tag)) return "";

    if (tag === "A") {
      if (isClosing) return "</a>";
      const hrefMatch = /href\s*=\s*"([^"]*)"|href\s*=\s*'([^']*)'/i.exec(attrs);
      const href = safeUrl(hrefMatch ? hrefMatch[1] || hrefMatch[2] || "" : "");
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" style="color:#54622f;text-decoration:underline;">`;
    }

    if (tag === "SPAN") {
      if (isClosing) return "</span>";
      const styleMatch = /style\s*=\s*"([^"]*)"|style\s*=\s*'([^']*)'/i.exec(attrs);
      const styleStr = styleMatch ? styleMatch[1] || styleMatch[2] || "" : "";
      const safeProps = styleStr
        .split(";")
        .map((p) => p.trim())
        .filter((prop) => {
          const [prop_, value] = prop.split(":").map((s) => s.trim());
          if (!prop_ || !value) return false;
          if (prop_ === "color" || prop_ === "background-color") return SAFE_COLOR_VALUE_RE.test(value);
          if (prop_ === "font-size") return SAFE_FONT_SIZE_RE.test(value);
          return false;
        })
        .join(";");
      return safeProps ? `<span style="${escapeHtml(safeProps)}">` : "<span>";
    }

    if (tag === "BR") return "<br>";
    if (tag === "UL") return isClosing ? "</ul>" : `<ul style="margin:0 0 16px;padding-left:22px;">`;
    if (tag === "OL") return isClosing ? "</ol>" : `<ol style="margin:0 0 16px;padding-left:22px;">`;
    if (tag === "LI") return isClosing ? "</li>" : `<li style="margin:0 0 6px;line-height:1.6;">`;

    return isClosing ? `</${tag.toLowerCase()}>` : `<${tag.toLowerCase()}>`;
  });
  return out;
}

const SPACER_HEIGHTS: Record<SpacerSize, number> = { small: 12, medium: 24, large: 48 };

function renderBlock(block: NewsletterBlock): string {
  switch (block.type) {
    case "heading": {
      if (!block.text.trim()) return "";
      const color = safeColor(block.color, "#1c1f13");
      return `<h2 style="margin:28px 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:19px;color:${color};text-align:${block.align};">${escapeHtml(block.text)}</h2>`;
    }
    case "paragraph": {
      const content = sanitizeInlineHtml(block.html).trim();
      return content
        ? `<div style="margin:0 0 16px;line-height:1.7;color:#3f4629;font-size:15px;text-align:${block.align};">${content}</div>`
        : "";
    }
    case "image": {
      if (!block.url.trim()) return "";
      const margin =
        block.align === "center" ? "0 auto 20px" : block.align === "right" ? "0 0 20px auto" : "0 0 20px 0";
      return `<img src="${escapeHtml(safeUrl(block.url))}" alt="${escapeHtml(block.alt)}" style="max-width:100%;display:block;border-radius:10px;margin:${margin};" />`;
    }
    case "button": {
      if (!block.text.trim()) return "";
      const bg = safeColor(block.bgColor, "#626d38");
      const fg = safeColor(block.textColor, "#fffdf9");
      return `<div style="margin:24px 0;text-align:${block.align};"><a href="${escapeHtml(safeUrl(block.url))}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${bg};color:${fg};padding:12px 26px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">${escapeHtml(block.text)}</a></div>`;
    }
    case "quote": {
      if (!block.text.trim()) return "";
      const accent = safeColor(block.accentColor, "#c9793f");
      return `<blockquote style="margin:24px 0;padding:14px 22px;border-left:4px solid ${accent};font-style:italic;color:#3f4629;font-size:16px;line-height:1.7;text-align:${block.align};">${escapeHtml(block.text)}</blockquote>`;
    }
    case "spacer":
      return `<div style="height:${SPACER_HEIGHTS[block.size]}px;line-height:${SPACER_HEIGHTS[block.size]}px;font-size:1px;">&nbsp;</div>`;
    case "divider":
      return `<hr style="border:none;border-top:1px solid #e8ebd8;margin:24px 0;" />`;
  }
}

function plainTextOf(block: NewsletterBlock): string {
  if (block.type === "heading" || block.type === "quote" || block.type === "button") return block.text;
  if (block.type === "paragraph") return block.html.replace(/<[^>]+>/g, " ");
  return "";
}

function buildPreheader(blocks: NewsletterBlock[]): string {
  const text = blocks
    .map(plainTextOf)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return escapeHtml(text.slice(0, 140));
}

export function renderNewsletterHtml(subject: string, blocks: NewsletterBlock[]): string {
  const body = blocks.map(renderBlock).join("\n");
  const preheader = buildPreheader(blocks);

  return `<div style="background:#efe9da;padding:40px 16px;font-family:Georgia,'Times New Roman',serif;">
    <span style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</span>
    <div style="max-width:600px;margin:0 auto;">
      <div style="height:6px;border-radius:10px 10px 0 0;background:linear-gradient(90deg,#c9793f,#dd9a63,#7c8a48);"></div>
      <div style="background:#fffdf9;border-left:1px solid #e9dcc0;border-right:1px solid #e9dcc0;">
        <div style="padding:28px 40px 20px;text-align:center;border-bottom:1px solid #f3ecdd;">
          <img src="https://turningolive.org/logo-icon.png" width="40" height="40" alt="" style="display:inline-block;vertical-align:middle;margin-right:10px;" />
          <img src="https://turningolive.org/logo-wordmark.png" width="150" alt="Turning Olive Charity" style="display:inline-block;vertical-align:middle;" />
        </div>
        <div style="padding:40px 40px 12px;">
          <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#c9793f;">Newsletter</p>
          <h1 style="margin:0 0 28px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#1c1f13;">${escapeHtml(subject)}</h1>
          <div style="font-family:Arial,Helvetica,sans-serif;padding-bottom:24px;">
            ${body}
          </div>
        </div>
      </div>
      <div style="background:#363b25;border-radius:0 0 10px 10px;padding:32px 40px;font-family:Arial,Helvetica,sans-serif;">
        <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;color:#d2d8b3;">Impacting the world in our own small ways.</p>
        <p style="margin:0 0 10px;font-size:12px;line-height:1.7;color:#b3bd85;">
          Turning Olive Charity &middot; La, Accra, Ghana<br/>
          <a href="mailto:info@turningolive.org" style="color:#b3bd85;">info@turningolive.org</a>
        </p>
        <p style="margin:0;font-size:12px;">
          <a href="https://www.instagram.com/olive.charity_2025" target="_blank" rel="noopener noreferrer" style="color:#dd9a63;text-decoration:none;">Follow us on Instagram</a>
          <span style="color:#626d38;"> &middot; </span>
          <a href="{{ unsubscribe }}" style="color:#8a9463;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>`;
}
