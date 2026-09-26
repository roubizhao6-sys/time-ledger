# 时光存折 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first React PWA that stores monthly memories, generates yearly digital albums, supports encrypted backup, and sells offline activation codes.

**Architecture:** React + TypeScript SPA with hash routing. Domain logic is pure and tested. IndexedDB is the persistence layer. Web Crypto handles encrypted backups and license signatures. The build deploys as a static PWA to GitHub Pages.

**Tech Stack:** React 19, TypeScript, Vite, React Router, IndexedDB, Web Crypto, Vitest, Testing Library, vite-plugin-pwa.

**Spec:** `docs/superpowers/specs/2026-09-27-time-ledger-design.md`

## Global Constraints

- 只面向中国大陆，界面使用简体中文。
- 人民币价格：¥9.9/月、¥79/年、¥19.9/月双人家庭版。
- 本地优先，不上传用户内容到服务器。
- 不伪造原价、稀缺、评价或销量。
- 免费版最多3条记忆。
- 数据备份使用AES-GCM加密。
- 激活码使用ECDSA签名，私钥不进入公开仓库。
- 部署路径为 `/time-ledger/`。
- Node.js 24+，npm 11+。
- 所有核心逻辑必须有自动化测试。

---

### Task 1: Project scaffold and test harness

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/vite-env.d.ts`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Create: `.gitignore`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm run test`.

- [ ] **Step 1: Create Vite React TypeScript scaffold**

Run:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom lucide-react
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-plugin-pwa
```

- [ ] **Step 2: Configure Vite base path and test environment**

`vite.config.ts` must include:

```ts
export default defineConfig({
  base: "/time-ledger/",
  plugins: [react(), VitePWA({ registerType: "autoUpdate" })],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});
```

- [ ] **Step 3: Add test setup**

`src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add placeholder app shell**

`src/App.tsx`:

```tsx
export default function App() {
  return <main>时光存折</main>;
}
```

- [ ] **Step 5: Run checks**

Run:

```bash
npm run build
npm run test -- --run
```

Expected: build succeeds and test runner exits without failures.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold time ledger app"
```

---

### Task 2: Domain model and pure memory logic

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/memory.ts`
- Create: `src/domain/memory.test.ts`

**Interfaces:**
- Produces: `MemoryEntry`, `Vault`, `AppSettings`, `Plan`, `Mood`, `calculateStreak(entries: MemoryEntry[]): number`, `groupEntriesByMonth(entries: MemoryEntry[]): MonthGroup[]`, `makeMonthlySummary(entries: MemoryEntry[], year: number, month: number): MonthlySummary`, `createEmptyVault(name: string, type: VaultType): Vault`, `createMemoryEntry(input: NewEntryInput): MemoryEntry`.

- [ ] **Step 1: Write failing tests**

Tests must cover:

```ts
it("counts consecutive months", () => {
  expect(calculateStreak(entriesForMonths(["2026-09", "2026-08", "2026-07"]))).toBe(3);
});

it("groups entries by month in descending order", () => {
  expect(groupEntriesByMonth(entries).map((group) => group.key)).toEqual(["2026-09", "2026-08"]);
});

it("limits free users to three entries", () => {
  expect(canAddEntry("free", 3)).toBe(false);
});
```

- [ ] **Step 2: Run tests to confirm failure**

Run:

```bash
npm run test -- --run src/domain/memory.test.ts
```

Expected: FAIL because domain functions do not exist.

- [ ] **Step 3: Implement types and functions**

Implement pure functions without React or browser APIs. Use ISO date strings. Use `crypto.randomUUID()` only in `createMemoryEntry`.

- [ ] **Step 4: Run tests**

Run:

```bash
npm run test -- --run src/domain/memory.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain
git commit -m "feat: add memory domain model"
```

---

### Task 3: Image compression and backup encryption utilities

**Files:**
- Create: `src/lib/image.ts`
- Create: `src/lib/crypto.ts`
- Create: `src/lib/crypto.test.ts`

**Interfaces:**
- Produces: `compressImage(file: File): Promise<string>`, `encryptJson(value: unknown, password: string): Promise<EncryptedPayload>`, `decryptJson<T>(payload: EncryptedPayload, password: string): Promise<T>`, `bytesToBase64(bytes: Uint8Array): string`, `base64ToBytes(value: string): Uint8Array`.

- [ ] **Step 1: Write failing tests**

```ts
it("encrypts and decrypts a vault", async () => {
  const payload = await encryptJson({ hello: "世界" }, "test-password");
  await expect(decryptJson(payload, "test-password")).resolves.toEqual({ hello: "世界" });
});

it("rejects the wrong password", async () => {
  const payload = await encryptJson({ secret: true }, "correct");
  await expect(decryptJson(payload, "wrong")).rejects.toBeTruthy();
});
```

