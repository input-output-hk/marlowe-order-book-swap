import { useState } from "react";
import {
  COLORS,
  truncateString,
  type ITableData,
  type ITokenAmount,
} from "~/utils";
import { Button, SIZE } from "../Button/Button";
import { RetractModal } from "../SwapModals/RetractModal";
import { SwapModal } from "../SwapModals/SwapModal";
import type { TableProps } from "./table.interface";

export const TableBodyDesktop = ({ data }: TableProps) => {
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
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
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
  return (
    <div className="hidden md:table-row-group">
      <RetractModal
        open={openRetract}
        setOpen={setOpenRetract}
        offer={offered}
        receive={desired}
      />
      <SwapModal
        open={openAccept}
        setOpen={setOpenAccept}
        offer={offered}
        receive={desired}
      />
      {data.map((row) => (
        <div key={row.id} className="table-row">
          <div className="table-cell w-1/4">
            <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
              {row.offered.icon}
              <p className="font-bold">
                {row.offered.amount}
                <abbr title={row.offered.token}>
                  {truncateString(row.offered.token, 16)}
                </abbr>
              </p>
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
              {row.desired.icon}
              <p className="font-bold">
                {row.desired.amount}
                <abbr title={row.desired.token}>
                  {truncateString(row.desired.token, 16)}
                </abbr>
              </p>
            </div>
          </div>
          <div className="table-cell w-1/4 text-center">
            <div className="items-center justify-center px-2 py-6">
              {new Date(row.expiry).toLocaleDateString(undefined, options)}
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex items-center justify-center">
              {/* TODO: change when we implement wallets */}
              {row.createdBy === process.env.NEXT_PUBLIC_OWN_ADDRESS ? (
                <div>
                  <Button
                    size={SIZE.SMALL}
                    color={COLORS.RED}
                    onClick={handleOpenRetract(row)}
                  >
                    Retract offer
                  </Button>
                </div>
              ) : (
                <div>
                  <Button size={SIZE.SMALL} onClick={handleOpenAccept(row)}>
                    Accept Offer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
