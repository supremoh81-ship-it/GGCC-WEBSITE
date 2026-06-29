const sharp = require('sharp')
const path = require('path')

const INPUT = path.resolve(__dirname, '../public/images/logo-original.png')
const OUTPUT = path.resolve(__dirname, '../public/images/logo.png')

async function run() {
  // Resize to 512x512 first for efficient processing
  const resized = await sharp(INPUT)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = resized
  const { width, height, channels } = info
  const buf = Buffer.from(data)

  for (let i = 0; i < width * height; i++) {
    const r = buf[i * channels]
    const g = buf[i * channels + 1]
    const b = buf[i * channels + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max - min

    // Make near-white (low saturation, high brightness) transparent
    if (r > 230 && g > 230 && b > 230 && saturation < 30) {
      buf[i * channels + 3] = 0
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT)

  const stat = require('fs').statSync(OUTPUT)
  console.log(`Done: ${OUTPUT} (${(stat.size / 1024).toFixed(1)} KB)`)
}

run().catch(e => { console.error(e); process.exit(1) })
