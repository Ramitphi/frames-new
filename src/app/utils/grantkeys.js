// pages/api/grantKey.js
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { ethers } from "ethers";
import { http, createWalletClient, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const grantkey = async (recipientAddress) => {
  const unlockAddress = "0xdc8e0d9ce98e81e9b614570becce27fb667ca220";
  const privateKey = process.env.PVT_KEY;

  const client = createPublicClient({
    chain: base,
    transport: http(
      "https://base-mainnet.g.alchemy.com/v2/rMYr-Rk_99PwVZE8cioxT0aXKskRXRu7"
    ),
  });

  const account = privateKeyToAccount(`0x${privateKey}`);

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(
      "https://base-mainnet.g.alchemy.com/v2/rMYr-Rk_99PwVZE8cioxT0aXKskRXRu7"
    ),
  });

  try {
    const { request } = await client.simulateContract({
      address: unlockAddress,
      abi: PublicLockV13.abi,
      functionName: "grantKeys",
      args: [
        [recipientAddress],
        [ethers.constants.MaxUint256],
        ["0x0B561c02AfAAb4060b028254c4Aa03a5646B0F18"],
      ],
      account,
      chain: base,
    });
    const txn = await walletClient.writeContract(request);
    return true;
  } catch (error) {
    console.error({ error });
    return false;
  }
};
