import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/routes'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'
import { makeState } from '../test/state'

describe('pricing', () => {
  it('shows transparent RMB plans without fake urgency', async () => {
    render(
      <VaultProvider repository={createMemoryRepository(makeState())}>
        <MemoryRouter initialEntries={['/pricing']}>
          <AppRoutes />
        </MemoryRouter>
      </VaultProvider>,
    )

    expect(await screen.findByText('¥9.9')).toBeInTheDocument()
    expect(screen.getByText('¥79')).toBeInTheDocument()
    expect(screen.getByText('¥19.9')).toBeInTheDocument()
    expect(screen.getByText(/免费版最多3条/)).toBeInTheDocument()
    expect(screen.queryByText(/限时/)).not.toBeInTheDocument()
  })
})
