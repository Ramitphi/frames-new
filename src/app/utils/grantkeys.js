// pages/api/grantKey.js
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { ethers } from "ethers";
import { http, createWalletClient, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const grantkey = async (recipientAddress) => {
  const unlockAddress = "0x8aa635b923526d26fed8143e57700cc4ba0e2755";
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
        ["0x4C4926B2d1feFa7CceC2888ffCA1e2db98BC42A4"],
      ],
      account,
      chain: base,
    });
    const txn = await walletClient.writeContract(request);
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
