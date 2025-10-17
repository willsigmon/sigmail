import { describe, expect, it } from "vitest";
import type { IncomingMessage, ServerResponse } from "http";
import { clearCookie, getSessionCookieOptions, setCookie } from "./cookies";

const createMockResponse = () => {
  const headers: Record<string, string | string[]> = {};
  return {
    getHeader(name: string) {
      return headers[name.toLowerCase()];
    },
    setHeader(name: string, value: string | string[]) {
      headers[name.toLowerCase()] = value;
    },
    headers,
  } as unknown as Pick<ServerResponse, "getHeader" | "setHeader"> & {
    headers: Record<string, string | string[]>;
  };
};

const createRequest = (headers: Record<string, string> = {}, protocol?: string) => {
  return {
    headers,
    protocol,
  } as unknown as IncomingMessage & { protocol?: string };
};

describe("cookies", () => {
  it("marks cookies secure when forwarded proto is https", () => {
    const options = getSessionCookieOptions(
      createRequest({ "x-forwarded-proto": "https" })
    );

    expect(options.secure).toBe(true);
    expect(options.sameSite).toBe("none");
  });

  it("falls back to lax when request is not secure", () => {
    const options = getSessionCookieOptions(createRequest());

    expect(options.secure).toBe(false);
    expect(options.sameSite).toBe("lax");
  });

  it("appends Set-Cookie headers on successive calls", () => {
    const res = createMockResponse();
    const opts = getSessionCookieOptions(createRequest({ "x-forwarded-proto": "https" }));

    setCookie(res, "first", "foo", opts);
    setCookie(res, "second", "bar", opts);
    clearCookie(res, "third", opts);

    const header = res.headers["set-cookie"];
    expect(Array.isArray(header)).toBe(true);
    expect(header).toHaveLength(3);
    expect(header?.[0]).toContain("first=foo");
    expect(header?.[1]).toContain("second=bar");
    expect(header?.[2]).toContain("third=");
  });
});
