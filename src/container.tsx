import React from "react";
import { createRoot, Root } from "react-dom/client";
import { JsonRpcProvider, JsonRpcSigner } from "ethers";

import App from "./components/App";
import { SmartContractActionConfig, WalletInitParams } from "./types";

import "./index.scss";
import { TransactionBuilder } from "./services/Transaction.builder";
import { TransactionClient } from "./services/Transaction.signer";
import { ChainsProvider } from "./providers/chains.provider";

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

  public getSigner: (() => Promise<JsonRpcSigner | null>) | null = null;
  public disconnect: (() => Promise<void>) | null = null;
  public openConnectModal: (() => Promise<void>) | null = null;
  public openNetworkModal: (() => Promise<void>) | null = null;
  public openAccountModal: (() => Promise<void>) | null = null;

  public initialConfig: WalletInitParams | null = null;

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

  public init(params: WalletInitParams): void {
    this.initialConfig = params;

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
          onConnected={(address) => params.on?.connected?.(address)}
          onDisconnected={() => params.on?.disconnected?.()}
          onLoaded={({
            getSigner,
            disconnect,
            openNetworkModal,
            openAccountModal,
            openConnectModal,
          }) => {
            console.log("refreshed wallet exposed states");
            this.getSigner = getSigner;
            this.disconnect = disconnect;
            this.openConnectModal = openConnectModal;
            this.openNetworkModal = openNetworkModal;
            this.openAccountModal = openAccountModal;
          }}
        />
      </React.StrictMode>,
    );
  }

  public async executeSmartContractAction({
    context,
    config,
    params,
    onlyEstimateGas,
  }: SmartContractActionConfig) {
    const signer = (await this.getSigner?.()) || undefined;
    const chain = new ChainsProvider().getChain(
      this.initialConfig?.chainKey || "mainnet",
    );

    if (!chain) {
      throw new Error("CHAIN_NOT_FOUND");
    }
    const client = new JsonRpcProvider(chain.rpcUrls.public.http[0], chain.id);

    if (context.sendATransaction && !signer) {
      throw new Error("SIGNER_UNAVAILABLE");
    }

    try {
      const txBuilder = new TransactionBuilder(
        JSON.parse(context.contractABI),
        context.contractAddress,
      );

      const fineTunedParams = params.map((param) => {
        try {
          const value = JSON.parse(param.toString());
          if (typeof value === "number") {
            return param;
          }
          return value;
        } catch {
          return param;
        }
      });

      const request = txBuilder.buildTransaction(
        context.functionName,
        fineTunedParams,
        config,
      );

      const txClient = new TransactionClient(client, signer);

      if (onlyEstimateGas) {
        return txClient
          .estimateGas(request)
          .then((res) => {
            context.onSuccess({
              data: null,
              status: "success",
              errorMessage: null,
              consumedGas: res?.toString() || "0",
            });

            return res;
          })
          .catch((err) => {
            context.onError({
              data: null,
              status: "error",
              errorMessage: err?.message || "Unknown error",
              consumedGas: "0",
            });

            return err;
          });
      }

      if (context.sendATransaction) {
        return txClient
          .signAndSendTransaction(request)
          .then((tx) => {
            context.onSuccess({
              data: tx,
              status: "success",
              errorMessage: null,
              consumedGas: tx?.gasUsed?.toString() || "0",
            });

            return tx;
          })
          .catch((err) => {
            context.onError({
              data: null,
              status: "error",
              errorMessage: err?.message || "Unknown error",
              consumedGas: "0",
            });

            return err;
          });
      } else {
        return txClient
          .call(request)
          .then((tx) => {
            context.onSuccess({
              data: txBuilder.decodeFunctionResult(context.functionName, tx),
              status: "success",
              errorMessage: null,
              consumedGas: "0",
            });

            return tx;
          })
          .catch((err) => {
            context.onError({
              data: null,
              status: "error",
              errorMessage: err?.message || "Unknown error",
              consumedGas: "0",
            });

            return err;
          });
      }
    } catch (e) {
      context.onError({
        data: null,
        status: "error",
        errorMessage: (e as any).message || "Unknown error",
        consumedGas: "0",
      });
    }
  }
}
