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
import { ADA, ICON_SIZES, type IOptions } from "~/utils";
import { type Asset } from "~/utils/tokens";
import { Input } from "../Input/Input";
import { TokensModal } from "../TokensModal/TokensModal";

interface TokenInputsProps {
  label: string;
  valueOffered: string;
  setValueOffered: Dispatch<SetStateAction<string>>;
  selectedOffered: IOptions;
  setSelectedOffered: Dispatch<SetStateAction<IOptions>>;
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
        const tokens = ownTokens.map((token) => {
          return {
            assetName:
              token.assetId.assetName === "" ? ADA : token.assetId.assetName,
            // TODO: Need to get decimals somehow
            decimals: 0,
            icon: (
              <Image
                src={CardanoIcon as string}
                alt={"C"}
                height={ICON_SIZES.XS}
              />
            ),
            amount: token.quantity,
            policyId: unPolicyId(token.assetId.policyId),
          };
        });
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
      endContent={<TokensModal assets={ownTokens} />}
    />
  );
};
