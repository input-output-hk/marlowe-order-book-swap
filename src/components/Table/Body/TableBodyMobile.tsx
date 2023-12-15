import Image from "next/image";
import SwapIcon from "public/swap.svg";
import { useCardano } from "use-cardano";
import {
  COLORS,
  ICON_SIZES,
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
  const { account } = useCardano();

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
                  {row.createdBy === account.address ? (
                    <Button
                      size={SIZE.XSMALL}
                      color={COLORS.RED}
                      onClick={handleOpenRetract(row)}
                      disabled={!account.address}
                    >
                      Retract
                    </Button>
                  ) : (
                    <Button
                      size={SIZE.XSMALL}
                      onClick={handleOpenAccept(row)}
                      disabled={!account.address}
                    >
                      Accept
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
