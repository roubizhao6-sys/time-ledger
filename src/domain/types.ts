export type Plan = 'free' | 'monthly' | 'yearly' | 'family'
export type VaultType = 'personal' | 'couple' | 'family'
export type Mood = 'joy' | 'calm' | 'tired' | 'brave' | 'missing' | 'grateful'
export type VaultTheme = 'paper' | 'forest' | 'sunset' | 'night'

export interface MemoryEntry {
  id: string
  vaultId: string
  title: string
  text: string
  mood: Mood
  tags: string[]
  memoryDate: string
  createdAt: string
  updatedAt: string
  imageDataUrl?: string
  favorite: boolean
  shared: boolean
}

export interface Vault {
  id: string
  name: string
  type: VaultType
  theme: VaultTheme
  createdAt: string
  updatedAt: string
  entries: MemoryEntry[]
}

export interface AppSettings {
  activeVaultId: string
  deviceId: string
  plan: Plan
  licenseExpiresAt?: string
  onboardingComplete: boolean
}

export interface PersistedState {
  version: 1
  vault: Vault
  settings: AppSettings
}

export interface NewEntryInput {
  vaultId: string
  title: string
  text: string
  mood: Mood
  tags?: string[]
  memoryDate: string
  imageDataUrl?: string
  favorite?: boolean
  shared?: boolean
}

export interface MonthGroup {
  key: string
  label: string
  entries: MemoryEntry[]
}

export interface MonthlySummary {
  key: string
  label: string
  count: number
  coverImage?: string
  moods: Mood[]
  entries: MemoryEntry[]
}
