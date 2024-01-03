import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { getAddress } from "~/utils";
import { TableFooterMobile } from "../Footer/TableFooterMobile";
import type { TableProps } from "../table.interface";
import { DataRowMobile } from "./DataRowMobile";

export const TableBodyMobile = ({
  data,
  handleOpenAccept,
  handleOpenRetractOrDeposit,
  pagination,
  setPagination,
}: TableProps) => {
  const [myAddress, setMyAddress] = useState<string | undefined>(undefined);
  const { runtimeLifecycle } = useContext(TSSDKContext);

  useEffect(() => {
    if (runtimeLifecycle) void getAddress(runtimeLifecycle, setMyAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-m-light-purple p-4 md:hidden">
        {data.map((row) => {
          return (
            <DataRowMobile
              key={row.id}
              row={row}
              handleOpenAccept={handleOpenAccept}
              handleOpenRetract={handleOpenRetractOrDeposit}
              address={myAddress}
            />
          );
        })}
      </div>
      <div className="bg-m-light-purple px-24">
        {pagination && setPagination && (
          <TableFooterMobile pagination={pagination} />
        )}
      </div>
      <div className="h-16 w-full rounded-b-lg bg-m-light-purple md:hidden" />
    </>
  );
};
