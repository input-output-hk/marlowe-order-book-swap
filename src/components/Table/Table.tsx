import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import SearchNoneIcon from "public/search-none.svg";
import { useState } from "react";
import { ICON_SIZES, PAGES, type ITableData, type ITokenAmount } from "~/utils";
import { RetractModal } from "../SwapModals/RetractModal";
import { SwapModal } from "../SwapModals/SwapModal";
import { TableFooterDesktop } from "./Footer/TableFooterDesktop";
import { TableHead } from "./TableHead";
import type { TablePropsWithSort } from "./table.interface";

const TableBodyMobile = dynamic(
  () => import("./Body/TableBodyMobile").then((mod) => mod.TableBodyMobile),
  { ssr: false },
);
const TableBodyDesktop = dynamic(
  () => import("./Body/TableBodyDesktop").then((mod) => mod.TableBodyDesktop),
  { ssr: false },
);

export const Table = ({
  data,
  sort,
  setSort,
  pagination,
  setPagination,
}: TablePropsWithSort) => {
  const [openRetractOrDeposit, setOpenRetractOrDeposit] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [contractId, setContractId] = useState<string>("");
  const [desired, setDesired] = useState<ITokenAmount>({
    token: "",
    icon: <></>,
    amount: 0,
    currency: "",
  });
  const [offered, setOffered] = useState<ITokenAmount>({
    token: "",
    icon: <></>,
    amount: 0,
    currency: "",
  });
  const router = useRouter();

  const handleOpenRetractOrDeposit = (row: ITableData) => () => {
    setOffered(row.offered);
    setDesired(row.desired);
    // TODO: CHANGE
    if (false) {
      setOpenRetractOrDeposit(true);
      setContractId(row.id);
    } else {
      void router.push({
        pathname: PAGES.DEPOSIT,
        query: {
          id: row.id,
          offeredToken: row.offered.token,
          offeredAmount: row.offered.amount,
          desiredToken: row.desired.token,
          desiredAmount: row.desired.amount,
          expiryDate: row.expiry,
        },
      });
    }
  };
  const handleOpenAccept = (row: ITableData) => () => {
    setOffered(row.offered);
    setDesired(row.desired);
    setOpenAccept(true);
    setContractId(row.id);
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
          handleOpenRetractOrDeposit={handleOpenRetractOrDeposit}
          handleOpenAccept={handleOpenAccept}
        />
      </div>
      <TableFooterDesktop pagination={pagination} />
      <TableBodyMobile
        data={data}
        handleOpenRetractOrDeposit={handleOpenRetractOrDeposit}
        handleOpenAccept={handleOpenAccept}
        pagination={pagination}
        setPagination={setPagination}
      />
      <RetractModal
        open={openRetractOrDeposit}
        setOpen={setOpenRetractOrDeposit}
        offered={offered}
        desired={desired}
        id={contractId}
      />
      <SwapModal
        open={openAccept}
        setOpen={setOpenAccept}
        offered={offered}
        desired={desired}
        id={contractId}
      />
    </>
  );
};
