import type { ITokenAmount } from "~/utils";

export interface TableProps {
  data: Array<ITableData>;
}

export interface ITableData {
  id: number;
  createdBy: string;
  offered: ITokenAmount;
  desired: ITokenAmount;
  expiry: string;
}
