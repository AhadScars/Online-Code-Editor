"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { createPortal } from "react-dom";
import type { LangId, LanguageConfig } from "@/lib/languages";
import { LANGUAGES } from "@/lib/languages";

type ToolbarProps = {
  language: LanguageConfig;
  fileName: string;
  isRunning: boolean;
  onLanguageChange: (id: LangId) => void;
  onRun: () => void;
  onClearCode: () => void;
  onClearTerminal: () => void;
  onResetCode: () => void;
};

export function Toolbar({
  language,
  fileName,
  isRunning,
  onLanguageChange,
  onRun,
  onClearCode,
  onClearTerminal,
  onResetCode,
}: ToolbarProps) {
  const runLabel = language.outputMode === "preview" ? "Preview" : "Run";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const id = window.setTimeout(() => {
      document.addEventListener("pointerdown", onPointerDown, true);
      document.addEventListener("keydown", onKey);
    }, 0);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id: LangId) => {
    if (isRunning) return;
    onLanguageChange(id);
    setOpen(false);
  };

  const toggle = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRunning) return;
    setOpen((v) => !v);
  };

  return (
    <header className="relative z-[210] flex h-11 shrink-0 items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--bg-toolbar)] px-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-white shadow-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </div>
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-semibold text-[var(--text-bright)]">
              Terminal
            </div>
            <div className="truncate text-[10px] leading-none text-[var(--text-dim)]">
              Online Code Editor
            </div>
          </div>
        </div>

        <div className="hidden h-5 w-px bg-[var(--border)] sm:block" />

        <div className="flex min-w-0 items-center gap-2">
          <div className="relative">
            <button
              ref={triggerRef}
              type="button"
              id="lang-select"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label="Language"
              disabled={isRunning}
              onClick={toggle}
              className={`flex cursor-pointer items-center gap-1.5 rounded border px-2 py-1 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                open
                  ? "border-[var(--border)] bg-[#3d3f43] text-[var(--text-bright)]"
                  : "border-[var(--border)] bg-[#3d3f43] text-[var(--text)] hover:bg-[#45474c]"
              }`}
            >
              <span>{language.label}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
                className={`text-[var(--text-dim)] transition-transform ${open ? "rotate-180" : ""}`}
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {mounted &&
              open &&
              createPortal(
                <div
                  ref={menuRef}
                  id="lang-dropdown-menu"
                  role="listbox"
                  aria-labelledby="lang-select"
                  style={{
                    position: "fixed",
                    top: menuPos.top,
                    left: menuPos.left,
                    zIndex: 99999,
                    minWidth: 120,
                  }}
                  className="rounded border border-[var(--border)] bg-[#2b2d30] py-1 shadow-lg"
                >
                  {LANGUAGES.map((lang) => {
                    const active = lang.id === language.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => pick(lang.id)}
                        className={`block w-full px-3 py-1.5 text-left text-xs ${
                          active
                            ? "bg-[#3d3f43] text-[var(--text-bright)]"
                            : "text-[var(--text)] hover:bg-[#35373b]"
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>,
                document.body
              )}
          </div>

          <span className="hidden truncate font-mono text-xs text-[var(--text-dim)] md:inline">
            {fileName}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onClearCode}
          disabled={isRunning}
          title="Clear all code in the editor"
          className="rounded-md border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-xs text-[var(--text)] transition hover:bg-[#3d3f43] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onResetCode}
          disabled={isRunning}
          title="Restore sample code"
          className="rounded-md border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-xs text-[var(--text)] transition hover:bg-[#3d3f43] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onClearTerminal}
          disabled={isRunning}
          title="Clear terminal output"
          className="rounded-md border border-[var(--border)] bg-transparent px-2.5 py-1.5 text-xs text-[var(--text)] transition hover:bg-[#3d3f43] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear output
        </button>
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${
            isRunning
              ? "running-pulse bg-[var(--run-green)]"
              : "bg-[var(--run-green)] hover:bg-[var(--run-green-hover)]"
          }`}
          title={`${runLabel} (Ctrl/Cmd + Enter)`}
        >
          {isRunning ? "Running…" : `▶ ${runLabel}`}
        </button>
      </div>
    </header>
  );
}
