import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { grantkey } from "../../utils/grantkeys";

const NEXT_PUBLIC_URL = "https://87b7-205-254-163-184.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  let fid: number | undefined = 0;

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];

    const isGranted = await grantkey(accountAddress);

    if (isGranted) {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Success`,
            },
          ],
          image: `${NEXT_PUBLIC_URL}/success.png`,
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        })
      );
    }
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Txn Failed`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/failure.png`,
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
