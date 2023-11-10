import { useEffect, useState } from "react";
import { Table } from "~/components/Table/Table";
import { env } from "~/env.mjs";
import {
  SortOrder,
  filterTableData,
  sortTableData,
  type IFilters,
  type ISort,
  type ITableData,
} from "~/utils";
import { Loading } from "../Loading/Loading";
import { UtilityDesktop } from "./UtilityDesktop";
import { UtilityMobile } from "./UtilityMobile";

interface ListingPageProps {
  listingData: Array<ITableData>;
}

export const ListingPage = ({ listingData }: ListingPageProps) => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IFilters>({
    filterOwnListings: false,
    searchQuery: "",
    owner: env.NEXT_PUBLIC_OWN_ADDRESS,
  });
  const [sort, setSort] = useState<ISort>({
    sortBy: "expiryDate",
    sortOrder: SortOrder.ASC,
  });

  const sortedData = sortTableData(listingData, sort);
  const data = filterTableData(sortedData, filters);

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");
    setLoading(walletInfo !== "{}" && walletInfo !== null);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-grow items-center justify-center ">
        <Loading />
      </div>
    );
  }

  return (
    <main className="flex h-fit w-full flex-grow flex-col gap-4 ">
      <UtilityMobile
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
      />
      <UtilityDesktop filters={filters} setFilters={setFilters} />

      <div className="mx-4 mb-4 rounded-lg shadow-container md:mx-12 lg:mx-24 lg:p-4 xl:mx-32 xl:p-10">
        <Table data={data} sort={sort} setSort={setSort} />
      </div>
    </main>
  );
};
