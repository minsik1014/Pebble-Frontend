// @/features/auth/containers/LoginContainer.tsx
import { useState } from "react";
import { LoginForm } from "../components/LoginForm";

export const LoginContainer = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // 💡 에러 메시지 관리 상태 추가 (기본값 null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // 유저가 다시 타이핑을 시작하면 기존 에러 메시지 초기화해주는 UX 빌드 패턴
    if (errorMessage) setErrorMessage(null); 
  };
  
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errorMessage) setErrorMessage(null);
  };
  
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 시안 검증용 하드코딩 테스트 로직:
    // 실제 서버 통신 API 실패 시 이 구문을 타게 설계하시면 됩니다.
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
      errorMessage={errorMessage} // 💡 상태값 바인딩
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onTogglePassword={handleTogglePassword}
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
    />
  );
};