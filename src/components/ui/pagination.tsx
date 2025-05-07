import * as React from "react"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button"; // Added buttonVariants
import type { VariantProps } from "class-variance-authority"; // For Button variant props
import { cn } from "@/lib/utils"
 
interface PaginationProps extends React.HTMLAttributes<HTMLElement> { // Changed to HTMLAttributes<HTMLElement> for nav
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number // Made optional as it's not used in current Pagination component
  pageSizeOptions?: number[] // Made optional
  siblingCount?: number // For controlling number of page links shown
}

// Main Pagination component using <nav> for semantic HTML
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  siblingCount = 1, // Default to 1 sibling page link on each side of current page
  ...props
}) => {
  const paginationRange = usePaginationRange({ currentPage, totalPages, siblingCount });

  if (currentPage === 0 || totalPages < 2) { // Don't render if no pages or only one page
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") { // Render ellipsis as plain text or a non-interactive element
            return <PaginationEllipsis key={`ellipsis-${index}`} />;
          }
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => onPageChange(pageNumber as number)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </nav>
  );
};
Pagination.displayName = "Pagination"


// usePaginationRange Hook (from ShadCN example, slightly modified)
const usePaginationRange = ({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount: number;
}) => {
  return React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5; // Sibling count + first, last, current, and 2 ellipses

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "...", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }
    // Default: should not happen based on logic above, but as a fallback
    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);
};

const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};


// PaginationContent: Wraps the list of pagination items
export const PaginationContent = React.forwardRef<
  HTMLUListElement, // Changed to ul for semantic list
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent"


// PaginationItem: List item for each pagination element
export const PaginationItem = React.forwardRef<
  HTMLLIElement, // Changed to li
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} /> // Removed default class
));
PaginationItem.displayName = "PaginationItem"


// PaginationLink: The actual clickable button for a page number
type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> & // Use ButtonProps for size and variant
  React.ComponentProps<typeof Button> // Inherit Button props

export const PaginationLink = ({
  className,
  isActive,
  size = "icon", // Default size for pagination buttons
  ...props
}: PaginationLinkProps) => (
  <Button // Use Button component directly
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"} // Style active link differently
    size={size}
    className={cn(
      buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"


// PaginationPrevious: Button for "Previous Page"
export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof PaginationLink> // Inherit from PaginationLink
>(({ className, ...props }, ref) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default" // Consistent size with Next button
    className={cn("gap-1 pl-2.5", className)} // Style for icon and text
    {...props}
    ref={ref}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
))
PaginationPrevious.displayName = "PaginationPrevious"


// PaginationNext: Button for "Next Page"
export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof PaginationLink> // Inherit from PaginationLink
>(({ className, ...props }, ref) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default" // Consistent size with Previous button
    className={cn("gap-1 pr-2.5", className)} // Style for icon and text
    {...props}
    ref={ref}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
))
PaginationNext.displayName = "PaginationNext"

// PaginationEllipsis: Represents skipped pages
export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => ( // Changed to span
  <span // Use span for non-interactive ellipsis
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" /> {/* Using MoreHorizontal for ellipsis */}
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// Helper icon, if not already imported elsewhere (e.g. lucide-react)
const MoreHorizontal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);


// Re-export ButtonProps for convenience if needed by consumers
export type ButtonProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
