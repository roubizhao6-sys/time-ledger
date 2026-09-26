import { describe, expect, it } from 'vitest'
import {
  calculateStreak,
  canAddEntry,
  createEmptyVault,
  createMemoryEntry,
  groupEntriesByMonth,
  makeMonthlySummary,
} from './memory'
import type { MemoryEntry } from './types'

function entry(id: string, memoryDate: string, text = '记录'): MemoryEntry {
  return {
    id,
    vaultId: 'vault-1',
    title: `记忆 ${id}`,
    text,
    mood: 'calm',
    tags: [],
    memoryDate,
    createdAt: memoryDate,
    updatedAt: memoryDate,
    favorite: false,
    shared: false,
  }
}

describe('memory domain', () => {
  it('counts consecutive months from the latest entry', () => {
    expect(
      calculateStreak([
        entry('1', '2026-09-03T10:00:00.000Z'),
        entry('2', '2026-08-03T10:00:00.000Z'),
        entry('3', '2026-07-03T10:00:00.000Z'),
      ]),
    ).toBe(3)
  })

  it('breaks streak when a month is missing', () => {
    expect(
      calculateStreak([
        entry('1', '2026-09-03T10:00:00.000Z'),
        entry('2', '2026-07-03T10:00:00.000Z'),
      ]),
    ).toBe(1)
  })

  it('groups entries by month in descending order', () => {
    const groups = groupEntriesByMonth([
      entry('1', '2026-08-03T10:00:00.000Z'),
      entry('2', '2026-09-03T10:00:00.000Z'),
    ])

    expect(groups.map((group) => group.key)).toEqual(['2026-09', '2026-08'])
    expect(groups[0].label).toBe('2026年9月')
  })

  it('builds a monthly summary', () => {
    const summary = makeMonthlySummary(
      [entry('1', '2026-09-03T10:00:00.000Z'), entry('2', '2026-09-18T10:00:00.000Z')],
      2026,
      9,
    )

    expect(summary.count).toBe(2)
    expect(summary.moods).toEqual(['calm', 'calm'])
  })

  it('limits free users to three entries', () => {
    expect(canAddEntry('free', 2)).toBe(true)
    expect(canAddEntry('free', 3)).toBe(false)
    expect(canAddEntry('yearly', 999)).toBe(true)
  })

  it('creates a vault and a memory entry with stable ids', () => {
    const vault = createEmptyVault('我们的存折', 'couple')
    const memory = createMemoryEntry({
      vaultId: vault.id,
      title: '第一次一起看海',
      text: '风很大，但我们都没有走。',
      mood: 'joy',
      memoryDate: '2026-09-27T10:00:00.000Z',
      tags: ['旅行', ' 旅行 ', '海边'],
    })

    expect(vault.type).toBe('couple')
    expect(vault.entries).toEqual([])
    expect(memory.vaultId).toBe(vault.id)
    expect(memory.tags).toEqual(['旅行', '海边'])
    expect(memory.id).toBeTruthy()
  })
})
