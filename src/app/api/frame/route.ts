import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import {
  getDailyAllowance,
  getTotalbalance,
  getLiquidityMintingPoints,
} from "../../utils/degen";

const NEXT_PUBLIC_URL =
  "https://frames-new-git-degen-dashboard-ramitphis-projects.vercel.app/";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    let number;
    if (message.button === 1) {
      const data = await getDailyAllowance(accountAddress);
      const newlabel = `Allowance: ${data[0].tip_allowance}`;

      console.log(newlabel);

      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: newlabel,
            },
            { label: " Balance" },
            { label: "Liquidity  Points" },
          ],
          image: `${NEXT_PUBLIC_URL}/degen.png`,
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        })
      );
    }
    if (message.button === 2) {
      const data = await getTotalbalance(accountAddress);
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: " Allowance",
            },
            { label: `Balance: ${data[0].points}` },
            { label: " Liquidity Miting Points" },
          ],
          image: `${NEXT_PUBLIC_URL}/degen.png`,
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        })
      );
    }
    if (message.button === 3) {
      const data = await getLiquidityMintingPoints(accountAddress);

      let points = 0;
      data[0] ? (points = data[0].points) : (points = 0);

      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: "Allowance",
            },
            { label: ` Balance` },
            { label: `Points: ${points}` },
          ],
          image: `${NEXT_PUBLIC_URL}/degen.png`,
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        })
      );
    }
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
