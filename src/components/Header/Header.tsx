import Image from "next/image";
import MarloweIcon from "~/../public/marlowe-logo.svg";
import LogoIcon from "~/../public/marlowe.svg";
import NamiIcon from "~/../public/nami.svg";

export const Header = () => {
  const addr = "addr_test1qp8rc...";
  return (
    <header className="px-10 py-5 sm:px-24 sm:py-12">
      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <Image
          src={MarloweIcon}
          alt="Moarlowe"
          width={150}
          className="hidden sm:block"
        />
        <Image
          src={LogoIcon}
          alt="Marlowe"
          width={30}
          className="block sm:hidden"
        />
        <div className="flex gap-5">
          <Image src={NamiIcon} alt="N" width={30} />
          <div className="hidden sm:block">{addr}</div>
        </div>
      </div>
    </header>
  );
};
