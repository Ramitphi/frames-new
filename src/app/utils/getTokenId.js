import { init } from "@airstack/airstack-react";
import { fetchQuery } from "@airstack/airstack-react";

export const getTokenId = async (address) => {
  console.log({ address });
  init(process.env.AIRSTACK_API_KEY);

  const query = `query MyQuery {
    Base: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "0xaa713b6ba2774708b0bfa2b3d933fb02c3b58896"}, owner: {_eq: "${address}"}}, blockchain: base, limit: 50}
    ) {
      TokenBalance {
        tokenId
      }
    }
  }`;
  const { data, error } = await fetchQuery(query);
  console.log({ data });
  return data.Base.TokenBalance[0].tokenId;
};
