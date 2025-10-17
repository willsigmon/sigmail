import type { IncomingMessage, ServerResponse } from "http";
// @ts-ignore - cookie package has type export issues with some TS configurations
import { serialize as serializeCookie } from "cookie";

type SameSite = "strict" | "lax" | "none";

export type CookieOptions = {
  domain?: string;
  httpOnly?: boolean;
  path?: string;
  sameSite?: SameSite;
  secure?: boolean;
  maxAge?: number;
  expires?: Date;
};

type RequestLike = IncomingMessage & { protocol?: string };
type ResponseLike = Pick<ServerResponse, "getHeader" | "setHeader">;

function isSecureRequest(req: RequestLike) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers?.["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

function appendSetCookieHeader(res: ResponseLike, value: string) {
  const existing = res.getHeader("Set-Cookie");

  if (!existing) {
    res.setHeader("Set-Cookie", value);
    return;
  }

  if (Array.isArray(existing)) {
    res.setHeader("Set-Cookie", [...existing, value]);
    return;
  }

  res.setHeader("Set-Cookie", [String(existing), value]);
}

export function setCookie(
  res: ResponseLike,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const serialized = serializeCookie(name, value, {
    httpOnly: options.httpOnly,
    domain: options.domain,
    path: options.path ?? "/",
    sameSite: options.sameSite,
    secure: options.secure,
    maxAge: options.maxAge,
    expires: options.expires,
  });

  appendSetCookieHeader(res, serialized);
}

export function clearCookie(
  res: ResponseLike,
  name: string,
  options: CookieOptions = {}
) {
  setCookie(res, name, "", {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
}

export function getSessionCookieOptions(req: RequestLike): CookieOptions {
  const secure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    sameSite: secure ? "none" : "lax",
    secure,
  };
}
