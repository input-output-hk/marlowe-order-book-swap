import { Header } from "~/components/Header/Header";
import { TransactionError } from "~/components/Information/TransactionError";
import { HEADER_TITLE, PAGES, headerLinks } from "~/utils";

export default function TransactionErrorPage() {
  return (
    <>
      <Header
        title={HEADER_TITLE}
        links={headerLinks}
        homeLink={PAGES.LISTING}
      />
      <TransactionError />
    </>
  );
}
