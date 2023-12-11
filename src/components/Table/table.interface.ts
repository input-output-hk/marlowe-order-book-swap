import type { Dispatch, SetStateAction } from "react";
import type { IPagination } from "~/pages/listing";
import type { ISort, ITableData } from "~/utils";

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
  setPagination: Dispatch<SetStateAction<IPagination>>;
}
