interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  totalPages,
  total,
  perPage = 10,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // Build page buttons: always show first, last, current ±1
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages));
  const sorted = Array.from(pages).sort((a, b) => a - b);

  return (
    <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold tracking-widest uppercase text-gray-500">
      <span>
        Showing {from}–{to} of {total}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {sorted.map((p, idx) => {
          const prev = sorted[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-2">
              {showEllipsis && (
                <span className="text-gray-600 px-1">…</span>
              )}
              <button
                onClick={() => onPageChange(p)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  p === page
                    ? 'bg-[#39ff14] text-black'
                    : 'border border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                {p}
              </button>
            </span>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
