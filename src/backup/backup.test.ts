import { describe, expect, it } from 'vitest'
import { createBackupText, readBackupText } from './backup'
import { makeEntry, makeState } from '../test/state'

describe('encrypted backup', () => {
  it('round trips a persisted state', async () => {
    const state = makeState([makeEntry({ title: '备份里的记忆' })])
    const text = await createBackupText(state, 'backup-password')

    await expect(readBackupText(text, 'backup-password')).resolves.toMatchObject({
      version: 1,
      vault: { name: '测试存折' },
    })
  })

  it('rejects an invalid header', async () => {
    await expect(readBackupText('{"hello":true}', 'backup-password')).rejects.toThrow(
      '不是有效的时光存折备份',
    )
  })

  it('rejects the wrong password', async () => {
    const text = await createBackupText(makeState(), 'correct-password')
    await expect(readBackupText(text, 'wrong-password')).rejects.toBeTruthy()
  })
})
