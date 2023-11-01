import type { Dispatch, SetStateAction } from "react";
import type { ISort, ITableData } from "~/utils";

export interface TableProps {
  data: Array<ITableData>;
}

export interface TablePropsWithSort extends TableProps {
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}
