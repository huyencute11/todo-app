import { test as base, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const EVIDENCE_DIR = process.env.DEVFLOW_EVIDENCE_DIR ?? 'docs/devflow/evidence'

type Evidence = { evidence: (name: string) => Promise<void> }

/** Saves a named full-page screenshot into the devflow evidence folder and the HTML report. */
export const test = base.extend<Evidence>({
  evidence: async ({ page }, provide, testInfo) => {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true })
    await provide(async (name: string) => {
      const file = path.join(EVIDENCE_DIR, `${name}.png`)
      await page.screenshot({ path: file, fullPage: true })
      await testInfo.attach(name, { path: file, contentType: 'image/png' })
    })
  },
})

export { expect }
