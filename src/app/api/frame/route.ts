import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { getBidding } from "../../utils/getBidding";
import { getNFTImageUrl } from "../../utils/getNFTImageUrl";

const NEXT_PUBLIC_URL = "https://13ec-103-59-75-39.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];

    const { tokenId, price } = await getBidding();
    const metadata = await getNFTImageUrl(tokenId);
    console.log({ metadata });

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Place Bid`,
            action: "link",
            target: `https://nouns.build/dao/base/0xFBfe187b444798214Dd4BbfAdE369F8DC3864C6a/${tokenId}?tab=contracts`,
          },
          {
            label: `Current Bid: ${price}ETH`,
          },
        ],
        image: metadata,
        post_url: `${NEXT_PUBLIC_URL}/api/frame`,
      })
    );
  }
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Auth Failed`,
        },
      ],
      image: `${NEXT_PUBLIC_URL}/failure.png`,
      post_url: `${NEXT_PUBLIC_URL}/api/frame`,
    })
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
