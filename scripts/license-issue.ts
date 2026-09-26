import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { signLicense } from '../src/license/sign'
import type { LicensePlan } from '../src/license/types'

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

const deviceId = arg('--device')
const plan = arg('--plan') as LicensePlan | undefined
const expires = arg('--expires')

if (!deviceId || !plan || !expires) {
  console.error(
    'Usage: npm run license:issue -- --device <device-id> --plan yearly --expires 2027-09-27',
  )
  process.exit(1)
}

if (!['monthly', 'yearly', 'family'].includes(plan)) {
  console.error('Plan must be monthly, yearly, or family')
  process.exit(1)
}

const keyFile = JSON.parse(
  readFileSync(resolve('private/license-private-key.json'), 'utf8'),
) as { privateKey: JsonWebKey }

const code = await signLicense(
  {
    deviceId,
    plan,
    expiresAt: expires,
  },
  keyFile.privateKey,
)

console.log(code)
