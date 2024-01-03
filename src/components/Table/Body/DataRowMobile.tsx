import Image from "next/image";
import SwapIcon from "public/swap.svg";
import { useContext, useEffect, useState } from "react";
import { Button, SIZE } from "~/components/Button/Button";
import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  ICON_SIZES,
  getExpiration,
  getTransactionDetails,
  humanReadable,
  loadingState,
  truncateString,
} from "~/utils";
import { type DataRowProps, type IStateData } from "../table.interface";

export const DataRowMobile = ({
  row,
  address,
  handleOpenAccept,
  handleOpenRetract,
}: DataRowProps) => {
  const [state, setState] = useState<IStateData>(loadingState);
  const { client } = useContext(TSSDKContext);

  useEffect(() => {
    if (client && address)
      void getTransactionDetails(
        client,
        row,
        address,
        handleOpenAccept,
        handleOpenRetract,
        setState,
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, address]);

  const hasStarted =
    new Date(row.start).toISOString() < new Date().toISOString();

  return (
    <div key={row.id} className="flex flex-col gap-2 rounded-lg bg-white py-2">
      <div className="flex justify-evenly px-20 text-sm opacity-30">
        <p>Offered</p>
        <Image src={SwapIcon as string} alt={"<-->"} height={ICON_SIZES.S} />
        <p>Desired</p>
      </div>
      <div className="flex justify-between px-4">
        <div className="flex gap-2">
          {row.offered.icon}
          <p className="font-bold">
            {humanReadable(row.offered.amount, 2)}&nbsp;
            {truncateString(row.offered.token, 7)}
          </p>
        </div>
        <div className="flex gap-2">
          {row.desired.icon}
          <p className="font-bold">
            {humanReadable(row.desired.amount, 2)}&nbsp;
            {truncateString(row.desired.token, 7)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 pt-2">
        <div>Expires in {getExpiration(row.expiry)}</div>
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
