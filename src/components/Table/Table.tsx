import { TableBodyDesktop } from "./TableBodyDesktop";
import { TableBodyMobile } from "./TableBodyMobile";
import { TableHead } from "./TableHead";
import type { TableProps } from "./table.interface";

export const Table = ({ data }: TableProps) => {
  return (
    <>
      <div className="hidden min-h-min w-full md:table">
        <TableHead />
        <TableBodyDesktop data={data} />
      </div>
      <TableBodyMobile data={data} />
    </>
  );
};
