import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { PhoneFrame } from './components/PhoneFrame'
import { SettingsScreen } from './components/SettingsScreen'
import { TodayScreen } from './components/TodayScreen'
import { TrendsScreen } from './components/TrendsScreen'

function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<TodayScreen />} />
            <Route path="trends" element={<TrendsScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </PhoneFrame>
    </BrowserRouter>
  )
}

export default App
