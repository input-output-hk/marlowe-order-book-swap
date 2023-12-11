import type { NextRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { type IPagination } from "~/pages/listing";
import { PAGES } from "~/utils";

export const previousPage = (
  setPagination: Dispatch<SetStateAction<IPagination>>,
  pagination: IPagination,
  router: NextRouter,
) => {
  const { page } = pagination;
  if (page && page > 1) {
    setPagination((prev) => ({
      ...prev,
      page: prev.page ? prev.page - 1 : 1,
    }));
    void router.push({
      pathname: PAGES.LISTING,
      query: { page: String(page - 1) },
    });
  }
};

export const nextPage = (
  setPagination: Dispatch<SetStateAction<IPagination>>,
  pagination: IPagination,
  router: NextRouter,
) => {
  const { page, fetchMore } = pagination;
  if (fetchMore && page) {
    setPagination((prev) => ({
      ...prev,
      page: prev.page ? prev.page + 1 : 1,
    }));
    void router.push({
      pathname: PAGES.LISTING,
      query: { page: String(page + 1) },
    });
  }
};

export const selectAnyPage = (
  setPagination: Dispatch<SetStateAction<IPagination>>,
  page: number,
  router: NextRouter,
) => {
  setPagination((prev) => ({
    ...prev,
    page,
  }));
  void router.push({
    pathname: PAGES.LISTING,
    query: { page: String(page) },
  });
};
