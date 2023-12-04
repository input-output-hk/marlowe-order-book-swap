import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useCardano } from "use-cardano";
import { Table } from "~/components/Table/Table";
import {
  SortOrder,
  sortTableData,
  type IFilters,
  type ISort,
  type ITableData,
} from "~/utils";
import { Loading } from "../Loading/Loading";
import { UtilityDesktop } from "./UtilityDesktop";
import { UtilityMobile } from "./UtilityMobile";

interface ListingPageProps {
  listingData: Array<ITableData> | null;
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
}

export const ListingPage = ({
  listingData,
  filters,
  setFilters,
}: ListingPageProps) => {
  const { account } = useCardano();

  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState<ISort>({
    sortBy: "expiryDate",
    sortOrder: SortOrder.ASC,
  });

  useEffect(() => {
    const walletInfo = window.localStorage.getItem("walletInfo");
    if (!account.address || walletInfo) {
      setLoading(false);
    }
    if (account.address) {
      setFilters((prev) => {
        return { ...prev, owner: account.address! };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]);

  if (loading || !listingData) {
    return (
      <div className="flex flex-grow items-center justify-center">
        <Loading />
      </div>
    );
  }

  const sortedData = sortTableData(listingData, sort);

  return (
    <main className="flex h-fit w-full flex-grow flex-col gap-4">
      <UtilityMobile
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
      />
      <UtilityDesktop filters={filters} setFilters={setFilters} />

      <div className="mx-4 mb-4 rounded-lg shadow-container md:mx-12 lg:mx-24 lg:p-4 xl:mx-32 xl:p-10">
        <Table data={sortedData} sort={sort} setSort={setSort} />
      </div>
    </main>
  );
};
