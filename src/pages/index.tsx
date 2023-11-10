import Head from "next/head";
import { Header } from "~/components/Header/Header";
import { WalletSelect } from "~/components/WalletSelect/WalletSelect";
import { HEADER_TITLE, PAGES, headerLinks } from "~/utils";

export default function Home() {
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

      <main className="h-screen w-full flex-grow px-4 pb-48 pt-4 sm:px-28 md:flex md:items-center md:justify-center md:px-0 ">
        <WalletSelect />
      </main>
    </>
  );
}
