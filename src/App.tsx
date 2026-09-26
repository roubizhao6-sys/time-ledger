import { HashRouter } from 'react-router-dom'
import { AppRoutes } from './app/routes'
import { VaultProvider } from './state/VaultContext'

export default function App() {
  return (
    <HashRouter>
      <VaultProvider>
        <AppRoutes />
      </VaultProvider>
    </HashRouter>
  )
}
