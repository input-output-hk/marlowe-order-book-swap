import { type MarloweState } from "@marlowe.io/language-core-v1";
import type { SupportedWalletName } from "@marlowe.io/wallet/browser";

export interface IToken {
  token: string;
  icon: JSX.Element;
  currency: string;
}

export interface ITokenAmount extends IToken {
  amount: number;
}

export interface ITableData {
  id: string;
  createdBy: string;
  offered: ITokenAmount;
  desired: ITokenAmount;
  expiry: string;
  start: string;
  state: MarloweState;
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

export interface IWalletInStorage {
  address: string;
  walletProvider: SupportedWalletName;
}

export interface ILink {
  displayText: string;
  href: string;
}
