import { useState } from "react";
import { Table } from "~/components/Table/Table";
import { type ITableData } from "~/utils";
import { UtilityDesktop } from "./UtilityDesktop";
import { UtilityMobile } from "./UtilityMobile";

interface ListingPageProps {
  listingData: Array<ITableData>;
}

export const ListingPage = ({ listingData }: ListingPageProps) => {
  const [filterOwnListings, setFilterOwnListings] = useState(false);

  const data = filterOwnListings
    ? listingData.filter(
        (e) => e.createdBy === process.env.NEXT_PUBLIC_OWN_ADDRESS,
      )
    : listingData;

  return (
    <main className="flex h-fit w-full flex-grow flex-col gap-4 ">
      <UtilityMobile
        filterOwnListings={filterOwnListings}
        setFilterOwnListings={setFilterOwnListings}
      />
      <UtilityDesktop
        filterOwnListings={filterOwnListings}
        setFilterOwnListings={setFilterOwnListings}
      />

      <div className="mx-4 mb-4 rounded-lg shadow-container md:mx-12 lg:mx-24 lg:p-4 xl:mx-32 xl:p-10">
        <Table data={data} />
      </div>
    </main>
  );
};
