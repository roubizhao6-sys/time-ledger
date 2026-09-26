export type LicensePlan = 'monthly' | 'yearly' | 'family'

export interface LicensePayload {
  deviceId: string
  plan: LicensePlan
  expiresAt: string
  issuedAt: string
}

export interface SignableLicensePayload {
  deviceId: string
  plan: LicensePlan
  expiresAt: string
}

export interface LicenseKeyPair {
  publicKey: JsonWebKey
  privateKey: JsonWebKey
}

export type LicenseErrorCode =
  | 'MALFORMED'
  | 'INVALID_SIGNATURE'
  | 'DEVICE_MISMATCH'
  | 'EXPIRED'
  | 'UNSUPPORTED'

export class LicenseError extends Error {
  readonly code: LicenseErrorCode

  constructor(code: LicenseErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'LicenseError'
  }
}
