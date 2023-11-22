import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import { ICON_SIZES } from "./iconSizes";
import type { IToken } from "./interfaces";

export const exampleTokens: IToken[] = [
  {
    token: "ADA",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
];

export const TOKENS = {
  ADA: "ADA",
} as const;

export type TOKENS = (typeof TOKENS)[keyof typeof TOKENS];

export const tokensData: Record<
  TOKENS,
  { currency_symbol: string; token_name: string }
> = {
  [TOKENS.ADA]: {
    currency_symbol: "",
    token_name: "",
  },
};
