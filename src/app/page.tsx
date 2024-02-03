import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const NEXT_PUBLIC_URL = "https://frames-new.vercel.app";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Click Me",
    },
    { label: "button 2" },
  ],
  image: `${NEXT_PUBLIC_URL}/park-1.png`,
  input: {
    text: "Tell me a boat story",
  },
  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "ramit.xyz",
  description: "LFG",
  openGraph: {
    title: "ramit",
    description: "LFG",
    images: [`${NEXT_PUBLIC_URL}/park-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return <>ramit</>;
}
