import { send } from '../src/discord.js'

const WEBHOOK_ID = process.env.DISCORD_WEBHOOK_ID
const WEBHOOK_TOKEN = process.env.DISCORD_WEBHOOK_TOKEN

if (!WEBHOOK_ID || !WEBHOOK_TOKEN) {
  throw new Error('Missing DISCORD_WEBHOOK_ID or DISCORD_WEBHOOK_TOKEN env vars')
}

async function runTest(label, commits, { repo = 'thomasbnt/classic-discord-webhook', branch = 'main', compareUrl = 'https://github.com/thomasbnt/classic-discord-webhook/compare/abc123...def456', threadId } = {}) {
  console.log(`\n── ${label} ──`)
  try {
    await send(WEBHOOK_ID, WEBHOOK_TOKEN, repo, branch, compareUrl, commits, threadId)
    console.log('✓ OK')
  } catch (err) {
    console.error(`✗ FAIL: ${err.message}`)
  }
}

const baseCommit = {
  id: 'abc1234567890abcdef',
  url: 'https://github.com/thomasbnt/classic-discord-webhook/commit/abc1234',
  message: 'fix: correct embed color',
  timestamp: new Date().toISOString(),
  author: { username: 'thomasbnt' },
}

const longMessageCommit = {
  id: 'bcd2345678901bcdef0',
  url: 'https://github.com/thomasbnt/classic-discord-webhook/commit/bcd2345',
  message: 'feat: add support for very long commit messages that exceed the maximum allowed subject line length defined by git convention',
  timestamp: new Date().toISOString(),
  author: { username: 'thomasbnt' },
}

const unknownAuthorCommit = {
  id: 'cde3456789012cdef01',
  url: 'https://github.com/thomasbnt/classic-discord-webhook/commit/cde3456',
  message: 'chore: update dependencies',
  timestamp: new Date().toISOString(),
  author: null,
}

const manyCommits = Array.from({ length: 11 }, (_, i) => ({
  id: `${String(i).padStart(3, '0')}abcdefghijklmnopqrs`,
  url: `https://github.com/thomasbnt/classic-discord-webhook/commit/${String(i).padStart(3, '0')}abcde`,
  message: `feat: commit number ${i + 1}`,
  timestamp: new Date(Date.now() - i * 60000).toISOString(),
  author: { username: 'thomasbnt' },
}))

async function main() {
  await runTest('1 commit — auteur connu', [baseCommit])
  await new Promise(r => setTimeout(r, 2000))

  await runTest('Message tronqué (>72 chars)', [longMessageCommit])
  await new Promise(r => setTimeout(r, 2000))

  await runTest('Auteur inconnu (null)', [unknownAuthorCommit])
  await new Promise(r => setTimeout(r, 2000))

  await runTest('11 commits — affiche "+ X more..."', manyCommits)
  await new Promise(r => setTimeout(r, 2000))

  await runTest('Plusieurs commits mixtes', [baseCommit, longMessageCommit, unknownAuthorCommit])
}

main()
