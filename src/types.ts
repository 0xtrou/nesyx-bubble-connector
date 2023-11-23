import { JsonRpcSigner } from "ethers";

export interface WalletInitParams {
  chainKeys: string[];
  projectId: string;
  on?: {
    connected: (address: string) => void;
    disconnected: () => void;
  };
}

export interface WalletContainerInitParams {
  chainKeys: string[];
  projectId: string;
  onLoaded: (params: {
    getSigner: () => Promise<JsonRpcSigner | null>;
    disconnect: () => Promise<void>;
    openConnectModal: () => Promise<void>;
    openAccountModal: () => Promise<void>;
    openNetworkModal: () => Promise<void>;
  }) => void;
  onConnected: (address: string) => void;
  onDisconnected: () => void;
}
