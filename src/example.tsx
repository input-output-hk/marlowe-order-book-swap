import Image from "next/image";
import MarloweIcon from "public/marlowe.svg";

export const example = [
  {
    id: 1,
    createdBy: "addr_test123456789",
    offered: {
      token: "ADA",
      amount: 1.04,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    desired: {
      token: "Marlons",
      amount: 2,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    expiry: "12/26/2023 11:35",
  },
  {
    id: 2,
    createdBy: "test_123",
    offered: {
      token: "ADA",
      amount: 20000,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    desired: {
      token: "Marlons",
      amount: 0.00016,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    expiry: "12/26/2023 16:35",
  },
  {
    id: 3,
    createdBy: "addr_test123456789",
    offered: {
      token: "ADA",
      amount: 1000,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    desired: {
      token: "MarlowePunks",
      amount: 2,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    expiry: "11/11/2025 14:28",
  },
  {
    id: 4,
    createdBy: "test_123",
    offered: {
      token: "Marlons",
      amount: 3.4,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    desired: {
      token: "ADA",
      amount: 53,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    expiry: "11/11/2025 14:28",
  },
  {
    id: 5,
    createdBy: "test_123",
    offered: {
      token: "MarlowePunks",
      amount: 2,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    desired: {
      token: "Marlons",
      amount: 6,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    expiry: "11/11/2025 14:28",
  },
  {
    id: 6,
    createdBy: "test_123",
    offered: {
      token: "MarlowePunks",
      amount: 7,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    desired: {
      token: "Marlons",
      amount: 3.1415,
      icon: <Image src={MarloweIcon as string} alt="M" />,
    },
    expiry: "11/11/2023 14:28",
  },
];
