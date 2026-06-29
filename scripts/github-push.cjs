const https = require('https')
const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')
const TOKEN = process.argv[2]
const OWNER = 'supremoh81-ship-it'
const REPO = 'GGCC-WEBSITE'

const IGNORE = new Set([
  '.git', 'node_modules', '.next', 'out', 'build', '.vercel',
  'scripts', '.claude'
])

const IGNORE_FILES = new Set([
  'tsconfig.tsbuildinfo', 'next-env.d.ts'
])

function api(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null
    const opts = {
      hostname: 'api.github.com',
      path: apiPath,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'User-Agent': 'GGCC-Push',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    }
    const req = https.request(opts, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }) }
        catch { resolve({ status: res.statusCode, data: d }) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

function getAllFiles(dir, base) {
  const files = []
  for (const entry of fs.readdirSync(dir)) {
    if (IGNORE.has(entry) || entry.startsWith('.env')) continue
    if (IGNORE_FILES.has(entry)) continue
    const full = path.join(dir, entry)
    const rel = path.relative(base, full).replace(/\\/g, '/')
    try {
      if (fs.statSync(full).isDirectory()) {
        files.push(...getAllFiles(full, base))
      } else {
        files.push(rel)
      }
    } catch { /* skip inaccessible */ }
  }
  return files
}

async function run() {
  if (!TOKEN) { console.error('Usage: node scripts/github-push.cjs <token>'); process.exit(1) }

  const files = getAllFiles(ROOT, ROOT)
  console.log(`Found ${files.length} files to push`)

  // Get current remote HEAD
  const refRes = await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/main`)
  const remoteHead = refRes.status === 200 ? refRes.data.object.sha : null
  console.log('Remote HEAD:', remoteHead ? remoteHead.slice(0, 7) : 'none')

  let baseTreeSha = null
  if (remoteHead) {
    const commitRes = await api('GET', `/repos/${OWNER}/${REPO}/git/commits/${remoteHead}`)
    baseTreeSha = commitRes.data.tree?.sha
    console.log('Base tree:', baseTreeSha ? baseTreeSha.slice(0, 7) : 'none')
  }

  // Create blobs
  console.log('Uploading files...')
  const treeItems = []
  let done = 0
  for (const rel of files) {
    const content = fs.readFileSync(path.join(ROOT, rel))
    const b64 = content.toString('base64')
    const blobRes = await api('POST', `/repos/${OWNER}/${REPO}/git/blobs`, {
      content: b64,
      encoding: 'base64'
    })
    if (blobRes.status === 201) {
      treeItems.push({ path: rel, mode: '100644', type: 'blob', sha: blobRes.data.sha })
      done++
      if (done % 20 === 0) console.log(`  ${done}/${files.length} uploaded`)
    } else {
      console.warn(`  SKIP ${rel}: ${blobRes.status}`)
    }
  }
  console.log(`All ${done} blobs created`)

  // Create tree
  const treePayload = { tree: treeItems }
  if (baseTreeSha) treePayload.base_tree = baseTreeSha
  const treeRes = await api('POST', `/repos/${OWNER}/${REPO}/git/trees`, treePayload)
  if (!treeRes.data.sha) { console.error('Tree failed:', JSON.stringify(treeRes.data)); return }
  console.log('Tree:', treeRes.data.sha.slice(0, 7))

  // Create commit
  const commitPayload = {
    message: 'Initial commit: GGCC church platform — complete full-stack build',
    tree: treeRes.data.sha,
    author: { name: 'GGCC Development', email: 'dev@ggcc.church', date: new Date().toISOString() },
    parents: remoteHead ? [remoteHead] : []
  }
  const commitRes = await api('POST', `/repos/${OWNER}/${REPO}/git/commits`, commitPayload)
  if (!commitRes.data.sha) { console.error('Commit failed:', JSON.stringify(commitRes.data)); return }
  console.log('Commit:', commitRes.data.sha.slice(0, 7))

  // Update ref
  const updateRes = await api('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    sha: commitRes.data.sha,
    force: true
  })
  if (updateRes.status === 200) {
    console.log(`\nSUCCESS! Code is live at:\nhttps://github.com/${OWNER}/${REPO}`)
  } else {
    console.error('Ref update failed:', JSON.stringify(updateRes.data))
  }
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
