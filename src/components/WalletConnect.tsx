import { FC, useEffect } from "react";

import {
  Chain,
  useDisconnect,
  WagmiConfig,
  WalletClient,
  useWalletClient,
  useAccount,
  PublicClient,
  useSwitchNetwork,
  useNetwork,
} from "wagmi";
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner } from "ethers";
import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
} from "@web3modal/wagmi/react";
import { ChainFormatters } from "viem";
import * as DefaultChains from "viem/chains";

import { WalletContainerInitParams } from "../types";
import { ChainsProvider } from "../providers/chains.provider";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  return new JsonRpcSigner(provider, account.address);
}

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new JsonRpcProvider(transport.url, network);
}

export const WalletConnectLoader: FC<{
  params: WalletContainerInitParams;
}> = (props) => {
  const { onLoaded, onConnected, onDisconnected, chainKey } = props.params;

  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const chain =
    new ChainsProvider().getChain(chainKey) || DefaultChains["mainnet"];
  const network = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({ chainId: chain.id });

  useAccount({
    onConnect: async (pr) => {
      if (network.chain?.id !== chain.id && switchNetworkAsync) {
        await switchNetworkAsync();
      }

      if (pr.address) {
        onConnected(pr.address);
      }
    },
    onDisconnect() {
      onDisconnected();
    },
  });

  useEffect(() => {
    onLoaded({
      openConnectModal: () => open({ view: "Connect" }),
      openAccountModal: () => open({ view: "Account" }),
      openNetworkModal: () => open({ view: "Networks" }),
      switchNetwork: async (chainId: string) => {
        const chain = new ChainsProvider().getChain(chainId);
        if (chain && switchNetworkAsync) {
          await switchNetworkAsync(chain.id);
        }

        return Promise.reject(new Error("CHAIN_NOT_FOUND"));
      },
      disconnect: () => Promise.resolve(disconnect()),
      getSigner: () =>
        Promise.resolve(
          walletClient ? walletClientToSigner(walletClient) : null,
        ),
    });
  }, [walletClient, open, disconnect]);

  return null;
};

export const WalletConnectProvider: FC<{
  params: WalletContainerInitParams;
}> = (props) => {
  const { projectId, chainKey } = props.params;

  const chains: Chain<ChainFormatters>[] = Object.keys(DefaultChains)
    .map(
      // @ts-expect-error Safe to ignore
      (key) => DefaultChains[key],
    )
    .filter((elm) => !!elm);
  const desiredChain =
    new ChainsProvider().getChain(chainKey) || DefaultChains["mainnet"];

  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
  });

  createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    defaultChain: desiredChain,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletConnectLoader params={props.params} />
    </WagmiConfig>
  );
};
