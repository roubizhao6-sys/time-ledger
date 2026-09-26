import { Search } from 'lucide-react'
import { useState } from 'react'
import { MemoryCard } from '../components/MemoryCard'
import { groupEntriesByMonth } from '../domain/memory'
import { useVault } from '../state/useVault'

export function TimelinePage() {
  const { state } = useVault()
  const [query, setQuery] = useState('')
  const entries = (state?.vault.entries ?? []).filter((entry) => {
    const haystack = [entry.title, entry.text, ...entry.tags].join(' ').toLowerCase()
    return haystack.includes(query.trim().toLowerCase())
  })
  const groups = groupEntriesByMonth(entries)

  return (
    <section className="page-stack">
      <div className="section-card-head">
        <div>
          <p className="eyebrow">时间轴</p>
          <h1>你的记忆按月生长</h1>
        </div>
      </div>

      <label className="search-field" htmlFor="memory-search">
        <Search size={18} />
        <input
          id="memory-search"
          aria-label="搜索记忆"
          value={query}
          placeholder="搜索标题、内容或标签"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {groups.length ? (
        groups.map((group) => (
          <section className="month-group" key={group.key}>
            <div className="month-heading">
              <h2>{group.label}</h2>
              <span>{group.entries.length} 笔</span>
            </div>
            <div className="memory-list">
              {group.entries.map((entry) => <MemoryCard key={entry.id} entry={entry} />)}
            </div>
          </section>
        ))
      ) : (
        <div className="empty-state">
          <strong>没有找到记忆</strong>
          <p>{query ? '换个关键词试试。' : '从存入第一笔开始。'}</p>
        </div>
      )}
    </section>
  )
}
