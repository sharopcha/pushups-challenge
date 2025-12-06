import { useEffect } from "react";
import { isStandalonePWA } from "@/lib/isStandalone";
import { createClient } from "../supabase/client";

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

export function useRegisterPushSubscription() {
  const supabase = createClient();

  useEffect(() => {
    if (!isStandalonePWA()) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    const register = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const jsonSub = subscription.toJSON();
      const { endpoint, keys } = jsonSub;

      if (!endpoint || !keys || !keys.p256dh || !keys.auth) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("push_subscriptions").upsert(
        {
          user_id: user.id,
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_agent: navigator.userAgent,
        },
        { onConflict: "endpoint" } // so we don't duplicate
      );
    };

    register().catch(console.error);
  }, [supabase]);
}
