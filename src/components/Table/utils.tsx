import type { Dispatch, SetStateAction } from "react";
import { PAGINATION_LIMIT, type IPagination } from "~/utils";

export const previousPage = (
  currentPage: number,
  setCurrentPage: Dispatch<SetStateAction<number>>,
  setPagination: Dispatch<SetStateAction<IPagination>>,
) => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
    setPagination((prev) => {
      return { ...prev, offset: prev.offset - PAGINATION_LIMIT };
    });
  }
};

export const nextPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  pagination: IPagination,
  setPagination: Dispatch<SetStateAction<IPagination>>,
) => {
  if (pagination.fetchMore) {
    setCurrentPage((prev) => prev + 1);
    setPagination((prev) => {
      return { ...prev, offset: prev.offset + PAGINATION_LIMIT };
    });
  }
};

export const selectAnyPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  page: number,
) => setCurrentPage(page);
