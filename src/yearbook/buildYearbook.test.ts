import { describe, expect, it } from 'vitest'
import { createEmptyVault, createMemoryEntry } from '../domain/memory'
import { buildYearbookHtml } from './buildYearbook'

describe('yearbook generator', () => {
  it('builds a self-contained yearly album', () => {
    const vault = createEmptyVault('我们的存折', 'couple')
    vault.entries = [
      createMemoryEntry({
        vaultId: vault.id,
        title: '九月的海',
        text: '风很大。',
        mood: 'joy',
        memoryDate: '2026-09-05T10:00:00.000Z',
      }),
      createMemoryEntry({
        vaultId: vault.id,
        title: '八月的风',
        text: '夏天还没结束。',
        mood: 'calm',
        memoryDate: '2026-08-05T10:00:00.000Z',
      }),
    ]

    const html = buildYearbookHtml(vault, 2026)

    expect(html).toContain('2026')
    expect(html).toContain('我们的存折')
    expect(html).toContain('笔记忆')
    expect(html).toContain('<strong>2</strong>')
    expect(html).toContain('2026年9月')
    expect(html).toContain('九月的海')
  })
})
