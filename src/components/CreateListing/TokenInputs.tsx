import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { Asset } from "~/utils/tokens";
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
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValueOffered(e.target.value || "");
  };

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
          selectedOffered={selectedOffered}
          setSelectedOffered={setSelectedOffered}
        />
      }
    />
  );
};
