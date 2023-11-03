import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import type { IOptions } from "~/utils";
import { exampleTokens } from "~/utils/tokens";
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
  const dropDownOptions = exampleTokens.map((token) => {
    return {
      option: token.token,
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
