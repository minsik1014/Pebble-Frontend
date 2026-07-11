// @/features/auth/containers/ForgotPasswordContainer.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const ForgotPasswordContainer = (): JSX.Element => {
  const navigate = useNavigate();
  
  // 흐름 제어 상태 (1: 이메일 입력, 2: 발송 완료, 3: 패스워드 재설정)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; newPassword?: string; passwordConfirm?: string }>({});
  const [shakeTarget, setShakeTarget] = useState<{ email?: boolean; newPassword?: boolean; passwordConfirm?: boolean }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;

  // 셰이크 모션 트리거
  const triggerShake = (field: "email" | "newPassword" | "passwordConfirm") => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setShakeTarget((prev) => ({ ...prev, [field]: false })), 400);
  };

  // 폼 유효성 실시간 체크 (버튼 활성화 스위치)
  useEffect(() => {
    if (step === 1) {
      setIsFormValid(email.trim() !== "" && emailRegex.test(email) && !errors.email);
    } else if (step === 3) {
      const hasValues = newPassword !== "" && passwordConfirm !== "";
      const hasNoErrors = !errors.newPassword && !errors.passwordConfirm;
      setIsFormValid(hasValues && hasNoErrors);
    }
  }, [email, newPassword, passwordConfirm, errors, step]);

  const handleChange = (field: string, value: string) => {
    if (field === "email") {
      setEmail(value);
      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (field === "newPassword") {
      setNewPassword(value);
      if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: undefined }));
    }
    if (field === "passwordConfirm") {
      setPasswordConfirm(value);
      if (errors.passwordConfirm) setErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    }
  };

  // 포커스 아웃(onBlur) 핸들러 (회원가입/로그인 양식과 동일하게 빈 값 패스 조건 포함)
  const handleFieldBlur = (field: "email" | "newPassword" | "passwordConfirm") => {
    if (field === "email" && email !== "") {
      if (!emailRegex.test(email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
        triggerShake("email");
      }
    }

    if (field === "newPassword" && newPassword !== "") {
      // 8자 이상, 영문/숫자 포함 조합 규칙 체크 (간단히 정규식 처리 가능)
      const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!pwRegex.test(newPassword)) {
        setErrors((prev) => ({ ...prev, newPassword: "8자 이상, 영문·숫자 포함이어야 합니다." }));
        triggerShake("newPassword");
      }
    }

    if (field === "passwordConfirm" && passwordConfirm !== "" && newPassword !== "") {
      if (newPassword !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." }));
        triggerShake("passwordConfirm");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!email.trim() || !emailRegex.test(email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
        triggerShake("email");
        return;
      }
      // 이메일 발송 완료 단계로 전환
      setStep(2);
    } 
    
    else if (step === 2) {
      // '로그인하러 가기' 버튼 클릭 시 3단계(새 비밀번호 변경) 화면으로 안내
      setStep(3);
    } 
    
    else if (step === 3) {
      const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      
      if (!pwRegex.test(newPassword)) {
        setErrors((prev) => ({ ...prev, newPassword: "8자 이상, 영문·숫자 포함이어야 합니다." }));
        triggerShake("newPassword");
        return;
      }

      if (newPassword !== passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." }));
        triggerShake("passwordConfirm");
        return;
      }

      console.log("비밀번호 변경 완료 서버 전송:", { email, newPassword });
      // 변경 성공 후 로그인 메인 페이지로 이동
      navigate("/login");
    }
  };

  const handleBackToLogin = () => {
    if (step === 1) {
      navigate("/login");
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  return (
    <ForgotPasswordForm
      step={step}
      email={email}
      newPassword={newPassword}
      passwordConfirm={passwordConfirm}
      showPw={showPw}
      showPwConfirm={showPwConfirm}
      errors={errors}
      shakeTarget={shakeTarget}
      isFormValid={isFormValid}
      onChange={handleChange}
      onFieldBlur={handleFieldBlur}
      onTogglePw={() => setShowPw((p) => !p)}
      onTogglePwConfirm={() => setShowPwConfirm((p) => !p)}
      onSubmit={handleSubmit}
      onBackToLogin={handleBackToLogin}
    />
  );
};