export type SpacerSize = "small" | "medium" | "large";

export type NewsletterBlock =
  | { id: string; type: "heading"; text: string; color: string }
  | { id: string; type: "paragraph"; html: string }
  | { id: string; type: "image"; url: string; alt: string }
  | { id: string; type: "button"; text: string; url: string; bgColor: string; textColor: string }
  | { id: string; type: "quote"; text: string; accentColor: string }
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

export function createBlock(type: NewsletterBlock["type"]): NewsletterBlock {
  const id = Math.random().toString(36).slice(2, 10);
  switch (type) {
    case "heading":
      return { id, type, text: "", color: "#1c1f13" };
    case "paragraph":
      return { id, type, html: "" };
    case "image":
      return { id, type, url: "", alt: "" };
    case "button":
      return { id, type, text: "", url: "", bgColor: "#626d38", textColor: "#fffdf9" };
    case "quote":
      return { id, type, text: "", accentColor: "#c9793f" };
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

const ALLOWED_INLINE_TAGS = new Set(["B", "STRONG", "I", "EM", "U", "BR", "A"]);

/** Strips a contentEditable paragraph's HTML down to a small safe allowlist before it can reach an email. */
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
    if (tag === "BR") return "<br>";
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
      return `<h2 style="margin:28px 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:19px;color:${color};">${escapeHtml(block.text)}</h2>`;
    }
    case "paragraph": {
      const content = sanitizeInlineHtml(block.html).trim();
      return content
        ? `<p style="margin:0 0 16px;line-height:1.7;color:#3f4629;font-size:15px;">${content}</p>`
        : "";
    }
    case "image":
      return block.url.trim()
        ? `<img src="${escapeHtml(safeUrl(block.url))}" alt="${escapeHtml(block.alt)}" style="max-width:100%;display:block;border-radius:10px;margin:0 0 20px;" />`
        : "";
    case "button": {
      if (!block.text.trim()) return "";
      const bg = safeColor(block.bgColor, "#626d38");
      const fg = safeColor(block.textColor, "#fffdf9");
      return `<div style="margin:24px 0;"><a href="${escapeHtml(safeUrl(block.url))}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${bg};color:${fg};padding:12px 26px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">${escapeHtml(block.text)}</a></div>`;
    }
    case "quote": {
      if (!block.text.trim()) return "";
      const accent = safeColor(block.accentColor, "#c9793f");
      return `<blockquote style="margin:24px 0;padding:14px 22px;border-left:4px solid ${accent};font-style:italic;color:#3f4629;font-size:16px;line-height:1.7;">${escapeHtml(block.text)}</blockquote>`;
    }
    case "spacer":
      return `<div style="height:${SPACER_HEIGHTS[block.size]}px;line-height:${SPACER_HEIGHTS[block.size]}px;font-size:1px;">&nbsp;</div>`;
    case "divider":
      return `<hr style="border:none;border-top:1px solid #e8ebd8;margin:24px 0;" />`;
  }
}

export function renderNewsletterHtml(subject: string, blocks: NewsletterBlock[]): string {
  const body = blocks.map(renderBlock).join("\n");
  return `<div style="background:#faf7f0;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:16px;overflow:hidden;border:1px solid #e8ebd8;">
      <div style="background:#363b25;padding:24px 32px;">
        <span style="color:#faf7f0;font-size:18px;font-weight:bold;">Turning Olive Charity</span>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#1c1f13;">${escapeHtml(subject)}</h1>
        ${body}
      </div>
      <div style="padding:24px 32px;border-top:1px solid #e8ebd8;">
        <p style="margin:0;font-size:12px;color:#7c8a48;">
          Turning Olive Charity &middot; La, Accra, Ghana<br/>
          <a href="{{ unsubscribe }}" style="color:#7c8a48;">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>`;
}
