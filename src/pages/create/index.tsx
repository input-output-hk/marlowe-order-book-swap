import Head from "next/head";
import { CreateListing } from "~/components/CreateListing/CreateListing";
import { Footer } from "~/components/Footer/Footer";

export default function CreateListingPage() {
  return (
    <>
      <Head>
        <title>Order Book Swap Prototype - Create</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <CreateListing />
      <Footer />
    </>
  );
}
