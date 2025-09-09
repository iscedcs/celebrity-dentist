"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMediaQuery } from "@/hooks/use-mobile";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface ResponsivePaginationProps {
  totalItems: number;
  limit: number;
  siblingCount?: number;
}

export function PaginationComponent({
  totalItems,
  limit,
  siblingCount = 1,
}: ResponsivePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  // Get current page from search params or default to 1
  const currentPage = Number(searchParams.get("page") || "1");
  const totalPages = Math.ceil(totalItems / limit);

  // Create a new URLSearchParams instance to manipulate
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Set the page parameter
    params.set("page", pageNumber.toString());

    // Always append the limit parameter
    params.set("limit", limit.toString());

    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers to display with responsive behavior
  const generatePagination = () => {
    // Use a smaller sibling count on mobile
    const effectiveSiblingCount = isSmallScreen ? 0 : siblingCount;

    // If there are fewer pages than the siblings count * 2 + 5, show all pages
    if (totalPages <= effectiveSiblingCount * 2 + 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Calculate start and end points for the pagination
    const leftSiblingIndex = Math.max(currentPage - effectiveSiblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + effectiveSiblingCount,
      totalPages
    );

    // Determine whether to show ellipses
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    // Always show first and last page
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "leftEllipsis", ...middleRange, "rightEllipsis", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: 5 },
        (_, i) => totalPages - 4 + i
      );
      return [1, "leftEllipsis", ...rightRange];
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from({ length: 5 }, (_, i) => i + 1);
      return [...leftRange, "rightEllipsis", totalPages];
    }

    // This should never happen, but just in case
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = generatePagination();

  // For very small screens, show a simplified version
  if (isSmallScreen) {
    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() =>
            currentPage > 1 && router.push(createPageURL(currentPage - 1))
          }
          disabled={currentPage <= 1}
          className={`p-2 rounded-md border ${
            currentPage <= 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-muted"
          }`}
          aria-label="Previous page"
        >
          <span aria-hidden="true">←</span>
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            currentPage < totalPages &&
            router.push(createPageURL(currentPage + 1))
          }
          disabled={currentPage >= totalPages}
          className={`p-2 rounded-md border ${
            currentPage >= totalPages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-muted"
          }`}
          aria-label="Next page"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    );
  }

  // Regular pagination for larger screens
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : 0}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pages.map((page, i) => {
          if (page === "leftEllipsis" || page === "rightEllipsis") {
            return (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={page === currentPage}
                className={
                  page === currentPage
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "hover:bg-muted"
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages ? createPageURL(currentPage + 1) : "#"
            }
            aria-disabled={currentPage >= totalPages}
            tabIndex={currentPage >= totalPages ? -1 : 0}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
