import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import { useState } from "react";

interface TableBodyProps {
  data: Array<{
    id: number;
    createdBy: string;
    offered: { token: string; amount: number };
    desired: { token: string; amount: number };
    expiry: string;
  }>;
}

export const TableBody = ({ data }: TableBodyProps) => {
  const [options, setOptions] = useState<Intl.DateTimeFormatOptions>({
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="table-row-group">
      {data.map((row) => (
        <div key={row.id} className="table-row">
          <div className="table-cell w-1/4">
            <div className="flex flex-col items-center gap-2 px-2 py-4 text-xs sm:flex-row sm:px-6 sm:text-sm md:px-10 md:text-base lg:px-14 lg:text-lg">
              <Image
                src={MarloweIcon}
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
            <div className="flex flex-col items-center gap-2 px-2 py-4 text-xs sm:flex-row sm:px-6 sm:text-sm md:px-10 md:text-base lg:px-14 lg:text-lg">
              <Image
                src={MarloweIcon}
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
            <div className="flex items-center justify-center px-2 py-4 text-xs sm:px-5 sm:text-sm md:px-8 md:text-base lg:text-lg">
              {new Date(row.expiry).toLocaleDateString(undefined, options)}
            </div>
          </div>
          <div className="table-cell w-1/6 sm:w-1/5 md:w-1/4">
            <div className="flex items-center justify-center py-4">
              <button className="border border-black md:hidden">Retract</button>
              <button className="hidden border border-black md:block">
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
