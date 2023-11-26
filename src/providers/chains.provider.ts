import * as DefaultChains from "viem/chains";
import { Chain } from "@wagmi/core";

export class ChainsProvider {
  public static customChains: Chain[] = [];
  public static saveCustomChains(chain: Chain[]) {
    this.customChains = this.customChains.concat(chain);
  }

  public getChain(chainId: number): Chain | null {
    return (
      Object.keys(DefaultChains)
        // @ts-expect-error Safe to ignore
        .map((key) => DefaultChains[key])
        .concat(ChainsProvider.customChains)
        .find((chain: Chain) => {
          return chain.id === chainId;
        }) || null
    );
  }
}
