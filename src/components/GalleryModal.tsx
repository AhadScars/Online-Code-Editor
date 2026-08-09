"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { Pagination, usePageSlice } from "@/components/Pagination";
import {
  GALLERY,
  GALLERY_CATEGORIES,
  type GalleryItem,
} from "@/lib/gallery";
import { getLanguage } from "@/lib/languages";

const PAGE_SIZE = 6;

type GalleryModalProps = {
  open: boolean;
  onClose: () => void;
  onOpen: (item: GalleryItem) => void;
};

export function GalleryModal({ open, onClose, onOpen }: GalleryModalProps) {
  const [category, setCategory] = useState<"all" | GalleryItem["category"]>(
    "all"
  );
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return GALLERY.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.langId.includes(query)
      );
    });
  }, [category, q]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, q]);

  useEffect(() => {
    if (open) setPage(1);
  }, [open]);

  const { pageItems, totalPages, safePage } = usePageSlice(
    items,
    page,
    PAGE_SIZE
  );

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  return (
    <Modal open={open} onClose={onClose} title="Public Gallery" wide>
      <p className="mb-3 text-xs text-[var(--text-dim)]">
        Open a ready-made example in a new tab. Great for learning and demos.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search examples…"
          className="min-w-[12rem] flex-1 rounded-md border border-[var(--border)] bg-[#1e1f22] px-3 py-1.5 text-xs text-[var(--text-bright)] outline-none focus:border-[var(--accent)]"
        />
        <div className="flex flex-wrap gap-1">
          <CatChip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label="All"
          />
          {GALLERY_CATEGORIES.map((c) => (
            <CatChip
              key={c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
              label={c.label}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {pageItems.map((item) => {
          const lang = getLanguage(item.langId);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onOpen(item);
                onClose();
              }}
              className="rounded-lg border border-[var(--border)] bg-[#1e1f22] p-3 text-left transition hover:border-[var(--accent)] hover:bg-[#252628]"
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: lang.badgeColor }}
                />
                <span className="text-xs font-semibold text-[var(--text-bright)]">
                  {item.title}
                </span>
              </div>
              <p className="mb-2 text-[11px] leading-snug text-[var(--text-dim)]">
                {item.description}
              </p>
              <span className="rounded bg-[#3d3f43] px-1.5 py-0.5 text-[10px] text-[var(--text)]">
                {lang.label}
              </span>
            </button>
          );
        })}
        {items.length === 0 && (
          <p className="col-span-full py-6 text-center text-xs text-[var(--text-dim)]">
            No examples match your search.
          </p>
        )}
      </div>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        totalItems={items.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </Modal>
  );
}

function CatChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] ${
        active
          ? "bg-[var(--accent)] text-white"
          : "bg-[#3d3f43] text-[var(--text)] hover:bg-[#45474c]"
      }`}
    >
      {label}
    </button>
  );
}
