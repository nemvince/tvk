import type { CamelKeys, ReplaceKeys } from "string-ts";
import { camelKeys, replaceKeys } from "string-ts";

export const makeTypedEnvironment = <T>(schema: (v: unknown) => T) => {
  let cache: CamelKeys<ReplaceKeys<T, "VITE_", "">>;

  return (args: Record<string, unknown>) => {
    if (cache) return cache;

    const withoutPrefix = replaceKeys(schema({ ...args }), "VITE_", "");
    const camelCased = camelKeys(withoutPrefix);
    cache = camelCased;
    return cache;
  };
};
