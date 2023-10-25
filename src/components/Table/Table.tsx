import { TableBodyDesktop } from "./TableBodyDesktop";
import { TableBodyMobile } from "./TableBodyMobile";
import { TableHead } from "./TableHead";

interface TableProps {
  data: Array<{
    id: number;
    createdBy: string;
    offered: { token: string; amount: number };
    desired: { token: string; amount: number };
    expiry: string;
  }>;
}

export const Table = ({ data }: TableProps) => {
  return (
    <div className="table min-h-min w-full">
      <TableHead />
      <TableBodyMobile data={data} />
      <TableBodyDesktop data={data} />
    </div>
  );
};
