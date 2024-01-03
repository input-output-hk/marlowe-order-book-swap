import { useContext, useEffect, useState } from "react";
import { Button, SIZE } from "~/components/Button/Button";
import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  dateTimeOptions,
  getTransactionDetails,
  humanReadable,
  loadingState,
  truncateString,
} from "~/utils";
import { type DataRowProps, type IStateData } from "../table.interface";

export const DataRowDesktop = ({
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
    <div key={row.id} className="table-row">
      <div className="table-cell w-1/4">
        <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
          {row.offered.icon}
          <p className="font-bold">
            <abbr title={row.offered.amount + " " + row.offered.token}>
              {humanReadable(row.offered.amount, 2)}&nbsp;
              {truncateString(row.offered.token, 7)}
            </abbr>
          </p>
        </div>
      </div>
      <div className="table-cell w-1/4">
        <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
          {row.desired.icon}
          <p className="font-bold">
            <abbr title={row.desired.amount + " " + row.desired.token}>
              {humanReadable(row.desired.amount, 2)}&nbsp;
              {truncateString(row.desired.token, 7)}
            </abbr>
          </p>
        </div>
      </div>
      <div className="table-cell w-1/4 text-center">
        <div className="items-center justify-center px-2 py-6">
          {new Date(row.expiry).toLocaleDateString(undefined, dateTimeOptions)}
        </div>
      </div>
      <div className="table-cell w-1/4">
        <div className="flex items-center justify-center">
          <div className="w-fit">
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
    </div>
  );
};
