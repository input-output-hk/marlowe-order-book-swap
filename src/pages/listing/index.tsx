import Head from "next/head";
import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { ListingPage } from "~/components/ListingPage/ListingPage";
import {
  HEADER_TITLE,
  ICON_SIZES,
  PAGES,
  headerLinks,
  type ITableData,
} from "~/utils";

export default function Listing() {
  const example: ITableData[] = [
    {
      id: 1,
      createdBy: "addr_test123456789",
      offered: {
        token: "ADA",
        amount: 999.0123778979214,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
        ),
      },
      desired: {
        token: "Marlons",
        amount: 278071203701,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
        ),
      },
      expiry: "12/30/2023 11:35",
    },
    {
      id: 2,
      createdBy: "test_123",
      offered: {
        token: "ADA",
        amount: 20000001,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
        ),
      },
      desired: {
        token: "Merlons",
        amount: 0.00123116,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
        ),
      },
      expiry: "12/26/2023 16:35",
    },
    {
      id: 3,
      createdBy: "addr_test123456789",
      offered: {
        token: "ADA",
        amount: 0.00001,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
        ),
      },
      desired: {
        token: "Merluns",
        amount: 10.0010023116,
        icon: (
          <Image src={MarloweIcon as string} alt="M" height={ICON_SIZES.XS} />
        ),
      },
      expiry: "11/29/2023 16:38",
    },
  ];

  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <Header
        title={HEADER_TITLE}
        links={headerLinks}
        homeLink={PAGES.LISTING}
      />

      <ListingPage listingData={example} />

      <Footer />
    </>
  );
}
