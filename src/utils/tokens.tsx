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
  SODITA: "SODITA",
} as const;

export type TOKENS = (typeof TOKENS)[keyof typeof TOKENS];

export interface Asset {
  policyId: string;
  assetName: string;
  icon: JSX.Element;
}

export const tokensData: Record<TOKENS, Asset> = {
  [TOKENS.ADA]: {
    policyId: "",
    assetName: "",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  [TOKENS.TGENS]: {
    policyId: "c6e65ba7878b2f8ea0ad39287d3e2fd256dc5c4160fc19bdf4c4d87e",
    assetName: "tGENS",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  [TOKENS.AGIX]: {
    policyId: "6f1a1f0c7ccf632cc9ff4b79687ed13ffe5b624cce288b364ebdce50",
    assetName: "AGIX",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  [TOKENS.TDRIP]: {
    policyId: "698a6ea0ca99f315034072af31eaac6ec11fe8558d3f48e9775aab9d",
    assetName: "tDRIP",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  [TOKENS.DTU]: {
    policyId: "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe",
    assetName: "DTU",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  [TOKENS.TWRT]: {
    policyId: "659ab0b5658687c2e74cd10dba8244015b713bf503b90557769d77a7",
    assetName: "tWRT",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
  [TOKENS.SODITA]: {
    policyId: "77211b30313564b8b11db9c9de94addc5fa305f5d47fd278140eef63",
    assetName: "SODITA",
    icon: <Image src={CardanoIcon as string} height={ICON_SIZES.M} alt="C" />,
  },
};
