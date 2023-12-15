import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "public/open_input_black.svg";
import { ICON_SIZES, PAGES } from "~/utils";
import type { ITableFooter } from "../table.interface";

export const TableFooterDesktop = ({ pagination }: ITableFooter) => {
  const { page } = pagination;

  return (
    <div className="hidden w-full items-center justify-center gap-4 rounded-lg py-4 md:flex">
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

      <div className="flex gap-2">
        {page && page >= 2 && (
          <Link
            href={{
              pathname: PAGES.LISTING,
              query: { page: page - 1 },
            }}
          >
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10">
              <p>{page - 1}</p>
            </div>
          </Link>
        )}
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-m-purple p-2 text-white">
          <p>{page}</p>
        </div>
        {pagination.fetchMore && page && (
          <Link
            href={{
              pathname: PAGES.LISTING,
              query: { page: page + 1 },
            }}
          >
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10">
              <p>{page + 1}</p>
            </div>
          </Link>
        )}
      </div>
      <Link
        href={{
          pathname: PAGES.LISTING,
          query: { page: page! + 1 },
        }}
      >
        <button
          className="flex h-8 cursor-pointer select-none items-center justify-center rounded-lg p-2 hover:ring-1 hover:ring-m-purple/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0"
          disabled={!pagination.fetchMore}
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
    </div>
  );
};
