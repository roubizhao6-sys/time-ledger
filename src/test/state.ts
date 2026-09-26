import { createEmptyVault, createMemoryEntry } from '../domain/memory'
import type { MemoryEntry, NewEntryInput, PersistedState, VaultType } from '../domain/types'

export function makeEntry(input: Partial<NewEntryInput> & Pick<NewEntryInput, 'title'>): MemoryEntry {
  return createMemoryEntry({
    vaultId: input.vaultId ?? 'vault-1',
    title: input.title,
    text: input.text ?? '这是一段测试记忆。',
    mood: input.mood ?? 'calm',
    memoryDate: input.memoryDate ?? '2026-09-27T10:00:00.000Z',
    tags: input.tags ?? [],
    imageDataUrl: input.imageDataUrl,
    favorite: input.favorite ?? false,
    shared: input.shared ?? false,
  })
}

export function makeState(
  entries: MemoryEntry[] = [],
  type: VaultType = 'personal',
): PersistedState {
  const vault = createEmptyVault('测试存折', type)
  vault.entries = entries.map((entry) => ({ ...entry, vaultId: vault.id }))
  return {
    version: 1,
    vault,
    settings: {
      activeVaultId: vault.id,
      deviceId: 'device-test',
      plan: 'yearly',
      onboardingComplete: true,
    },
  }
}
