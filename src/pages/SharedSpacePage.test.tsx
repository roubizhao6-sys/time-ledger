import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/routes'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'
import { makeEntry, makeState } from '../test/state'

describe('shared space', () => {
  it('shows only shared memories', async () => {
    const entries = [
      makeEntry({ title: '我们的纪念日', shared: true }),
      makeEntry({ title: '自己的备忘', shared: false }),
    ]

    render(
      <VaultProvider repository={createMemoryRepository(makeState(entries, 'couple'))}>
        <MemoryRouter initialEntries={['/shared']}>
          <AppRoutes />
        </MemoryRouter>
      </VaultProvider>,
    )

    expect(await screen.findByText('我们的纪念日')).toBeInTheDocument()
    expect(screen.queryByText('自己的备忘')).not.toBeInTheDocument()
  })
})
