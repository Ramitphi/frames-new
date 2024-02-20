import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { getMeeting } from "../../utils/getMeeting";

const NEXT_PUBLIC_URL = "https://e1ef-205-254-163-183.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];

    const meetingLink = await getMeeting(accountAddress);

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            action: "link",
            label: `Meeting Link`,
            target: `https://app.huddle01.com/${meetingLink}`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/Huddle01.png`,
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
