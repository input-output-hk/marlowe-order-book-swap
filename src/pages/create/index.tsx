import Head from "next/head";
import { CreateListing } from "~/components/CreateListing/CreateListing";
import { Footer } from "~/components/Footer/Footer";
import { HEADER_TITLE } from "~/utils";

export default function CreateListingPage() {
  return (
    <>
      <Head>
        <title>{HEADER_TITLE} - Create</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>

      <CreateListing />
      <Footer />
    </>
  );
}
