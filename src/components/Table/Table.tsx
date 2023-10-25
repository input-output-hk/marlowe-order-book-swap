import dynamic from "next/dynamic";
import { TableHead } from "./TableHead";
import type { TableProps } from "./table.interface";

const TableBodyMobile = dynamic(
  () => import("./TableBodyMobile").then((mod) => mod.TableBodyMobile),
  { ssr: false },
);
const TableBodyDesktop = dynamic(
  () => import("./TableBodyDesktop").then((mod) => mod.TableBodyDesktop),
  { ssr: false },
);

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
