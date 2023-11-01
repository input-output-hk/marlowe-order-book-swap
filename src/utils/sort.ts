import { SortOrder, type ISort, type ITableData } from "./interfaces";

const sortByExpiry = (data: ITableData[], sortOrder: string) => {
  return data.sort((a, b) => {
    const aDate = new Date(a.expiry);
    const bDate = new Date(b.expiry);

    if (sortOrder === SortOrder.ASC) {
      return aDate.getTime() - bDate.getTime();
    } else {
      return bDate.getTime() - aDate.getTime();
    }
  });
};

export const sortTableData = (data: ITableData[], sort: ISort) => {
  const { sortBy, sortOrder } = sort;

  if (sortBy === "expiryDate") {
    return sortByExpiry(data, sortOrder);
  }

  return data;
};
