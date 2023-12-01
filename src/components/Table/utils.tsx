import type { Dispatch, SetStateAction } from "react";

export const previousPage = (
  currentPage: number,
  setCurrentPage: Dispatch<SetStateAction<number>>,
) => (currentPage > 1 ? setCurrentPage((prev) => prev - 1) : null);

export const nextPage = (setCurrentPage: Dispatch<SetStateAction<number>>) =>
  setCurrentPage((prev) => prev + 1);

export const selectAnyPage = (
  setCurrentPage: Dispatch<SetStateAction<number>>,
  page: number,
) => setCurrentPage(page);

export const currentPageStyle =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-m-purple p-2 text-white";
export const pageStyle =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10";
