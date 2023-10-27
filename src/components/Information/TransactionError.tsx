import Image from "next/image";
import Fail from "public/fail.svg";
import LeftArrowIcon from "public/go-back.svg";
import { COLORS } from "~/utils";
import { Button, SIZE } from "../Button/Button";

export const TransactionError = () => {
  return (
    <main className="flex h-full w-full flex-col items-center text-center">
      <div className="m-auto mt-3 flex w-3/5 flex-col items-center justify-center gap-5 align-middle md:w-1/3">
        <Image src={Fail as string} height={60} alt="X" />
        <div className="text-3xl font-extrabold">Transaction failed</div>
        <div className="text-left">
          There was an error creating the transaction, this could be for a
          number of reasons:
          <ul className="my-3 max-w-md list-inside list-disc">
            <li>The user&apos;s wallet does not contain sufficient funds.</li>
            <li>The network is congested. </li>
            <li>Marlowe Runtime may have failed.</li>
          </ul>
        </div>
        <div className="w-full lg:w-4/5">
          <Button size={SIZE.REGULAR} color={COLORS.BLACK}>
            <div className="flex justify-center gap-3">
              <Image src={LeftArrowIcon as string} height={20} alt="←" />
              Return to vesting schedule
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
};
