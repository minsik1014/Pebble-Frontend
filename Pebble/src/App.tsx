import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { CalendarMainPage } from '@/pages/calendar/CalendarMainPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { ProfileSetupPage } from '@/features/auth/pages/ProfileSetupPage';
import { SignUpCompletePage } from '@/features/auth/pages/SignUpCompletePage';
import SettingsPage from './pages/settings/SettingsPage';
import MyPage from "@/pages/mypage/MyPage";
import ProfileEditPage from "@/pages/mypage/ProfileEditPage";
import MyCategoryDetailPage from "@/pages/mypage/MyCategoryDetailPage";

function App() {
  return (
    <BrowserRouter>
      {/* 테마 스위칭을 테스트하려면 아래 div에 className="theme-popart" 등을 추가하세요 */}
      <div className="min-h-screen font-sans">
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<CalendarMainPage />} />
            <Route path="my" element={<MyPage />} />
            <Route path="my/profile" element={<ProfileEditPage />} />
            <Route
              path="my/categories/:categoryId"
              element={<MyCategoryDetailPage />}
            />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/signup-complete" element={<SignUpCompletePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
