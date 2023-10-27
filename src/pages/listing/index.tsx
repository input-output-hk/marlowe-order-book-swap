import Head from "next/head";
import { Header } from "~/components/Header/Header";
import { ListingPage } from "~/components/ListingPage/ListingPage";

export default function Listing() {
  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <Header />

      <ListingPage />
    </>
  );
}
