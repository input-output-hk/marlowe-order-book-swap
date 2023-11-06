import Image from "next/image";
import LogoIcon from "~/../public/marlowe.svg";
import { ICON_SIZES } from "~/utils";

interface LoadingProps {
  size?: (typeof ICON_SIZES)[keyof typeof ICON_SIZES];
}

export const Loading = ({ size = ICON_SIZES.XXL }: LoadingProps) => {
  return (
    <div className="animate-ping">
      <Image src={LogoIcon as string} alt="Loading..." height={size} />
    </div>
  );
};
