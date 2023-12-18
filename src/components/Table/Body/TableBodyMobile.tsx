import Image from "next/image";
import SwapIcon from "public/swap.svg";
import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  COLORS,
  ICON_SIZES,
  getAddress,
  getExpiration,
  humanReadable,
  truncateString,
} from "~/utils";
import { Button, SIZE } from "../../Button/Button";
import { TableFooterMobile } from "../Footer/TableFooterMobile";
import type { TableProps } from "../table.interface";

export const TableBodyMobile = ({
  data,
  handleOpenAccept,
  handleOpenRetract,
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
          const hasExpired =
            new Date(row.expiry).toISOString() < new Date().toISOString();
          const hasFinished = row.createdBy === undefined;
          const hasStarted =
            new Date(row.start).toISOString() < new Date().toISOString();

          return (
            <div
              key={row.id}
              className="flex flex-col gap-2 rounded-lg bg-white py-2"
            >
              <div className="flex justify-evenly px-20 text-sm opacity-30">
                <p>Offered</p>
                <Image
                  src={SwapIcon as string}
                  alt={"<-->"}
                  height={ICON_SIZES.S}
                />
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
                  {row.createdBy === myAddress ? (
                    <Button
                      size={SIZE.SMALL}
                      color={COLORS.RED}
                      onClick={handleOpenRetract(row)}
                      disabled={!myAddress || hasExpired || !hasStarted}
                    >
                      {hasExpired
                        ? "Offer ended"
                        : !hasStarted
                        ? "Not started"
                        : "Retract offer"}
                    </Button>
                  ) : (
                    <Button
                      size={SIZE.SMALL}
                      onClick={handleOpenAccept(row)}
                      disabled={
                        !myAddress || hasExpired || hasFinished || !hasStarted
                      }
                    >
                      {hasExpired || hasFinished
                        ? "Offer ended"
                        : !hasStarted
                        ? "Not started"
                        : "Accept Offer"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
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
