import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useVault } from '../state/useVault'

export function EntryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, updateEntry, deleteEntry } = useVault()
  const entry = state?.vault.entries.find((item) => item.id === id)

  if (!entry) {
    return (
      <section className="simple-page">
        <h1>记忆不存在</h1>
        <Link to="/timeline">返回时间轴</Link>
      </section>
    )
  }

  async function handleDelete() {
    if (!entry) return
    if (!window.confirm('确定删除这笔记忆吗？此操作不能撤销。')) return
    await deleteEntry(entry.id)
    navigate('/timeline')
  }

  return (
    <article className="entry-detail">
      <Link className="back-link" to="/timeline">
        <ArrowLeft size={18} /> 返回时间轴
      </Link>
      {entry.imageDataUrl && <img className="entry-hero-image" src={entry.imageDataUrl} alt="" />}
      <p className="eyebrow">
        {new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(entry.memoryDate))}
      </p>
      <h1>{entry.title}</h1>
      <p className="entry-text">{entry.text}</p>
      <div className="detail-actions">
        <button
          type="button"
          onClick={() => void updateEntry(entry.id, { favorite: !entry.favorite })}
        >
          <Heart size={18} fill={entry.favorite ? 'currentColor' : 'none'} />
          {entry.favorite ? '已收藏' : '收藏'}
        </button>
        <button type="button" className="danger" onClick={() => void handleDelete()}>
          <Trash2 size={18} /> 删除
        </button>
      </div>
    </article>
  )
}