- [ ] **Step 2: Run test to see failure**

Run:

```bash
npm run test -- --run src/lib/crypto.test.ts
```

- [ ] **Step 3: Implement AES-GCM + PBKDF2**

Use `crypto.subtle`, 16-byte salt, 12-byte IV, 200000 PBKDF2 iterations, SHA-256, AES-GCM-256. Use chunked base64 conversion.

- [ ] **Step 4: Implement image compression**

Use Canvas. Max width/height 1600px. Output JPEG at quality 0.82. Reject files over 8MB before compression.

- [ ] **Step 5: Run tests and build**

```bash
npm run test -- --run src/lib/crypto.test.ts
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/lib
git commit -m "feat: add compression and encryption utilities"
```

---

### Task 4: IndexedDB repository

**Files:**
- Create: `src/storage/db.ts`
- Create: `src/storage/repository.ts`
- Create: `src/storage/repository.test.ts`

**Interfaces:**
- Produces: `VaultRepository { load(): Promise<PersistedState | null>; save(state: PersistedState): Promise<void>; clear(): Promise<void>; }`, `createIndexedDbRepository(): VaultRepository`, `createMemoryRepository(initial?: PersistedState): VaultRepository`.

- [ ] **Step 1: Write failing repository tests**

Use `createMemoryRepository` to test save/load/clear round trips.

- [ ] **Step 2: Run tests to confirm failure**

```bash
npm run test -- --run src/storage/repository.test.ts
```

- [ ] **Step 3: Implement repository interface**

`PersistedState` contains `vault`, `settings`, `version`.

- [ ] **Step 4: Implement IndexedDB store**

Store one serialized state object under key `time-ledger-state`. Catch quota and unavailable errors with typed errors.

- [ ] **Step 5: Run tests**

```bash
npm run test -- --run src/storage/repository.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/storage
git commit -m "feat: add local persistence repository"
```

---

### Task 5: Offline license verifier and issuer

**Files:**
- Create: `src/license/types.ts`
- Create: `src/license/verify.ts`
- Create: `src/license/verify.test.ts`
- Create: `scripts/license-keygen.ts`
- Create: `scripts/license-issue.ts`
- Create: `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `LicensePayload { deviceId: string; plan: "monthly"|"yearly"|"family"; expiresAt: string; }`, `verifyLicense(code: string, deviceId: string, publicKeyJwk: JsonWebKey): Promise<LicensePayload>`.

- [ ] **Step 1: Write failing verification tests**

Generate a test ECDSA keypair in the test, sign a payload, and assert valid/invalid cases.

- [ ] **Step 2: Implement ECDSA verification**

Use Web Crypto ES256. Encode code as `base64url(payload).base64url(signature)`.

- [ ] **Step 3: Implement key generation CLI**

`npm run license:keygen` writes `private/license-private-key.json` and prints the public JWK for `src/config/licensePublicKey.ts`.

- [ ] **Step 4: Implement issuer CLI**

`npm run license:issue -- --device <id> --plan yearly --expires 2027-09-27` prints one activation code.

- [ ] **Step 5: Run tests**

```bash
npm run test -- --run src/license/verify.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/license scripts package.json .env.example .gitignore
git commit -m "feat: add offline license verification"
```

---

### Task 6: App shell, routing, and state provider

**Files:**
- Create: `src/app/AppShell.tsx`
- Create: `src/app/routes.tsx`
- Create: `src/state/VaultContext.tsx`
- Create: `src/state/useVault.ts`
- Create: `src/components/NavBar.tsx`
- Create: `src/components/LoadingScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Modify: `src/styles/global.css`

**Interfaces:**
- Produces: `VaultProvider`, `useVault(): VaultContextValue`.

- [ ] **Step 1: Write failing navigation test**

Assert that the app renders the welcome route and that the bottom navigation contains `首页`, `时间轴`, `年度册`, `我的`.

- [ ] **Step 2: Implement hash router**

Routes:

```text
#/welcome
#/dashboard
#/entry/new
#/entry/:id
#/timeline
#/yearbook
#/backup
#/pricing
#/settings
#/help
```

- [ ] **Step 3: Implement VaultProvider**

Load persisted state on mount. Expose createVault, addEntry, updateEntry, deleteEntry, importState, clearAll, setPlan.

- [ ] **Step 4: Run tests and build**

```bash
npm run test -- --run
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app src/state src/components src/App.tsx src/main.tsx src/styles/global.css
git commit -m "feat: add app shell and state provider"
```

---

### Task 7: Welcome and onboarding flow

