import { useState } from "react";
import { Table } from "~/components/Table/Table";
import { example } from "~/example";
import { UtilityDesktop } from "./UtilityDesktop";
import { UtilityMobile } from "./UtilityMobile";

export const ListingPage = () => {
  const [filterOwnListings, setFilterOwnListings] = useState(false);

  const data = filterOwnListings
    ? example.filter((e) => e.createdBy === "me")
    : example;

  return (
    <main className="flex-grow-1 flex h-fit w-full flex-col gap-4">
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
