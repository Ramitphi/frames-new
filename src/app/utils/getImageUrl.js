// import { Resvg } from "@resvg/resvg-js";
import { convert } from "convert-svg-to-png";

import { NFTStorage, File } from "nft.storage";
export const getImageUrl = async (svgData) => {
  console.log({ svgData });
  const NFT_STORAGE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGQ2ZmFiOGJDOGE4MUU5OWU3YURjMmZmOERmNzVGNjg4ZmExQkY2NjYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwODc3MDc4MDQ0OSwibmFtZSI6IndvcmRjYXN0In0.MrRVOj61z8y2kkMqTVlz4i14wUc6cq84CmScYORek0s";
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const data = await convert(svgData);
  console.log({ data });

  const blob = new Blob([data], { type: "image/jpeg" });
  console.log(blob);

  const cid = await client.storeBlob(blob);
  return `https://nftstorage.link/ipfs/${cid}`;
};
