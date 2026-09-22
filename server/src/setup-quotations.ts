import { db } from './db'

async function setupQuotationsTables() {
  console.log('Creating quotations table...')

  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_number TEXT NOT NULL UNIQUE,
      customer_id INTEGER NOT NULL,
      customer_type_id INTEGER NOT NULL,
      markup_percentage REAL NOT NULL,
      subtotal REAL NOT NULL,
      total REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (customer_id)
      REFERENCES customers(id),

      FOREIGN KEY (customer_type_id)
      REFERENCES customer_types(id)
    )
  `)

  console.log('Quotations table created successfully!')

  console.log('Creating quotation_items table...')

  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      cost_price REAL NOT NULL,
      markup_percentage REAL NOT NULL,
      quotation_price REAL NOT NULL,
      line_total REAL NOT NULL,

      FOREIGN KEY (quotation_id)
      REFERENCES quotations(id),

      FOREIGN KEY (product_id)
      REFERENCES products(id)
    )
  `)

  console.log('Quotation items table created successfully!')

  process.exit(0)
}

setupQuotationsTables().catch((error) => {
  console.error('Quotation tables setup failed:', error)
  process.exit(1)
})