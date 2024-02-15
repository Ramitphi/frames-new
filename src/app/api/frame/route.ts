import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { recommendUser } from "../../utils/recommend";
import { isAttendee } from "../../utils/isAttendee";
import { getAccount } from "../../utils/getAccount";
const NEXT_PUBLIC_URL = "https://9ec4-171-76-82-77.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });
  console.log({ g: message });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    let count = 0;

    const res = await isAttendee(accountAddress);
    console.log({ len: res?.length });
    let uAddress;
    for (let i = count; i < res?.length; i++) {
      if (res[i].followerAddress?.tokenBalances[0]?.owner?.identity) {
        uAddress = res[i].followerAddress?.tokenBalances[0]?.owner?.identity;
        count = i;
        break;
      }
    }
    const user = await getAccount(uAddress);

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: "Next",
          },
          {
            label: `${user} ✈️`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/ethdenver.png`,
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
