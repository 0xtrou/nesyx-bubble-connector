import * as ethers from "ethers";

import { NesyxConnectContainer } from "./container";
import { UtilsProvider } from "./providers/utils.provider";
import { WalletInitParams } from "./types";
import { ChainsProvider } from "./providers/chains.provider";

let instance: NesyxConnectContainer;

/**
 * The function to get NesyxConnect instance
 */
export const getInstance = () => {
  if (!instance) throw new Error("NesyxConnect isn't initialized");
  return instance;
};

/**
 * Init an NesyxConnect instance.
 * The function has its own boundary context.
 */
export const init = (params: WalletInitParams) => {
  /**
   * Destroy the old node if possible
   */
  instance?.destroy();

  /**
   * Randomize root node id
   */
  const rootDOMId = new UtilsProvider().randomize();

  /**
   * Initialize new instance
   */
  instance = new NesyxConnectContainer(rootDOMId);
  return instance.init.call(instance, params);
};

/**
 * Now to expose to window context
 */
if (window) {
  const windowInstance = window as any;

  windowInstance.Nesyx = {};
  windowInstance.Nesyx.NesyxConnect = NesyxConnectContainer;
  windowInstance.Nesyx.getInstance = getInstance;
  windowInstance.Nesyx.init = init;
  windowInstance.Nesyx.ethers = ethers;
  windowInstance.Nesyx.utils = {};
  windowInstance.Nesyx.utils.ChainsProvider = new ChainsProvider();
}

export default NesyxConnectContainer;
