// @/features/auth/containers/SignUpContainer.tsx
import { useState, useEffect } from "react";
import { SignUpForm } from "../components/SignUpForm";

export const SignUpContainer = (): JSX.Element => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    agreeTerms: false,
  });

  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; passwordConfirm?: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  
  // 개별 컴포넌트의 흔들림 애니메이션 상태 관리
  const [shakeTarget, setShakeTarget] = useState<{ email?: boolean; password?: boolean; passwordConfirm?: boolean }>({});

  // 특정 필드에 애니메이션을 트리거하는 헬퍼 함수
  const triggerShake = (field: "email" | "password" | "passwordConfirm") => {
    setShakeTarget((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setShakeTarget((prev) => ({ ...prev, [field]: false })), 400);
  };

  // 실시간 폼 전체 정합성 체크 (버튼 활성화 여부만 판단)
  useEffect(() => {
    const hasValues = form.email !== "" && form.password !== "" && form.passwordConfirm !== "";
    
    // @ 이후 최소 3자, 첫 번째 . 이후 최소 2자 조건 만족 검사
    const emailRegex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;
    const isEmailValid = emailRegex.test(form.email);
    
    const hasNoErrors = !errors.email && !errors.password && !errors.passwordConfirm;
    
    setIsFormValid(hasValues && isEmailValid && hasNoErrors && form.agreeTerms);
  }, [form, errors]);

  // 값 입력 핸들러: 타이핑 중에는 에러 상태를 초기화하여 실시간 경고 차단
  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 통합 포커스 아웃(onBlur) 핸들러: 커서가 나갔을 때 검사 후 에러 시 흔들림 트리거
  const handleFieldBlur = (field: "email" | "password" | "passwordConfirm") => {
    if (form[field] === "") return;

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]{3,}\.[^\s@]{2,}$/;
      if (!emailRegex.test(form.email)) {
        setErrors((prev) => ({ ...prev, email: "올바른 이메일 형식이 아니에요" }));
        triggerShake("email");
      } else if (form.email === "example123@sample.com") {
        setErrors((prev) => ({ ...prev, email: "이미 가입된 이메일이에요" }));
        triggerShake("email");
      }
    }

    if (field === "password") {
      if (form.password.length < 8) {
        setErrors((prev) => ({ ...prev, password: "비밀번호는 8자 이상이어야 합니다." }));
        triggerShake("password");
      }
    }

    if (field === "passwordConfirm" && form.password !== "") {
      if (form.password !== form.passwordConfirm) {
        setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." }));
        triggerShake("passwordConfirm");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.email === "example123@sample.com") {
      setErrors((prev) => ({ ...prev, email: "이미 가입된 이메일이에요" }));
      triggerShake("email");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setErrors((prev) => ({ ...prev, passwordConfirm: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." }));
      triggerShake("passwordConfirm");
      return;
    }

    console.log("다음 단계 진입 성공 데이터:", form);
  };

  return (
    <SignUpForm
      form={form}
      showPw={showPw}
      showPwConfirm={showPwConfirm}
      errors={errors}
      isFormValid={isFormValid}
      shakeTarget={shakeTarget} 
      onChange={handleFieldChange}
      onFieldBlur={handleFieldBlur}
      onTogglePw={() => setShowPw((p) => !p)}
      onTogglePwConfirm={() => setShowPwConfirm((p) => !p)}
      onSubmit={handleSubmit}
    />
  );
};