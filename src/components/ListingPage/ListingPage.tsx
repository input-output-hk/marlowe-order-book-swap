import { useState, type Dispatch, type SetStateAction } from "react";
import { Table } from "~/components/Table/Table";
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
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>;
  loading: boolean;
}

export const ListingPage = ({
  listingData,
  filters,
  setFilters,
  loading,
}: ListingPageProps) => {
  const [sort, setSort] = useState<ISort>({
    sortBy: "expiryDate",
    sortOrder: SortOrder.ASC,
  });

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
          <Table data={data} sort={sort} setSort={setSort} />
        )}
      </div>
    </main>
  );
};
