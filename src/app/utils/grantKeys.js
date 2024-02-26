// pages/api/grantKey.js
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { ethers } from "ethers";
import { LocksmithService } from "@unlock-protocol/unlock-js";
import { http, createWalletClient, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

export const grantkey = async (recipientAddress, img) => {
  const unlockAddress = "0xa5efd9aba615b8056e2886cfb0c4898b60748cdd";
  const privateKey = process.env.PVT_KEY;

  console.log({ privateKey });
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
    const service = new LocksmithService();

    const siwe = LocksmithService.createSiweMessage({
      domain: "unlock-protocol.com",
      uri: "https://unlock-protocol.com",
      address: "0x4C4926B2d1feFa7CceC2888ffCA1e2db98BC42A4",
      chainId: 8453,
      version: "1",
    });

    // Get message text to be signed
    const message = siwe.prepareMessage();
    console.log({ message });
    const signature = await walletClient.signMessage({
      account,
      message,
    });

    const loginResponse = await service.login({
      message,
      signature,
    });

    const { accessToken } = loginResponse.data;

    console.log(accessToken);
    // Save the metadata in locksmith
    const p = await service.updateUserMetadata(
      8453,
      unlockAddress,
      recipientAddress,
      {
        metadata: { public: img }, // Assuming all fields are protected
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log({ f: p.data.metadata.public });
    // Grant the key

    // const { request } = await client.simulateContract({
    //   address: unlockAddress,
    //   abi: PublicLockV13.abi,
    //   functionName: "grantKeys",
    //   args: [
    //     [recipientAddress],
    //     [ethers.constants.MaxUint256],
    //     ["0x4C4926B2d1feFa7CceC2888ffCA1e2db98BC42A4"],
    //   ],
    //   account,
    //   chain: base,
    // });
    // console.log({ request });
    // const txn = await walletClient.writeContract(request);
    // console.log({ txn });
    return true;
  } catch (error) {
    console.error({ error });
    return false;
  }
};
