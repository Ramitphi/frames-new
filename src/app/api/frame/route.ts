import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { getNFTOwner } from "../../utils/getNFTOwners";
import { getAccount } from "../../utils/getAccount";
import { Redis } from "@upstash/redis";

const NEXT_PUBLIC_URL = "https://dac8-205-254-163-184.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });
  let count;

  let user;
  const redis = new Redis({
    url: "https://primary-blowfish-43231.upstash.io",
    token:
      "AajfACQgZWNjMjhkYWUtYTdkMC00MmNjLWFlYjYtOWVkZjMxZGZiOTg3ODllMTE0OGJjMmY0NDYxYThjODUxN2QyOTRmZjZjN2Y=",
  });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    const d: number | null = await redis.get(accountAddress);
    console.log({ d });

    const res = await getNFTOwner(accountAddress);

    let uAddress;
    if (d) {
      count = d;
    } else {
      count = 0;
    }
    let showuser;

    for (let i = count + 1; i < res?.length; i++) {
      uAddress = res[i].owner.identity;
      user = await getAccount(uAddress);

      if (user) {
        showuser = user[0].profileName;
        console.log({ showuser });

        await redis.set(accountAddress, i);
        break;
      }
    }

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: "Next",
          },
          {
            action: "link",
            label: `${showuser} 📖`,
            target: `https://warpcast/${showuser}`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/outcast.png`,
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
