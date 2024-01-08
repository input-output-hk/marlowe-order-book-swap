import { unPolicyId } from "@marlowe.io/runtime-core";
import Image from "next/image";
import CardanoIcon from "public/cardano.svg";
import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import { TSSDKContext } from "~/contexts/tssdk.context";
import { ADA, ICON_SIZES, textToHexa } from "~/utils";
import { lookupTokenMetadata } from "~/utils/lookupTokenMetadata";
import { type Asset } from "~/utils/tokens";
import { Input } from "../Input/Input";
import { TokensModal } from "../TokensModal/TokensModal";

interface TokenInputsProps {
  label: string;
  valueOffered: string;
  setValueOffered: Dispatch<SetStateAction<string>>;
  selectedOffered: Asset;
  setSelectedOffered: Dispatch<SetStateAction<Asset>>;
  errors: (string | undefined)[];
}

export const TokenInputs = ({
  label,
  selectedOffered,
  setSelectedOffered,
  valueOffered,
  setValueOffered,
  errors = [],
}: TokenInputsProps) => {
  const { runtimeLifecycle } = useContext(TSSDKContext);

  const [ownTokens, setOwnTokens] = useState<Asset[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValueOffered(e.target.value || "");
  };

  useEffect(() => {
    const getOwnTokens = async () => {
      const ownTokens = await runtimeLifecycle?.wallet.getTokens();
      if (ownTokens) {
        const tokens = await Promise.all(
          ownTokens.map(async (token) => {
            let tokenMetadata = null;
            try {
              tokenMetadata = await lookupTokenMetadata(
                unPolicyId(token.assetId.policyId),
                token.assetId.assetName === ADA
                  ? ""
                  : textToHexa(token.assetId.assetName),
                "preprod",
              );
            } catch (e) {
              console.error(e);
            }
            return {
              tokenName:
                tokenMetadata?.ticker ??
                tokenMetadata?.name ??
                token.assetId.assetName,
              assetName:
                token.assetId.assetName === "" ? ADA : token.assetId.assetName,
              decimals: tokenMetadata?.decimals ?? -1,
              icon: (
                <Image
                  src={
                    tokenMetadata?.logo
                      ? "data:image/png;base64," + tokenMetadata.logo
                      : (CardanoIcon as string)
                  }
                  alt={tokenMetadata?.logo ? tokenMetadata.name : "C"}
                  height={ICON_SIZES.S}
                  width={ICON_SIZES.S}
                />
              ),
              amount: token.quantity,
              policyId: unPolicyId(token.assetId.policyId),
            };
          }),
        );
        setOwnTokens(tokens);
      }
    };
    if (runtimeLifecycle) {
      void getOwnTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle]);

  return (
    <Input
      value={valueOffered}
      onChange={handleChange}
      label={label}
      type="number"
      pointerEvents
      placeholder="0"
      error={errors}
      endContent={
        <TokensModal
          assets={label === "You will swap *" ? ownTokens : undefined}
          selectedOffered={selectedOffered}
          setSelectedOffered={setSelectedOffered}
        />
      }
    />
  );
};
