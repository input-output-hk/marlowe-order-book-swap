import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import dtuIcon from "public/tokens/DTU.png";
import tDripIcon from "public/tokens/tDRIP.png";
import tGensIcon from "public/tokens/tGENS.png";
import tMINIcon from "public/tokens/tMIN.png";
import tWrtIcon from "public/tokens/tWRT.png";
import { ICON_SIZES } from "./iconSizes";

export const TOKENS = {
  ADA: "ADA",
  TGENS: "tGENS",
  TDRIP: "tDRIP",
  DTU: "DTU",
  TMIN: "tMIN",
  TWRT: "tWRT",
} as const;

export type TOKENS = (typeof TOKENS)[keyof typeof TOKENS];

export interface Asset {
  tokenName: string;
  policyId: string;
  assetName: string;
  decimals: number;
  icon: JSX.Element;
  amount?: bigint;
}

export const tokensData: Record<TOKENS, Asset> = {
  [TOKENS.ADA]: {
    tokenName: "ADA",
    policyId: "",
    assetName: "",
    decimals: 6,
    icon: (
      <Image
        src={CardanoIcon as string}
        height={ICON_SIZES.S}
        width={ICON_SIZES.S}
        alt="ADA"
      />
    ),
  },
  [TOKENS.TGENS]: {
    tokenName: "tGENS",
    policyId: "c6e65ba7878b2f8ea0ad39287d3e2fd256dc5c4160fc19bdf4c4d87e",
    assetName: "tGENS",
    decimals: 6,
    icon: (
      <Image
        src={tGensIcon}
        height={ICON_SIZES.S}
        width={ICON_SIZES.S}
        alt="tGens"
      />
    ),
  },
  [TOKENS.TMIN]: {
    tokenName: "tMIN",
    policyId: "f6f49b186751e61f1fb8c64e7504e771f968cea9f4d11f5222b169e3",
    assetName: "tMIN",
    decimals: 6,
    icon: (
      <Image
        src={tMINIcon}
        height={ICON_SIZES.S}
        width={ICON_SIZES.S}
        alt="tMIN"
      />
    ),
  },
  [TOKENS.TDRIP]: {
    tokenName: "tDRIP",
    policyId: "698a6ea0ca99f315034072af31eaac6ec11fe8558d3f48e9775aab9d",
    assetName: "tDRIP",
    decimals: 6,
    icon: (
      <Image
        src={tDripIcon}
        height={ICON_SIZES.S}
        width={ICON_SIZES.S}
        alt="tDRIP"
      />
    ),
  },
  [TOKENS.DTU]: {
    tokenName: "DTU",
    policyId: "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe",
    assetName: "Djed_testMicroUSD",
    decimals: 6,
    icon: (
      <Image
        src={dtuIcon}
        height={ICON_SIZES.S}
        width={ICON_SIZES.S}
        alt="DTU"
      />
    ),
  },
  [TOKENS.TWRT]: {
    tokenName: "tWRT",
    policyId: "659ab0b5658687c2e74cd10dba8244015b713bf503b90557769d77a7",
    assetName: "WingRiders",
    decimals: 6,
    icon: (
      <Image
        src={tWrtIcon}
        height={ICON_SIZES.S}
        width={ICON_SIZES.S}
        alt="tWRT"
      />
    ),
  },
};
