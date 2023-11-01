import type { Dispatch, SetStateAction } from "react";
import type { ISort, ITableData } from "~/utils";

export interface TableProps {
  data: Array<ITableData>;
  handleOpenRetract: (row: ITableData) => () => void;
  handleOpenAccept: (row: ITableData) => () => void;
}

export interface TablePropsWithSort {
  data: Array<ITableData>;
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}
