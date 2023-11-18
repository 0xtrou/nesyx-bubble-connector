import React from "react";
import { JsonRpcSigner } from "ethers";
import { createRoot, Root } from "react-dom/client";

import App from "./components/App";
import { WalletInitParams } from "./types";

import "./index.scss";

export class NesyxConnectContainer {
  /**
   * Root node selector id
   * @private
   */
  private readonly rootSelectorId: string;

  /**
   * Root node
   * @private
   */
  private rootNode: Root | null = null;

  public connect: (() => Promise<void>) | null = null;
  public getSigner: (() => Promise<JsonRpcSigner | null>) | null = null;
  public disconnect: (() => Promise<void>) | null = null;
  public openConnectModal: (() => Promise<void>) | null = null;
  public openNetworkModal: (() => Promise<void>) | null = null;
  public openAccountModal: (() => Promise<void>) | null = null;

  /**
   * Constructor to initialize the NesyxConnect Container
   * @param rootSelectorId - the id selector of the NesyxConnect Container DOM object.
   */
  constructor(rootSelectorId: string) {
    const rootDOM = document.getElementById(rootSelectorId);

    if (!rootDOM) {
      /**
       * Initialize dom node
       */
      const dom = document.createElement("div");
      dom.setAttribute("id", rootSelectorId);
      document.body.appendChild(dom);
    }

    this.rootSelectorId = rootSelectorId;
  }

  /**
   * The function to initialize root node.
   * @private
   */
  private initRootNode() {
    if (document.getElementById(this.rootSelectorId)) {
      this.rootNode = createRoot(
        document.getElementById(this.rootSelectorId) as HTMLElement,
      );
    } else {
      throw new Error("ROOT_NODE_NOT_FOUND");
    }

    return this.rootNode;
  }

  /**
   * The function to destroy root node.
   */
  public destroy() {
    /**
     * Unmount root node
     */
    this.rootNode?.unmount();
    this.rootNode = null;

    /**
     * Remove root element
     */
    document.getElementById(this.rootSelectorId)?.remove();
  }

  /**
   * The function to open the UID modal
   */
  public init(params: WalletInitParams): void {
    /**
     * Initialize root node
     */
    this.initRootNode();

    /**
     * Now to render root node
     */
    this.rootNode?.render(
      <React.StrictMode>
        <App
          {...params}
          onLoaded={({
            getSigner,
            disconnect,
            openNetworkModal,
            openAccountModal,
            openConnectModal,
          }) => {
            console.log("refreshed wallet exposed states");
            this.getSigner = async () => {
              const signer = await getSigner();

              if (signer) {
                params.on?.connected?.(signer.address);
                return signer;
              }

              params.on?.disconnected?.();
              return null;
            };
            this.disconnect = async () => {
              await disconnect();
              params.on?.disconnected?.();
            };
            this.openConnectModal = openConnectModal;
            this.openNetworkModal = openNetworkModal;
            this.openAccountModal = openAccountModal;

            this.getSigner();
          }}
        />
      </React.StrictMode>,
    );
  }
}
