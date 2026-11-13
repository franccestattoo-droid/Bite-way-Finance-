export async function verifyFinanceAccess(
  verifyUser: () => Promise<boolean>,
  verifyPermission: () => Promise<boolean>,
): Promise<boolean> {
  if (!(await verifyUser())) return false;
  return verifyPermission();
}

export function passwordLinkType(hash: string): boolean {
  const type = new URLSearchParams(hash.replace(/^#/, "")).get("type");
  return type === "recovery" || type === "invite";
}