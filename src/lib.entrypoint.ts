import { NesyxConnectContainer } from "./container";
import { UtilsProvider } from "./providers/utils.provider";

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
export const init = () => {
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
  return instance.init.call(instance);
};

/**
 * The function to open modal
 */
export const openModal = () => {
  if (!instance) throw new Error("NesyxConnect isn't initialized");
  return instance.openConnectModal.call(instance);
};

/**
 * The function to close the modal
 */
export const closeModal = () => {
  if (!instance) throw new Error("NesyxConnect isn't initialized");
  return instance.destroy.call(instance);
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
  windowInstance.Nesyx.openModal = openModal;
  windowInstance.Nesyx.closeModal = closeModal;
}

export default NesyxConnectContainer;
