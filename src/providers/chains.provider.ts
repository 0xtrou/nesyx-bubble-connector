import * as DefaultChains from "viem/chains";
import { Chain } from "@wagmi/core";

export class ChainsProvider {
  public getChain(chainId: number | string): Chain | null {
    return (
      DefaultChains[
        // @ts-expect-error Safe to ignore
        Object.keys(DefaultChains).find((key) => key === chainId)
      ] ||
      Object.keys(DefaultChains)
        // @ts-expect-error Safe to ignore
        .map((key) => DefaultChains[key])
        .find((chain: Chain) => {
          return chain.id === chainId;
        }) ||
      null
    );
  }
}
