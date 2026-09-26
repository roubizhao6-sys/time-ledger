import { ArrowRight, BookHeart, Flame, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MemoryCard } from '../components/MemoryCard'
import { calculateStreak, makeMonthlySummary, sortEntriesByDate } from '../domain/memory'
import { useVault } from '../state/useVault'

export function DashboardPage() {
  const { state } = useVault()
  const entries = state?.vault.entries ?? []
  const now = new Date()
  const summary = makeMonthlySummary(entries, now.getFullYear(), now.getMonth() + 1)
  const streak = calculateStreak(entries)
  const recent = sortEntriesByDate(entries).slice(0, 3)

  return (
    <section className="page-stack">
      <div className="dashboard-hero">
        <p className="eyebrow">本月</p>
        <h1>存入一笔记忆</h1>
        <p>不用写很多。一张照片，一句话，未来的你会感谢今天留下的这一笔。</p>
        <Link className="primary-button" to="/entry/new">
          开始记录 <ArrowRight size={18} />
        </Link>
      </div>

      <div className="metric-grid">
        <article>
          <BookHeart size={20} />
          <span>本月已存入</span>
          <strong>{summary.count} 笔</strong>
        </article>
        <article>
          <Flame size={20} />
          <span>连续存储</span>
          <strong>{streak} 个月</strong>
        </article>
        <article>
          <Layers3 size={20} />
          <span>累计记忆</span>
          <strong>{entries.length} 笔</strong>
        </article>
      </div>

      <div className="section-card">
        <div className="section-card-head">
          <div>
            <p className="eyebrow">最近存入</p>
            <h2>你的时间线</h2>
          </div>
          <Link to="/timeline">查看全部</Link>
        </div>
        {recent.length ? (
          <div className="memory-list">
            {recent.map((entry) => <MemoryCard key={entry.id} entry={entry} />)}
          </div>
        ) : (
          <div className="empty-state">
            <strong>存折还是空的</strong>
            <p>存入第一笔记忆后，这里会出现你的时间线。</p>
          </div>
        )}
      </div>
    </section>
  )
}
