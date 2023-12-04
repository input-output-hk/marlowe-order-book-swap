import { type RuntimeLifecycle } from "@marlowe.io/runtime-lifecycle/api";
import { type BrowserRuntimeLifecycleOptions } from "@marlowe.io/runtime-lifecycle/browser";
import { type RestClient } from "@marlowe.io/runtime-rest-client";
import { createContext } from "react";

export interface TSSDKContextType {
  runtimeLifecycle?: RuntimeLifecycle;
  setRuntime?: (options: BrowserRuntimeLifecycleOptions) => Promise<void>;
  client?: RestClient;
}

export const TSSDKContext = createContext<TSSDKContextType>({
  runtimeLifecycle: undefined,
  setRuntime: undefined,
  client: undefined,
});
