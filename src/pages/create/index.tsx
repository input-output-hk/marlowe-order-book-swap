import Head from "next/head";
import { CreateListing } from "~/components/CreateListing/CreateListing";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { HEADER_TITLE, PAGES, headerLinks } from "~/utils";

export default function CreateListingPage() {
  return (
    <>
      <Head>
        <title>{HEADER_TITLE} - Create</title>
        <meta name="description" content="Create Listing" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <Header
        title={HEADER_TITLE}
        links={headerLinks}
        homeLink={PAGES.LISTING}
      />
      <CreateListing />
      <Footer />
    </>
  );
}
