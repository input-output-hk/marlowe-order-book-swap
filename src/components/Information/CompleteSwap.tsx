import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import CompleteIcon from "public/complete.svg";
import CubeIcon from "public/cube.svg";
import LeftArrowIcon from "public/go-back.svg";
import SeeMoreIcon from "public/see-more.svg";
import { COLORS, ICON_SIZES, PAGES } from "~/utils";
import { Button, SIZE } from "../Button/Button";

interface IQueryParams {
  id?: string;
}

export const CompleteSwap = () => {
  const { query }: { query: IQueryParams } = useRouter();
  const { id } = query;
  const goToScanner = () => {
    if (id) {
      // TODO: Change when preprod is not used
      window.open(
        `https://preprod.marlowescan.com/contractView?tab=info&contractId=${id}%231`,
        "_blank",
      );
    }
  };

  return (
    <main className="flex h-full w-full flex-col items-center text-center">
      <div className="m-auto mt-3 flex w-2/3 flex-col items-center justify-center gap-5 align-middle lg:w-1/3">
        <Image src={CompleteIcon as string} height={ICON_SIZES.XXXL} alt="" />
        <div className="text-3xl font-extrabold">
          Nice, you&apos;ve completed a swap! 🎉
        </div>
        <div>
          You can now view the transaction on the Marlowe Scanner using the
          button below,
        </div>
        <div className="flex w-4/5 flex-col gap-7">
          <Button size={SIZE.REGULAR} filled onClick={goToScanner}>
            <div className="flex items-center justify-center gap-3 whitespace-normal break-words text-sm sm:text-base">
              <div className="hidden sm:block">
                <Image src={CubeIcon as string} height={ICON_SIZES.S} alt="" />
              </div>
              View transaction
              <div className="hidden sm:block">
                <Image
                  src={SeeMoreIcon as string}
                  height={ICON_SIZES.S}
                  alt="→"
                />
              </div>
            </div>
          </Button>
          <Link href={PAGES.LISTING}>
            <Button size={SIZE.REGULAR} color={COLORS.BLACK}>
              <div className="flex justify-center gap-3 whitespace-normal break-words text-sm sm:text-base">
                <div className="hidden sm:block">
                  <Image
                    src={LeftArrowIcon as string}
                    height={ICON_SIZES.S}
                    alt=""
                  />
                </div>
                Return to vesting schedule
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};
