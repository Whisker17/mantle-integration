import { Hex, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  createSmartAccountClient,
  PaymasterMode,
  SupportedSigner,
} from "@biconomy/account";
import * as chains from "viem/chains";
import { Chain } from "viem/chains";

export const getChain = (chainId: number): Chain => {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }
  throw new Error("Chain not found");
};

const biconomyPaymasterApiKey =
  "_CqpAw2Nd.59825447-aa57-440b-a136-94dfaa81e84b";
const bundlerUrl =
  "https://bundler.biconomy.io/api/v2/80001/A5CBjLqSc.0dcbc53e-anPe-44c7-b22d-21071345f76a";

const privateKey =
  "0x4054ab390ed4e96bedbe7e558bd7295d7a049d7516e119a6401c4b19240adb99";

export const nativeTransfer = async (to: string, amount: number) => {
  // ----- 1. Generate EOA from private key
  const account = privateKeyToAccount(privateKey as Hex);
  const client = createWalletClient({
    account,
    chain: getChain(80001),
    transport: http(),
  });
  const eoa = client.account.address;
  console.log(`EOA address: ${eoa}`);

  // ------ 2. Create biconomy smart account instance
  const smartAccount = await createSmartAccountClient({
    signer: client as SupportedSigner,
    bundlerUrl: bundlerUrl,
    biconomyPaymasterApiKey: biconomyPaymasterApiKey,
  });
  const scwAddress = await smartAccount.getAccountAddress();
  console.log("SCW Address", scwAddress);

  // ------ 3. Generate transaction data
  const txData = {
    to,
    value: parseEther(amount.toString()),
  };

  // ------ 4. Send user operation and get tx hash
  const { waitForTxHash } = await smartAccount.sendTransaction(txData, {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  });
  const { transactionHash } = await waitForTxHash();
  console.log("transactionHash", transactionHash);
};

nativeTransfer("0xab5a413A2B0EB4bF451b3993E894796AD057f162", 1);
