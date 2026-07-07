import React, { useState } from 'react';

// 플로우 관리를 위한 타입 정의
type AuthView = 'LOGIN' | 'FIND_PASSWORD' | 'CHANGE_PASSWORD' | 'SIGNUP_STEP1' | 'SIGNUP_STEP2' | 'SIGNUP_WELCOME';

const AuthContainer = () => {
  const [view, setView] = useState<AuthView>('LOGIN');
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // SignUp States
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordCheck, setSignupPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState(1);

  // 1. 소셜 로그인 (OAuth API 이동 - 별도 페이지 작업 없이 바로 href 이동)
  const handleKakaoLogin = () => {
    window.location.href = 'https://api.pebble.com/oauth2/authorization/kakao';
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://api.pebble.com/oauth2/authorization/google';
  };

  // 2. 임시 비밀번호 발급 요청
  const handleFindPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 백엔드에서 랜덤 대소문자+숫자 섞인 6자 생성하여 메일 발송하는 API 호출 구역
    console.log(`${email}로 임시 비밀번호를 발송했습니다.`);
    
    // 다시 로그인 모달로 복귀하도록 세팅
    alert('임시 비밀번호가 전송되었습니다. 로그인 화면에서 입력해주세요.');
    setView('LOGIN');
  };

  // 3. 로그인 처리 (임시 비밀번호 로그인 분기 포함)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 가정: 백엔드 검증 결과, 현재 로그인한 비밀번호가 '임시 비밀번호'일 경우
    const isTemporaryPassword = true; // API 결과에 따라 가변 처리

    if (isTemporaryPassword) {
      alert('임시 비밀번호로 로그인하셨습니다. 안전을 위해 비밀번호를 변경해주세요.');
      setView('CHANGE_PASSWORD'); // 모달을 비밀번호 변경 화면으로 강제 전환
    } else {
      console.log('일반 로그인 성공');
    }
  };

  // 4. 비밀번호 변경 완료 처리
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    console.log('비밀번호 변경 완료 API 요청');
    alert('비밀번호가 정상적으로 변경되었습니다. 다시 로그인해주세요.');
    setView('LOGIN'); // 해당 버튼 누르면 다시 로그인 모달이 나옴
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[440px] shadow-2xl relative transition-all">
        
        {/* 상단 로고 (피그마 반영) */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#111317] tracking-tight" style={{ fontFamily: 'PebbleFont, sans-serif' }}>
            PEBBLE
          </h1>
        </div>

        {/* ================= 1. 로그인 화면 ================= */}
        {view === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-500 -mt-4 mb-2">계정으로 로그인하세요</p>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">이메일</label>
              <input 
                type="email" 
                placeholder="example@muses.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">비밀번호</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm"
              />
            </div>

            <button type="submit" className="w-full py-3.5 bg-[#111317] text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors mt-2">
              로그인
            </button>

            <div className="flex justify-center gap-4 text-xs text-gray-500 my-1">
              <button type="button" onClick={() => setView('FIND_PASSWORD')} className="hover:underline">비밀번호 찾기</button>
            </div>

            <div className="flex items-center my-2 text-gray-400 text-xs">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="px-3">또는</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* 카카오 & 구글 OAuth 버튼 */}
            <button type="button" onClick={handleKakaoLogin} className="w-full py-3 bg-[#FEE500] text-[#191919] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90">
              <span>카카오로 계속하기</span>
            </button>
            <button type="button" onClick={handleGoogleLogin} className="w-full py-3 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-50">
              <span>구글로 계속하기</span>
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              계정이 없으신가요? <button type="button" onClick={() => setView('SIGNUP_STEP1')} className="text-gray-900 underline font-medium">회원가입</button>
            </p>
          </form>
        )}

        {/* ================= 2. 비밀번호 찾기 (임시 비번 발급) ================= */}
        {view === 'FIND_PASSWORD' && (
          <form onSubmit={handleFindPasswordSubmit} className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-500 -mt-4 mb-2">새 계정을 만드세요 (임시 비밀번호 발급)</p>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">이메일*</label>
              <input 
                type="email" 
                required
                placeholder="example@muses.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#111317] text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors mt-2">
              임시 비밀번호 발급받기
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              이미 계정이 있으신가요? <button type="button" onClick={() => setView('LOGIN')} className="text-gray-900 underline font-medium">로그인</button>
            </p>
          </form>
        )}

        {/* ================= 3. 비밀번호 변경 모달 ================= */}
        {view === 'CHANGE_PASSWORD' && (
          <form onSubmit={handleChangePasswordSubmit} className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray-500 -mt-4 mb-2">새 계정을 만드세요 (비밀번호 변경)</p>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">변경 할 비밀번호</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">비밀번호 다시 입력하기</label>
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-sm"
              />
            </div>
            <button type="submit" className="w-full py-3.5 bg-[#111317] text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors mt-2">
              다음으로
            </button>
          </form>
        )}

        {/* ================= 4. 회원가입 Step 1: 계정 생성 ================= */}
        {view === 'SIGNUP_STEP1' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pebble 시작하기</h2>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">이메일*</label>
              <input 
                type="email" 
                placeholder="이메일을 입력해 주세요" 
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">비밀번호*</label>
              <input 
                type="password" 
                placeholder="비밀번호를 입력해 주세요" 
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">8자 이상, 영문·숫자 포함</span>
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">비밀번호 확인*</label>
              <input 
                type="password" 
                placeholder="비밀번호를 한 번 더 입력해 주세요" 
                value={signupPasswordCheck}
                onChange={(e) => setSignupPasswordCheck(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <button 
              type="button" 
              onClick={() => setView('SIGNUP_STEP2')}
              className="w-full py-3.5 bg-[#111317] text-white rounded-xl text-sm font-semibold mt-4"
            >
              다음
            </button>
          </div>
        )}

        {/* ================= 5. 회원가입 Step 2: 프로필 설정 ================= */}
        {view === 'SIGNUP_STEP2' && (
          <div className="flex flex-col gap-4">
            <button onClick={() => setView('SIGNUP_STEP1')} className="text-left text-sm text-gray-500 mb-2">← 프로필을 완성해 주세요</button>
            
            {/* 캐릭터 프로필 선택창 가상 컴포넌트 */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl">🪨</div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button 
                    key={num} 
                    onClick={() => setSelectedCharacter(num)}
                    className={`w-8 h-8 rounded-full border text-xs ${selectedCharacter === num ? 'border-black bg-gray-200' : 'border-gray-200'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">닉네임*</label>
              <input 
                type="text" 
                placeholder="닉네임을 입력해 주세요" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 font-medium block mb-1">소개 (선택)</label>
              <input 
                type="text" 
                placeholder="소개를 입력해 주세요" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <button 
              type="button" 
              onClick={() => setView('SIGNUP_WELCOME')}
              className="w-full py-3.5 bg-[#111317] text-white rounded-xl text-sm font-semibold mt-4"
            >
              시작하기
            </button>
          </div>
        )}

        {/* ================= 6. 회원가입 완료: 환영 페이지 ================= */}
        {view === 'SIGNUP_WELCOME' && (
          <div className="text-center flex flex-col items-center gap-4 py-6">
            <h2 className="text-xl font-bold text-gray-900">환영합니다!</h2>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl my-2">🪨</div>
            <p className="text-sm text-gray-600 font-medium">
              <span className="text-black font-semibold">{nickname || '닉네임'}</span>님 가입이 완료되었어요.<br/>
              오늘의 조약돌을 차곡차곡 쌓아 보세요!
            </p>
            <button 
              type="button" 
              onClick={() => { setView('LOGIN'); alert('가입 완료되어 다시 로그인 폼으로 이동합니다.'); }}
              className="w-full py-3.5 bg-[#111317] text-white rounded-xl text-sm font-semibold mt-4"
            >
              내 일정 기록하러 가기
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthContainer;