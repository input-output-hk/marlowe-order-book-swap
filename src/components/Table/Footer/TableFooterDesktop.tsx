import Image from "next/image";
import Link from "next/link";
import DoubleArrowIcon from "public/double-arrow.svg";
import ArrowIcon from "public/open_input_black.svg";
import { ICON_SIZES, PAGES, getPagesToDisplay } from "~/utils";
import type { ITableFooter } from "../table.interface";

export const TableFooterDesktop = ({ pagination }: ITableFooter) => {
  const { page } = pagination;

  return (
    <div className="hidden w-full items-center justify-center gap-4 rounded-lg py-4 md:flex">
      <div className="flex">
        <Link
          href={{
            pathname: PAGES.LISTING,
            query: { page: 1 },
          }}
        >
          <button
            className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-lg hover:ring-1 hover:ring-m-purple/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0"
            disabled={page === 1}
          >
            <Image
              src={DoubleArrowIcon as string}
              alt="<<"
              height={ICON_SIZES.S}
            />
          </button>
        </Link>
        <Link
          href={{
            pathname: PAGES.LISTING,
            query: { page: page! - 1 },
          }}
        >
          <button
            className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0"
            disabled={page === 1}
          >
            <Image
              src={ArrowIcon as string}
              alt="<"
              className="rotate-90"
              height={ICON_SIZES.S}
            />
            <p>Prev</p>
          </button>
        </Link>
      </div>

      <div className="flex gap-2">
        {getPagesToDisplay(pagination, 2, page).map((pageNumber) => {
          return (
            <Link
              href={{
                pathname: PAGES.LISTING,
                query: { page: pageNumber },
              }}
              key={pageNumber}
            >
              <button
                className={`flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 ${
                  page === pageNumber
                    ? "bg-m-purple text-white"
                    : "hover:ring-1 hover:ring-m-purple/10"
                }`}
                disabled={page === pageNumber}
              >
                <p>{pageNumber}</p>
              </button>
            </Link>
          );
        })}
      </div>

      <div className="flex">
        <Link
          href={{
            pathname: PAGES.LISTING,
            query: { page: page! + 1 },
          }}
        >
          <button
            className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0"
            disabled={page === pagination.totalPages}
          >
            <p>Next</p>
            <Image
              src={ArrowIcon as string}
              alt=">"
              className="-rotate-90"
              height={ICON_SIZES.S}
            />
          </button>
        </Link>
        <Link
          href={{
            pathname: PAGES.LISTING,
            query: { page: pagination.totalPages },
          }}
        >
          <button
            className="flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-lg hover:ring-1 hover:ring-m-purple/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0"
            disabled={page === pagination.totalPages}
          >
            <Image
              src={DoubleArrowIcon as string}
              alt=">>"
              height={ICON_SIZES.S}
              className="rotate-180"
            />
          </button>
        </Link>
      </div>
    </div>
  );
};
