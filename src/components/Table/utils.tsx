import type { NextRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { PAGES, type IPagination } from "~/utils";

export const previousPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  currentPage: number,
  router: NextRouter,
) => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
    void router.push({
      pathname: PAGES.LISTING,
      query: { page: String(currentPage - 1) },
    });
  }
};

export const nextPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  currentPage: number,
  pagination: IPagination,
  router: NextRouter,
) => {
  if (pagination.fetchMore) {
    setCurrentPage((prev) => prev + 1);
    void router.push({
      pathname: PAGES.LISTING,
      query: { page: String(currentPage + 1) },
    });
  }
};

export const selectAnyPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  page: number,
  router: NextRouter,
) => {
  setCurrentPage(page);
  void router.push({
    pathname: PAGES.LISTING,
    query: { page: String(page) },
  });
};
