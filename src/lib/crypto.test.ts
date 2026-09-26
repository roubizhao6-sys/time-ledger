import { describe, expect, it } from 'vitest'
import { decryptJson, encryptJson } from './crypto'

describe('backup cryptography', () => {
  it('encrypts and decrypts JSON data', async () => {
    const payload = await encryptJson({ hello: '世界', count: 3 }, 'test-password')
    await expect(decryptJson(payload, 'test-password')).resolves.toEqual({
      hello: '世界',
      count: 3,
    })
  })

  it('rejects the wrong password', async () => {
    const payload = await encryptJson({ secret: true }, 'correct-password')
    await expect(decryptJson(payload, 'wrong-password')).rejects.toBeTruthy()
  })
})
