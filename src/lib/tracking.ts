import { useEffect } from "react";
import { loadUtmfyScript } from "./utmfy";

export const META_PIXEL_ID = "889185807027175";
export type TrackingEvent = "PageView" | "ViewContent" | "Lead" | "InitiateCheckout";

function ensurePixel() {
  if (typeof window === "undefined") return;
  const w = window as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown };
  if (w.fbq) return;
  const fbq = (...args: unknown[]) => { (fbq as typeof fbq & { queue?: unknown[] }).queue?.push(args); };
  (fbq as typeof fbq & { queue?: unknown[] }).queue = [];
  (fbq as typeof fbq & { loaded?: boolean; version?: string }).loaded = true;
  (fbq as typeof fbq & { version?: string }).version = "2.0";
  w.fbq = fbq; w._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", META_PIXEL_ID);
}

export function track(event: TrackingEvent, customData: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  ensurePixel();
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  const eventId = `${event.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  fbq?.("track", event, customData, { eventID: eventId });
  void fetch("/api/meta-capi", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event_name: event, event_id: eventId, custom_data: customData, url: window.location.href }),
    keepalive: true,
  }).catch(() => undefined);
}

export function useMarketingTracking() {
  useEffect(() => {
    ensurePixel();
    track("PageView");
    loadUtmfyScript();
  }, []);
}
