import type { Dispatch, SetStateAction } from "react";
import type { ISort, ITableData } from "~/utils";

export interface TableProps {
  data: Array<ITableData>;
  handleOpenRetract: (row: ITableData) => () => void;
  handleOpenAccept: (row: ITableData) => () => void;
  currentPage?: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
}

export interface TablePropsWithSort {
  data: Array<ITableData>;
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}

export interface ITableFooter {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}
