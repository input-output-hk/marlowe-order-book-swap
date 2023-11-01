import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { IOptions } from "~/utils";
import { exampleTokens } from "~/utils/tokens";
import { DropDown } from "../DropDown/DropDown";
import { Input } from "../Input/Input";

interface TokenInputsProps {
  label: string;
  valueOffered: number;
  setValueOffered: Dispatch<SetStateAction<number>>;
  selectedOffered: IOptions;
  setSelectedOffered: Dispatch<SetStateAction<IOptions>>;
}

export const TokenInputs = ({
  label,
  selectedOffered,
  setSelectedOffered,
  valueOffered,
  setValueOffered,
}: TokenInputsProps) => {
  const dropDownOptions = exampleTokens.map((token) => {
    return {
      option: token.token,
      icon: token.icon,
    };
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValueOffered(Number(e.target.value));
  };

  return (
    <Input
      value={valueOffered}
      onChange={handleChange}
      label={label}
      type="number"
      pointerEvents
      placeholder="0"
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
