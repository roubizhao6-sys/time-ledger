const encoder = new TextEncoder()
const decoder = new TextDecoder()

export interface EncryptedPayload {
  version: 1
  salt: string
  iv: string
  cipher: string
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }

  return btoa(binary)
}

export function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 200000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptJson(
  value: unknown,
  password: string,
): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(value)),
  )

  return {
    version: 1,
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    cipher: bytesToBase64(new Uint8Array(encrypted)),
  }
}

export async function decryptJson<T>(
  payload: EncryptedPayload,
  password: string,
): Promise<T> {
  if (payload.version !== 1) {
    throw new Error('不支持的备份版本')
  }

  const salt = base64ToBytes(payload.salt)
  const iv = base64ToBytes(payload.iv)
  const cipher = base64ToBytes(payload.cipher)
  const key = await deriveKey(password, salt)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher)

  return JSON.parse(decoder.decode(decrypted)) as T
}
