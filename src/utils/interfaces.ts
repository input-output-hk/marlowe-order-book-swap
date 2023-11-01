export interface IToken {
  token: string;
  icon: JSX.Element;
}

export interface ITokenAmount extends IToken {
  amount: number;
}

export interface ITableData {
  id: number;
  createdBy: string;
  offered: ITokenAmount;
  desired: ITokenAmount;
  expiry: string;
}

export interface IFilters {
  filterOwnListings: boolean;
  owner: string;
  searchQuery: string;
}

export type SortBy = "expiryDate";
export const SortOrder = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export interface ISort {
  sortBy: SortBy;
  sortOrder: string;
}

export interface IOptions {
  option: string;
  icon: JSX.Element;
}
