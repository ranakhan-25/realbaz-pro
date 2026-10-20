export interface AdminAuthSession {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  expiresAt?: string;
}

export async function loginAdminSession(
  identifier: string,
  password: string,
): Promise<AdminAuthSession> {
  void identifier;
  void password;

  return {
    accessToken: "demo-admin-access-token",
    refreshToken: "demo-admin-refresh-token",
    token: "demo-admin-access-token",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

export async function refreshAdminSession(): Promise<AdminAuthSession> {
  return {
    accessToken: "demo-admin-access-token",
    refreshToken: "demo-admin-refresh-token",
    token: "demo-admin-access-token",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

export async function logoutAdminSession(): Promise<void> {
  return;
}
