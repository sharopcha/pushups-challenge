// Deno Edge Function
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import webpush from "https://esm.sh/web-push@3.6.6";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT")!;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const PROJECT_DB_URL = Deno.env.get("PROJECT_DB_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(PROJECT_DB_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

interface Payload {
  userId: string;
  count: number; // last added pushups
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = (await req.json()) as Payload;

  const { userId, count } = body;

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return new Response("Error fetching subs", { status: 500 });
  }

  const payload = JSON.stringify({
    title: "Nice set! 💪",
    body: `You just added ${count} push-ups. Keep it up!`,
    url: "/dashboard",
  });

  const promises =
    subs?.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      ).catch((e: any) => {
        console.error("Push error", e?.statusCode, e?.body || e);
        // Optionally: remove invalid subscriptions if 410/404
      })
    ) ?? [];

  await Promise.all(promises);

  return new Response("ok", { status: 200 });
});
