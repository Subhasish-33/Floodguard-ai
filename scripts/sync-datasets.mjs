import fs from 'node:fs/promises'
import path from 'node:path'

const args = process.argv.slice(2)
const sourceArgIndex = args.indexOf('--source')
const targetArgIndex = args.indexOf('--target')

const source = sourceArgIndex >= 0 ? args[sourceArgIndex + 1] : '../data'
const target = targetArgIndex >= 0 ? args[targetArgIndex + 1] : './public/data'

const cwd = process.cwd()
const sourcePath = path.resolve(cwd, source)
const targetPath = path.resolve(cwd, target)

const ensureDirectory = async (dir) => {
  await fs.mkdir(dir, { recursive: true })
}

const copyRecursive = async (from, to) => {
  await ensureDirectory(to)
  const entries = await fs.readdir(from, { withFileTypes: true })
  await Promise.all(
    entries.map(async (entry) => {
      const fromPath = path.join(from, entry.name)
      const toPath = path.join(to, entry.name)
      if (entry.isDirectory()) {
        await copyRecursive(fromPath, toPath)
      } else {
        await fs.copyFile(fromPath, toPath)
      }
    }),
  )
}

const createDefaultManifest = async () => {
  const manifestPath = path.join(targetPath, 'manifest.json')
  try {
    await fs.access(manifestPath)
  } catch {
    const manifest = {
      geojson: {
        stateBoundary: '/data/geojson/odisha-state.geojson',
        districts: '/data/geojson/odisha-districts.geojson',
      },
      dem: {
        grid: '/data/dem/odisha-dem.asc',
      },
    }
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
  }
}

const run = async () => {
  await ensureDirectory(sourcePath)
  await ensureDirectory(targetPath)
  await copyRecursive(sourcePath, targetPath)
  await createDefaultManifest()
  process.stdout.write(`Datasets synced: ${sourcePath} -> ${targetPath}\n`)
}

run().catch((error) => {
  process.stderr.write(`Dataset sync failed: ${error.message}\n`)
  process.exit(1)
})
