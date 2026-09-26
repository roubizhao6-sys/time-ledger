import type {
  MemoryEntry,
  MonthGroup,
  MonthlySummary,
  NewEntryInput,
  Plan,
  Vault,
  VaultType,
} from './types'

const FREE_ENTRY_LIMIT = 3

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function parseDate(value: string): Date {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new Error('无效日期')
  }
  return date
}

export function monthKey(value: string | Date): string {
  const date = typeof value === 'string' ? parseDate(value) : value
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${date.getFullYear()}-${month}`
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-')
  return `${year}年${Number(month)}月`
}

function monthOrdinal(key: string): number {
  const [year, month] = key.split('-').map(Number)
  return year * 12 + month - 1
}

export function sortEntriesByDate(entries: MemoryEntry[]): MemoryEntry[] {
  return [...entries].sort((a, b) => {
    return new Date(b.memoryDate).getTime() - new Date(a.memoryDate).getTime()
  })
}

export function calculateStreak(entries: MemoryEntry[]): number {
  const months = [...new Set(entries.map((entry) => monthKey(entry.memoryDate)))]
    .sort((a, b) => monthOrdinal(b) - monthOrdinal(a))

  if (months.length === 0) return 0

  let streak = 1
  for (let index = 1; index < months.length; index += 1) {
    if (monthOrdinal(months[index - 1]) - monthOrdinal(months[index]) !== 1) {
      break
    }
    streak += 1
  }

  return streak
}

export function groupEntriesByMonth(entries: MemoryEntry[]): MonthGroup[] {
  const groups = new Map<string, MemoryEntry[]>()

  for (const entry of sortEntriesByDate(entries)) {
    const key = monthKey(entry.memoryDate)
    const group = groups.get(key) ?? []
    group.push(entry)
    groups.set(key, group)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => monthOrdinal(b) - monthOrdinal(a))
    .map(([key, groupEntries]) => ({
      key,
      label: monthLabel(key),
      entries: groupEntries,
    }))
}

export function makeMonthlySummary(
  entries: MemoryEntry[],
  year: number,
  month: number,
): MonthlySummary {
  const key = `${year}-${String(month).padStart(2, '0')}`
  const monthEntries = sortEntriesByDate(
    entries.filter((entry) => monthKey(entry.memoryDate) === key),
  )

  return {
    key,
    label: monthLabel(key),
    count: monthEntries.length,
    coverImage: monthEntries.find((entry) => entry.imageDataUrl)?.imageDataUrl,
    moods: monthEntries.map((entry) => entry.mood),
    entries: monthEntries,
  }
}

export function normalizeTags(tags: string[] = []): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))]
}

export function createMemoryEntry(input: NewEntryInput): MemoryEntry {
  const now = new Date().toISOString()

  return {
    id: makeId(),
    vaultId: input.vaultId,
    title: input.title.trim() || '未命名记忆',
    text: input.text.trim(),
    mood: input.mood,
    tags: normalizeTags(input.tags),
    memoryDate: input.memoryDate,
    createdAt: now,
    updatedAt: now,
    imageDataUrl: input.imageDataUrl,
    favorite: Boolean(input.favorite),
    shared: Boolean(input.shared),
  }
}

export function createEmptyVault(name: string, type: VaultType): Vault {
  const now = new Date().toISOString()

  return {
    id: makeId(),
    name: name.trim() || '我的时光存折',
    type,
    theme: 'paper',
    createdAt: now,
    updatedAt: now,
    entries: [],
  }
}

export function entryLimit(plan: Plan): number {
  return plan === 'free' ? FREE_ENTRY_LIMIT : Number.POSITIVE_INFINITY
}

export function canAddEntry(plan: Plan, currentCount: number): boolean {
  return currentCount < entryLimit(plan)
}

export function isEntryEmpty(entry: Pick<MemoryEntry, 'title' | 'text' | 'imageDataUrl'>): boolean {
  return !entry.title.trim() && !entry.text.trim() && !entry.imageDataUrl
}
