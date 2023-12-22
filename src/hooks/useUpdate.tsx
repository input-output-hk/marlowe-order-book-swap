import { useEffect } from "react";

interface IUseUpdate {
  callback: () => void;
  delay: number;
}

export default function useUpdate({ callback, delay }: IUseUpdate) {
  useEffect(() => {
    const timeout = setInterval(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
