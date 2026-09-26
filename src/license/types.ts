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
  constructor(
    public readonly code: LicenseErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'LicenseError'
  }
}
