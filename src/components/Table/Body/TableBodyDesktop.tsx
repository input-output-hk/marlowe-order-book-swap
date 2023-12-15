import { useCardano } from "use-cardano";
import {
  COLORS,
  dateTimeOptions,
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
  const { account } = useCardano();

  return (
    <div className="hidden md:table-row-group">
      {data.map((row) => {
        const hasExpired =
          new Date(row.expiry).toISOString() < new Date().toISOString();
        const hasFinished = row.createdBy === undefined;
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
                {row.createdBy === account.address ? (
                  <div>
                    <Button
                      size={SIZE.SMALL}
                      color={COLORS.RED}
                      onClick={handleOpenRetract(row)}
                      disabled={!account.address || hasExpired}
                    >
                      {hasExpired ? "Offer ended" : "Retract offer"}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      size={SIZE.SMALL}
                      onClick={handleOpenAccept(row)}
                      disabled={!account.address || hasExpired || hasFinished}
                    >
                      {hasExpired || hasFinished
                        ? "Offer ended"
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
