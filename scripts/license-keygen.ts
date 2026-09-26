import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateLicenseKeyPair } from '../src/license/keys'

const pair = await generateLicenseKeyPair()
const privatePath = resolve('private/license-private-key.json')

mkdirSync(resolve('private'), { recursive: true })
writeFileSync(
  privatePath,
  JSON.stringify(
    {
      version: 1,
      publicKey: pair.publicKey,
      privateKey: pair.privateKey,
    },
    null,
    2,
  ),
)

console.log('Private key saved to private/license-private-key.json')
console.log('Public key for src/config/licensePublicKey.ts:')
console.log(JSON.stringify(pair.publicKey, null, 2))
