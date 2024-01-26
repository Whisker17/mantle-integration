import { Signer, ethers } from "ethers";
import {
  DEFAULT_ENTRYPOINT_ADDRESS,
  BiconomySmartAccountV2,
} from "@biconomy/account";
import { ChainId } from "@biconomy/core-types";
import { IBundler, Bundler } from "@biconomy/bundler";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { config } from "dotenv";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";

config();

const rpcUrl = "https://rpc.testnet.mantle.xyz/";
const biconomyPaymasterApiKey =
  "https://paymaster.biconomy.io/api/v1/5001/yfbLWhoN8.375a1da0-6b1b-4b1f-bebc-63c278e08a67";
const bundlerUrl =
  "https://bundler.biconomy.io/api/v2/5001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";

let provider = new ethers.providers.JsonRpcProvider(rpcUrl);
let signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);

// Configure the Biconomy Bundler
const bundler: IBundler = new Bundler({
  bundlerUrl: bundlerUrl, // URL to the Biconomy bundler service
  chainId: ChainId.MANTLE_TESTNET, // Chain ID for Polygon Mumbai test network
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address for the bundler
});

// Configure the Biconomy Paymaster
const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl: biconomyPaymasterApiKey, // URL to the Biconomy paymaster service
});

async function createModule() {
  return await ECDSAOwnershipValidationModule.create({
    signer: signer, // The wallet acting as the signer
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE, // Address of the default ECDSA ownership validation module
  });
}

async function createSmartAccount() {
  const module = await createModule(); // Create the validation module

  let smartAccount = await BiconomySmartAccountV2.create({
    chainId: ChainId.MANTLE_TESTNET, // Chain ID for the Mantle Testnet
    bundler: bundler, // The configured bundler instance
    paymaster: paymaster, // The configured paymaster instance
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS, // Default entry point address
    defaultValidationModule: module, // The default validation module
    activeValidationModule: module, // The active validation module
  });
  console.log(
    "Smart Account Address: ",
    await smartAccount.getAccountAddress() // Logging the address of the created smart account
  );
  return smartAccount;
}

createSmartAccount();
