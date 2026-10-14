// ==========================================
// Component: HtmlEditor
// Rich HTML Code Editor with toolbar, line numbers, and quick tag insertion
// ==========================================

import React, { useRef } from "react";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import TitleIcon from "@mui/icons-material/Title";

export default function HtmlEditor({
  value = "",
  onChange,
  onBlur,
  name,
  label = "محتوای HTML مقاله",
  error,
  placeholder = "کد HTML مقاله را اینجا بنویسید یا با دکمه‌های بالا درج کنید...",
}) {
  const textareaRef = useRef(null);

  // Quick tag insertion helper
  const insertTag = (openTag, closeTag = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const replacement = `${openTag}${selectedText || ""}${closeTag}`;
    const newValue =
      value.substring(0, start) + replacement + value.substring(end);

    onChange({ target: { name, value: newValue } });

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const cursorPos = selectedText
        ? start + replacement.length
        : start + openTag.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleKeyDown = (e) => {
    // Support Tab key indentation inside code editor
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange({ target: { name, value: newValue } });

      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  // Generate line numbers
  const linesCount = Math.max((value || "").split("\n").length, 12);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  const gutterRef = useRef(null);

  const handleScroll = (e) => {
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full text-right" dir="rtl">
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center gap-1.5">
            <CodeIcon fontSize="small" className="text-primary" />
            <span>{label}</span>
          </label>
          <span className="text-[11px] text-text-muted font-numeric">
            {value.length} کاراکتر
          </span>
        </div>
      )}

      {/* Editor Container */}
      <div
        className={`border rounded-xl overflow-hidden bg-surface transition-all duration-200 ${
          error
            ? "border-error ring-1 ring-error"
            : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        }`}
      >
        {/* Formatting Toolbar */}
        <div
          dir="ltr"
          className="flex flex-wrap items-center gap-1 p-2 bg-bg-light/80 border-b border-border/70 select-none text-xs"
        >
          <button
            type="button"
            onClick={() => insertTag("<h2>", "</h2>")}
            className="px-2.5 py-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary font-bold flex items-center gap-1 transition-colors"
            title="Heading 2 (<h2>)"
          >
            <TitleIcon fontSize="small" /> H2
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h3>", "</h3>")}
            className="px-2 py-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary font-semibold transition-colors"
            title="Heading 3 (<h3>)"
          >
            H3
          </button>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => insertTag("<p>", "</p>")}
            className="px-2 py-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Paragraph (<p>)"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => insertTag("<strong>", "</strong>")}
            className="p-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Bold (<strong>)"
          >
            <FormatBoldIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<em>", "</em>")}
            className="p-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Italic (<em>)"
          >
            <FormatItalicIcon fontSize="small" />
          </button>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
            className="p-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Unordered List (<ul>)"
          >
            <FormatListBulletedIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<blockquote>\n  ", "\n</blockquote>")}
            className="p-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Quote (<blockquote>)"
          >
            <FormatQuoteIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<code>", "</code>")}
            className="px-2 py-1 rounded hover:bg-surface border border-transparent hover:border-border font-mono text-secondary transition-colors"
            title="Inline Code (<code>)"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() =>
              insertTag("<pre><code>\n", "\n</code></pre>")
            }
            className="px-2 py-1 rounded hover:bg-surface border border-transparent hover:border-border font-mono text-xs text-secondary transition-colors"
            title="Code Block (<pre><code>)"
          >
            pre
          </button>
          <div className="w-[1px] h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => insertTag('<a href="https://..." target="_blank">', "</a>")}
            className="p-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Link (<a>)"
          >
            <LinkIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<img src="https://..." alt="', '" class="rounded-xl w-full my-4" />')}
            className="p-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Image (<img>)"
          >
            <ImageIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<hr />\n")}
            className="px-2 py-1 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors"
            title="Divider (<hr />)"
          >
            HR
          </button>
        </div>

        {/* Code Area with Line Numbers */}
        <div className="flex bg-[#1e2433] text-gray-200 min-h-[320px] max-h-[550px] overflow-hidden" dir="ltr">
          {/* Gutter / Line Numbers */}
          <div
            ref={gutterRef}
            className="w-12 py-3 px-2 text-right select-none font-mono text-xs text-gray-500 bg-[#161a25] border-r border-gray-700/60 overflow-hidden leading-6"
          >
            {lineNumbers.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            wrap="off"
            placeholder={placeholder}
            rows={14}
            spellCheck={false}
            className="flex-1 p-3 bg-transparent text-gray-100 font-mono text-sm leading-6 resize-y focus:outline-none placeholder-gray-500 overflow-x-auto"
          />
        </div>
      </div>

      {error && (
        <span className="text-xs text-error font-medium animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}
