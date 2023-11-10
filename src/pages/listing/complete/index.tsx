import { Header } from "~/components/Header/Header";
import { CompleteSwap } from "~/components/Information/CompleteSwap";
import { HEADER_TITLE, PAGES, headerLinks } from "~/utils";

export default function CompletePage() {
  return (
    <>
      <Header
        title={HEADER_TITLE}
        links={headerLinks}
        homeLink={PAGES.LISTING}
      />
      <CompleteSwap />
    </>
  );
}
