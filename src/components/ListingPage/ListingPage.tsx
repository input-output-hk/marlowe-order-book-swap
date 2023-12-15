import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useCardano } from "use-cardano";
import { Table } from "~/components/Table/Table";
import { type IPagination } from "~/pages/listing";
import {
  ICON_SIZES,
  SortOrder,
  filterTableData,
  type IFilters,
  type ISort,
  type ITableData,
} from "~/utils";
import { Loading } from "../Loading/Loading";
import { UtilityDesktop } from "./UtilityDesktop";
import { UtilityMobile } from "./UtilityMobile";

interface ListingPageProps {
  listingData: Array<ITableData> | null;
  pagination: IPagination;
  setPagination: Dispatch<SetStateAction<IPagination>>;
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const ListingPage = ({
  listingData,
  pagination,
  setPagination,
  filters,
  setFilters,
  loading,
  setLoading,
}: ListingPageProps) => {
  const { account } = useCardano();

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

  // Sorting is disabled for now, we need to find a way to search contracts by expiryDate
  // const sortedData = sortTableData(listingData, sort);
  const data = filterTableData(listingData ?? [], filters);

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
        {loading || !listingData ? (
          <div className="flex flex-grow items-center justify-center py-36 md:py-28">
            <Loading sizeDesktop={ICON_SIZES.XXXL} sizeMobile={ICON_SIZES.XL} />
          </div>
        ) : (
          <Table
            data={data}
            sort={sort}
            setSort={setSort}
            pagination={pagination}
            setPagination={setPagination}
          />
        )}
      </div>
    </main>
  );
};
