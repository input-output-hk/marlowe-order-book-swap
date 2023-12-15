import Image from "next/image";
import { useRouter } from "next/router";
import DisconnectIcon from "public/disconnect.svg";
import { ICON_SIZES } from "~/utils";

export const DisconnectButton = () => {
  const router = useRouter();

  const disconnectWallet = () => {
    window.localStorage.setItem("walletInfo", "");
    router.reload();
  };

  return (
    <div onClick={disconnectWallet}>
      <abbr title="Disconnect Wallet">
        <Image
          src={DisconnectIcon as string}
          alt="Disconnect"
          width={ICON_SIZES.M}
          height={ICON_SIZES.M}
        />
      </abbr>
    </div>
  );
};
