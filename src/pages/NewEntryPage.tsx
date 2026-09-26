import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImageUploader } from '../components/ImageUploader'
import { MoodPicker } from '../components/MoodPicker'
import type { Mood } from '../domain/types'
import { FreeLimitError, useVault } from '../state/useVault'

function todayInputValue() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

export function NewEntryPage() {
  const navigate = useNavigate()
  const { state, addEntry } = useVault()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [mood, setMood] = useState<Mood>('calm')
  const [memoryDate, setMemoryDate] = useState(todayInputValue())
  const [tags, setTags] = useState('')
  const [imageDataUrl, setImageDataUrl] = useState<string>()
  const [shared, setShared] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!state) return
    setError('')
    setSaving(true)

    try {
      await addEntry({
        vaultId: state.vault.id,
        title,
        text,
        mood,
        memoryDate: new Date(`${memoryDate}T12:00:00`).toISOString(),
        tags: tags.split(/[,，]/),
        imageDataUrl,
        shared,
      })
      navigate('/timeline')
    } catch (saveError) {
      setError(
        saveError instanceof FreeLimitError
          ? saveError.message
          : saveError instanceof Error
            ? saveError.message
            : '保存失败',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="entry-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <p className="eyebrow">存入一笔</p>
        <h1>今天想记住什么？</h1>
        <p>不需要完整，也不需要写得漂亮。只要是真的。</p>
      </div>

      <label htmlFor="entry-title">标题</label>
      <input
        id="entry-title"
        className="text-input"
        value={title}
        maxLength={40}
        placeholder="例如：第一次一起看海"
        onChange={(event) => setTitle(event.target.value)}
        required
      />

      <label htmlFor="entry-text">内容</label>
      <textarea
        id="entry-text"
        className="text-input textarea"
        value={text}
        maxLength={2000}
        placeholder="写一句最想留下的话……"
        onChange={(event) => setText(event.target.value)}
      />

      <div className="two-column-form">
        <div>
          <label htmlFor="entry-date">日期</label>
          <input
            id="entry-date"
            className="text-input"
            type="date"
            value={memoryDate}
            onChange={(event) => setMemoryDate(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="entry-tags">标签</label>
          <input
            id="entry-tags"
            className="text-input"
            value={tags}
            placeholder="旅行，朋友，家人"
            onChange={(event) => setTags(event.target.value)}
          />
        </div>
      </div>

      <span className="field-label">心情</span>
      <MoodPicker value={mood} onChange={setMood} />

      <span className="field-label">照片</span>
      <ImageUploader value={imageDataUrl} onChange={setImageDataUrl} />

      <label className="toggle-row">
        <input type="checkbox" checked={shared} onChange={(event) => setShared(event.target.checked)} />
        放进共享空间
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="primary-button full-width" type="submit" disabled={saving}>
        {saving ? '正在存入……' : '存入存折'}
      </button>
    </form>
  )
}
