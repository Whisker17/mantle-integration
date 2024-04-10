"use client";

import React from "react";
import { PrimeSdk, EtherspotBundler } from "@etherspot/prime-sdk";
import { ethers } from "ethers";
import "./App.css";

const App = () => {
  const [etherspotWalletAddress, setEtherspotWalletAddress] = React.useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [eoaWalletAddress, setEoaWalletAddress] = React.useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [eoaPrivateKey, setEoaPrivateKey] = React.useState("");
  const bundlerApiKey =
    "eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9";

  const generateRandomEOA = async () => {
    // Create random EOA wallet
    const randomWallet = ethers.Wallet.createRandom();
    setEoaWalletAddress(randomWallet.address);
    setEoaPrivateKey(randomWallet.privateKey);
  };

  const generateEtherspotWallet = async () => {
    // Initialise Etherspot SDK
    const primeSdk = new PrimeSdk(
      { privateKey: eoaPrivateKey },
      {
        chainId: 5000,
        bundlerProvider: new EtherspotBundler(5000, bundlerApiKey),
      }
    );
    const address = await primeSdk.getCounterFactualAddress();
    setEtherspotWalletAddress(address);
    console.log("\x1b[33m%s\x1b[0m", `EtherspotWallet address: ${address}`);
  };

  return (
    <div className="App-header">
      <h1 className="App-title">Getting started with Etherspot Prime</h1>

      <p>
        {" "}
        To initialise the SDK, it requires a Key Based Wallet(KBW) to be passed
        in.
      </p>

      <button className="App-button" onClick={() => generateRandomEOA()}>
        First click here to generate a random KBW.
      </button>
      <a
        target="_blank"
        href={"https://mantlescan.info/address/" + eoaWalletAddress}
      >
        KBW Address: {eoaWalletAddress}
      </a>

      <p>
        Now we can intialise the SDK with this address as the owner, and create
        an Etherspot smart contract wallet.
      </p>

      <button onClick={() => generateEtherspotWallet()}>
        Generate Etherspot Smart Contract Wallet
      </button>
      <a
        target="_blank"
        href={"https://mantlescan.info/address/" + etherspotWalletAddress}
      >
        Etherspot Smart Account Address: {etherspotWalletAddress}
      </a>

      <p>
        <a target="_blank" href="https://etherspot.fyi/prime-sdk/intro">
          Now you have a wallet created on Mantle you can explore what else we
          can do with the Prime SDK.
        </a>
      </p>
    </div>
  );
};

export default App;
