import type { VercelRequest, VercelResponse } from "@vercel/node";
import type * as Runtime from "../../server/_core/runtime";

const runtimeModulePromise: Promise<typeof Runtime> =
  process.env.VERCEL === "1"
    ? import("../../dist/server/runtime.js")
    : import("../../server/_core/runtime");

function getQueryValue(value: VercelRequest["query"][string]): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = getQueryValue(req.query.code);
  const state = getQueryValue(req.query.state);

  if (!code || !state) {
    res.status(400).json({ error: "code and state are required" });
    return;
  }

  try {
    const { COOKIE_NAME, ONE_YEAR_MS, db, sdk, getSessionCookieOptions, setCookie } =
      await runtimeModulePromise;

    const tokenResponse = await sdk.exchangeCodeForToken(code, state);
    const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

    if (!userInfo.openId) {
      res.status(400).json({ error: "openId missing from user info" });
      return;
    }

    await db.upsertUser({
      id: userInfo.openId,
      name: userInfo.name || null,
      email: userInfo.email ?? null,
      loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
      lastSignedIn: new Date(),
    });

    const sessionToken = await sdk.createSessionToken(userInfo.openId, {
      name: userInfo.name || "",
      expiresInMs: ONE_YEAR_MS,
    });

    const cookieOptions = getSessionCookieOptions(req);
    setCookie(res, COOKIE_NAME, sessionToken, {
      ...cookieOptions,
      maxAge: ONE_YEAR_MS,
    });

    res.status(302);
    res.setHeader("Location", "/");
    res.end();
  } catch (error) {
    console.error("[OAuth] Callback failed", error);
    res.status(500).json({ error: "OAuth callback failed" });
  }
}
