const fs = require('node:fs/promises')
const path = require('node:path')
const { createSeed } = require('./seed')

const dataDir = path.join(__dirname, '..', 'data')
const dataFile = path.join(dataDir, 'db.json')

let writeQueue = Promise.resolve()

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch (error) {
    await writeDb(createSeed())
  }
}

async function readDb() {
  await ensureStore()
  return JSON.parse(await fs.readFile(dataFile, 'utf8'))
}

function writeDb(db) {
  const operation = writeQueue.then(async () => {
    await fs.mkdir(dataDir, { recursive: true })
    const tempFile = `${dataFile}.${process.pid}.tmp`
    await fs.writeFile(tempFile, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
    await fs.rename(tempFile, dataFile)
  })
  writeQueue = operation.catch(() => {})
  return operation
}

async function updateDb(mutator) {
  const db = await readDb()
  const result = await mutator(db)
  await writeDb(db)
  return result === undefined ? db : result
}

async function resetDb() {
  const db = createSeed()
  await writeDb(db)
  return db
}

module.exports = { dataFile, ensureStore, readDb, writeDb, updateDb, resetDb }
