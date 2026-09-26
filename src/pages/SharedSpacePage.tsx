import { Link } from 'react-router-dom'
import { MemoryCard } from '../components/MemoryCard'
import { useVault } from '../state/useVault'

export function SharedSpacePage() {
  const { state } = useVault()
  const sharedEntries = state?.vault.entries.filter((entry) => entry.shared) ?? []

  return (
    <section className="page-stack">
      <div className="simple-page">
        <p className="eyebrow">共享空间</p>
        <h1>把值得一起记住的事，放到这里。</h1>
        <p>当前版本通过加密备份文件交换数据，不需要账号，也不上传到云服务器。</p>
      </div>

      <div className="shared-actions">
        <Link className="primary-button" to="/entry/new">存入共享记忆</Link>
        <Link className="secondary-button" to="/backup">导出加密备份</Link>
      </div>

      {sharedEntries.length ? (
        <div className="memory-list">
          {sharedEntries.map((entry) => <MemoryCard key={entry.id} entry={entry} />)}
        </div>
      ) : (
        <div className="empty-state">
          <strong>还没有共享记忆</strong>
          <p>新增记忆时勾选“放进共享空间”，再通过加密备份分享给伴侣或家人。</p>
        </div>
      )}
    </section>
  )
}
