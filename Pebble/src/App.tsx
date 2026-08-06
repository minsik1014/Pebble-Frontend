import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProfileSetupPage } from '@/features/auth/pages/ProfileSetupPage';
import { SignUpCompletePage } from '@/features/auth/pages/SignUpCompletePage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { SocialOAuthCallbackPage } from '@/features/auth/pages/SocialOAuthCallbackPage';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { ReportLayout } from '@/features/report/ReportLayout';
import { FIRST_STEP_PATH } from '@/features/report/constants/reportSteps';
import { BusiestCategoryStep } from '@/features/report/steps/BusiestCategoryStep';
import { BusiestDayStep } from '@/features/report/steps/BusiestDayStep';
import { MonthlyPebbleStep } from '@/features/report/steps/MonthlyPebbleStep';
import { SharedFriendsStep } from '@/features/report/steps/SharedFriendsStep';
import { SummaryStep } from '@/features/report/steps/SummaryStep';
import { CalendarMainPage } from '@/pages/calendar/CalendarMainPage';
import { LandingPage } from '@/pages/landing/LandingPage';
import FriendsPage from '@/pages/freinds/FriendsPage';
import MyPage from '@/pages/mypage/MyPage';
import ProfileEditPage from '@/pages/mypage/ProfileEditPage';
import { getAccessToken } from '@/services/api';

import SettingsPage from './pages/settings/SettingsPage';

function RootRoute() {
  if (!getAccessToken()) {
    return <Navigate to="/landing" replace />;
  }

  return <CalendarMainPage />;
}

function LandingRoute() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return <LandingPage />;
}

function ProtectedLayoutRoute() {
  if (!getAccessToken()) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <BrowserRouter>
      {/* 테마 스위칭을 테스트하려면 아래 div에 className="theme-popart" 등을 추가하세요 */}
      <div className="min-h-screen font-sans">
        <Routes>
          <Route path="/landing" element={<LandingRoute />} />

          <Route element={<MainLayout />}>
            <Route index element={<RootRoute />} />
          </Route>

          <Route element={<ProtectedLayoutRoute />}>
            <Route path="friends" element={<FriendsPage />} />
            <Route path="my" element={<MyPage />} />
            <Route path="my/profile" element={<ProfileEditPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route
            path="/report"
            element={
              <RequireAuth>
                <ReportLayout />
              </RequireAuth>
            }
          >
            <Route
              index
              element={<Navigate to={FIRST_STEP_PATH} replace />}
            />
            <Route path="monthly" element={<MonthlyPebbleStep />} />
            <Route path="category" element={<BusiestCategoryStep />} />
            <Route path="day" element={<BusiestDayStep />} />
            <Route path="friends" element={<SharedFriendsStep />} />
            <Route path="summary" element={<SummaryStep />} />
            <Route
              path="*"
              element={<Navigate to={FIRST_STEP_PATH} replace />}
            />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/profile-setup" element={<ProfileSetupPage />} />
          <Route path="/signup-complete" element={<SignUpCompletePage />} />
          <Route
            path="/oauth/callback/:provider"
            element={<SocialOAuthCallbackPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
