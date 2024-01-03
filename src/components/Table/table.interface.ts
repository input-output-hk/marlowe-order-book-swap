import type { Dispatch, SetStateAction } from "react";
import type { IPagination } from "~/pages/listing";
import type { COLORS, ISort, ITableData } from "~/utils";

export interface TableProps {
  data: Array<ITableData>;
  handleOpenRetract: (row: ITableData) => () => void;
  handleOpenAccept: (row: ITableData) => () => void;
  pagination?: IPagination;
  setPagination?: Dispatch<SetStateAction<IPagination>>;
}

export interface TablePropsWithSort {
  data: Array<ITableData>;
  pagination: IPagination;
  setPagination: Dispatch<SetStateAction<IPagination>>;
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}

export interface ITableFooter {
  pagination: IPagination;
}

export interface DataRowProps {
  row: ITableData;
  address: string | undefined;
  handleOpenRetract: (row: ITableData) => () => void;
  handleOpenAccept: (row: ITableData) => () => void;
}

export interface IStateData {
  disabled: boolean;
  text: string;
  action: <T extends never[]>(...args: T) => void;
  color?: COLORS;
}
