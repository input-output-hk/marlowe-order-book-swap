import Image from "next/image";
import SwapIcon from "public/swap.svg";
import { COLORS, getExpiration, truncateString } from "~/utils";
import { Button, SIZE } from "../Button/Button";
import type { TableProps } from "./table.interface";

export const TableBodyMobile = ({ data }: TableProps) => {
  return (
    <>
      <div className="flex flex-col gap-2 rounded-lg bg-m-light-purple p-4 md:hidden">
        {data.map((row) => {
          return (
            <div
              key={row.id}
              className="flex flex-col gap-2 rounded-lg bg-white py-2"
            >
              <div className="flex justify-evenly px-20 text-sm opacity-30">
                <p>Offered</p>
                <Image src={SwapIcon as string} alt={"<-->"} />
                <p>Desired</p>
              </div>
              <div className="flex justify-between px-4">
                <div className="flex gap-2">
                  {row.offered.icon}
                  <p className="font-bold">
                    {row.offered.amount}{" "}
                    <abbr title={row.offered.token}>
                      {truncateString(row.offered.token, 7)}
                    </abbr>
                  </p>
                </div>
                <div className="flex gap-2">
                  {row.desired.icon}
                  <p className="font-bold">
                    {row.desired.amount}{" "}
                    <abbr title={row.desired.token}>
                      {truncateString(row.desired.token, 7)}
                    </abbr>
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 pt-2">
                <div>Expires in {getExpiration(row.expiry)}</div>
                <div className="w-1/3">
                  {/* TODO: change when we implement wallets */}
                  {row.createdBy === process.env.NEXT_PUBLIC_OWN_ADDRESS ? (
                    <Button size={SIZE.XSMALL} color={COLORS.RED}>
                      Retract
                    </Button>
                  ) : (
                    <Button size={SIZE.XSMALL}>Accept</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-16 w-full rounded-b-lg bg-m-light-purple md:hidden" />
    </>
  );
};
