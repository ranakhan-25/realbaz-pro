export const ADMIN_AUTH_STORAGE_KEYS = {
  accessToken: "admin_access_token",
  refreshToken: "admin_refresh_token",
};

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEYS.accessToken);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_AUTH_STORAGE_KEYS.refreshToken);
}

export function setStoredTokens(accessToken?: string, refreshToken?: string) {
  if (typeof window === "undefined") return;

  if (accessToken) {
    window.localStorage.setItem(
      ADMIN_AUTH_STORAGE_KEYS.accessToken,
      accessToken,
    );
  }

  if (refreshToken) {
    window.localStorage.setItem(
      ADMIN_AUTH_STORAGE_KEYS.refreshToken,
      refreshToken,
    );
  }
}

export function clearStoredTokens() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEYS.accessToken);
  window.localStorage.removeItem(ADMIN_AUTH_STORAGE_KEYS.refreshToken);
}

export const adminAuthStorage = {
  getAccessToken: getStoredAccessToken,
  getRefreshToken: getStoredRefreshToken,
  setTokens: setStoredTokens,
  clear: clearStoredTokens,
};
