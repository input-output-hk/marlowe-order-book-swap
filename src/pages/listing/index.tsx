import Head from "next/head";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import { Header } from "~/components/Header/Header";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import { ICON_SIZES, type ITableData } from "~/utils";

export default function Listing() {
  const example: ITableData[] = [
    {
      id: 1,
      createdBy: "addr_test123456789",
      offered: {
        token: "ADA",
        amount: 1.04,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.S} />
        ),
      },
      desired: {
        token: "Marlons",
        amount: 2,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.S} />
        ),
      },
      expiry: "12/26/2023 11:35",
    },
    {
      id: 2,
      createdBy: "test_123",
      offered: {
        token: "ADA",
        amount: 20000,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.S} />
        ),
      },
      desired: {
        token: "Marlons",
        amount: 0.00016,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.S} />
        ),
      },
      expiry: "12/26/2023 16:35",
    },
  ];

  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <Header />

      <ListingPage listingData={example} />
    </>
  );
}
