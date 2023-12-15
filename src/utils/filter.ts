import type { IFilters, ITableData } from "./interfaces";

const filterMyListing = (data: ITableData[], owner: string) => {
  return data.filter((item) => item.createdBy === owner);
};

export const filterTableData = (data: ITableData[], filters: IFilters) => {
  const { filterOwnListings, owner } = filters;
  console.log(owner);

  let filteredData = data;

  if (filterOwnListings) {
    filteredData = filterMyListing(filteredData, owner);
  }

  return filteredData;
};
