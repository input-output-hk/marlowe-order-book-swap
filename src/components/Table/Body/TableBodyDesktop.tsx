import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getAddress } from "~/utils";
import type { TableProps } from "../table.interface";
import { DataRowDesktop } from "./DataRowDesktop";

export const TableBodyDesktop = ({
  data,
  handleOpenAccept,
  handleOpenRetract,
  handleGoToDeposit,
}: TableProps) => {
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);
  const { runtimeLifecycle } = useContext(TSSDKContext);

  useEffect(() => {
    if (runtimeLifecycle) void getAddress(runtimeLifecycle, setMyAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  return (
    <div className="hidden md:table-row-group">
      {data.map((row) => {
        return (
          <DataRowDesktop
            key={row.id}
            row={row}
            handleOpenAccept={handleOpenAccept}
            handleOpenRetract={handleOpenRetract}
            handleGoToDeposit={handleGoToDeposit}
            address={myAddress}
          />
        );
      })}
    </div>
  );
};
