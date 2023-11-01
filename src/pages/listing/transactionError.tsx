import { Header } from "~/components/Header/Header";
import { TransactionError } from "~/components/Information/TransactionError";

export default function TransactionErrorPage() {
  return (
    <>
      <Header />
      <TransactionError />
    </>
  );
}
