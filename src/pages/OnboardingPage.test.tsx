import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/routes'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'

describe('onboarding', () => {
  it('creates a couple vault and opens the dashboard', async () => {
    const user = userEvent.setup()

    render(
      <VaultProvider repository={createMemoryRepository()}>
        <MemoryRouter initialEntries={['/onboarding']}>
          <AppRoutes />
        </MemoryRouter>
      </VaultProvider>,
    )

    await user.clear(screen.getByLabelText('存折名称'))
    await user.type(screen.getByLabelText('存折名称'), '我们的存折')
    await user.click(screen.getByRole('button', { name: /情侣/ }))
    await user.click(screen.getByRole('button', { name: '创建存折' }))

    expect(await screen.findByText('存入一笔记忆')).toBeInTheDocument()
    expect(screen.getByText('我们的存折')).toBeInTheDocument()
  })
})
