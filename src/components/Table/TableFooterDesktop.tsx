import Image from "next/image";
import ArrowIcon from "public/open_input_black.svg";
import { ICON_SIZES } from "~/utils";
import type { ITableFooter } from "./table.interface";
import { nextPage, previousPage, selectAnyPage } from "./utils";

export const TableFooterDesktop = ({
  currentPage,
  setCurrentPage,
  pagination,
  setPagination,
}: ITableFooter) => {
  const handlePrevious = () =>
    previousPage(currentPage, setCurrentPage, setPagination);

  const handleNext = () => nextPage(setCurrentPage, pagination, setPagination);

  const handleSelectPage = (page: number) => () =>
    selectAnyPage(setCurrentPage, page);

  return (
    <div className="hidden w-full items-center justify-center gap-4 rounded-lg py-4 md:flex">
      <button
        className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-default disabled:opacity-50 disabled:ring-0"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <Image
          src={ArrowIcon as string}
          alt="<"
          className="rotate-90"
          height={ICON_SIZES.S}
        />
        <p>Previous</p>
      </button>

      <div className="flex gap-2">
        {currentPage >= 2 && (
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10"
            onClick={handleSelectPage(currentPage - 1)}
          >
            <p>{currentPage - 1}</p>
          </div>
        )}
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-m-purple p-2 text-white">
          <p>{currentPage}</p>
        </div>
        {pagination.fetchMore && (
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10"
            onClick={handleSelectPage(currentPage + 1)}
          >
            <p>{currentPage + 1}</p>
          </div>
        )}
      </div>

      <button
        className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-default disabled:opacity-50 disabled:ring-0"
        onClick={handleNext}
        disabled={pagination.fetchMore}
      >
        <p>Next</p>
        <Image
          src={ArrowIcon as string}
          alt=">"
          className="-rotate-90"
          height={ICON_SIZES.S}
        />
      </button>
    </div>
  );
};
