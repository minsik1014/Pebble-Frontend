// src/features/auth/containers/LoginContainer.tsx

import { useState } from 'react';

import { LoginForm } from '../components/LoginForm';

// 실제 로그인 API 연결 전 화면 흐름 확인에 사용하는 임시 계정입니다.
const MOCK_LOGIN_ACCOUNT = {
  email: 'example123@sample.com',
  password: 'abcd1234!',
};

export const LoginContainer = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 개별 필드 에러 및 흔들림(shake) 상태 관리
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [shakeTarget, setShakeTarget] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  // 회원가입 페이지와 동일한 셰이크 트리거 함수
  const triggerShake = (field: 'email' | 'password') => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(
      () => setShakeTarget((prev) => ({ ...prev, [field]: false })),
      400,
    );
  };

  // 회원가입 정규식과 통일 (@ 이후 최소 3자, 첫 번째 . 이후 최소 2자)
  const emailRegex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (errorMessage) setErrorMessage(null);

    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (errorMessage) setErrorMessage(null);

    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // 통합 포커스 아웃(onBlur) 핸들러
  const handleFieldBlur = (field: 'email' | 'password') => {
    // 회원가입 페이지처럼 빈 값일 때는 Blur 시점 검사를 건너뜁니다.
    if (field === 'email' && email !== '') {
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({
          ...prev,
          email: '올바른 이메일 형식이 아니에요',
        }));
        triggerShake('email');
      }
    }

    if (field === 'password' && password !== '') {
      if (password.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: '비밀번호는 8자 이상이어야 합니다.',
        }));
        triggerShake('password');
      }
    }
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // 로그인 시도(제출) 시점에 빈 값 필터링 및 셰이크 처리
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let hasError = false;
    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.';
      triggerShake('email');
      hasError = true;
    } else if (!emailRegex.test(email)) {
      nextErrors.email = '올바른 이메일 형식이 아니에요';
      triggerShake('email');
      hasError = true;
    }

    if (!password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
      triggerShake('password');
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    // TODO: 실제 로그인/API 연동 전까지 랜딩에서 메인 캘린더로 진입하는 흐름을 임시 비활성화합니다.
    if (
      email === MOCK_LOGIN_ACCOUNT.email &&
      password === MOCK_LOGIN_ACCOUNT.password
    ) {
      setErrors({});
      setErrorMessage('현재 로그인 진입은 임시로 비활성화되어 있어요.');
      return;
    }

    setErrorMessage(
      '로그인하지 못했어요.\n이메일 또는 비밀번호를 다시 확인해 주세요.',
    );
  };

  const handleSocialLogin = (provider: 'google' | 'naver') => {
    console.log(`${provider} 로그인 진행`);
  };

  return (
    <LoginForm
      email={email}
      password={password}
      showPassword={showPassword}
      errorMessage={errorMessage}
      errors={errors}
      shakeTarget={shakeTarget}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onFieldBlur={handleFieldBlur}
      onTogglePassword={handleTogglePassword}
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
    />
  );
};
