/**
 * Push GGCC website to GitHub using isomorphic-git (no git installation needed).
 *
 * Usage:
 *   node scripts/push-to-github.mjs <github-token>
 *
 * Example:
 *   node scripts/push-to-github.mjs ghp_xxxxxxxxxxxxxxxxxxxx
 */

import git from 'isomorphic-git'
import http from 'isomorphic-git/http/node/index.cjs'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const REPO_URL = 'https://github.com/supremoh81-ship-it/GGCC-WEBSITE.git'
const BRANCH = 'main'

const token = process.argv[2]
if (!token) {
  console.error('Usage: node scripts/push-to-github.mjs <github-token>')
  console.error('\nGet a token at: https://github.com/settings/tokens (needs repo scope)')
  process.exit(1)
}

const onAuth = () => ({ username: token, password: 'x-oauth-basic' })

async function run() {
  console.log('Initializing git repository...')

  await git.init({ fs, dir: ROOT, defaultBranch: BRANCH })

  console.log('Staging all files...')
  await git.add({ fs, dir: ROOT, filepath: '.' })

  const status = await git.statusMatrix({ fs, dir: ROOT })
  const staged = status.filter(([, , worktree]) => worktree !== 1)
  console.log(`Staged ${staged.length} files`)

  console.log('Creating commit...')
  await git.commit({
    fs,
    dir: ROOT,
    message: 'Initial commit: GGCC church platform',
    author: {
      name: 'GGCC Development',
      email: 'dev@ggcc.church',
    },
  })

  console.log('Adding remote...')
  try {
    await git.addRemote({ fs, dir: ROOT, remote: 'origin', url: REPO_URL })
  } catch {
    await git.deleteRemote({ fs, dir: ROOT, remote: 'origin' })
    await git.addRemote({ fs, dir: ROOT, remote: 'origin', url: REPO_URL })
  }

  console.log('Pushing to GitHub...')
  await git.push({
    fs,
    http,
    dir: ROOT,
    remote: 'origin',
    ref: BRANCH,
    onAuth,
    onProgress: (progress) => {
      if (progress.phase) process.stdout.write(`\r${progress.phase}: ${progress.loaded ?? ''}/${progress.total ?? ''}  `)
    },
  })

  console.log('\nSuccessfully pushed to GitHub.')
  console.log(`View at: https://github.com/supremoh81-ship-it/GGCC-WEBSITE`)
}

run().catch((err) => {
  console.error('\nPush failed:', err.message)
  process.exit(1)
})