**Files:**
- Create: `src/pages/WelcomePage.tsx`
- Create: `src/pages/OnboardingPage.tsx`
- Create: `src/pages/OnboardingPage.test.tsx`
- Modify: `src/app/routes.tsx`

**Interfaces:**
- Consumes: `createEmptyVault`, `useVault`.
- Produces: onboarding completion state.

- [ ] **Step 1: Write failing onboarding test**

Assert that selecting `情侣` and submitting creates a vault with type `couple`.

- [ ] **Step 2: Implement welcome copy**

Headline: `每月存一点，年底得到一本只属于你们的回忆册。`

- [ ] **Step 3: Implement 3-step onboarding**

Step 1 name, Step 2 type, Step 3 theme and first prompt.

- [ ] **Step 4: Run tests**

```bash
npm run test -- --run src/pages/OnboardingPage.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/WelcomePage.tsx src/pages/OnboardingPage.tsx src/pages/OnboardingPage.test.tsx src/app/routes.tsx
git commit -m "feat: add onboarding flow"
```

---

### Task 8: Dashboard and new memory form

**Files:**
- Create: `src/pages/DashboardPage.tsx`
- Create: `src/pages/NewEntryPage.tsx`
- Create: `src/components/MemoryCard.tsx`
- Create: `src/components/MoodPicker.tsx`
- Create: `src/components/ImageUploader.tsx`
- Create: `src/pages/DashboardPage.test.tsx`
- Create: `src/pages/NewEntryPage.test.tsx`

**Interfaces:**
- Consumes: `useVault`, `compressImage`, `createMemoryEntry`.
- Produces: entry creation and free-limit gate.

- [ ] **Step 1: Write failing dashboard test**

Assert that the dashboard shows `本月已存入` and `连续存储`.

- [ ] **Step 2: Write failing free-limit test**

With a free plan and 3 entries, clicking `存入一笔` shows upgrade prompt instead of the form.

- [ ] **Step 3: Implement dashboard**

Show current month, streak, total entries, next prompt, recent entries, single primary CTA.

- [ ] **Step 4: Implement entry form**

Fields: date, title, text, mood, tags, photo, favorite, shared. Save to IndexedDB through context.

- [ ] **Step 5: Run tests**

```bash
npm run test -- --run src/pages/DashboardPage.test.tsx src/pages/NewEntryPage.test.tsx
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/DashboardPage.tsx src/pages/NewEntryPage.tsx src/components src/pages/*.test.tsx
git commit -m "feat: add dashboard and entry creation"
```

---

### Task 9: Timeline and memory detail

**Files:**
- Create: `src/pages/TimelinePage.tsx`
- Create: `src/pages/EntryDetailPage.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/pages/TimelinePage.test.tsx`

**Interfaces:**
- Consumes: `groupEntriesByMonth`, `useVault`.
- Produces: filtering by year/tag and editing/deleting entries.

- [ ] **Step 1: Write failing timeline test**

Assert entries appear under the correct month heading and search filters by text.

- [ ] **Step 2: Implement timeline**

Year selector, tag filter, search box, month groups, memory cards.

- [ ] **Step 3: Implement detail page**

Show image, text, mood, tags, favorite, edit, delete, share flag.

- [ ] **Step 4: Run tests**

```bash
npm run test -- --run src/pages/TimelinePage.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/TimelinePage.tsx src/pages/EntryDetailPage.tsx src/components/EmptyState.tsx src/pages/TimelinePage.test.tsx
git commit -m "feat: add timeline and entry detail"
```

---

### Task 10: Yearbook generator

**Files:**
- Create: `src/yearbook/buildYearbook.ts`
- Create: `src/yearbook/buildYearbook.test.ts`
- Create: `src/pages/YearbookPage.tsx`
- Create: `src/yearbook/yearbook.css`

**Interfaces:**
- Produces: `buildYearbookHtml(vault: Vault, year: number): string`, `downloadYearbook(vault: Vault, year: number): void`.

- [ ] **Step 1: Write failing yearbook test**

Assert generated HTML contains the year, cover title, total entry count, and each month heading.

- [ ] **Step 2: Implement HTML generator**

Self-contained HTML with inline CSS, embedded image data URLs, print styles, and no external assets.

- [ ] **Step 3: Implement yearbook page**

Year picker, cover preview, stats, monthly highlights, `下载年度册` and `打印` buttons.

- [ ] **Step 4: Run tests**

```bash
npm run test -- --run src/yearbook/buildYearbook.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/yearbook src/pages/YearbookPage.tsx
git commit -m "feat: add annual yearbook generator"
```

---

### Task 11: Encrypted backup and restore

**Files:**
- Create: `src/pages/BackupPage.tsx`
- Create: `src/backup/backup.ts`
- Create: `src/backup/backup.test.ts`

