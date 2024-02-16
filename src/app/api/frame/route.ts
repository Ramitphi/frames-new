import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { grantkey } from "../../utils/grantkeys";
import { isAttendee } from "../../utils/isAttendee";

const NEXT_PUBLIC_URL = "https://c1bf-171-76-82-77.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    const hasAttended = await isAttendee("eam-oydm-tdl", accountAddress);
    console.log({ hasAttended });

    if (hasAttended) {
      try {
        const isGranted = await grantkey(accountAddress);

        if (isGranted) {
          return new NextResponse(
            getFrameHtmlResponse({
              image: `${NEXT_PUBLIC_URL}/minted.png`,
              post_url: `${NEXT_PUBLIC_URL}/api/frame`,
            })
          );
        }
      } catch (e) {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: `Already Claimed!`,
              },
            ],
            image: `${NEXT_PUBLIC_URL}/claimed.png`,
            post_url: `${NEXT_PUBLIC_URL}/api/frame`,
          })
        );
      }
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
