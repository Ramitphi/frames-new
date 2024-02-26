import axios from "axios";

export const getCasts = async (fid) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      api_key: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
    },
  };
  const data = await axios.get(
    `https://api.neynar.com/v2/farcaster/feed/user/${fid}/popular`,
    options
  );

  let casts = "";

  for (let i = 0; i < 10; i++) {
    // console.log(data?.data.casts[i]?.text);

    casts = casts + " " + data?.data.casts[i]?.text;
  }

  return casts;
};
