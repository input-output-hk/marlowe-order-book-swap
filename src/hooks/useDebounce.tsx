import { useCallback, useEffect } from "react";

interface IUseDebounce<T> {
  effect: () => void;
  dependencies: Array<T>;
  delay: number; // time in ms
}

export default function useDebounce<T>({
  effect,
  dependencies,
  delay,
}: IUseDebounce<T>) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
