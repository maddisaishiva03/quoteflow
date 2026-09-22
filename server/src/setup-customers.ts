import { db } from './db'

async function setupCustomersTable() {
  console.log('Creating customers table...')

  await db.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      customer_type_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (customer_type_id)
      REFERENCES customer_types(id)
    )
  `)

  console.log('Customers table created successfully!')

  process.exit(0)
}

setupCustomersTable().catch((error) => {
  console.error('Customers table setup failed:', error)
  process.exit(1)
})