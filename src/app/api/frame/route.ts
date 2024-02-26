import {
  FrameRequest,
  getFrameMessage,
  getFrameHtmlResponse,
} from "@coinbase/onchainkit";

import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { getCasts } from "../../utils/getCasts";
import { getWorldCloud } from "../../utils/getWordCloud";
import { getImageUrl } from "../../utils/getImageUrl";
import { grantkey } from "../../utils/grantKeys";

const NEXT_PUBLIC_URL = "https://05fa-103-59-75-143.ngrok-free.app";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let accountAddress: string | undefined = "";
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: "9269D1DF-9073-4D62-96AD-E8AA03CD9C12",
  });

  const redis = new Redis({
    url: "https://us1-direct-longhorn-39936.upstash.io",
    token:
      "AZwAACQgYjYyYjJkMTktZTRlMi00MmQ3LTk0ODgtOGMzNGRlNGFlYWNlOGY4OTRlMzI3MjIyNDQxZmJiN2RlNmZmZmQ0MWRjMzY=",
  });

  console.log({ gg: message });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    // console.log({ accountAddress });
    const res: { img: string; minted: boolean } | null = await redis.get(
      accountAddress
    );
    if (res?.minted) {
      const min = await grantkey(accountAddress, res?.img);
      console.log(res?.img);

      if (min) {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: `Minted`,
              },
            ],
            image: `${res?.img}`,
            post_url: `${NEXT_PUBLIC_URL}/api/frame`,
          })
        );
      } else {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: `Error in minting`,
              },
            ],
            image: `${NEXT_PUBLIC_URL}/failure.png`,
            post_url: `${NEXT_PUBLIC_URL}/api/frame`,
          })
        );
      }
    } else if (res?.img && !res?.minted) {
      await redis.set(accountAddress, { img: res?.img, minted: true });

      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Mint`,
            },
          ],
          image: `${res?.img}`,
          post_url: `${NEXT_PUBLIC_URL}/api/frame`,
        })
      );
    } else {
      const data = await getCasts(message?.interactor?.fid);
      console.log({ data });

      const res = await getWorldCloud(data);
      // console.log({ res });

      const cloudImage = await getImageUrl(res);
      console.log(cloudImage);
      await redis.set(accountAddress, { img: cloudImage, minted: false });

      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: ` click again`,
            },
          ],
          image: `${NEXT_PUBLIC_URL}/wordcloud.png`,
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
