import { ethers, TransactionRequest } from "ethers";
import { GasPriceConfig } from "../types";

/**
 * @notice The instance will receive Contract ABI and Contract address. Then expose methods to "call" or "send" to smart contract
 */
export class TransactionBuilder {
  constructor(
    public readonly contractABI: any[],
    public readonly contractAddress: string,
  ) {}

  public buildTransaction(
    methodName: string,
    params: any[],
    config: GasPriceConfig,
  ): TransactionRequest {
    const contract = new ethers.Contract(
      this.contractAddress,
      this.contractABI,
    );
    const data = contract.interface.encodeFunctionData(methodName, params);
    console.log("buildTransaction", methodName, params, config, data);
    return {
      to: this.contractAddress,
      data,
      ...config,
    };
  }

  public decodeFunctionResult(methodName: string, data: string) {
    console.log("decodeFunctionResult", methodName, data);
    const contract = new ethers.Contract(
      this.contractAddress,
      this.contractABI,
    );
    return contract.interface.decodeFunctionResult(methodName, data.toString());
  }
}
