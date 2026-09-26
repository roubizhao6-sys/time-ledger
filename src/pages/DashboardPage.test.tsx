import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/routes'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'
import { makeEntry, makeState } from '../test/state'

describe('dashboard', () => {
  it('shows memory balance and recent entry', async () => {
    const memory = makeEntry({ title: '本月的小事' })
    render(
      <VaultProvider repository={createMemoryRepository(makeState([memory]))}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </VaultProvider>,
    )

    expect(await screen.findByText('本月已存入')).toBeInTheDocument()
    expect(screen.getByText('累计记忆')).toBeInTheDocument()
    expect(screen.getByText('本月的小事')).toBeInTheDocument()
  })
})
