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
  setModalOpen,
}: TablePropsWithSort) => {
  const [openRetract, setOpenRetract] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [contractId, setContractId] = useState<string>("");
  const [desired, setDesired] = useState<ITokenAmount>({
    token: "",
    icon: <></>,
    amount: 0,
    currency: "",
    policyId: "",
  });
  const [offered, setOffered] = useState<ITokenAmount>({
    token: "",
    icon: <></>,
    amount: 0,
    currency: "",
    policyId: "",
  });
  const router = useRouter();

  const handleOpenRetract = (row: ITableData) => () => {
    setOffered(row.offered);
    setDesired(row.desired);
    setOpenRetract(true);
    setContractId(row.id);
    setModalOpen(true);
  };
  const handleOpenAccept = (row: ITableData) => () => {
    setOffered(row.offered);
    setDesired(row.desired);
    setOpenAccept(true);
    setContractId(row.id);
    setModalOpen(true);
  };
  const handleGoToDeposit = (row: ITableData) => () => {
    void router.push({
      pathname: PAGES.DEPOSIT,
      query: {
        id: row.id,
        offeredToken: row.offered.token,
        offeredAmount: row.offered.amount,
        offeredPolicyId: row.offered.policyId,
        desiredToken: row.desired.token,
        desiredAmount: String(row.desired.amount),
        desiredPolicyId: row.desired.policyId,
        expiryDate: row.expiry,
      },
    });
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
          handleGoToDeposit={handleGoToDeposit}
        />
      </div>
      <TableFooterDesktop pagination={pagination} />
      <TableBodyMobile
        data={data}
        handleOpenRetract={handleOpenRetract}
        handleOpenAccept={handleOpenAccept}
        handleGoToDeposit={handleGoToDeposit}
        pagination={pagination}
        setPagination={setPagination}
      />
      <RetractModal
        open={openRetract}
        setOpen={setOpenRetract}
        offered={offered}
        desired={desired}
        id={contractId}
        setModalOpen={setModalOpen}
      />
      <SwapModal
        open={openAccept}
        setOpen={setOpenAccept}
        offered={offered}
        desired={desired}
        id={contractId}
        setModalOpen={setModalOpen}
      />
    </>
  );
};
