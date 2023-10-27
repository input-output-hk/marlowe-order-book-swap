import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import NamiIcon from "public/nami.svg";
import { useState } from "react";
import { Table } from "~/components/Table/Table";
import { UtilityDesktop } from "./UtilityDesktop";
import { UtilityMobile } from "./UtilityMobile";

export const ListingPage = () => {
  const [filterOwnListings, setFilterOwnListings] = useState(false);

  const example = [
    {
      id: 1,
      createdBy: "addr_test123456789",
      offered: {
        token: "ADA",
        amount: 1.04,
        icon: <Image src={NamiIcon as string} alt="M" width={16} />,
      },
      desired: {
        token: "Marlons",
        amount: 2,
        icon: <Image src={MarloweIcon as string} alt="M" width={16} />,
      },
      expiry: "12/26/2023 11:35",
    },
    {
      id: 2,
      createdBy: "test_123",
      offered: {
        token: "ADA",
        amount: 20000,
        icon: <Image src={MarloweIcon as string} alt="M" width={16} />,
      },
      desired: {
        token: "Marlons",
        amount: 0.00016,
        icon: <Image src={NamiIcon as string} alt="M" width={16} />,
      },
      expiry: "12/26/2023 16:35",
    },
  ];

  const data = filterOwnListings
    ? example.filter((e) => e.createdBy === process.env.NEXT_PUBLIC_OWN_ADDRESS)
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
