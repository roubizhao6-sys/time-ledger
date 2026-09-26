import { base64UrlToBytes, decodeUtf8 } from './encoding'
import { LicenseError, type LicensePayload } from './types'

const SUPPORTED_PLANS = new Set(['monthly', 'yearly', 'family'])

function bufferSource(bytes: Uint8Array): ArrayBuffer {
  return Uint8Array.from(bytes).buffer
}

export async function verifyLicense(
  code: string,
  deviceId: string,
  publicKeyJwk: JsonWebKey,
): Promise<LicensePayload> {
  const parts = code.trim().split('.')
  if (parts.length !== 2) {
    throw new LicenseError('MALFORMED', '激活码格式不正确')
  }

  let payload: LicensePayload
  try {
    payload = JSON.parse(decodeUtf8(base64UrlToBytes(parts[0]))) as LicensePayload
  } catch {
    throw new LicenseError('MALFORMED', '激活码内容无法读取')
  }

  if (!SUPPORTED_PLANS.has(payload.plan)) {
    throw new LicenseError('UNSUPPORTED', '不支持的版本')
  }

  const publicKey = await crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify'],
  )

  const valid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    publicKey,
    bufferSource(base64UrlToBytes(parts[1])),
    bufferSource(base64UrlToBytes(parts[0])),
  )

  if (!valid) {
    throw new LicenseError('INVALID_SIGNATURE', '激活码签名无效')
  }

  if (payload.deviceId !== deviceId) {
    throw new LicenseError('DEVICE_MISMATCH', '激活码不属于当前设备')
  }

  const expiry = new Date(`${payload.expiresAt}T23:59:59.999Z`)
  if (Number.isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
    throw new LicenseError('EXPIRED', '激活码已过期')
  }

  return payload
}
