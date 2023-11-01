import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import { ICON_SIZES } from "./iconSizes";
import type { IToken } from "./interfaces";

export const exampleTokens: IToken[] = [
  {
    token: "ADA",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  {
    token: "ADA2",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
];
