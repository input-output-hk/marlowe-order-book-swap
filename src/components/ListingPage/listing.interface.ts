import type { Dispatch, SetStateAction } from "react";
import type { IFilters } from "~/utils";
import { type ISort } from "~/utils";

export interface UtilityProps {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
}

export interface UtilityPropsMobile extends UtilityProps {
  sort: ISort;
  setSort: Dispatch<SetStateAction<ISort>>;
}
