import { bytesToBase64Url, encodeUtf8 } from './encoding'
import type { LicensePayload, SignableLicensePayload } from './types'

export async function signLicense(
  input: SignableLicensePayload,
  privateKeyJwk: JsonWebKey,
): Promise<string> {
  const privateKey = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  )

  const payload: LicensePayload = {
    ...input,
    issuedAt: new Date().toISOString(),
  }
  const payloadJson = JSON.stringify(payload)
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privateKey,
    encodeUtf8(payloadJson),
  )

  return `${bytesToBase64Url(encodeUtf8(payloadJson))}.${bytesToBase64Url(
    new Uint8Array(signature),
  )}`
}
