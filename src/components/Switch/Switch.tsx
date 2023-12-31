interface SwitchProps {
  enabled: boolean;
  setEnabled: () => void;
}

export const Switch = ({ enabled, setEnabled }: SwitchProps) => {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
      <div className="flex">
        <label className="relative inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={enabled}
            readOnly
          />
          <div
            onClick={setEnabled}
            className="
              peer h-7 w-12 rounded-full bg-gray-300
              after:absolute after:left-1 after:top-1 after:h-5 after:w-5
              after:rounded-full after:border after:border-m-light-gray after:bg-white after:transition-all after:content-['']
              peer-checked:bg-m-green peer-checked:after:translate-x-full"
          />
        </label>
      </div>
    </div>
  );
};
