import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/routes'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'
import { makeEntry, makeState } from '../test/state'

describe('timeline', () => {
  it('groups entries by month and filters by search', async () => {
    const user = userEvent.setup()
    const entries = [
      makeEntry({ title: '九月的海', memoryDate: '2026-09-05T10:00:00.000Z' }),
      makeEntry({ title: '八月的风', memoryDate: '2026-08-05T10:00:00.000Z' }),
    ]

    render(
      <VaultProvider repository={createMemoryRepository(makeState(entries))}>
        <MemoryRouter initialEntries={['/timeline']}>
          <AppRoutes />
        </MemoryRouter>
      </VaultProvider>,
    )

    expect(await screen.findByText('2026年9月')).toBeInTheDocument()
    expect(screen.getByText('2026年8月')).toBeInTheDocument()

    await user.type(screen.getByLabelText('搜索记忆'), '八月')
    expect(screen.getByText('八月的风')).toBeInTheDocument()
    expect(screen.queryByText('九月的海')).not.toBeInTheDocument()
  })
})
