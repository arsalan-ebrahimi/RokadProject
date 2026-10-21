// ==========================================
// Component: HtmlEditor
// Rich HTML Code Editor with responsive toolbar, line numbers, quick tag insertion,
// and dvh-aware viewport height with mobile line-wrap support
// ==========================================

import React, { useRef, useState } from "react";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import TitleIcon from "@mui/icons-material/Title";
import WrapTextIcon from "@mui/icons-material/WrapText";

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
  const gutterRef = useRef(null);
  const [isWrapEnabled, setIsWrapEnabled] = useState(true);

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
  const linesCount = Math.max((value || "").split("\n").length, 10);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWrapEnabled((prev) => !prev)}
              title={isWrapEnabled ? "غیرفعال‌سازی شکستن خطوط" : "فعال‌سازی شکستن خطوط"}
              className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 border transition-colors cursor-pointer ${
                isWrapEnabled
                  ? "bg-primary-light border-primary-border text-text-accent"
                  : "bg-surface border-border text-text-muted"
              }`}
            >
              <WrapTextIcon fontSize="inherit" />
              <span className="hidden sm:inline">شکست خطوط</span>
            </button>
            <span className="text-[11px] text-text-muted font-numeric">
              {value.length} کاراکتر
            </span>
          </div>
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
        {/* Formatting Toolbar (horizontally scrollable on mobile) */}
        <div
          dir="ltr"
          className="flex items-center gap-1 p-2 bg-bg-light/80 border-b border-border/70 select-none text-xs overflow-x-auto hide-scrollbar scroll-smooth"
        >
          <button
            type="button"
            onClick={() => insertTag("<h2>", "</h2>")}
            className="px-2.5 py-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary font-bold flex items-center gap-1 transition-colors shrink-0 min-h-[32px]"
            title="Heading 2 (<h2>)"
          >
            <TitleIcon fontSize="small" /> H2
          </button>
          <button
            type="button"
            onClick={() => insertTag("<h3>", "</h3>")}
            className="px-2 py-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary font-semibold transition-colors shrink-0 min-h-[32px]"
            title="Heading 3 (<h3>)"
          >
            H3
          </button>
          <div className="w-[1px] h-4 bg-border mx-1 shrink-0" />
          <button
            type="button"
            onClick={() => insertTag("<p>", "</p>")}
            className="px-2 py-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Paragraph (<p>)"
          >
            P
          </button>
          <button
            type="button"
            onClick={() => insertTag("<strong>", "</strong>")}
            className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Bold (<strong>)"
          >
            <FormatBoldIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<em>", "</em>")}
            className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Italic (<em>)"
          >
            <FormatItalicIcon fontSize="small" />
          </button>
          <div className="w-[1px] h-4 bg-border mx-1 shrink-0" />
          <button
            type="button"
            onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
            className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Unordered List (<ul>)"
          >
            <FormatListBulletedIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<blockquote>\n  ", "\n</blockquote>")}
            className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Quote (<blockquote>)"
          >
            <FormatQuoteIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<code>", "</code>")}
            className="px-2 py-1.5 rounded hover:bg-surface border border-transparent hover:border-border font-mono text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Inline Code (<code>)"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => insertTag("<pre><code>\n", "\n</code></pre>")}
            className="px-2 py-1.5 rounded hover:bg-surface border border-transparent hover:border-border font-mono text-xs text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Code Block (<pre><code>)"
          >
            pre
          </button>
          <div className="w-[1px] h-4 bg-border mx-1 shrink-0" />
          <button
            type="button"
            onClick={() => insertTag('<a href="https://..." target="_blank">', "</a>")}
            className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Link (<a>)"
          >
            <LinkIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag('<img src="https://..." alt="', '" class="rounded-xl w-full my-4" />')}
            className="p-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Image (<img>)"
          >
            <ImageIcon fontSize="small" />
          </button>
          <button
            type="button"
            onClick={() => insertTag("<hr />\n")}
            className="px-2 py-1.5 rounded hover:bg-surface border border-transparent hover:border-border text-secondary transition-colors shrink-0 min-h-[32px]"
            title="Divider (<hr />)"
          >
            HR
          </button>
        </div>

        {/* Code Area with Line Numbers and responsive height */}
        <div className="flex bg-[#1e2433] text-gray-200 min-h-[260px] md:min-h-[350px] max-h-[50dvh] md:max-h-[550px] overflow-hidden" dir="ltr">
          {/* Gutter / Line Numbers */}
          <div
            ref={gutterRef}
            className="w-10 md:w-12 py-3 px-1.5 md:px-2 text-right select-none font-mono text-xs text-gray-500 bg-[#161a25] border-r border-gray-700/60 overflow-hidden leading-6 shrink-0"
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
            wrap={isWrapEnabled ? "soft" : "off"}
            placeholder={placeholder}
            rows={12}
            spellCheck={false}
            className={`
              flex-1 p-3 bg-transparent text-gray-100 font-mono text-xs md:text-sm leading-6 resize-y focus:outline-none placeholder-gray-500 overflow-x-auto
              ${isWrapEnabled ? "break-words whitespace-pre-wrap" : "whitespace-pre"}
            `}
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
