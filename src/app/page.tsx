import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const NEXT_PUBLIC_URL = "https://6701-103-59-75-143.ngrok-free.app";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Create Word Cast (Click Twice)",
    },
  ],
  image: `${NEXT_PUBLIC_URL}/wordcloud.png`,

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
  return <>Generates word cloud </>;
}
