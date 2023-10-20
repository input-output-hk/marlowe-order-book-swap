import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  endContent?: JSX.Element;
  label?: string;
  pointerEvents?: boolean;
  startContent?: JSX.Element;
  useShadow?: boolean;
}

export const Input = ({
  disabled = false,
  endContent,
  label,
  max,
  min,
  placeholder,
  pointerEvents = false,
  startContent,
  type = "text",
  useShadow = false,
  value,
  onChange,
}: InputProps) => {
  return (
    <>
      {label && <label className="text-m-darker-grey">{label}</label>}
      <div className="relative flex items-center">
        <div
          className={`${
            pointerEvents ? "" : "pointer-events-none"
          } absolute p-4`}
        >
          {startContent}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          max={max}
          min={min}
          value={value?.toString()}
          onChange={onChange}
          disabled={disabled}
          className={`m-dark-grey focus:border-m-purple focus:ring-m-purple w-full flex-grow rounded-md border p-3 ${
            startContent ? "px-12" : "px-4"
          } ${useShadow ? "shadow-md" : ""} focus:outline-none focus:ring-1`}
        />
        <div
          className={`${
            pointerEvents ? "" : "pointer-events-none"
          } absolute right-0 p-4`}
        >
          {endContent}
        </div>
      </div>
    </>
  );
};
