import { createClient } from "./supabase/client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function ensurePushSubscriptionAndNotify(pushupCount: number) {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator) || !("Notification" in window)) return;

  const supabase = createClient();

  // 1) Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // 2) Make sure service worker is ready
  const reg = await navigator.serviceWorker.ready;

  // 3) Get existing subscription if any
  let subscription = await reg.pushManager.getSubscription();

  // 4) If no subscription, ask permission + subscribe
  if (!subscription) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted");
      return;
    }

    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const jsonSub = subscription.toJSON();
  const { endpoint, keys } = jsonSub;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    console.error("Invalid subscription object");
    return;
  }

  // 5) Upsert into Supabase
  const { error: subError } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      user_agent: navigator.userAgent,
    },
    { onConflict: "endpoint" }
  );

  if (subError) {
    console.error("Error saving subscription:", subError);
    return;
  }

  // 6) Call the edge function to send the push
  //    (If you still want to restrict by env, keep the NODE_ENV check)
  const { data: fnData, error: fnError } = await supabase.functions.invoke(
    "pushup-notify",
    {
      body: {
        userId: user.id,
        count: pushupCount,
      },
    }
  );

  console.log("Function response:", fnData);
  if (fnError) {
    console.error("Function error:", fnError);
  }
}