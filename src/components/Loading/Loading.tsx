import Image from "next/image";
import LogoIcon from "~/../public/marlowe.svg";
import { ICON_SIZES } from "~/utils";

interface LoadingProps {
  sizeDesktop?: (typeof ICON_SIZES)[keyof typeof ICON_SIZES];
  sizeMobile?: (typeof ICON_SIZES)[keyof typeof ICON_SIZES];
}

export const Loading = ({
  sizeDesktop = ICON_SIZES.XXXL,
  sizeMobile = ICON_SIZES.XXL,
}: LoadingProps) => {
  return (
    <>
      <div className="hidden animate-ping sm:block">
        <Image src={LogoIcon as string} alt="Loading..." height={sizeDesktop} />
      </div>
      <div className="block animate-ping sm:hidden">
        <Image src={LogoIcon as string} alt="Loading..." height={sizeMobile} />
      </div>
    </>
  );
};
