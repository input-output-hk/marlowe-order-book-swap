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
import { ICON_SIZES, parseTokenName, textToHexa } from "~/utils";
import { lookupTokenMetadata } from "~/utils/lookupTokenMetadata";
import { type Asset } from "~/utils/tokens";
import { Input } from "../Input/Input";
import { TokensModal } from "../TokensModal/TokensModal";

interface TokenInputsProps {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  selected: Asset;
  setSelected: Dispatch<SetStateAction<Asset>>;
  errors: (string | undefined)[];
}

export const TokenInputs = ({
  label,
  selected,
  setSelected,
  value,
  setValue,
  errors = [],
}: TokenInputsProps) => {
  const { runtimeLifecycle } = useContext(TSSDKContext);

  const [ownTokens, setOwnTokens] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputSections = e.target.value.split(".");
    const decimals = inputSections[1]?.substring(0, selected.decimals);
    if (selected.decimals > 0) setValue(inputSections[0] + "." + decimals);
    else setValue(e.target.value || "");
  };

  useEffect(() => {
    const getOwnTokens = async () => {
      const ownTokens = await runtimeLifecycle?.wallet.getTokens();
      if (ownTokens) {
        const tokens = await Promise.all(
          ownTokens.map(async (token) => {
            try {
              const tokenMetadata = await lookupTokenMetadata(
                unPolicyId(token.assetId.policyId),
                textToHexa(token.assetId.assetName),
                "preprod",
              );
              return {
                tokenName: tokenMetadata?.ticker
                  ? parseTokenName(tokenMetadata.ticker)
                  : tokenMetadata?.name ?? token.assetId.assetName,
                assetName: token.assetId.assetName,
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
            } catch (e) {
              return {
                tokenName: token.assetId.assetName,
                assetName: parseTokenName(token.assetId.assetName),
                decimals: -1,
                icon: (
                  <Image
                    src={CardanoIcon as string}
                    alt={"C"}
                    height={ICON_SIZES.S}
                    width={ICON_SIZES.S}
                  />
                ),
                amount: token.quantity,
                policyId: unPolicyId(token.assetId.policyId),
              };
            }
          }),
        );
        setOwnTokens(tokens);
      }
      setLoading(false);
    };
    if (runtimeLifecycle) {
      void getOwnTokens();
    }
    const valueSections = value.split(".");
    if (selected.decimals > 0 && valueSections.length > 1) {
      setValue(
        valueSections[0] +
          "." +
          valueSections[1]?.substring(0, selected.decimals),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimeLifecycle, selected]);

  return (
    <Input
      value={value}
      onChange={handleChange}
      label={label}
      type="number"
      pointerEvents
      placeholder="0"
      error={errors}
      step={selected.decimals > 0 ? String(1 / 10 ** selected.decimals) : "any"}
      endContent={
        <TokensModal
          assets={label.startsWith("You will swap *") ? ownTokens : undefined}
          selected={selected}
          setSelected={setSelected}
          loading={loading}
        />
      }
    />
  );
};
