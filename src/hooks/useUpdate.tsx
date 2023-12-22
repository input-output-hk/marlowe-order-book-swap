import { useEffect } from "react";

interface IUseUpdate<T> {
  callback: () => void;
  dependence: T;
  delay: number;
}

export default function useUpdate<T>({
  callback,
  dependence,
  delay,
}: IUseUpdate<T>) {
  useEffect(() => {
    if (dependence === 1) {
      const timeout = setInterval(callback, delay);
      return () => clearTimeout(timeout);
    }
  }, [callback, delay, dependence]);
}
