import Head from "next/head";
import { CreateListing } from "~/components/CreateListing/CreateListing";
import { Header } from "~/components/Header/Header";

export default function CreateListingPage() {
  return (
    <>
      <Head>
        <title>Create Listing</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <Header />
      <CreateListing />
    </>
  );
}
