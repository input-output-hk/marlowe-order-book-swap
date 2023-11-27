import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { ADA, type IOptions } from "~/utils";
import { tokensData } from "~/utils/tokens";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";

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
  const dropDownOptions = Object.entries(tokensData).map(([_, token]) => {
    return {
      option: token.token_name === "" ? ADA : token.token_name,
      icon: token.icon,
    };
  });

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
        <DropDown
          options={dropDownOptions}
          selected={selectedOffered}
          setSelected={setSelectedOffered}
        />
      }
    />
  );
};
