import { describe, expect, it, vi } from "vitest";
import { verifyFinanceAccess, passwordLinkType } from "./auth-access";

describe("exclusive finance access", () => {
  it("denies unauthenticated visitors without querying permissions", async () => {
    const permission = vi.fn(async () => true);
    expect(await verifyFinanceAccess(async () => false, permission)).toBe(false);
    expect(permission).not.toHaveBeenCalled();
  });
  it("denies authenticated but unauthorized accounts", async () => {
    expect(await verifyFinanceAccess(async () => true, async () => false)).toBe(false);
  });
  it("allows only authenticated accounts approved by the database", async () => {
    expect(await verifyFinanceAccess(async () => true, async () => true)).toBe(true);
  });
  it("accepts invite and recovery links but not ordinary sessions for password setup", () => {
    expect(passwordLinkType("#type=invite&access_token=x")).toBe(true);
    expect(passwordLinkType("#type=recovery&access_token=x")).toBe(true);
    expect(passwordLinkType("#type=signup")).toBe(false);
    expect(passwordLinkType("")).toBe(false);
  });
});