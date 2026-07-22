// @/features/auth/containers/LoginContainer.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

// 실제 로그인 API 연결 전 화면 흐름 확인에 사용하는 임시 계정입니다.
const MOCK_LOGIN_ACCOUNT = {
  email: "example123@sample.com",
  password: "abcd1234!",
};

export const LoginContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 개별 필드 에러 및 흔들림(shake) 상태 관리 추가
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [shakeTarget, setShakeTarget] = useState<{ email?: boolean; password?: boolean }>({});

  // 회원가입 페이지와 동일한 셰이크 트리거 함수
  const triggerShake = (field: "email" | "password") => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setShakeTarget((prev) => ({ ...prev, [field]: false })), 400);
  };

  // 회원가입 정규식과 완전히 통일 (@ 이후 최소 3자, 첫 번째 . 이후 최소 2자)
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
  
  // 통합 포커스 아웃(onBlur) 핸들러 수정
  const handleFieldBlur = (field: "email" | "password") => {
    // 핵심 수정 사항: 회원가입 페이지처럼 빈 값일 때는 Blur 시점 검사를 건너뜁니다!
    if (field === "email" && email !== "") {
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아니에요" }));
        triggerShake("email");
      }
    }

    if (field === "password" && password !== "") {
      // 만약 로그인 비밀번호도 최소 글자 수 규칙이 필요하다면 조건 커스텀 가능합니다.
      // 현재는 회원가입 양식처럼 입력 시 오류가 없으면 패스하게끔 기본 설계합니다.
      if (password.length < 8) {
        setErrors((prev) => ({ ...prev, password: "비밀번호는 8자 이상이어야 합니다." }));
        triggerShake("password");
      }
    }
  };
  
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  // 로그인 시도(제출) 시점에 빈 값 필터링 및 셰이크 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let hasError = false;
    const nextErrors: { email?: string; password?: string } = {};

    // 이메일이 완전히 비었거나 형식이 틀렸을 때
    if (!email.trim()) {
      nextErrors.email = "이메일을 입력해 주세요.";
      triggerShake("email");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      nextErrors.email = "올바른 이메일 형식이 아니에요";
      triggerShake("email");
      hasError = true;
    }

    // 비밀번호가 완전히 비었을 때
    if (!password) {
      nextErrors.password = "비밀번호를 입력해 주세요.";
      triggerShake("password");
      hasError = true;
    }

    if (hasError) {
      setErrors(nextErrors);
      return;
    }

    // 인증 성공 시 메인 홈페이지로 이동합니다.
    if (email === MOCK_LOGIN_ACCOUNT.email && password === MOCK_LOGIN_ACCOUNT.password) {
      setErrors({});
      setErrorMessage(null);
      navigate("/", { replace: true });
      return;
    }
    
    // 이메일/패스워드 입력 요건 통과 후, 백엔드 인증 실패 시 하드코딩 에러박스 노출
    setErrorMessage(
      "로그인하지 못했어요.\n이메일 또는 비밀번호를 다시 확인해 주세요."
    );
  };

  const handleSocialLogin = (provider: "google" | "naver") => {
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
