import Head from "next/head";
import Image from "next/image";
import { CreateListing } from "~/components/CreateListing/CreateListing";
import { Header } from "~/components/Header/Header";
import { ICON_SIZES, type IToken } from "~/utils";

import CardanoIcon from "public/cardano.svg";

export default function CreateListingPage() {
  const example: IToken[] = [
    {
      token: "ADA",
      icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
    },
    {
      token: "ADA2",
      icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
    },
  ];
  return (
    <>
      <Head>
        <title>Create Listing</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <Header />
      <CreateListing tokenOptions={example} />
    </>
  );
}
