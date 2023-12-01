import Image from "next/image";
import ArrowIcon from "public/open_input_black.svg";
import { ICON_SIZES } from "~/utils";
import type { ITableFooter } from "./table.interface";
import {
  currentPageStyle,
  nextPage,
  pageStyle,
  previousPage,
  selectAnyPage,
} from "./utils";

export const TableFooterMobile = ({
  currentPage,
  setCurrentPage,
}: ITableFooter) => {
  const handlePrevious = () => previousPage(currentPage, setCurrentPage);
  const handleNext = () => nextPage(setCurrentPage);
  const handleSelectPage = (page: number) => () =>
    selectAnyPage(setCurrentPage, page);

  return (
    <div className="flex w-full items-center justify-center gap-4 rounded-lg bg-white py-4 md:hidden">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-default disabled:opacity-50 disabled:ring-0"
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
        {/* TODO: handle page counter */}
        {[1, 2, 3].map((page) => (
          <div
            key={page}
            className={page === currentPage ? currentPageStyle : pageStyle}
            onClick={handleSelectPage(page)}
          >
            <p>{page}</p>
          </div>
        ))}
      </div>
      <button
        onClick={handleNext}
        className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-default disabled:opacity-50 disabled:ring-0"
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
