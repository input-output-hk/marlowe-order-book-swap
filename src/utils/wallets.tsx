import Image from "next/image";
import LaceIcon from "public/lace.svg";
import NamiIcon from "public/nami.svg";

export const wallets = [
  {
    icon: <Image src={LaceIcon as string} alt="LACE" />,
    name: "Lace",
  },
  {
    icon: <Image src={NamiIcon as string} alt="NAME" />,
    name: "Nami",
  },
];
