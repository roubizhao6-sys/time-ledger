import type { PersistedState } from '../domain/types'
import { deleteState, readState, writeState } from './db'

export interface VaultRepository {
  load(): Promise<PersistedState | null>
  save(state: PersistedState): Promise<void>
  clear(): Promise<void>
}

function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

export function createMemoryRepository(initial: PersistedState | null = null): VaultRepository {
  let state = initial ? clone(initial) : null

  return {
    async load() {
      return state ? clone(state) : null
    },
    async save(nextState) {
      state = clone(nextState)
    },
    async clear() {
      state = null
    },
  }
}

export function createIndexedDbRepository(): VaultRepository {
  return {
    load: readState,
    save: writeState,
    clear: deleteState,
  }
}
