import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'
import { AppRoutes } from './routes'

function renderAt(path: string) {
  return render(
    <VaultProvider repository={createMemoryRepository()}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </VaultProvider>,
  )
}

describe('app routing', () => {
  it('shows the welcome experience before onboarding', async () => {
    renderAt('/welcome')
    expect(await screen.findByText(/每月存一点/)).toBeInTheDocument()
    expect(screen.getByText('开始记录')).toBeInTheDocument()
  })

  it('exposes the primary navigation after onboarding', async () => {
    renderAt('/dashboard')
    expect(await screen.findByText('首页')).toBeInTheDocument()
    expect(screen.getByText('时间轴')).toBeInTheDocument()
    expect(screen.getByText('年度册')).toBeInTheDocument()
    expect(screen.getByText('我的')).toBeInTheDocument()
  })
})
