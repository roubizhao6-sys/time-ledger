import { describe, expect, it } from 'vitest'
import { generateLicenseKeyPair } from './keys'
import { signLicense } from './sign'
import { verifyLicense } from './verify'

describe('offline license', () => {
  it('verifies a valid device-bound license', async () => {
    const pair = await generateLicenseKeyPair()
    const code = await signLicense(
      {
        deviceId: 'device-abc',
        plan: 'yearly',
        expiresAt: '2099-12-31',
      },
      pair.privateKey,
    )

    await expect(
      verifyLicense(code, 'device-abc', pair.publicKey),
    ).resolves.toMatchObject({
      deviceId: 'device-abc',
      plan: 'yearly',
    })
  })

  it('rejects a license for another device', async () => {
    const pair = await generateLicenseKeyPair()
    const code = await signLicense(
      {
        deviceId: 'device-a',
        plan: 'monthly',
        expiresAt: '2099-12-31',
      },
      pair.privateKey,
    )

    await expect(
      verifyLicense(code, 'device-b', pair.publicKey),
    ).rejects.toMatchObject({ code: 'DEVICE_MISMATCH' })
  })

  it('rejects an expired license', async () => {
    const pair = await generateLicenseKeyPair()
    const code = await signLicense(
      {
        deviceId: 'device-a',
        plan: 'monthly',
        expiresAt: '2020-01-01',
      },
      pair.privateKey,
    )

    await expect(
      verifyLicense(code, 'device-a', pair.publicKey),
    ).rejects.toMatchObject({ code: 'EXPIRED' })
  })
})
