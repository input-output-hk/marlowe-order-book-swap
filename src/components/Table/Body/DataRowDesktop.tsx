import { useContext, useEffect, useState } from "react";
import { Button, SIZE } from "~/components/Button/Button";
import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  dateTimeOptions,
  getTransactionDetails,
  humanReadable,
  loadingState,
  truncateString,
  type IWalletInStorage,
} from "~/utils";
import { type DataRowProps, type IStateData } from "../table.interface";

export const DataRowDesktop = ({
  row,
  address,
  handleOpenAccept,
  handleOpenRetract,
  handleGoToDeposit,
}: DataRowProps) => {
  const [state, setState] = useState<IStateData>(loadingState);
  const { client } = useContext(TSSDKContext);

  useEffect(() => {
    if (client) {
      const walletInfo = window.localStorage.getItem("walletInfo");
      const addressLocalStorage = walletInfo
        ? (JSON.parse(walletInfo) as IWalletInStorage).address
        : "";

      void getTransactionDetails(
        client,
        row,
        addressLocalStorage,
        handleOpenRetract,
        handleOpenAccept,
        handleGoToDeposit,
        setState,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const hasStarted =
    new Date(row.start).toISOString() < new Date().toISOString();

  if (state.text === "Retract Offer") {
    console.log(state, hasStarted, address);
  }

  return (
    <div key={row.id} className="table-row">
      <div className="table-cell w-1/4">
        <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
          {row.offered.icon}
          <p className="font-bold">
            <abbr title={row.offered.amount + " " + row.offered.tokenName}>
              {humanReadable(Number(row.offered.amount), 2)}&nbsp;
              {truncateString(row.offered.tokenName, 7)}
            </abbr>
          </p>
        </div>
      </div>
      <div className="table-cell w-1/4">
        <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
          {row.desired.icon}
          <p className="font-bold">
            <abbr title={row.desired.amount + " " + row.desired.tokenName}>
              {humanReadable(Number(row.desired.amount), 2)}&nbsp;
              {truncateString(row.desired.tokenName, 7)}
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
          <div className="w-36">
            <Button
              size={SIZE.SMALL}
              onClick={state.action}
              disabled={
                !address ||
                state.disabled ||
                (!hasStarted && address !== row.createdBy)
              }
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
