import { TableBody } from "./TableBody";
import { TableHead } from "./TableHead";

interface TableProps {
  columns: Array<{ column: string; icon: JSX.Element }>;
  data: Array<{
    id: number;
    createdBy: string;
    offered: { token: string; amount: number };
    desired: { token: string; amount: number };
    expiry: string;
  }>;
}

export const Table = ({ columns, data }: TableProps) => {
  return (
    <div className="table min-h-min w-full">
      <TableHead columns={columns} />
      <TableBody data={data} />
    </div>
  );
};
