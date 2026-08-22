import { createQueryString } from "@/lib/utils";
import { SearchParams } from "@/types";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export default function DataPagination({
  searchParams,
  currentPage,
  totalPages,
}: {
  searchParams: SearchParams;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createQueryString(searchParams, { page: currentPage - 1 })}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href={createQueryString(searchParams, { page: index })}
              isActive={index === currentPage}
            >
              {index}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={createQueryString(searchParams, { page: currentPage + 1 })}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
