import { JsonRpcSigner } from "ethers";

export interface WalletInitParams {
  chainKeys: string[];
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  on?: {
    connected: (address: string) => void;
    disconnected: () => void;
  };
}

export interface WalletContainerInitParams {
  chainKeys: string[];
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
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
