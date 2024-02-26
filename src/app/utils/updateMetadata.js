// pages/api/grantKey.js
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { ethers } from "ethers";
import { LocksmithService } from "@unlock-protocol/unlock-js";
import { http, createWalletClient, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { getTokenId } from "./getTokenId";

export const updateMetadata = async (recipientAddress, img) => {
  const unlockAddress = "0xaa713b6ba2774708b0bfa2b3d933fb02c3b58896";
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

    const tokenId = await getTokenId(recipientAddress);
    console.log(tokenId);
    console.log({ tokenId });
    const p = await service.updateKeyMetadata(
      8453,
      unlockAddress,
      tokenId,
      {
        metadata: {
          name: "Word Cloud",
          description: "Word Cloud based on top 10 Casts",
          image: img,
        }, // Assuming all fields are protected
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return true;
  } catch (error) {
    console.error({ error });
    return false;
  }
};
