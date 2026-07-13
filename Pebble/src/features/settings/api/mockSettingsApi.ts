// src/features/settings/api/mockSettingsApi.ts

const MOCK_DELAY = 700;

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestEmailChange(newEmail: string) {
  await delay();

  if (newEmail === 'used@test.com') {
    throw new Error('이미 사용 중인 이메일이에요.');
  }

  if (newEmail === 'fail@test.com') {
    throw new Error('이메일 변경 요청에 실패했어요. 다시 시도해 주세요.');
  }

  return {
    success: true,
    message: '인증 메일을 보냈어요. 새 이메일에서 인증을 완료하면 변경이 적용돼요.',
  };
}

export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  await delay();

  if (currentPassword === 'wrong1234') {
    throw new Error('현재 비밀번호가 일치하지 않아요.');
  }

  if (newPassword === 'fail1234') {
    throw new Error('비밀번호 변경에 실패했어요. 다시 시도해 주세요.');
  }

  return {
    success: true,
    message: '비밀번호가 변경되었어요.',
  };
}