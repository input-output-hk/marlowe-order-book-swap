import { COLORS, truncateString } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import type { TableProps } from "./table.interface";

export const TableBodyDesktop = ({
  data,
  handleOpenAccept,
  handleOpenRetract,
}: TableProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return (
    <div className="hidden md:table-row-group">
      {data.map((row) => (
        <div key={row.id} className="table-row">
          <div className="table-cell w-1/4">
            <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
              {row.offered.icon}
              <p className="font-bold">
                {row.offered.amount}
                <abbr title={row.offered.token}>
                  {truncateString(row.offered.token, 16)}
                </abbr>
              </p>
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex items-center gap-2 py-6 pl-[20%] xl:pl-[30%] 2xl:pl-[37%]">
              {row.desired.icon}
              <p className="font-bold">
                {row.desired.amount}
                <abbr title={row.desired.token}>
                  {truncateString(row.desired.token, 16)}
                </abbr>
              </p>
            </div>
          </div>
          <div className="table-cell w-1/4 text-center">
            <div className="items-center justify-center px-2 py-6">
              {new Date(row.expiry).toLocaleDateString(undefined, options)}
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex items-center justify-center">
              {/* TODO: change when we implement wallets */}
              {row.createdBy === process.env.NEXT_PUBLIC_OWN_ADDRESS ? (
                <div>
                  <Button
                    size={SIZE.SMALL}
                    color={COLORS.RED}
                    onClick={handleOpenRetract(row)}
                  >
                    Retract offer
                  </Button>
                </div>
              ) : (
                <div>
                  <Button size={SIZE.SMALL} onClick={handleOpenAccept(row)}>
                    Accept Offer
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
