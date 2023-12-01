import dynamic from "next/dynamic";
import Image from "next/image";
import SearchNoneIcon from "public/search-none.svg";
import { useState } from "react";
import { ICON_SIZES, type ITableData, type ITokenAmount } from "~/utils";
import { RetractModal } from "../SwapModals/RetractModal";
import { SwapModal } from "../SwapModals/SwapModal";
import { TableFooterDesktop } from "./TableFooterDesktop";
import { TableHead } from "./TableHead";
import type { TablePropsWithSort } from "./table.interface";

const TableBodyMobile = dynamic(
  () => import("./TableBodyMobile").then((mod) => mod.TableBodyMobile),
  { ssr: false },
);
const TableBodyDesktop = dynamic(
  () => import("./TableBodyDesktop").then((mod) => mod.TableBodyDesktop),
  { ssr: false },
);

export const Table = ({
  data,
  sort,
  setSort,
  pagination,
  setPagination,
}: TablePropsWithSort) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openRetract, setOpenRetract] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [desired, setDesired] = useState<ITokenAmount>({
    token: "",
    icon: <></>,
    amount: 0,
  });
  const [offered, setOffered] = useState<ITokenAmount>({
    token: "",
    icon: <></>,
    amount: 0,
  });

  const handleOpenRetract = (row: ITableData) => () => {
    setOffered(row.offered);
    setDesired(row.desired);
    setOpenRetract(true);
  };
  const handleOpenAccept = (row: ITableData) => () => {
    setOffered(row.offered);
    setDesired(row.desired);
    setOpenAccept(true);
  };

  if (!data.length) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Image
          src={SearchNoneIcon as string}
          alt="X"
          height={ICON_SIZES.XXXL}
        />
        <div className="text-2xl font-bold text-m-dark-gray">
          There is no listing to display
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden min-h-min w-full md:table">
        <TableHead sort={sort} setSort={setSort} />
        <TableBodyDesktop
          data={data}
          handleOpenRetract={handleOpenRetract}
          handleOpenAccept={handleOpenAccept}
        />
      </div>
      <TableFooterDesktop
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagination={pagination}
        setPagination={setPagination}
      />
      <TableBodyMobile
        data={data}
        handleOpenRetract={handleOpenRetract}
        handleOpenAccept={handleOpenAccept}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <RetractModal
        open={openRetract}
        setOpen={setOpenRetract}
        offered={offered}
        desired={desired}
      />
      <SwapModal
        open={openAccept}
        setOpen={setOpenAccept}
        offered={offered}
        desired={desired}
      />
    </>
  );
};