**Interfaces:**
- Produces: `createBackupFile(state: PersistedState, password: string): Promise<Blob>`, `readBackupFile(file: File, password: string): Promise<PersistedState>`.

- [ ] **Step 1: Write failing backup test**

Round-trip a persisted state through create/read and reject the wrong password.

- [ ] **Step 2: Implement backup format**

File header: `TIME_LEDGER_BACKUP_V1`. Store encrypted JSON payload.

- [ ] **Step 3: Implement backup page**

Export password, import file, import password, confirmation before replacing data.

- [ ] **Step 4: Run tests**

```bash
npm run test -- --run src/backup/backup.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/backup src/pages/BackupPage.tsx
git commit -m "feat: add encrypted backup and restore"
```

---

### Task 12: Pricing, activation, and plan limits

**Files:**
- Create: `src/pages/PricingPage.tsx`
- Create: `src/pages/PricingPage.test.tsx`
- Create: `src/license/ActivationForm.tsx`
- Create: `src/config/licensePublicKey.ts`

**Interfaces:**
- Consumes: `verifyLicense`, `useVault`.
- Produces: plan activation and expiration display.

- [ ] **Step 1: Write failing pricing test**

Assert prices `¥9.9`, `¥79`, `¥19.9` appear and free plan shows `最多3条`.

- [ ] **Step 2: Implement pricing cards**

Use transparent copy. No fake original price, no fake countdown.

- [ ] **Step 3: Implement activation form**

Copy device ID, enter activation code, show success/expired/device mismatch errors.

- [ ] **Step 4: Run tests**

```bash
npm run test -- --run src/pages/PricingPage.test.tsx
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/PricingPage.tsx src/pages/PricingPage.test.tsx src/license/ActivationForm.tsx src/config
git commit -m "feat: add pricing and activation"
```

---

### Task 13: Settings, privacy, help, and reminders

**Files:**
- Create: `src/pages/SettingsPage.tsx`
- Create: `src/pages/PrivacyPage.tsx`
- Create: `src/pages/HelpPage.tsx`
- Create: `src/reminders/buildReminderIcs.ts`
- Create: `src/reminders/buildReminderIcs.test.ts`

**Interfaces:**
- Produces: `buildReminderIcs(vaultName: string, startDate: Date): string`.

- [ ] **Step 1: Write failing ICS test**

Assert the generated calendar has 12 VEVENT blocks and monthly recurrence rules.

- [ ] **Step 2: Implement settings**

Vault name, theme, device ID copy, plan, delete-all confirmation.

- [ ] **Step 3: Implement privacy and help**

Explain local storage, backup, deletion, no cloud promise, refund contact.

- [ ] **Step 4: Implement reminder download**

Generate a 12-month `.ics` file users can add to their calendar.

- [ ] **Step 5: Run tests**

```bash
npm run test -- --run src/reminders/buildReminderIcs.test.ts
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/SettingsPage.tsx src/pages/PrivacyPage.tsx src/pages/HelpPage.tsx src/reminders
git commit -m "feat: add settings privacy and reminders"
```

---

### Task 14: PWA, GitHub Pages, and launch verification

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `public/manifest.webmanifest`
- Create: `public/icons/icon.svg`
- Modify: `vite.config.ts`
- Modify: `README.md`

**Interfaces:**
- Produces: live GitHub Pages deployment and installable PWA.

- [ ] **Step 1: Configure PWA manifest**

Name: `时光存折`，short name: `时光存折`，theme color: `#1f5a45`，display: `standalone`.

- [ ] **Step 2: Add GitHub Pages workflow**

Workflow runs `npm ci`, `npm run test -- --run`, `npm run build`, uploads `dist`, and deploys with GitHub Pages actions.

- [ ] **Step 3: Add README**

Include product description, price, local-first limitations, commands, and deployment URL.

- [ ] **Step 4: Run full verification**

```bash
npm run test -- --run
npm run build
```

- [ ] **Step 5: Commit and push**

```bash
git add .github public README.md vite.config.ts
git commit -m "chore: add PWA and GitHub Pages deployment"
git push origin main
```

- [ ] **Step 6: Verify live site**

Open the deployed URL and check:

- onboarding loads
- entry can be created
- timeline updates
- backup export works
- yearbook downloads
- mobile layout works

---

## Self-Review

- Spec coverage: product, local-first, subscription, encryption, yearbook, reminders, activation, PWA, and deployment each map to a task.
- Placeholder scan: no TBD or TODO remains.
- Type consistency: `MemoryEntry`, `Vault`, `PersistedState`, `VaultRepository`, and `verifyLicense` use consistent names across tasks.
- Scope: the plan is large but each task is independently testable and reviewable.
