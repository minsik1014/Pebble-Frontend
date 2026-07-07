import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 시도:', { email, password });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* 1. 상단 글로벌 네비게이션 바 */}
      <header className="w-full px-10 py-5 flex justify-between items-center bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* 가상의 Pebble 작은 로고 아이콘 */}
          <div className="w-6 h-6 bg-gray-900 rounded-sm"></div>
          <span className="font-bold text-lg text-gray-900">Pebble</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <button className="text-gray-700 hover:text-gray-900 transition-colors">회원가입</button>
          <button className="px-5 py-2.5 bg-[#111317] text-white rounded-xl font-medium hover:bg-black transition-colors">
            로그인
          </button>
        </div>
      </header>

      {/* 2. 메인 스플릿(좌/우) 콘텐츠 영역 */}
      <main className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 items-center px-10 py-12 gap-10">
        
        {/* [좌측] 서비스 소개 영역 */}
        <div className="flex flex-col items-start gap-8 justify-center">
          <div className="flex items-center gap-4">
            {/* 피그마의 Pebble 심볼 형태 구현 (상태에 맞게 에셋/이미지로 대체 가능) */}
            <div className="grid grid-cols-2 gap-1 w-16 h-16">
              <div className="bg-gray-800 rounded-tl-xl rounded-tr-xl rounded-bl-xl"></div>
              <div className="bg-gray-500 rounded-tr-xl rounded-br-xl rounded-bl-xl"></div>
              <div className="bg-gray-300 rounded-tl-xl rounded-bl-xl rounded-br-xl"></div>
              <div className="bg-transparent"></div>
            </div>
            <h2 className="text-6xl font-bold text-gray-900 tracking-tight">Pebble</h2>
          </div>
          {/* Title 01 (28px) 또는 Heading급 텍스트 */}
          <p className="text-3xl font-semibold text-gray-900 leading-[1.3]">
            할 일을 가볍게 정리해 볼까요?
          </p>
        </div>

        {/* [우측] 로그인 폼 영역 */}
        <div className="w-full max-w-[440px] mx-auto md:ml-auto flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">로그인</h3>
          
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            {/* 이메일 입력 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                이메일<span className="text-red-500 ml-0.5">*</span>
              </label>
              <input 
                type="email" 
                required
                placeholder="이메일을 입력해 주세요" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-base leading-[1.5]"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-sm font-medium text-gray-700">
                비밀번호<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative w-full">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="비밀번호를 입력해 주세요" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 text-base leading-[1.5]"
                />
                {/* 비밀번호 보기/숨기기 토글 버튼 */}
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* 메인 로그인 버튼 */}
            <button 
              type="submit" 
              className="w-full py-4 bg-[#111317] text-white rounded-xl text-base font-semibold hover:bg-black transition-colors mt-2"
            >
              로그인
            </button>

            {/* 비밀번호 찾기 */}
            <div className="text-right -mt-2">
              <button type="button" className="text-sm text-gray-400 hover:text-gray-600 hover:underline">
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* 또는 구분선 */}
            <div className="flex items-center my-2 text-gray-300 text-sm">
              <div className="flex-1 h-[1px] bg-gray-200"></div>
              <span className="px-4 text-gray-400">또는</span>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>

            {/* 소셜 로그인 버튼 그룹 */}
            <div className="flex flex-col gap-3">
              {/* 구글 로그인 */}
              <button 
                type="button" 
                className="w-full py-3.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-base font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-blue-500">G</span>
                <span>Google로 계속하기</span>
              </button>
              
              {/* 네이버 로그인 (시안 내 초록색 버튼 반영) */}
              <button 
                type="button" 
                className="w-full py-3.5 bg-[#03C75A] text-white rounded-xl text-base font-medium flex items-center justify-center gap-3 hover:opacity-95 transition-opacity"
              >
                <span className="text-lg font-extrabold">N</span>
                <span>네이버로 계속하기</span>
              </button>
            </div>

            {/* 하단 회원가입 유도 */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Pebble이 처음이신가요?{' '}
              <button type="button" className="text-gray-900 font-semibold hover:underline">
                회원가입
              </button>
            </p>
          </form>
        </div>

      </main>
    </div>
  );
};

export default LoginPage;