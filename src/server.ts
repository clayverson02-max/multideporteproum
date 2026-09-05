import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = { fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response };
let serverEntryPromise: Promise<ServerEntry> | undefined;
async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => (m.default ?? m) as ServerEntry);
  return serverEntryPromise;
}
function getToken(env: unknown) {
  const record = env && typeof env === "object" ? env as Record<string, unknown> : {};
  return typeof record.META_CAPI_ACCESS_TOKEN === "string" && record.META_CAPI_ACCESS_TOKEN ? record.META_CAPI_ACCESS_TOKEN : undefined;
}
function getCookie(request: Request, name: string) {
  return request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1];
}
async function handleCapi(request: Request, env: unknown) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const accessToken = getToken(env);
  if (!accessToken) return Response.json({ ok: true, configured: false });
  try {
    const body = await request.json() as { event_name?: string; event_id?: string; custom_data?: Record<string, unknown>; url?: string };
    const allowed = new Set(["PageView", "ViewContent", "Lead", "InitiateCheckout"]);
    if (!body.event_name || !allowed.has(body.event_name)) return Response.json({ ok: false, error: "Invalid event" }, { status: 400 });
    const userData: Record<string, string> = { client_user_agent: request.headers.get("user-agent") ?? "" };
    const fbp = getCookie(request, "_fbp"); const fbc = getCookie(request, "_fbc");
    if (fbp) userData.fbp = fbp; if (fbc) userData.fbc = fbc;
    const payload = { data: [{ event_name: body.event_name, event_time: Math.floor(Date.now() / 1000), event_id: body.event_id, action_source: "website", event_source_url: body.url ?? request.headers.get("referer") ?? "", user_data: userData, custom_data: body.custom_data ?? {} }] };
    const response = await fetch(`https://graph.facebook.com/v23.0/889185807027175/events?access_token=${encodeURIComponent(accessToken)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    return new Response(await response.text(), { status: response.status, headers: { "content-type": "application/json" } });
  } catch { return Response.json({ ok: false }, { status: 500 }); }
}
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) return response;
  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
}
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/meta-capi") return handleCapi(request, env);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), { status: 500, headers: { "content-type": "text/html; charset=utf-8" } });
    }
  },
};
