import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MemoryEntry } from '../domain/types'

const moodLabels: Record<MemoryEntry['mood'], string> = {
  joy: '开心',
  calm: '平静',
  tired: '疲惫',
  brave: '勇敢',
  missing: '想念',
  grateful: '感激',
}

export function MemoryCard({ entry }: { entry: MemoryEntry }) {
  return (
    <Link className="memory-card" to={`/entry/${entry.id}`}>
      {entry.imageDataUrl && <img src={entry.imageDataUrl} alt="" />}
      <div className="memory-card-copy">
        <div className="memory-card-meta">
          <span>{new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' }).format(new Date(entry.memoryDate))}</span>
          <span>{moodLabels[entry.mood]}</span>
          {entry.favorite && <Heart size={15} fill="currentColor" />}
        </div>
        <h3>{entry.title}</h3>
        <p>{entry.text || '这一天只留下了一张照片。'}</p>
      </div>
    </Link>
  )
}
