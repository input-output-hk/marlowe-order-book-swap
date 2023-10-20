import type { ChangeEvent } from "react";

interface SearchBarProps {
  disabled?: boolean;
  endContent?: JSX.Element;
  placeholder?: string;
  startContent?: JSX.Element;
  type?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = ({
  disabled = false,
  endContent,
  placeholder,
  startContent,
  type = "text",
  value,
  onChange,
}: SearchBarProps) => {
  return (
    <div className="relative flex items-center">
      <div className="absolute p-4">{startContent}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-m-dark-grey focus:border-m-purple focus:ring-m-purple w-full flex-grow rounded-md p-3 ${
          startContent ? "px-12" : "px-4"
        } focus:outline-none focus:ring-1`}
      />
      <div className="absolute right-0 p-4">{endContent}</div>
    </div>
  );
};
