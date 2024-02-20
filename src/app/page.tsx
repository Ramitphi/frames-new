import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const NEXT_PUBLIC_URL = "https://e1ef-205-254-163-183.ngrok-free.app";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Create Meeting",
    },
  ],
  image: `${NEXT_PUBLIC_URL}/Huddle01.png`,

  post_url: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: "ramit.xyz",
  description: "LFG",
  openGraph: {
    title: "ramit",
    description: "LFG",
    images: [`${NEXT_PUBLIC_URL}/Huddle01.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return <>gggg</>;
}
