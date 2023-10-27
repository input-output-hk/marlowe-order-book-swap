import type { Dispatch, SetStateAction } from "react";

export interface UtilityProps {
  filterOwnListings: boolean;
  setFilterOwnListings: Dispatch<SetStateAction<boolean>>;
}
