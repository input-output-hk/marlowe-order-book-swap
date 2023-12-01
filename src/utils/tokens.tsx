import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import { ICON_SIZES } from "./iconSizes";

export const TOKENS = {
  ADA: "ADA",
  TGENS: "tGENS",
  AGIX: "AGIX",
  TDRIP: "tDRIP",
  DTU: "DTU",
  TWRT: "tWRT",
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
  [TOKENS.AGIX]: {
    currency_symbol: "6f1a1f0c7ccf632cc9ff4b79687ed13ffe5b624cce288b364ebdce50",
    token_name: "AGIX",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.TDRIP]: {
    currency_symbol: "698a6ea0ca99f315034072af31eaac6ec11fe8558d3f48e9775aab9d",
    token_name: "tDRIP",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.DTU]: {
    currency_symbol: "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe",
    token_name: "DTU",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
  [TOKENS.TWRT]: {
    currency_symbol: "659ab0b5658687c2e74cd10dba8244015b713bf503b90557769d77a7",
    token_name: "tWRT",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.S} alt="C" />,
  },
};
