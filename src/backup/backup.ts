import type { PersistedState } from '../domain/types'
import { decryptJson, encryptJson, type EncryptedPayload } from '../lib/crypto'

export const BACKUP_HEADER = 'TIME_LEDGER_BACKUP_V1'

interface BackupEnvelope {
  header: typeof BACKUP_HEADER
  createdAt: string
  payload: EncryptedPayload
}

function assertState(value: unknown): asserts value is PersistedState {
  const candidate = value as Partial<PersistedState>
  if (
    !candidate ||
    candidate.version !== 1 ||
    !candidate.vault ||
    !candidate.settings ||
    !Array.isArray(candidate.vault.entries)
  ) {
    throw new Error('备份内容不完整')
  }
}

export async function createBackupText(
  state: PersistedState,
  password: string,
): Promise<string> {
  const envelope: BackupEnvelope = {
    header: BACKUP_HEADER,
    createdAt: new Date().toISOString(),
    payload: await encryptJson(state, password),
  }
  return JSON.stringify(envelope)
}

export async function readBackupText(
  text: string,
  password: string,
): Promise<PersistedState> {
  let envelope: BackupEnvelope
  try {
    envelope = JSON.parse(text) as BackupEnvelope
  } catch {
    throw new Error('不是有效的时光存折备份')
  }

  if (envelope.header !== BACKUP_HEADER || !envelope.payload) {
    throw new Error('不是有效的时光存折备份')
  }

  const state = await decryptJson<PersistedState>(envelope.payload, password)
  assertState(state)
  return state
}

export async function createBackupFile(
  state: PersistedState,
  password: string,
): Promise<Blob> {
  return new Blob([await createBackupText(state, password)], {
    type: 'application/json;charset=utf-8',
  })
}

export async function readBackupFile(
  file: File,
  password: string,
): Promise<PersistedState> {
  return readBackupText(await file.text(), password)
}
