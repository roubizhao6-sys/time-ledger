import { groupEntriesByMonth } from '../domain/memory'
import type { MemoryEntry, Vault } from '../domain/types'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

function moodLabel(entry: MemoryEntry): string {
  const labels: Record<MemoryEntry['mood'], string> = {
    joy: '开心',
    calm: '平静',
    tired: '疲惫',
    brave: '勇敢',
    missing: '想念',
    grateful: '感激',
  }
  return labels[entry.mood]
}

const yearbookCss = `
  *{box-sizing:border-box}
  body{margin:0;background:#f4ecdc;color:#24342c;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;line-height:1.75}
  .book{max-width:920px;margin:0 auto;background:#fffaf0;box-shadow:0 20px 80px rgba(68,50,28,.14)}
  .cover{min-height:82vh;display:grid;align-content:center;padding:64px;background:linear-gradient(160deg,#1f5a45,#163e30);color:#fff8e8}
  .cover small{letter-spacing:.18em;text-transform:uppercase;color:#f1ce82}
  .cover h1{font-size:clamp(48px,10vw,92px);line-height:.95;letter-spacing:-.06em;margin:18px 0}
  .cover p{max-width:620px;color:#dce8df;font-size:20px}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:36px}
  .stat{padding:18px;border:1px solid rgba(255,255,255,.18);border-radius:18px;background:rgba(255,255,255,.06)}
  .stat strong{display:block;font-size:36px;color:#f1ce82}.stat span{color:#dce8df}
  .page{padding:54px}
  .month{margin:0 0 56px}.month h2{font-size:34px;border-bottom:1px solid #d8ceb9;padding-bottom:12px}
  .memory{display:grid;grid-template-columns:240px 1fr;gap:22px;margin:24px 0;padding-bottom:24px;border-bottom:1px dashed #ddd2bd;break-inside:avoid}
  .memory img{width:100%;height:190px;object-fit:cover;border-radius:18px}
  .memory h3{margin:0 0 6px;font-size:24px}.meta{color:#8a6b34;font-size:14px}.memory p{white-space:pre-wrap}
  .empty{color:#6d7669}
  @media(max-width:680px){.memory{grid-template-columns:1fr}.cover,.page{padding:28px}.stats{grid-template-columns:1fr}}
  @media print{body{background:#fff}.book{box-shadow:none}.cover{min-height:auto;break-after:page}.memory{break-inside:avoid}}
`

export function buildYearbookHtml(vault: Vault, year: number): string {
  const entries = vault.entries.filter(
    (entry) => new Date(entry.memoryDate).getFullYear() === year,
  )
  const groups = groupEntriesByMonth(entries)
  const favoriteCount = entries.filter((entry) => entry.favorite).length
  const monthCount = groups.length

  const monthSections = groups
    .map(
      (group) => `
        <section class="month">
          <h2>${escapeHtml(group.label)}</h2>
          ${group.entries
            .map(
              (entry) => `
                <article class="memory">
                  ${entry.imageDataUrl ? `<img src="${entry.imageDataUrl}" alt="">` : ''}
                  <div>
                    <p class="meta">${formatDate(entry.memoryDate)} · ${moodLabel(entry)}</p>
                    <h3>${escapeHtml(entry.title)}</h3>
                    <p>${escapeHtml(entry.text || '这一天只留下了一张照片。')}</p>
                    ${entry.tags.length ? `<p class="meta">${entry.tags.map(escapeHtml).join(' · ')}</p>` : ''}
                  </div>
                </article>
              `,
            )
            .join('')}
        </section>
      `,
    )
    .join('')

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(vault.name)} · ${year}年度回忆册</title>
<style>${yearbookCss}</style>
</head>
<body>
<div class="book">
  <section class="cover">
    <small>Time Ledger</small>
    <h1>${escapeHtml(vault.name)}</h1>
    <p>${year} 年度回忆册</p>
    <div class="stats">
      <div class="stat"><strong>${entries.length}</strong><span>笔记忆</span></div>
      <div class="stat"><strong>${monthCount}</strong><span>个月份</span></div>
      <div class="stat"><strong>${favoriteCount}</strong><span>笔收藏</span></div>
    </div>
  </section>
  <main class="page">
    ${monthSections || '<div class="empty">这一年还没有存入记忆。</div>'}
  </main>
</div>
</body>
</html>`
}

export function downloadYearbook(vault: Vault, year: number): void {
  const html = buildYearbookHtml(vault, year)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${vault.name}-${year}年度回忆册.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
