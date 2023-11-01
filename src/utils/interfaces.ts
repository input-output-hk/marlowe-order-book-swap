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

export type SortOrder = "asc" | "desc";
export type SortBy = "expiryDate";

export interface ISort {
  sortBy: SortBy;
  sortOrder: SortOrder;
}
