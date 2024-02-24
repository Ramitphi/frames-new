import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";

import { NextRequest, NextResponse } from "next/server";
import { getCasts } from "../../utils/getCasts";
import { getWorldCloud } from "../../utils/getWordCloud";
import { getImageUrl } from "../../utils/getImageUrl";

const NEXT_PUBLIC_URL = "https://125e-103-59-75-203.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    console.log({ accountAddress });

    const data = await getCasts(2391);
    console.log({ data });

    const res = await getWorldCloud(data);
    console.log({ res });

    const cloudImage = await getImageUrl(res);

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Show Cloud`,
          },
        ],
        image: `${cloudImage}`,
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
