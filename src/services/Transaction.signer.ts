import { JsonRpcProvider, JsonRpcSigner, TransactionRequest } from "ethers";

export class TransactionClient {
  constructor(
    public readonly client: JsonRpcProvider,
    public readonly signer?: JsonRpcSigner | undefined,
  ) {}

  public call(request: TransactionRequest) {
    return this.client.call(request);
  }

  public signAndSendTransaction(request: TransactionRequest) {
    if (!this.signer) throw new Error("SIGNER_UNAVAILABLE");
    return this.signer
      .sendTransaction(request)
      .then((tx) => this.client.getTransactionReceipt(tx.hash));
  }

  public estimateGas(request: TransactionRequest) {
    if (!this.signer) throw new Error("SIGNER_UNAVAILABLE");
    return this.signer.estimateGas(request).then((r) => r.toString());
  }
}
