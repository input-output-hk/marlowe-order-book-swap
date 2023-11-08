import Image from "next/image";
import CalendarIcon from "public/calendar-dark.svg";
import HandShakeIcon from "public/handshake.svg";
import ArrowIcon from "public/open_input_black.svg";
import TagIcon from "public/tag.svg";
import type { Dispatch, SetStateAction } from "react";
import { ICON_SIZES, SortOrder, type ISort } from "~/utils";

interface TableHeadProps {
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}

export const TableHead = ({ sort, setSort }: TableHeadProps) => {
  const sortCallback = () =>
    setSort((prev) => {
      return {
        ...prev,
        sortOrder:
          prev.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC,
      };
    });

  const columns = [
    {
      column: "Token Offered",
      icon: <Image src={TagIcon as string} alt="tag" height={ICON_SIZES.S} />,
      sortable: false,
    },
    {
      column: "Desired Token",
      icon: <Image src={TagIcon as string} alt="tag" height={ICON_SIZES.S} />,
      sortable: false,
    },
    {
      column: "Expiry Date",
      onClick: sortCallback,
      icon: (
        <Image
          src={CalendarIcon as string}
          alt="calendar"
          height={ICON_SIZES.S}
        />
      ),
      sortable: true,
    },
    {
      column: "Actions",
      icon: (
        <Image
          src={HandShakeIcon as string}
          alt="actions"
          height={ICON_SIZES.S}
        />
      ),
      sortable: false,
    },
  ];

  const columnStyle = (index: number) => {
    if (index === 0) {
      return "rounded-l-lg";
    } else if (index === columns.length - 1) {
      return "rounded-r-lg";
    } else {
      return "";
    }
  };

  const isClickeable = (sortable: boolean) =>
    sortable ? "cursor-pointer" : "";

  const getSortArrowRotation = () =>
    sort.sortOrder === SortOrder.ASC ? "rotate-180" : "";

  return (
    <div className="hidden bg-m-light-purple md:table-header-group">
      <div className="table-row">
        {columns.map(({ column, icon, onClick, sortable }, index) => (
          <div
            key={index}
            className={`table-cell ${columnStyle(
              index,
            )} py-4 text-center text-base font-medium`}
            onClick={onClick}
          >
            <div
              className={`flex ${isClickeable(
                sortable,
              )} select-none flex-col items-center justify-center`}
            >
              {icon}
              <div className="flex">
                {column}
                {sortable && (
                  <Image
                    src={ArrowIcon as string}
                    alt={sort.sortOrder === SortOrder.ASC ? "↑" : "↓"}
                    className={`${getSortArrowRotation()} h-auto w-auto`}
                    height={ICON_SIZES.M}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
