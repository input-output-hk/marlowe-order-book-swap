import Image from "next/image";
import LaceIcon from "public/lace.svg";
import NamiIcon from "public/nami.svg";

export const WALLETS = {
  LACE: "Lace",
  NAMI: "Nami",
} as const;

export type WALLETS = (typeof WALLETS)[keyof typeof WALLETS];

export const walletLogos: Record<WALLETS, JSX.Element> = {
  [WALLETS.LACE]: <Image src={LaceIcon as string} alt="L" />,
  [WALLETS.NAMI]: <Image src={NamiIcon as string} alt="N" />,
};