import Image from "next/image";
import SwapIcon from "public/swap.svg";
import { Button, SIZE } from "~/components/Button/Button";
import {
  ICON_SIZES,
  getExpiration,
  humanReadable,
  truncateString,
} from "~/utils";
import { type DataRowProps } from "../table.interface";

export const DataRowMobile = ({ row, address, state }: DataRowProps) => {
  const hasStarted =
    new Date(row.start).toISOString() < new Date().toISOString();
  const expiration = getExpiration(row.expiry);
  const expiredText =
    expiration === "Expired" ? "Expired" : `Expires in ${expiration}`;

  return (
    <div key={row.id} className="flex flex-col gap-2 rounded-lg bg-white py-2">
      <div className="flex justify-evenly px-20 text-sm opacity-30">
        <p>Offered</p>
        <Image src={SwapIcon as string} alt={"<-->"} height={ICON_SIZES.S} />
        <p>Desired</p>
      </div>
      <div className="flex justify-between px-4">
        <div className="flex items-center gap-2">
          {row.offered.icon}
          <p className="font-bold">
            {humanReadable(Number(row.offered.amount), 2)}&nbsp;
            {truncateString(row.offered.tokenName, 7)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {row.desired.icon}
          <p className="font-bold">
            {humanReadable(Number(row.desired.amount), 2)}&nbsp;
            {truncateString(row.desired.tokenName, 7)}
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between px-4 pt-2">
        {<div>{expiredText}</div>}
        <div className="w-1/3">
          <Button
            size={SIZE.SMALL}
            onClick={state.action}
            disabled={!address || state.disabled || !hasStarted}
            color={state.color}
          >
            {state.text}
          </Button>
        </div>
      </div>
    </div>
  );
};
