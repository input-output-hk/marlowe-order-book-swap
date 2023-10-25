import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import SwapIcon from "public/swap.svg";
import { COLORS } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import type { TableBodyProps } from "./table.interface";

export const TableBodyMobile = ({ data }: TableBodyProps) => {
  const truncateText = (text: string, letters: number) => {
    return text.length > letters ? text.substring(0, letters) + "..." : text;
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-m-light-purple p-4 md:hidden">
      {data.map((row) => {
        const difference =
          new Date(row.expiry).getTime() - new Date().getTime();
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );

        const expires =
          days > 0
            ? `${days} days ${hours}h`
            : hours > 0
            ? `${hours} hours ${minutes}m`
            : `${minutes} minutes`;

        return (
          <div
            key={row.id}
            className="flex flex-col gap-2 rounded-lg  bg-white py-2"
          >
            <div className="flex justify-evenly px-20 text-sm opacity-30">
              <p>Offered</p>
              <Image src={SwapIcon as string} alt={"<-->"} />
              <p>Desired</p>
            </div>
            <div className="flex justify-between px-4">
              <div className="flex gap-2">
                {/* TODO: replace with icons from marlowe runtime */}
                <Image src={MarloweIcon as string} alt="M" width={16} />
                <p>
                  {row.offered.amount} {truncateText(row.offered.token, 7)}
                </p>
              </div>
              <div className="flex gap-2">
                <Image src={MarloweIcon as string} alt="M" width={16} />
                <p>
                  {row.desired.amount} {truncateText(row.desired.token, 7)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 pt-2">
              <div>Expires in {expires}</div>
              <div className="w-1/3">
                {/* TODO: change when we implement wallets */}
                {row.createdBy === "me" ? (
                  <div>
                    <Button size={SIZE.SMALL} color={COLORS.RED}>
                      Retract
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button size={SIZE.SMALL}>Accept</Button>
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
