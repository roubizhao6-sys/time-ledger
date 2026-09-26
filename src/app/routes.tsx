import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './AppShell'
import { BackupPage } from '../pages/BackupPage'
import { DashboardPage } from '../pages/DashboardPage'
import { EntryDetailPage } from '../pages/EntryDetailPage'
import { HelpPage } from '../pages/HelpPage'
import { NewEntryPage } from '../pages/NewEntryPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { PricingPage } from '../pages/PricingPage'
import { PrivacyPage } from '../pages/PrivacyPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SharedSpacePage } from '../pages/SharedSpacePage'
import { TimelinePage } from '../pages/TimelinePage'
import { WelcomePage } from '../pages/WelcomePage'
import { YearbookPage } from '../pages/YearbookPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/entry/new" element={<NewEntryPage />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/yearbook" element={<YearbookPage />} />
        <Route path="/shared" element={<SharedSpacePage />} />
        <Route path="/backup" element={<BackupPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}
