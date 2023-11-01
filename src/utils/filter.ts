import type { IFilters, ITableData } from "./interfaces";

const filterMyListing = (data: ITableData[], owner: string) => {
  return data.filter((item) => item.createdBy === owner);
};

const filterByTokenName = (data: ITableData[], tokenName: string) => {
  return data.filter(
    (item) =>
      item.desired.token.toLowerCase().includes(tokenName.toLowerCase()) ||
      item.offered.token.toLowerCase().includes(tokenName.toLowerCase()),
  );
};

export const filterTableData = (data: ITableData[], filters: IFilters) => {
  const { filterOwnListings, owner, searchQuery } = filters;

  let filteredData = data;

  if (filterOwnListings) {
    filteredData = filterMyListing(filteredData, owner);
  }

  if (searchQuery) {
    filteredData = filterByTokenName(filteredData, searchQuery);
  }

  return filteredData;
};
