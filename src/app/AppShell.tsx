import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from '../components/NavBar'
import { useVault } from '../state/useVault'

export function AppShell() {
  const location = useLocation()
  const { state } = useVault()
  const bare = location.pathname === '/welcome' || location.pathname === '/onboarding'

  if (bare) return <Outlet />

  return (
    <div className="app-frame">
      <header className="app-header">
        <div>
          <p className="eyebrow">时光存折</p>
          <strong>{state?.vault.name ?? '我的记忆'}</strong>
        </div>
        <span className="header-balance">{state?.vault.entries.length ?? 0} 笔记忆</span>
      </header>
      <main className="app-content">
        <Outlet />
      </main>
      <NavBar />
    </div>
  )
}
