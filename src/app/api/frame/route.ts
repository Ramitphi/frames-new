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
import { updateMetadata } from "../../utils/updateMetadata";
import { grantkey } from "../../utils/grantKey";

const NEXT_PUBLIC_URL = "https://eb1a-103-59-75-143.ngrok-free.app";

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

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
    console.log({ accountAddress });

    const res: { img: string; minted: boolean } | null = await redis.get(
      accountAddress
    );
    console.log({ valid: res });

    if (res?.minted) {
      console.log("update");

      const min = await updateMetadata(accountAddress, res?.img);

      if (min) {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: `Minted Successfully`,
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
      console.log("inside grant");

      const isGranted = await grantkey(accountAddress);

      console.log({ hh: res?.img });

      if (isGranted) {
        await redis.set(accountAddress, { img: res?.img, minted: true });

        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [
              {
                label: "Mint",
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
                label: `Error!!`,
              },
            ],
            image: `${res?.img}`,
            post_url: `${NEXT_PUBLIC_URL}/api/frame`,
          })
        );
      }
    } else {
      const data = await getCasts(message.interactor.fid);
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
              label: `Creating word cloud. Wait for  3 sec & Click`,
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
