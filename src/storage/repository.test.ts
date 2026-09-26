import { describe, expect, it } from 'vitest'
import { createEmptyVault } from '../domain/memory'
import type { PersistedState } from '../domain/types'
import { createMemoryRepository } from './repository'

function state(): PersistedState {
  return {
    version: 1,
    vault: createEmptyVault('测试存折', 'personal'),
    settings: {
      activeVaultId: 'vault-1',
      deviceId: 'device-1',
      plan: 'free',
      onboardingComplete: true,
    },
  }
}

describe('vault repository', () => {
  it('saves and loads a state round trip', async () => {
    const repository = createMemoryRepository()
    const value = state()

    await repository.save(value)

    await expect(repository.load()).resolves.toEqual(value)
  })

  it('clears stored state', async () => {
    const repository = createMemoryRepository(state())
    await repository.clear()
    await expect(repository.load()).resolves.toBeNull()
  })
})
