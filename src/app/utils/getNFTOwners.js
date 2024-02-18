import { init } from "@airstack/airstack-react";
import { fetchQuery } from "@airstack/airstack-react";

export const getNFTOwner = async (address) => {
  console.log({ address });
  init(process.env.AIRSTACK_API_KEY);

  const query = `
  query MyQuery {
    Base: TokenBalances(
      input: {filter: {tokenAddress: {_eq: "0x73682A7f47Cb707C52cb38192dBB9266D3220315"}}, blockchain: base, limit: 200}
    ) {
      TokenBalance {
        owner {
          identity
        }
        amount
        tokenAddress
        tokenId
        tokenType
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }
`;

  const { data, error } = await fetchQuery(query);

  return data.Base.TokenBalance;
};
