import { useContext, useEffect, useState } from "react";
import { Loading } from "~/components/Loading/Loading";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getAddress } from "~/utils";
import type { TableProps } from "../table.interface";
import { DataRowDesktop } from "./DataRowDesktop";

export const TableBodyDesktop = ({ data, states }: TableProps) => {
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);
  const { runtimeLifecycle } = useContext(TSSDKContext);

  useEffect(() => {
    if (runtimeLifecycle) void getAddress(runtimeLifecycle, setMyAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  if (!states) {
    return <Loading />;
  }

  return (
    <div className="hidden md:table-row-group">
      {data.map((row) => {
        const state = states.find((state) => state.contractId === row.id)!;
        return (
          <DataRowDesktop
            key={row.id}
            row={row}
            state={state}
            address={myAddress}
          />
        );
      })}
    </div>
  );
};
