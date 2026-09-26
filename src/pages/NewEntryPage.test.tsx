import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from '../app/routes'
import { createMemoryRepository } from '../storage/repository'
import { VaultProvider } from '../state/VaultContext'
import { makeState } from '../test/state'

describe('new entry', () => {
  it('saves a memory and opens the timeline', async () => {
    const user = userEvent.setup()
    render(
      <VaultProvider repository={createMemoryRepository(makeState())}>
        <MemoryRouter initialEntries={['/entry/new']}>
          <AppRoutes />
        </MemoryRouter>
      </VaultProvider>,
    )

    await user.type(await screen.findByLabelText('标题'), '第一次一起看海')
    await user.type(screen.getByLabelText('内容'), '风很大，但我们都没有走。')
    await user.click(screen.getByRole('button', { name: '存入存折' }))

    expect(await screen.findByText('第一次一起看海')).toBeInTheDocument()
    expect(screen.getByText(/风很大/)).toBeInTheDocument()
  })
})
