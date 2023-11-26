import { JsonRpcSigner, TransactionReceipt } from "ethers";

export interface WalletInitParams {
  chainId: number;
  projectId: string;
  on?: {
    connected: (address: string) => void;
    disconnected: () => void;
  };
  customChains: {
    chainId: number;
    chainName: string;
    chainRpc: string;
    chainExplorerUrl: string;
    chainGasTokenName: string;
    chainGasTokenSymbol: string;
    chainGasTokenDecimals: number;
  }[];
}

export interface WalletContainerInitParams {
  chainId: number;
  projectId: string;
  onLoaded: (params: {
    getSigner: () => Promise<JsonRpcSigner | null>;
    switchNetwork: (chainId: number) => Promise<void>;
    disconnect: () => Promise<void>;
    openConnectModal: () => Promise<void>;
    openAccountModal: () => Promise<void>;
    openNetworkModal: () => Promise<void>;
  }) => void;
  onConnected: (address: string) => void;
  onDisconnected: () => void;
  customChains: {
    chainId: number;
    chainName: string;
    chainRpc: string;
    chainExplorerUrl: string;
    chainGasTokenName: string;
    chainGasTokenSymbol: string;
    chainGasTokenDecimals: number;
  }[];
}

export interface SmartContractActionConfig {
  context: SmartContractContext;
  params: any[];
  config: GasPriceConfig;
  onlyEstimateGas: boolean;
}

export interface SmartContractContext {
  contractABI: string;
  contractAddress: string;
  functionName: string;
  sendATransaction: boolean;
  onSuccess: (result: SmartContractActionResult) => void;
  onError: (result: SmartContractActionResult) => void;
}

export interface GasPriceConfig {
  gasPrice: string | undefined;
  gasLimit: string | undefined;
  value: string | undefined;
}

export interface SmartContractActionResult {
  data: TransactionReceipt | Record<string, any> | null;
  errorMessage: string | null;
  status: string;
  consumedGas: string;
}
