// pages/api/grantKey.js
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { ethers } from "ethers";
import { http, createWalletClient, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const grantkey = async (recipientAddress) => {
  const unlockAddress = "0xaa713b6ba2774708b0bfa2b3d933fb02c3b58896";
  const privateKey = process.env.PVT_KEY;

  console.log({ privateKey });
  const client = createPublicClient({
    chain: base,
    transport: http(
      "https://base-mainnet.g.alchemy.com/v2/rMYr-Rk_99PwVZE8cioxT0aXKskRXRu7"
    ),
  });

  const account = privateKeyToAccount(`0x${privateKey}`);
  console.log({ account });

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
    console.error({ error });
    return false;
  }
};
