import { db } from './db'

async function setupProductsTable() {
  console.log('Creating products table...')

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_code TEXT NOT NULL UNIQUE,
      product_name TEXT NOT NULL,
      cost_price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Products table created successfully!')

  process.exit(0)
}

setupProductsTable().catch((error) => {
  console.error('Products table setup failed:', error)
  process.exit(1)
})