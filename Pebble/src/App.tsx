import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { GlobalErrorToast } from '@/components/feedback/GlobalErrorToast';
import { NetworkStatusManager } from '@/components/feedback/NetworkStatusManager';
import { MainLayout } from '@/components/layout/MainLayout';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { RequireAuth } from '@/features/auth/components/RequireAuth';
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { ProfileSetupPage } from '@/features/auth/pages/ProfileSetupPage';
import { SignUpCompletePage } from '@/features/auth/pages/SignUpCompletePage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { SocialOAuthCallbackPage } from '@/features/auth/pages/SocialOAuthCallbackPage';
import { FIRST_STEP_PATH } from '@/features/report/constants/reportSteps';
import { ReportLayout } from '@/features/report/ReportLayout';
import { BusiestCategoryStep } from '@/features/report/steps/BusiestCategoryStep';
import { BusiestDayStep } from '@/features/report/steps/BusiestDayStep';
import { MonthlyPebbleStep } from '@/features/report/steps/MonthlyPebbleStep';
import { SharedFriendsStep } from '@/features/report/steps/SharedFriendsStep';
import { SummaryStep } from '@/features/report/steps/SummaryStep';
import { CalendarMainPage } from '@/pages/calendar/CalendarMainPage';
import FriendsPage from '@/pages/freinds/FriendsPage';
import { LandingPage } from '@/pages/landing/LandingPage';
import MyCategoryDetailPage from '@/pages/mypage/MyCategoryDetailPage';
import MyPage from '@/pages/mypage/MyPage';
import ProfileEditPage from '@/pages/mypage/ProfileEditPage';
import { EmailVerifyPage } from '@/pages/settings/EmailVerifyPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import { getAccessToken } from '@/services/api';

function RootRoute() {
  if (!getAccessToken()) {
    return (
      <Navigate
        to="/landing"
        replace
      />
    );
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
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <MainLayout />;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />

      <div className="min-h-screen bg-fill-surface font-sans text-text-strong">
        <Routes>
          <Route
            path="/landing"
            element={<LandingRoute />}
          />

          <Route element={<MainLayout />}>
            <Route
              index
              element={<RootRoute />}
            />
          </Route>

          <Route
            element={
              <ProtectedLayoutRoute />
            }
          >
            <Route
              path="friends"
              element={<FriendsPage />}
            />

            <Route
              path="my"
              element={<MyPage />}
            />

            <Route
              path="my/profile"
              element={<ProfileEditPage />}
            />

            <Route
              path="my/categories/:categoryId"
              element={
                <MyCategoryDetailPage />
              }
            />

            <Route
              path="settings"
              element={<SettingsPage />}
            />
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
              element={
                <Navigate
                  to={FIRST_STEP_PATH}
                  replace
                />
              }
            />

            <Route
              path="monthly"
              element={<MonthlyPebbleStep />}
            />

            <Route
              path="category"
              element={<BusiestCategoryStep />}
            />

            <Route
              path="day"
              element={<BusiestDayStep />}
            />

            <Route
              path="friends"
              element={<SharedFriendsStep />}
            />

            <Route
              path="summary"
              element={<SummaryStep />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to={FIRST_STEP_PATH}
                  replace
                />
              }
            />
          </Route>

          <Route
            path="/email/verify"
            element={<EmailVerifyPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPasswordPage />
            }
          />

          <Route
            path="/profile-setup"
            element={<ProfileSetupPage />}
          />

          <Route
            path="/signup-complete"
            element={<SignUpCompletePage />}
          />

          <Route
            path="/oauth/callback/:provider"
            element={
              <SocialOAuthCallbackPage />
            }
          />
        </Routes>
      </div>

      <GlobalErrorToast />
      <NetworkStatusManager />
    </BrowserRouter>
  );
}

export default App;