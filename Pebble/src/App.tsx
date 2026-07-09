import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CalendarMainPage } from '@/pages/calendar/CalendarMainPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      {/* 테마 스위칭을 테스트하려면 아래 div에 className="theme-popart" 등을 추가하세요 */}
      <div className="min-h-screen font-sans">
        <Routes>
          <Route path="/" element={<CalendarMainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} /> 
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;