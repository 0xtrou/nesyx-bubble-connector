import React from "react";
import { createRoot, Root } from "react-dom/client";
import App from "./components/App";
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
  public init() {
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
  public openConnectModal(): void {
    /**
     * Now to render root node
     */
    this.rootNode?.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}
