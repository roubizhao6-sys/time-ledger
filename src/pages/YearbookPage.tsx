import { Download, Printer } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buildYearbookHtml, downloadYearbook } from '../yearbook/buildYearbook'
import { useVault } from '../state/useVault'

export function YearbookPage() {
  const { state } = useVault()
  const vault = state?.vault
  const years = useMemo(() => {
    const values = new Set<number>()
    vault?.entries.forEach((entry) => values.add(new Date(entry.memoryDate).getFullYear()))
    if (values.size === 0) values.add(new Date().getFullYear())
    return [...values].sort((a, b) => b - a)
  }, [vault])
  const [year, setYear] = useState(years[0] ?? new Date().getFullYear())

  if (!vault) {
    return <section className="simple-page"><h1>还没有存折</h1></section>
  }

  const entries = vault.entries.filter((entry) => new Date(entry.memoryDate).getFullYear() === year)
  const html = buildYearbookHtml(vault, year)

  return (
    <section className="page-stack">
      <div className="section-card-head">
        <div>
          <p className="eyebrow">年度册</p>
          <h1>{year} 年回忆册</h1>
        </div>
        <select className="year-select" value={year} onChange={(event) => setYear(Number(event.target.value))}>
          {years.map((value) => <option key={value} value={value}>{value}年</option>)}
        </select>
      </div>

      <div className="yearbook-actions">
        <button className="primary-button" type="button" onClick={() => downloadYearbook(vault, year)}>
          <Download size={18} /> 下载年度册
        </button>
        <button className="secondary-button" type="button" onClick={() => window.print()}>
          <Printer size={18} /> 打印
        </button>
      </div>

      {entries.length ? (
        <iframe className="yearbook-preview" title="年度册预览" srcDoc={html} />
      ) : (
        <div className="empty-state">
          <strong>这一年还没有记忆</strong>
          <p>存入12个月的记忆后，年度册会自动变得完整。</p>
        </div>
      )}
    </section>
  )
}
