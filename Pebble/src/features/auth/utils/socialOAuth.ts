import type { SocialProvider } from '../api/authApi';

const OAUTH_STATE_KEY_PREFIX = 'pebble_oauth_state_';

const PROVIDER_CONFIG = {
  google: {
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
  },
  naver: {
    authorizationUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
    scope: undefined,
  },
} satisfies Record<
  SocialProvider,
  {
    authorizationUrl: string;
    clientId?: string;
    scope?: string;
  }
>;

export function getSocialRedirectUri(provider: SocialProvider) {
  return `${window.location.origin}/oauth/callback/${provider}`;
}

/** OAuth CSRF 방지 state를 저장한 뒤 각 플랫폼의 인가 화면으로 이동합니다. */
export function startSocialLogin(provider: SocialProvider) {
  const config = PROVIDER_CONFIG[provider];

  if (!config.clientId) {
    throw new Error(`${provider} OAuth Client ID가 설정되지 않았습니다.`);
  }

  const state = crypto.randomUUID();
  sessionStorage.setItem(`${OAUTH_STATE_KEY_PREFIX}${provider}`, state);

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: getSocialRedirectUri(provider),
    response_type: 'code',
    state,
  });

  if (config.scope) {
    params.set('scope', config.scope);
  }

  window.location.assign(`${config.authorizationUrl}?${params.toString()}`);
}

export function validateSocialOAuthState(
  provider: SocialProvider,
  receivedState: string | null,
) {
  const storageKey = `${OAUTH_STATE_KEY_PREFIX}${provider}`;
  const savedState = sessionStorage.getItem(storageKey);
  sessionStorage.removeItem(storageKey);

  return Boolean(
    receivedState &&
      savedState &&
      receivedState === savedState,
  );
}
