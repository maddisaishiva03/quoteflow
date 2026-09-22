import { db } from './db'

async function setupDatabase() {
  console.log('Creating customer_types table...')

  await db.execute(`
    CREATE TABLE IF NOT EXISTS customer_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type_name TEXT NOT NULL UNIQUE,
      markup_percentage REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('customer_types table created successfully!')

  const types = [
    ['Type A', 3],
    ['Type B', 5],
    ['Type C', 10],
    ['Type D', 20],
    ['Type E', 30],
  ]

  for (const [typeName, markup] of types) {
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO customer_types
        (type_name, markup_percentage)
        VALUES (?, ?)
      `,
      args: [typeName, markup],
    })
  }

  console.log('Default customer types inserted successfully!')

  const result = await db.execute(
    'SELECT * FROM customer_types ORDER BY id',
  )

  console.table(result.rows)

  process.exit(0)
}

setupDatabase().catch((error) => {
  console.error('Database setup failed:', error)
  process.exit(1)
})