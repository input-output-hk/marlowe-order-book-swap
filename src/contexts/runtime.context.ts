import { type RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import { type BrowserRuntimeLifecycleOptions } from "@marlowe.io/runtime-lifecycle/browser";
import { createContext } from "react";

export interface RuntimeContextType {
  runtimeLifecycle?: RuntimeLifecycle;
  setRuntime?: (options: BrowserRuntimeLifecycleOptions) => Promise<void>;
}

export const RuntimeContext = createContext<RuntimeContextType>({
  runtimeLifecycle: undefined,
  setRuntime: undefined,
});
