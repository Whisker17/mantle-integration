import React, { useState, useEffect } from "react";
import { ParticleNetwork,UserInfo,AuthType } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { MantleTestnet } from "@particle-network/chains";
import { AAWrapProvider, SmartAccount } from "@particle-network/aa";
import {ethers} from 'ethers';

// Retrieved from https://dashboard.particle.network
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID!,
  clientKey: process.env.REACT_APP_CLIENT_KEY!,
  appId: process.env.REACT_APP_APP_ID!,
};

const particle = new ParticleNetwork({
  ...config,
  chainName: MantleTestnet.name,
  chainId: MantleTestnet.id,
  wallet: { displayWalletEntry: true },
});

const smartAccount = new SmartAccount(new ParticleProvider(particle.auth), {
  ...config,
  aaOptions: {
    accountContracts: {
      SIMPLE: [
        {
          chainIds: [MantleTestnet.id],
          version: "1.0.0",
        },
      ],
    },
  },
});

const customProvider = new ethers.providers.Web3Provider(
  new AAWrapProvider(smartAccount),
  "any"
);

particle.setERC4337({
  name: "SIMPLE",
  version: "1.0.0",
});

const App = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mntBalance, setMntBalance] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo) {
      fetchMntBalance();
    }
  }, [userInfo]);

  const fetchMntBalance = async () => {
    const address = await smartAccount.getAddress();
    const balance = await customProvider.getBalance(address);
    setMntBalance(ethers.utils.formatEther(balance));
  };

  const handleLogin = async (preferredAuthType: AuthType) => {
    const user = !particle.auth.isLogin()
      ? await particle.auth.login({ preferredAuthType })
      : particle.auth.getUserInfo();
    setUserInfo(user);
  };

  const executeUserOp = async () => {
    const signer = customProvider.getSigner();
    const tx = {
      to: "0x000000000000000000000000000000000000dEaD",
      value: ethers.utils.parseEther("0.001"),
    };
    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();
    console.log("Transaction hash:", txReceipt.transactionHash);
  };

  return (
    <div className="App">
      {!userInfo ? (
        <div>
          <button onClick={() => handleLogin("google")}>
            Sign in with Google
          </button>
          <button onClick={() => handleLogin("twitter")}>
            Sign in with Twitter
          </button>
        </div>
      ) : (
        <div>
          <h2>{userInfo.name}</h2>
          <div>
            <small>{mntBalance} MNT</small>
            <button onClick={executeUserOp}>Execute User Operation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
