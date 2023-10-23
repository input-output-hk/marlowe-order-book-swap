import { type InputHTMLAttributes } from "react";

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
  pointerEvents: needsPointerEvents = false,
  startContent,
  type = "text",
  useShadow = false,
  value,
  onChange,
}: InputProps) => {
  const shadow = useShadow ? "shadow-md" : "";
  const paddingLeftX = startContent ? "pl-12" : "pl-4";
  const paddingRightX = endContent ? "pr-12" : "pr-4";
  const pointerEvents = needsPointerEvents ? "" : "pointer-events-none";

  return (
    <>
      {label && (
        <label htmlFor={label} className="text-m-darker-grey">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <div className={`${pointerEvents} absolute p-4`}>{startContent}</div>
        <input
          type={type}
          id={label}
          placeholder={placeholder}
          max={max}
          min={min}
          value={value?.toString()}
          onChange={onChange}
          disabled={disabled}
          className={`m-dark-grey focus:border-m-purple focus:ring-m-purple w-full flex-grow rounded-md border p-3 ${paddingLeftX} ${paddingRightX} ${shadow} focus:outline-none focus:ring-1`}
        />
        <div className={`${pointerEvents} absolute right-0 p-4`}>
          {endContent}
        </div>
      </div>
    </>
  );
};
