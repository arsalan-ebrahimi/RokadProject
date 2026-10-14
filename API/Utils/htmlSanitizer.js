/**
 * ==========================================
 * HTML Sanitizer & Plain Text Security Helper
 * Server-side XSS protection & allow-list sanitizer
 * ==========================================
 */

/**
 * Strips all HTML tags and returns clean, trimmed plain text.
 * Used for all free-text fields (titles, descriptions, quotes, etc.)
 * @param {string} str - Raw input text
 * @returns {string} Plain text with all HTML stripped
 */
export const stripHtml = (str) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
};

/**
 * Allowed HTML tags for rich blog content
 */
const ALLOWED_TAGS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "strong", "b", "em", "i", "u", "s", "del", "mark", "small", "sub", "sup",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "a", "img",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  "figure", "figcaption",
  "span", "div", "section"
]);

/**
 * Allowed attributes per tag or global
 */
const GLOBAL_ALLOWED_ATTRS = new Set(["class", "id", "dir", "lang", "title"]);

const TAG_ALLOWED_ATTRS = {
  a: new Set(["href", "target", "rel", "title", "class", "id"]),
  img: new Set(["src", "alt", "title", "width", "height", "loading", "class", "id"]),
  th: new Set(["colspan", "rowspan", "scope", "class", "id"]),
  td: new Set(["colspan", "rowspan", "class", "id"]),
  ol: new Set(["start", "type", "reversed", "class", "id"]),
  code: new Set(["class", "id"]),
  pre: new Set(["class", "id"])
};

/**
 * Validates URLs in href and src to prevent javascript: and dangerous URI schemes
 * @param {string} url - Target URL
 * @returns {boolean} True if URL protocol is safe
 */
const isSafeUrl = (url) => {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  
  // Prohibit javascript:, vbscript:, data: (except safe images in src)
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("vbscript:")) {
    return false;
  }
  
  // Relative URLs and anchors are safe
  if (trimmed.startsWith("/") || trimmed.startsWith("#") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return true;
  }
  
  // Safe absolute protocols
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  );
};

const isSafeImageSrc = (src) => {
  if (!src) return false;
  const trimmed = src.trim().toLowerCase();
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("vbscript:")) return false;
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) return true;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return true;
  if (trimmed.startsWith("data:image/")) return true;
  return false;
};

/**
 * Allow-list HTML sanitizer for rich text / blog bodies.
 * Strips disallowed tags, removes on* handlers, and cleans dangerous attributes.
 * @param {string} rawHtml - Unsanitized HTML string
 * @returns {string} Sanitized safe HTML string
 */
export const sanitizeHtml = (rawHtml) => {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  // 1. Remove dangerous wrapper tags and their full contents
  let clean = rawHtml
    .replace(/<!--[\s\S]*?-->/g, "") // Comments
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "")
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "");

  // 2. Process all remaining HTML tags
  clean = clean.replace(/<\/?([a-zA-Z0-9]+)(\s+[^>]*)?\/?>/g, (match, tagName, rawAttrs) => {
    const tag = tagName.toLowerCase();

    // If tag is not in whitelist, remove it completely
    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    // Closing tag: </tag>
    if (match.startsWith("</")) {
      return `</${tag}>`;
    }

    // Self-closing or opening tag with attributes
    if (!rawAttrs || !rawAttrs.trim()) {
      return match.endsWith("/>") ? `<${tag} />` : `<${tag}>`;
    }

    // Parse attributes
    const allowedForTag = TAG_ALLOWED_ATTRS[tag] || GLOBAL_ALLOWED_ATTRS;
    const sanitizedAttrs = [];
    const attrRegex = /([a-zA-Z0-9_\-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let attrMatch;

    let hasTargetBlank = false;
    let hasRel = false;

    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      let attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";

      // Explicitly reject event handlers (onclick, onerror, onload, etc.)
      if (attrName.startsWith("on")) continue;

      // Check if attribute is allowed
      if (!allowedForTag.has(attrName) && !GLOBAL_ALLOWED_ATTRS.has(attrName)) {
        continue;
      }

      // Check URL safety for href
      if (tag === "a" && attrName === "href") {
        if (!isSafeUrl(attrValue)) continue;
      }

      // Check URL safety for src
      if (tag === "img" && attrName === "src") {
        if (!isSafeImageSrc(attrValue)) continue;
      }

      // Track target="_blank"
      if (tag === "a" && attrName === "target") {
        if (attrValue.toLowerCase() === "_blank") {
          hasTargetBlank = true;
        }
      }

      if (tag === "a" && attrName === "rel") {
        hasRel = true;
      }

      // Escape quotes in attribute value
      const escapedValue = attrValue.replace(/"/g, "&quot;");
      sanitizedAttrs.push(`${attrName}="${escapedValue}"`);
    }

    // Force rel="noopener noreferrer" for external links
    if (tag === "a" && hasTargetBlank && !hasRel) {
      sanitizedAttrs.push('rel="noopener noreferrer"');
    }

    const attrsString = sanitizedAttrs.length ? ` ${sanitizedAttrs.join(" ")}` : "";
    return match.endsWith("/>") ? `<${tag}${attrsString} />` : `<${tag}${attrsString}>`;
  });

  return clean.trim();
};
