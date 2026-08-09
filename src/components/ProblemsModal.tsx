"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { PROBLEMS, type Problem } from "@/lib/problems";
import { getLanguage } from "@/lib/languages";

type ProblemsModalProps = {
  open: boolean;
  onClose: () => void;
  onOpen: (problem: Problem) => void;
};

const DIFF_COLOR: Record<Problem["difficulty"], string> = {
  easy: "#6aab73",
  medium: "#d5b778",
  hard: "#f75464",
};

export function ProblemsModal({ open, onClose, onOpen }: ProblemsModalProps) {
  const [diff, setDiff] = useState<"all" | Problem["difficulty"]>("all");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PROBLEMS.filter((p) => {
      if (diff !== "all" && p.difficulty !== diff) return false;
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.langId.includes(query)
      );
    });
  }, [diff, q]);

  return (
    <Modal open={open} onClose={onClose} title="Teacher Problem Pack" wide>
      <p className="mb-3 text-xs text-[var(--text-dim)]">
        Load a coding problem with starter code and automated tests. Great for
        practice and classroom exercises.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search problems…"
          className="min-w-[12rem] flex-1 rounded-md border border-[var(--border)] bg-[#1e1f22] px-3 py-1.5 text-xs text-[var(--text-bright)] outline-none focus:border-[var(--accent)]"
        />
        {(["all", "easy", "medium", "hard"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDiff(d)}
            className={`rounded-full px-2.5 py-1 text-[11px] capitalize ${
              diff === d
                ? "bg-[var(--accent)] text-white"
                : "bg-[#3d3f43] text-[var(--text)] hover:bg-[#45474c]"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {items.map((p) => {
          const lang = getLanguage(p.langId);
          const visibleTests = p.tests.filter((t) => !t.hidden).length;
          const hiddenTests = p.tests.filter((t) => t.hidden).length;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onOpen(p);
                onClose();
              }}
              className="rounded-lg border border-[var(--border)] bg-[#1e1f22] p-3 text-left transition hover:border-[var(--accent)] hover:bg-[#252628]"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text-bright)]">
                  {p.title}
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                  style={{
                    color: DIFF_COLOR[p.difficulty],
                    background: `${DIFF_COLOR[p.difficulty]}22`,
                  }}
                >
                  {p.difficulty}
                </span>
                <span className="rounded bg-[#3d3f43] px-1.5 py-0.5 text-[10px] text-[var(--text)]">
                  {lang.label}
                </span>
              </div>
              <p className="mb-1 text-[11px] leading-snug text-[var(--text-dim)]">
                {p.description}
              </p>
              <span className="text-[10px] text-[var(--text-dim)]">
                {visibleTests} sample test
                {visibleTests === 1 ? "" : "s"}
                {hiddenTests > 0 ? ` · ${hiddenTests} hidden` : ""}
              </span>
            </button>
          );
        })}
        {items.length === 0 && (
          <p className="py-6 text-center text-xs text-[var(--text-dim)]">
            No problems match your filters.
          </p>
        )}
      </div>
    </Modal>
  );
}
