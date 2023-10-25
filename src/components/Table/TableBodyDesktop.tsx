import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
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
            <div className="flex flex-col items-center gap-2 px-2 py-4 sm:flex-row sm:px-6 md:px-10 lg:px-14">
              <Image
                src={MarloweIcon as string}
                alt="M"
                width={16}
                className="sm:absolute"
              />
              <p className="sm:pl-6">
                {row.offered.amount} {row.offered.token}
              </p>
            </div>
          </div>
          <div className="table-cell w-1/4">
            <div className="flex flex-col items-center gap-2 px-2 py-4 sm:flex-row sm:px-6 md:px-10 lg:px-14">
              <Image
                src={MarloweIcon as string}
                alt="M"
                width={16}
                className="sm:absolute"
              />
              <p className="sm:pl-6">
                {row.desired.amount} {row.desired.token}
              </p>
            </div>
          </div>
          <div className="table-cell w-1/5 text-center md:w-1/4">
            <div className="items-center justify-center px-2 py-4 md:flex">
              {new Date(row.expiry).toLocaleDateString(undefined, options)}
            </div>
          </div>
          <div className="table-cell w-1/6 sm:w-1/5 md:w-1/4">
            <div className="flex items-center justify-center">
              <div className="md:hidden">
                <Button size={SIZE.SMALL}>Retract</Button>
              </div>
              <div className="hidden md:block">
                <Button size={SIZE.SMALL}>Accept Offer</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
