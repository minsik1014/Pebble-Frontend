import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  socialLogin,
  type SocialProvider,
} from '@/features/auth/api/authApi';
import {
  getSocialRedirectUri,
  validateSocialOAuthState,
} from '@/features/auth/utils/socialOAuth';
import { useProfileStore } from '@/features/mypage/store/useProfileStore';
import { setAuthTokens } from '@/services/api';

function isSocialProvider(value: string | undefined): value is SocialProvider {
  return value === 'google' || value === 'naver';
}

export const SocialOAuthCallbackPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const hasRequested = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    if (!isSocialProvider(provider)) {
      setErrorMessage('지원하지 않는 소셜 로그인 방식이에요.');
      return;
    }

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const oauthError = searchParams.get('error');

    if (
      oauthError ||
      !code ||
      !validateSocialOAuthState(provider, state)
    ) {
      setErrorMessage('소셜 인증을 완료하지 못했어요.');
      return;
    }

    void socialLogin(provider, {
      code,
      redirectUri: getSocialRedirectUri(provider),
    })
      .then(async (response) => {
        useProfileStore.getState().resetProfile();
        setAuthTokens(response.accessToken, response.refreshToken);

        if (response.isNewUser) {
          navigate('/profile-setup', {
            replace: true,
            state: { mode: 'social' },
          });
          return;
        }

        await useProfileStore.getState().loadProfile();

        navigate('/', { replace: true });
      })
      .catch(() => {
        setErrorMessage('소셜 로그인에 실패했어요. 다시 시도해 주세요.');
      });
  }, [navigate, provider, searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-fill-inverse font-sans" data-theme="light">
      <p className="text-[16px] text-text-primary">
        {errorMessage ?? '소셜 로그인 처리 중...'}
      </p>
      {errorMessage && (
        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          className="h-[44px] rounded-[12px] bg-btn-primary px-6 text-text-onFill"
        >
          로그인으로 돌아가기
        </button>
      )}
    </main>
  );
};
