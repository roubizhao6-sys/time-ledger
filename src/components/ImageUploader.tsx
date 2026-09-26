import { ImagePlus, X } from 'lucide-react'
import { useState } from 'react'
import { compressImage } from '../lib/image'

interface ImageUploaderProps {
  value?: string
  onChange: (value?: string) => void
}

export function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFile(file?: File) {
    if (!file) return
    setError('')
    setLoading(true)
    try {
      onChange(await compressImage(file))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '图片处理失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="image-uploader">
      {value ? (
        <div className="image-preview-wrap">
          <img src={value} alt="记忆预览" />
          <button type="button" onClick={() => onChange(undefined)} aria-label="移除照片">
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="image-dropzone">
          <ImagePlus size={24} />
          <strong>{loading ? '正在压缩……' : '添加一张照片'}</strong>
          <small>JPG、PNG、WebP，最大8MB</small>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
        </label>
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}
