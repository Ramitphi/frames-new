// pages/api/grantKey.js
import { http, createWalletClient, createPublicClient } from "viem";
import { base } from "viem/chains";
import abi from "./contractabi.json";

export const getBidding = async () => {
  const memberBiddingAddress = "0x965efa34c91088Fb2dF67CC1c8E4e83C3B8B4Ec3";

  const client = createPublicClient({
    chain: base,
    transport: http(
      "https://base-mainnet.g.alchemy.com/v2/rMYr-Rk_99PwVZE8cioxT0aXKskRXRu7"
    ),
  });

  try {
    const { request } = await client.simulateContract({
      address: memberBiddingAddress,
      abi: abi,
      functionName: "auction",
    });
    const txn = await client.readContract(request);
    console.log(txn);
    return {
      tokenId: Number(txn[0]),
      price: Number(txn[1]) / Math.pow(10, 18),
    };
  } catch (error) {
    console.error({ error });
    return { data: "" };
  }
};
