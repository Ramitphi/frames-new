import axios from "axios";

export const getNFTImageUrl = async (tokendId) => {
  console.log({ tokendId });

  const options = {
    headers: {
      accept: "application/json",
      "X-API-KEY":
        "ramitag734_sk_0382b30d-9a72-41a2-a09e-5e961657b34e_o2uzx7n7yz4ii8vs",
    },
  };

  const { data } = await axios.get(
    `https://api.simplehash.com/api/v0/nfts/base/0xFBfe187b444798214Dd4BbfAdE369F8DC3864C6a/${tokendId}`,
    options
  );
  console.log({ data: data.image_url });

  return data.image_url;
};
