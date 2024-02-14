import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const NEXT_PUBLIC_URL = "https://9ec4-171-76-82-77.ngrok-free.app";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Allowance",
    },
    { label: "Balance" },
    { label: "Liquidity  Points" },
  ],
  image: `${NEXT_PUBLIC_URL}/degen.png`,

  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "ramit.xyz",
  description: "LFG",
  openGraph: {
    title: "ramit",
    description: "LFG",
    images: [`${NEXT_PUBLIC_URL}/success.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return <>gggg</>;
}
