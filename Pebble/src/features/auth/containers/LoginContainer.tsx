// @/features/auth/containers/LoginContainer.tsx
import { useState } from "react";
import { LoginForm } from "../components/LoginForm";

export const LoginContainer = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (value: string) => setEmail(value);
  const handlePasswordChange = (value: string) => setPassword(value);
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
    // TODO: Authentication API Call Logic (Token Rotation / RBAC)
  };

  const handleSocialLogin = (provider: "google" | "naver") => {
    console.log(`${provider} 로그인 진행`);
    // TODO: OAuth 2.0 Flow Logic
  };

  return (
    <LoginForm
      email={email}
      password={password}
      showPassword={showPassword}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onTogglePassword={handleTogglePassword}
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
    />
  );
};