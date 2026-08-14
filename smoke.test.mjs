import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'

test('public bundle contains the four journey phases and original prompts', async () => {
  const html = await readFile(new URL('./public/index.html', import.meta.url), 'utf8')
  const prompts = JSON.parse(await readFile(new URL('./public/prompts.json', import.meta.url), 'utf8'))
  for (const phase of ['gate', 'story', 'scene', 'leave']) assert.match(html, new RegExp(`data-panel="${phase}"`))
  assert.equal(prompts.prompts.length, 3)
  assert.ok(prompts.prompts.every(p => p.rating === '18+' && p.system.includes('成年')))
})

test('standalone server serves the app and rejects missing paths', async (t) => {
  const port = 43173
  const child = spawn(process.execPath, ['server.mjs'], { cwd: new URL('.', import.meta.url), env: { ...process.env, PORT: String(port) }, stdio: 'ignore' })
  t.after(() => child.kill('SIGTERM'))
  let ready = false
  for (let i = 0; i < 30; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/`); if (r.ok) { ready = true; break } } catch {}
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  assert.equal(ready, true)
  assert.equal((await fetch(`http://127.0.0.1:${port}/prompts.json`)).status, 200)
  assert.equal((await fetch(`http://127.0.0.1:${port}/missing`)).status, 404)
})
