import { describe, expect, it } from 'vitest'
import { buildReminderIcs } from './buildReminderIcs'

describe('reminder calendar', () => {
  it('builds twelve monthly events', () => {
    const ics = buildReminderIcs('我们的存折', new Date('2026-09-27T10:00:00.000Z'))

    expect((ics.match(/BEGIN:VEVENT/g) ?? [])).toHaveLength(12)
    expect(ics).toContain('SUMMARY:存入一笔记忆')
    expect(ics).toContain('RRULE:FREQ=MONTHLY;COUNT=12')
  })
})
