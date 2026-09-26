import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  canAddEntry,
  createEmptyVault,
  createMemoryEntry,
} from '../domain/memory'
import type {
  MemoryEntry,
  NewEntryInput,
  PersistedState,
  Plan,
  VaultType,
} from '../domain/types'
import {
  createIndexedDbRepository,
  type VaultRepository,
} from '../storage/repository'
import { getDeviceId } from './device'

export class FreeLimitError extends Error {
  constructor() {
    super('免费版最多保存3条记忆，升级后可继续存储。')
    this.name = 'FreeLimitError'
  }
}

export interface VaultContextValue {
  state: PersistedState | null
  loading: boolean
  error: string | null
  createVault: (name: string, type: VaultType) => Promise<void>
  addEntry: (input: NewEntryInput) => Promise<MemoryEntry>
  updateEntry: (id: string, patch: Partial<MemoryEntry>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  importState: (nextState: PersistedState) => Promise<void>
  clearAll: () => Promise<void>
  setPlan: (plan: Plan, expiresAt?: string) => Promise<void>
}

const VaultContext = createContext<VaultContextValue | null>(null)

interface VaultProviderProps {
  children: ReactNode
  repository?: VaultRepository
}

export function VaultProvider({ children, repository }: VaultProviderProps) {
  const activeRepository = useMemo(
    () => repository ?? createIndexedDbRepository(),
    [repository],
  )
  const [state, setState] = useState<PersistedState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    activeRepository
      .load()
      .then((stored) => {
        if (active) setState(stored)
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : '本地数据读取失败')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [activeRepository])

  const persist = useCallback(
    async (nextState: PersistedState) => {
      setState(nextState)
      await activeRepository.save(nextState)
    },
    [activeRepository],
  )

  const createVault = useCallback(
    async (name: string, type: VaultType) => {
      const vault = createEmptyVault(name, type)
      const nextState: PersistedState = {
        version: 1,
        vault,
        settings: {
          activeVaultId: vault.id,
          deviceId: getDeviceId(),
          plan: 'free',
          onboardingComplete: true,
        },
      }
      await persist(nextState)
    },
    [persist],
  )

  const addEntry = useCallback(
    async (input: NewEntryInput) => {
      if (!state) throw new Error('请先创建存折')
      if (!canAddEntry(state.settings.plan, state.vault.entries.length)) {
        throw new FreeLimitError()
      }

      const entry = createMemoryEntry(input)
      const nextState: PersistedState = {
        ...state,
        vault: {
          ...state.vault,
          entries: [entry, ...state.vault.entries],
          updatedAt: new Date().toISOString(),
        },
      }
      await persist(nextState)
      return entry
    },
    [persist, state],
  )

  const updateEntry = useCallback(
    async (id: string, patch: Partial<MemoryEntry>) => {
      if (!state) throw new Error('请先创建存折')
      const updatedAt = new Date().toISOString()
      const nextState: PersistedState = {
        ...state,
        vault: {
          ...state.vault,
          updatedAt,
          entries: state.vault.entries.map((entry) =>
            entry.id === id ? { ...entry, ...patch, id, updatedAt } : entry,
          ),
        },
      }
      await persist(nextState)
    },
    [persist, state],
  )

  const deleteEntry = useCallback(
    async (id: string) => {
      if (!state) throw new Error('请先创建存折')
      const nextState: PersistedState = {
        ...state,
        vault: {
          ...state.vault,
          entries: state.vault.entries.filter((entry) => entry.id !== id),
          updatedAt: new Date().toISOString(),
        },
      }
      await persist(nextState)
    },
    [persist, state],
  )

  const importState = useCallback(
    async (nextState: PersistedState) => {
      await persist(nextState)
    },
    [persist],
  )

  const clearAll = useCallback(async () => {
    setState(null)
    await activeRepository.clear()
  }, [activeRepository])

  const setPlan = useCallback(
    async (plan: Plan, expiresAt?: string) => {
      if (!state) throw new Error('请先创建存折')
      await persist({
        ...state,
        settings: {
          ...state.settings,
          plan,
          licenseExpiresAt: expiresAt,
        },
      })
    },
    [persist, state],
  )

  const value = useMemo<VaultContextValue>(
    () => ({
      state,
      loading,
      error,
      createVault,
      addEntry,
      updateEntry,
      deleteEntry,
      importState,
      clearAll,
      setPlan,
    }),
    [
      state,
      loading,
      error,
      createVault,
      addEntry,
      updateEntry,
      deleteEntry,
      importState,
      clearAll,
      setPlan,
    ],
  )

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVaultContext(): VaultContextValue {
  const context = useContext(VaultContext)
  if (!context) {
    throw new Error('useVaultContext must be used inside VaultProvider')
  }
  return context
}
