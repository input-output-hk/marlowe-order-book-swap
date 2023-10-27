import Image from "next/image";
import CompleteIcon from "public/complete.svg";
import CubeIcon from "public/cube.svg";
import LeftArrowIcon from "public/go-back.svg";
import SeeMoreIcon from "public/see-more.svg";
import { COLORS } from "~/utils";
import { Button, SIZE } from "../Button/Button";

export const CompleteSwap = () => {
  return (
    <main className="flex h-full w-full flex-col items-center text-center">
      <div className="m-auto mt-3 flex w-2/3 flex-col items-center justify-center gap-5 align-middle sm:w-1/3">
        <Image src={CompleteIcon as string} height={60} alt="" />
        <div className="text-3xl font-extrabold">
          Nice, you’ve completed a swap! 🎉
        </div>
        <div className="">
          You can now view the transaction on the Marlowe Explorer using the
          button below,
        </div>
        <div className="flex w-4/5 flex-col gap-7">
          <Button size={SIZE.REGULAR} filled>
            <div className="flex justify-center gap-3">
              <Image src={CubeIcon as string} height={20} alt="" />
              View transaction
              <Image src={SeeMoreIcon as string} height={20} alt="→" />
            </div>
          </Button>
          <Button size={SIZE.REGULAR} color={COLORS.BLACK}>
            <div className="flex justify-center gap-3">
              <Image src={LeftArrowIcon as string} height={20} alt="" />
              Return to vesting schedule
            </div>
          </Button>
        </div>
      </div>
    </main>
  );
};
