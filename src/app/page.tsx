import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const NEXT_PUBLIC_URL = "https://125e-103-59-75-203.ngrok-free.app";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Create Word Cast",
    },
  ],
  image: `${NEXT_PUBLIC_URL}/success.png`,

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
  return <>nhj </>;
}
