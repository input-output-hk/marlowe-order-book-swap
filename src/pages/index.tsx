import Head from "next/head";

import { Table } from "~/components/Table/Table";
import { example } from "~/example";

export default function Home() {
  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <main className="px-4 py-4">
        <Table data={example} />
      </main>
    </>
  );
}
