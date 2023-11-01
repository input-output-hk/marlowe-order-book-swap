import type { Dispatch, SetStateAction } from "react";
import type { IFilters } from "~/utils";

export interface UtilityProps {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
}
