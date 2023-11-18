import { FC, useEffect } from "react";

import {
  Chain,
  useDisconnect,
  WagmiConfig,
  WalletClient,
  useWalletClient,
} from "wagmi";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
} from "@web3modal/wagmi/react";

import { ChainFormatters } from "viem";
import * as DefaultChains from "viem/chains";
import { WalletContainerInitParams } from "../types";

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

export const WalletConnectLoader: FC<{
  params: WalletContainerInitParams;
}> = (props) => {
  const { onLoaded } = props.params;

  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    onLoaded({
      openConnectModal: () => open({ view: "Connect" }),
      openAccountModal: () => open({ view: "Account" }),
      openNetworkModal: () => open({ view: "Networks" }),
      disconnect: async () => disconnect(),
      getSigner: async () =>
        walletClient ? walletClientToSigner(walletClient) : null,
    });
  }, [walletClient, open, disconnect]);

  return null;
};

export const WalletConnectProvider: FC<{
  params: WalletContainerInitParams;
}> = (props) => {
  const { projectId, metadata, chainKeys } = props.params;

  const chains: Chain<ChainFormatters>[] = chainKeys
    .map(
      // @ts-expect-error Safe to ignore
      (key) => DefaultChains[key],
    )
    .filter((elm) => !!elm);

  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  });

  createWeb3Modal({ wagmiConfig, projectId, chains });

  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletConnectLoader params={props.params} />
    </WagmiConfig>
  );
};
