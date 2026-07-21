import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import profile1 from "@/assets/profiles/profile1.png";
import profile2 from "@/assets/profiles/profile2.png";
import profile3 from "@/assets/profiles/profile3.png";
import profile4 from "@/assets/profiles/profile4.png";
import profile5 from "@/assets/profiles/profile5.png";
import { ProfileSetupForm } from "../components/ProfileSetupForm";

const DEFAULT_PROFILES = [
  { id: "profile-1", src: profile1, alt: "기본 프로필 1" },
  { id: "profile-2", src: profile2, alt: "기본 프로필 2" },
  { id: "profile-3", src: profile3, alt: "기본 프로필 3" },
  { id: "profile-4", src: profile4, alt: "기본 프로필 4" },
  { id: "profile-5", src: profile5, alt: "기본 프로필 5" },
];

export const ProfileSetupContainer = (): JSX.Element => {
  const navigate = useNavigate();
  const [selectedProfileId, setSelectedProfileId] = useState(DEFAULT_PROFILES[0].id);
  const [uploadedProfileSrc, setUploadedProfileSrc] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [introduction, setIntroduction] = useState("");

  const selectedProfileSrc = useMemo(() => {
    if (selectedProfileId === "upload" && uploadedProfileSrc) return uploadedProfileSrc;
    return DEFAULT_PROFILES.find((profile) => profile.id === selectedProfileId)?.src ?? DEFAULT_PROFILES[0].src;
  }, [selectedProfileId, uploadedProfileSrc]);

  // 닉네임은 공백을 제외한 문자가 하나 이상 있을 때 유효합니다.
  const isFormValid = nickname.trim().length > 0;

  const handleUploadProfile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setUploadedProfileSrc(reader.result);
      setSelectedProfileId("upload");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid) return;

    console.log("프로필 설정 완료:", {
      selectedProfileId,
      nickname: nickname.trim(),
      introduction: introduction.trim(),
    });
    navigate("/signup-complete", {
      state: {
        nickname: nickname.trim(),
        profileSrc: selectedProfileSrc,
      },
    });
  };

  return (
    <ProfileSetupForm
      profiles={DEFAULT_PROFILES}
      selectedProfileId={selectedProfileId}
      selectedProfileSrc={selectedProfileSrc}
      nickname={nickname}
      introduction={introduction}
      isFormValid={isFormValid}
      onSelectProfile={setSelectedProfileId}
      onUploadProfile={handleUploadProfile}
      onNicknameChange={setNickname}
      onIntroductionChange={setIntroduction}
      onBack={() => navigate("/signup")}
      onSubmit={handleSubmit}
    />
  );
};
