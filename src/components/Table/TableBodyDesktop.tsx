import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import { COLORS } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import type { TableBodyProps } from "./table.interface";

export const TableBodyDesktop = ({ data }: TableBodyProps) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
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
            <div className="flex items-center gap-2 py-6 pl-4 lg:pl-12 xl:pl-20 2xl:pl-32">
              <Image src={MarloweIcon as string} alt="M" width={16} />
              <p>
                {row.offered.amount} {row.offered.token}
              </p>
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex items-center gap-2 py-6 pl-4 lg:pl-12 xl:pl-20 2xl:pl-32">
              <Image src={MarloweIcon as string} alt="M" width={16} />
              <p>
                {row.desired.amount} {row.desired.token}
              </p>
            </div>
          </div>
          <div className="table-cell w-1/5 text-center md:w-1/4">
            <div className="items-center justify-center px-2 py-6">
              {new Date(row.expiry).toLocaleDateString(undefined, options)}
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex items-center justify-center">
              {/* TODO: change when we implement wallets */}
              {row.createdBy === "me" ? (
                <div>
                  <Button size={SIZE.SMALL} color={COLORS.RED}>
                    Retract offer
                  </Button>
                </div>
              ) : (
                <div>
                  <Button size={SIZE.SMALL}>Accept Offer</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
