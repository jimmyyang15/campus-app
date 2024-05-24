import { env } from "@/env";
import { type NextRequest, NextResponse } from "next/server";
import webPush from "web-push";

export const POST = async (req: NextRequest) => {
  if (!env.NEXT_PUBLIC_VAPID_KEY || !env.WEB_PUSH_EMAIL || !env.WEB_PUSH_PRIVATE_KEY) {
    throw new Error("Environment variables supplied not sufficient.");
  }
  const { subscription } = (await req.json()) as {
    subscription: webPush.PushSubscription;
  };
  try {
    webPush.setVapidDetails(`mailto:${env.WEB_PUSH_EMAIL}`, env.NEXT_PUBLIC_VAPID_KEY, env.WEB_PUSH_PRIVATE_KEY);
    const response = await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Hello Web Push",
        message: "Your web push notification is here!",
      }),
    );
    console.log("Responspe: ",response)
    return new NextResponse(response.body, {
      status: response.statusCode,
      headers: response.headers,
    });
  } catch (err:any) {
    if (err instanceof webPush.WebPushError) {
      return new NextResponse(err.body, {
        status: err.statusCode,
        headers: err.headers,
      });
    }
    console.log(err);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};