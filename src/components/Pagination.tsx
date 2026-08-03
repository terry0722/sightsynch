import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {}
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });

    if (pageNumber > 1) {
      params.set("page", String(pageNumber));
    }

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const getPageItems = () => {
    const items: (number | string)[] = [];
    const delta = 2;

    const range: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l: number | null = null;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          items.push(l + 1);
        } else if (i - l > 2) {
          items.push(`ellipsis-${l}`);
        }
      }
      items.push(i);
      l = i;
    }

    return items;
  };

  const pageItems = getPageItems();

  return (
    <nav
      aria-label="페이지 내비게이션"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200 pt-8 mt-16 font-mono text-xs"
    >
      {/* Mobile-friendly simplified counter */}
      <div className="flex sm:hidden items-center justify-between w-full">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-3 py-2 border border-neutral-200 hover:border-black transition-colors uppercase tracking-widest text-neutral-900"
          >
            ‹ 이전
          </Link>
        ) : (
          <span className="px-3 py-2 border border-neutral-100 text-neutral-300 uppercase tracking-widest cursor-not-allowed">
            ‹ 이전
          </span>
        )}

        <span className="text-neutral-500 uppercase tracking-widest px-2">
          {currentPage} / {totalPages}
        </span>

        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-3 py-2 border border-neutral-200 hover:border-black transition-colors uppercase tracking-widest text-neutral-900"
          >
            다음 ›
          </Link>
        ) : (
          <span className="px-3 py-2 border border-neutral-100 text-neutral-300 uppercase tracking-widest cursor-not-allowed">
            다음 ›
          </span>
        )}
      </div>

      {/* Desktop / Full pagination controls */}
      <div className="hidden sm:flex items-center gap-1.5 mx-auto">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="px-3 py-2 border border-neutral-200 hover:border-black transition-colors uppercase tracking-widest text-neutral-900 mr-2"
          >
            ‹ 이전
          </Link>
        ) : (
          <span className="px-3 py-2 border border-neutral-100 text-neutral-300 uppercase tracking-widest cursor-not-allowed mr-2">
            ‹ 이전
          </span>
        )}

        {pageItems.map((item, idx) => {
          if (typeof item === "string") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-2 text-neutral-400 select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = item === currentPage;
          return isCurrent ? (
            <span
              key={item}
              aria-current="page"
              className="min-w-[36px] h-[36px] flex items-center justify-center border border-black bg-black text-white font-bold tracking-wider"
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={createPageUrl(item)}
              className="min-w-[36px] h-[36px] flex items-center justify-center border border-neutral-200 text-neutral-800 hover:border-black transition-colors tracking-wider"
            >
              {item}
            </Link>
          );
        })}

        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="px-3 py-2 border border-neutral-200 hover:border-black transition-colors uppercase tracking-widest text-neutral-900 ml-2"
          >
            다음 ›
          </Link>
        ) : (
          <span className="px-3 py-2 border border-neutral-100 text-neutral-300 uppercase tracking-widest cursor-not-allowed ml-2">
            다음 ›
          </span>
        )}
      </div>
    </nav>
  );
}
