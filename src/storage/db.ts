import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { PersistedState } from '../domain/types'

interface TimeLedgerDb extends DBSchema {
  state: {
    key: string
    value: PersistedState
  }
}

const DB_NAME = 'time-ledger'
const DB_VERSION = 1
const STATE_KEY = 'current'

let databasePromise: Promise<IDBPDatabase<TimeLedgerDb>> | null = null

export function openDatabase(): Promise<IDBPDatabase<TimeLedgerDb>> {
  if (!databasePromise) {
    databasePromise = openDB<TimeLedgerDb>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains('state')) {
          database.createObjectStore('state')
        }
      },
    })
  }

  return databasePromise
}

export async function readState(): Promise<PersistedState | null> {
  const database = await openDatabase()
  return (await database.get('state', STATE_KEY)) ?? null
}

export async function writeState(state: PersistedState): Promise<void> {
  const database = await openDatabase()
  await database.put('state', state, STATE_KEY)
}

export async function deleteState(): Promise<void> {
  const database = await openDatabase()
  await database.delete('state', STATE_KEY)
}
