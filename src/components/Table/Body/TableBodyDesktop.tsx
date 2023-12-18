import { useContext, useEffect, useState } from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import {
  COLORS,
  dateTimeOptions,
  getAddress,
  humanReadable,
  truncateString,
} from "~/utils";
import { Button, SIZE } from "../../Button/Button";
import type { TableProps } from "../table.interface";

export const TableBodyDesktop = ({
  data,
  handleOpenAccept,
  handleOpenRetract,
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
        const hasExpired =
          new Date(row.expiry).toISOString() < new Date().toISOString();
        const hasFinished = row.createdBy === undefined;
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
                {new Date(row.expiry).toLocaleDateString(
                  undefined,
                  dateTimeOptions,
                )}
              </div>
            </div>
            <div className="table-cell w-1/4">
              <div className="flex items-center justify-center">
                {row.createdBy === myAddress ? (
                  <div>
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
                  </div>
                ) : (
                  <div>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
