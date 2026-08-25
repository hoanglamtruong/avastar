import webpush from "web-push";
import { prisma } from "@/lib/prisma";

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  process.env.VAPID_PUBLIC_KEY ||
  "BDvp6z59I2nuzCF2iaODvha_C55gELX0Jv_pofGuO1HsVBKAJ3-gvBUEqjAEYHmeSZKnbBa5UPLcsDIaYb2wsCk";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY ||
  "RnwVw3Svk6lHiY68jZRHej2OYSAO_R4J-cULYal-BSc";

const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:admin@avastar.zeebee.io.vn";

try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} catch (err) {
  console.warn("[web-push] setVapidDetails error:", err);
}

export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
}

/**
 * Send Web Push notification to all active owner / admin subscriptions
 */
export async function sendPushNotificationToOwners(payload: PushPayload) {
  try {
    const ownerUsers = await prisma.user.findMany({
      where: {
        role: {
          in: ["owner", "admin"],
        },
      },
      select: { id: true },
    });

    const ownerIds = ownerUsers.map((u) => u.id);
    if (ownerIds.length === 0) return;

    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId: { in: ownerIds },
      },
    });

    if (subscriptions.length === 0) return;

    const pushPayloadString = JSON.stringify({
      title: payload.title || "AVASTAR",
      body: payload.body || "Bạn có thông báo mới",
      url: payload.url || "/",
      icon: payload.icon || "/icons/icon-192.png",
      badge: payload.badge || "/icons/icon-192.png",
    });

    const promises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, pushPayloadString);
      } catch (err: any) {
        if (err.statusCode === 404 || err.statusCode === 410) {
          // Subscription expired or unsubscribed, remove from DB
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error("[web-push] send failed for subscription:", sub.id, err?.message);
        }
      }
    });

    await Promise.allSettled(promises);
  } catch (error) {
    console.error("[web-push] sendPushNotificationToOwners error:", error);
  }
}
