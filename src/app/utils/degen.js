import axios from "axios";

export const getDailyAllowance = async (address) => {
  const res = await axios.get(
    `https://www.degen.tips/api/airdrop2/tip-allowance?address=${address}`
  );
  return res.data;
};

export const getTotalbalance = async (address) => {
  const res = await axios.get(
    `https://www.degen.tips/api/airdrop2/points?address=${address}`
  );
  return res.data;
};

export const getLiquidityMintingPoints = async (address) => {
  const res = await axios.get(
    `https://www.degen.tips/api/liquidity-mining/points?address=${address}`
  );
  return res.data;
};
