// src/features/auth/utils/mockAuth.ts

const AUTH_STORAGE_KEY = 'pebble_mock_auth';

export function isMockAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function setMockAuthenticated() {
  localStorage.setItem(AUTH_STORAGE_KEY, 'true');
}

export function clearMockAuthenticated() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}