function escapeIcs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

export function buildReminderIcs(vaultName: string, startDate: Date): string {
  const events: string[] = []

  for (let index = 0; index < 12; index += 1) {
    const start = new Date(startDate)
    start.setMonth(start.getMonth() + index)
    start.setHours(20, 0, 0, 0)
    const end = new Date(start.getTime() + 30 * 60 * 1000)
    const uid = `time-ledger-${start.getTime()}@local`

    events.push(
      [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(start)}`,
        `DTEND:${toIcsDate(end)}`,
        'SUMMARY:存入一笔记忆',
        `DESCRIPTION:打开时光存折，为“${escapeIcs(vaultName)}”存入本月的一张照片和一句话。`,
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:打开时光存折，存入本月记忆',
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n'),
    )
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Time Ledger//CN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcs(vaultName)} · 月度提醒`,
    'X-TIME-LEDGER-RRULE:FREQ=MONTHLY;COUNT=12',
    ...events,
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}

export function downloadReminderIcs(vaultName: string, startDate: Date): void {
  const blob = new Blob([buildReminderIcs(vaultName, startDate)], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${vaultName}-月度提醒.ics`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
