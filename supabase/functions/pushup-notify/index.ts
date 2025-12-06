// Deno Edge Function
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import webpush from "https://esm.sh/web-push@3.6.6";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT")!;

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

interface Payload {
  userId: string;
  count: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  console.log(`${req.method} request received`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log('Non-POST request rejected');
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const body = (await req.json()) as Payload;
    console.log('Received payload:', body);

    const { userId, count } = body;

    if (!userId || !count) {
      console.error('Missing userId or count');
      return new Response(
        JSON.stringify({ error: 'Missing userId or count' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Fetching subscriptions for user: ${userId}`);

    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", userId);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Error fetching subscriptions' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Found ${subs?.length || 0} subscriptions`);

    if (!subs || subs.length === 0) {
      console.log('No subscriptions found, returning success');
      return new Response(
        JSON.stringify({ success: true, message: 'No subscriptions to notify' }), 
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const payload = JSON.stringify({
      title: "Nice set! 💪",
      body: `You just added ${count} push-ups. Keep it up!`,
      url: "/dashboard",
    });

    console.log('Sending notifications...');

    const promises =
      subs.map((sub) =>
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
        })
      );

    await Promise.all(promises);

    console.log('All notifications sent successfully');

    return new Response(
      JSON.stringify({ success: true }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal error' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});