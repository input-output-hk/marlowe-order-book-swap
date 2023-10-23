import Head from "next/head";
import Image from "next/image";
import CalendarIcon from "public/calendar.svg";
import HandShakeIcon from "public/handshake.svg";
import TagIcon from "public/tag.svg";
import { Table } from "~/components/Table";
import { example } from "~/example";

export default function Home() {
  const columns = [
    { column: "Token Offered", icon: <Image src={TagIcon} alt="tag" /> },
    { column: "Desired Token", icon: <Image src={TagIcon} alt="tag" /> },
    { column: "Expiry Date", icon: <Image src={CalendarIcon} alt="tag" /> },
    { column: "Actions", icon: <Image src={HandShakeIcon} alt="tag" /> },
  ];

  return (
    <>
      <Head>
        <title>Token Swap</title>
        <meta name="description" content="Token Swap Prototype" />
        <link rel="icon" href="/marlowe.svg" />
      </Head>
      <main className="bg-slate-200 px-10 py-4">
        <Table columns={columns} data={example} />
      </main>
    </>
  );
}
