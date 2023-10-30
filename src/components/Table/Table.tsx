import dynamic from "next/dynamic";
import Image from "next/image";
import SearchNoneIcon from "public/search-none.svg";
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
  if (!data.length) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Image src={SearchNoneIcon as string} alt="X" width={64} height={64} />
        <div className="text-2xl font-bold text-m-dark-gray">
          There is no listing to display
        </div>
      </div>
    );
  }

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
