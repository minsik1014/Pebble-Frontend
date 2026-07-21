import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. 타이포그래피
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'sans-serif',
        ],
      },
      fontSize: {
        'heading-01': ['40px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-02': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'title-01-sb': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-01-m': ['28px', { lineHeight: '1.3', fontWeight: '500' }],
        'title-02-sb': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-02-m': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'title-03-sb': ['20px', { lineHeight: '1.3', fontWeight: '600' }],
        'title-03-m': ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-01-sb': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-01-m': ['18px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-02-sb': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-02-m': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-03-r': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption-01': ['13px', { lineHeight: '1.3', fontWeight: '400' }],
      },
      // 2. 색상 시스템
      colors: {
        fill: {
          primary: '#171717', secondary: '#a3a3a3', teritory: '#e5e5e5',
          surface: '#fafafa', inverse: '#ffffff', danger: '#fc4c46',
          'danger-bg': '#fee7da', success: '#0da471', 'success-bg': '#cefbd5',
          warning: '#e8ae02', info: '#3059ff', shadow: 'rgba(23, 23, 23, 0.5)',
        },
        text: {
          strong: '#171717', primary: '#404040', secondary: '#737373',
          teritary: '#a3a3a3', quaternary: '#d4d4d4', onFill: '#ffffff',
          sunday: '#fea68f', saturday: '#82a0ff',
        },
        border: {
          primary: '#171717', selected: '#737373', default: '#d4d4d4',
        },
        btn: {
          primary: '#171717', secondary: '#404040', teritary: '#737373',
          quaternary: '#f5f5f5', pressed: 'rgba(23, 23, 23, 0.1)',
        },
        theme: {
          '1': { base: 'var(--color-1-base)', mid: 'var(--color-1-mid)', light: 'var(--color-1-light)' },
          '2': { base: 'var(--color-2-base)', mid: 'var(--color-2-mid)', light: 'var(--color-2-light)' },
          '3': { base: 'var(--color-3-base)', mid: 'var(--color-3-mid)', light: 'var(--color-3-light)' },
          '4': { base: 'var(--color-4-base)', mid: 'var(--color-4-mid)', light: 'var(--color-4-light)' },
          '5': { base: 'var(--color-5-base)', mid: 'var(--color-5-mid)', light: 'var(--color-5-light)' },
          '6': { base: 'var(--color-6-base)', mid: 'var(--color-6-mid)', light: 'var(--color-6-light)' },
        }
      },
      // 3. 토큰: 여백
      spacing: {
        'token-xs': '4px',
        'token-s': '8px',
        'token-m': '12px',
        'token-l': '20px',
        'token-xl': '32px',
        'token-xxl': '40px',
      },
      // 4. 토큰: 모서리 둥글기
      borderRadius: {
        'token-xs': '4px',
        'token-s': '12px',
        'token-m': '20px',
        'token-l': '32px',
        'token-infinite': '999px',
      },
      // 5. 토큰: 그림자
      boxShadow: {
        'shadow-m': '0px 0px 28px 0px rgba(23, 23, 23, 0.05)',
        'shadow-s': '0px 0px 4px 0px rgba(23, 23, 23, 0.1)',
        'shadow-noti': '4px 5px 20px 0px rgba(23, 23, 23, 0.1)',
      },
      // 6. 애니메이션 토큰
      animation: {
        'fade-in': 'fade-in 1s var(--animation-delay, 0s) ease forwards',
        // 💡 cubic-bezier 가속도를 조절하여 화면 기록 영상처럼 초기 구동 시 더 쫀득하고 부드럽게 위로 올라오도록 수치를 다듬었습니다.
        'fade-up': 'fade-up 0.8s var(--animation-delay, 0s) cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'marquee': 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'shimmer': 'shimmer 8s infinite',
        'image-glow': 'image-glow 1s ease forwards',
        'shake': 'shake 0.2s ease-in-out 2', 
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translate(0)' },
          '100%': { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'shimmer': {
          '0%, 90%, 100%': { backgroundPosition: 'calc(-100% - var(--shimmer-width)) 0' },
          '30%, 60%': { backgroundPosition: 'calc(100% + var(--shimmer-width)) 0' },
        },
        'image-glow': {
          '0%': { opacity: '0', animationTimingFunction: 'cubic-bezier(0.74, 0.25, 0.76, 1)' },
          '10%': { opacity: '0.7', animationTimingFunction: 'cubic-bezier(0.12, 0.01, 0.08, 0.99)' },
          '100%': { opacity: '0.4' },
        },
        'shake': { 
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
