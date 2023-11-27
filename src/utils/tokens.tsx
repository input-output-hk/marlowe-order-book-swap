import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import { ICON_SIZES } from "./iconSizes";

export const TOKENS = {
  ADA: "ADA",
  TGENS: "tGENS",
  TWRT: "tWRT",
  TWMT: "tWMT",
  TMIN: "tMIN",
} as const;

export type TOKENS = (typeof TOKENS)[keyof typeof TOKENS];

export const tokensData: Record<
  TOKENS,
  { currency_symbol: string; token_name: string; icon: JSX.Element }
> = {
  [TOKENS.ADA]: {
    currency_symbol: "",
    token_name: "",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.TGENS]: {
    currency_symbol: "c6e65ba7878b2f8ea0ad39287d3e2fd256dc5c4160fc19bdf4c4d87e",
    token_name: "tGENS",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.TWRT]: {
    currency_symbol: "f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e3",
    token_name: "tWRT",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.TWMT]: {
    currency_symbol: "f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e3",
    token_name: "tWMT",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.TMIN]: {
    currency_symbol: "f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e3",
    token_name: "tMIN",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
};
