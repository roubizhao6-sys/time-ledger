const MAX_SOURCE_BYTES = 8 * 1024 * 1024
const MAX_EDGE = 1600
const JPEG_QUALITY = 0.82

export function isSupportedImage(file: File): boolean {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('图片读取失败'))
    image.src = dataUrl
  })
}

export async function compressImage(file: File): Promise<string> {
  if (!isSupportedImage(file)) {
    throw new Error('只支持 JPG、PNG 或 WebP 图片')
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('原始图片不能超过8MB')
  }

  const source = await readAsDataUrl(file)
  const image = await loadImage(source)
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('浏览器无法处理图片')
  }

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}
