const ACCESS_TOKEN_STORAGE_KEY = "pebble_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "pebble_refresh_token";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function getAccessToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function getRefreshToken() {
  if (!canUseLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setRefreshToken(refreshToken: string) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
}

export function setAuthTokens(accessToken: string, refreshToken: string) {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
}

export function clearAuthTokens() {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export const clearAccessToken = clearAuthTokens;
