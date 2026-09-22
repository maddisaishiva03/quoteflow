import express from 'express'
import cors from 'cors'
import { db } from './db'

const app = express()

app.use(cors())
app.use(express.json())

// =====================================================
// TEST DATABASE CONNECTION
// =====================================================

app.get('/api/test-db', async (_req, res) => {
  try {
    const result = await db.execute('SELECT 1 AS connected')

    res.json({
      success: true,
      message: 'QuoteFlow connected to Turso successfully!',
      result: result.rows,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    })
  }
})

// =====================================================
// CUSTOMER TYPES
// =====================================================

// GET ALL CUSTOMER TYPES
app.get('/api/customer-types', async (_req, res) => {
  try {
    const result = await db.execute(`
      SELECT
        id,
        type_name,
        markup_percentage
      FROM customer_types
      ORDER BY id
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer types',
    })
  }
})

// UPDATE CUSTOMER TYPE MARKUP
app.put('/api/customer-types/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const markup = Number(req.body.markup)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer type ID',
      })
    }

    if (Number.isNaN(markup) || markup < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid markup percentage',
      })
    }

    await db.execute({
      sql: `
        UPDATE customer_types
        SET markup_percentage = ?
        WHERE id = ?
      `,
      args: [markup, id],
    })

    const result = await db.execute({
      sql: `
        SELECT
          id,
          type_name,
          markup_percentage
        FROM customer_types
        WHERE id = ?
      `,
      args: [id],
    })

    res.json({
      success: true,
      customerType: result.rows[0],
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to update customer type',
    })
  }
})

// =====================================================
// CUSTOMERS
// =====================================================

// GET ALL CUSTOMERS
app.get('/api/customers', async (_req, res) => {
  try {
    const result = await db.execute(`
      SELECT
        customers.id,
        customers.customer_name,
        customers.phone,
        customers.customer_type_id,
        customer_types.type_name,
        customer_types.markup_percentage
      FROM customers
      JOIN customer_types
        ON customers.customer_type_id = customer_types.id
      ORDER BY customers.id DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
    })
  }
})

// ADD CUSTOMER
app.post('/api/customers', async (req, res) => {
  try {
    const customerName = String(req.body.customerName ?? '').trim()
    const phone = String(req.body.phone ?? '').trim()
    const customerTypeId = Number(req.body.customerTypeId)

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
      })
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      })
    }

    if (!Number.isInteger(customerTypeId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer type is required',
      })
    }

    const customerType = await db.execute({
      sql: `
        SELECT id
        FROM customer_types
        WHERE id = ?
      `,
      args: [customerTypeId],
    })

    if (customerType.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer type does not exist',
      })
    }

    const result = await db.execute({
      sql: `
        INSERT INTO customers
        (customer_name, phone, customer_type_id)
        VALUES (?, ?, ?)
      `,
      args: [customerName, phone, customerTypeId],
    })

    res.status(201).json({
      success: true,
      customer: {
        id: Number(result.lastInsertRowid),
        customerName,
        phone,
        customerTypeId,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
    })
  }
})

// EDIT CUSTOMER
app.put('/api/customers/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const customerName = String(req.body.customerName ?? '').trim()
    const phone = String(req.body.phone ?? '').trim()
    const customerTypeId = Number(req.body.customerTypeId)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID',
      })
    }

    if (!customerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
      })
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      })
    }

    if (!Number.isInteger(customerTypeId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer type is required',
      })
    }

    const customerType = await db.execute({
      sql: `
        SELECT id
        FROM customer_types
        WHERE id = ?
      `,
      args: [customerTypeId],
    })

    if (customerType.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer type does not exist',
      })
    }

    await db.execute({
      sql: `
        UPDATE customers
        SET
          customer_name = ?,
          phone = ?,
          customer_type_id = ?
        WHERE id = ?
      `,
      args: [
        customerName,
        phone,
        customerTypeId,
        id,
      ],
    })

    res.json({
      success: true,
      message: 'Customer updated successfully',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
    })
  }
})

// =====================================================
// PRODUCTS
// =====================================================

// GET ALL PRODUCTS
app.get('/api/products', async (_req, res) => {
  try {
    const result = await db.execute(`
      SELECT
        id,
        product_code,
        product_name,
        cost_price,
        stock_quantity
      FROM products
      ORDER BY id DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
    })
  }
})

// ADD PRODUCT
app.post('/api/products', async (req, res) => {
  try {
    const productCode = String(req.body.productCode ?? '').trim()
    const productName = String(req.body.productName ?? '').trim()
    const costPrice = Number(req.body.costPrice)
    const stockQuantity = Number(req.body.stockQuantity)

    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: 'Product code is required',
      })
    }

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      })
    }

    if (Number.isNaN(costPrice) || costPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid cost price is required',
      })
    }

    if (
      Number.isNaN(stockQuantity) ||
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required',
      })
    }

    const existingProduct = await db.execute({
      sql: `
        SELECT id
        FROM products
        WHERE product_code = ?
      `,
      args: [productCode],
    })

    if (existingProduct.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Product code already exists',
      })
    }

    const result = await db.execute({
      sql: `
        INSERT INTO products
        (
          product_code,
          product_name,
          cost_price,
          stock_quantity
        )
        VALUES (?, ?, ?, ?)
      `,
      args: [
        productCode,
        productName,
        costPrice,
        stockQuantity,
      ],
    })

    res.status(201).json({
      success: true,
      product: {
        id: Number(result.lastInsertRowid),
        productCode,
        productName,
        costPrice,
        stockQuantity,
      },
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
    })
  }
})

// EDIT PRODUCT
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)

    const productCode = String(req.body.productCode ?? '').trim()
    const productName = String(req.body.productName ?? '').trim()
    const costPrice = Number(req.body.costPrice)
    const stockQuantity = Number(req.body.stockQuantity)

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      })
    }

    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: 'Product code is required',
      })
    }

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      })
    }

    if (Number.isNaN(costPrice) || costPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid cost price is required',
      })
    }

    if (
      Number.isNaN(stockQuantity) ||
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required',
      })
    }

    const existingProduct = await db.execute({
      sql: `
        SELECT id
        FROM products
        WHERE product_code = ?
        AND id != ?
      `,
      args: [productCode, id],
    })

    if (existingProduct.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Product code already exists',
      })
    }

    const product = await db.execute({
      sql: `
        SELECT id
        FROM products
        WHERE id = ?
      `,
      args: [id],
    })

    if (product.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    await db.execute({
      sql: `
        UPDATE products
        SET
          product_code = ?,
          product_name = ?,
          cost_price = ?,
          stock_quantity = ?
        WHERE id = ?
      `,
      args: [
        productCode,
        productName,
        costPrice,
        stockQuantity,
        id,
      ],
    })

    res.json({
      success: true,
      message: 'Product updated successfully',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: 'Failed to update product',
    })
  }
})

// =====================================================
// QUOTATIONS
// =====================================================

type QuotationItem = {
  productId: number
  quantity: number
  costPrice: number
  markupPercentage: number
  quotationPrice: number
  lineTotal: number
}

// CREATE QUOTATION
app.post('/api/quotations', async (req, res) => {
  try {
    const customerId = Number(req.body.customerId)
    const items: Array<{
      productId: number
      quantity: number
    }> = req.body.items

    // -------------------------------------------------
    // Validate customer
    // -------------------------------------------------

    if (!Number.isInteger(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid customer is required',
      })
    }

    // -------------------------------------------------
    // Validate items
    // -------------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product is required',
      })
    }

    // -------------------------------------------------
    // Get customer and current markup
    // -------------------------------------------------

    const customerResult = await db.execute({
      sql: `
        SELECT
          c.id,
          c.customer_name,
          c.customer_type_id,
          ct.type_name,
          ct.markup_percentage
        FROM customers c
        INNER JOIN customer_types ct
          ON c.customer_type_id = ct.id
        WHERE c.id = ?
      `,
      args: [customerId],
    })

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      })
    }

    const customer = customerResult.rows[0]

    const customerTypeId = Number(
      customer.customer_type_id
    )

    const markupPercentage = Number(
      customer.markup_percentage
    )

    // -------------------------------------------------
    // Calculate quotation items
    // -------------------------------------------------

    const quotationItems: QuotationItem[] = []

    let subtotal = 0

    for (const item of items) {
      const productId = Number(item.productId)
      const quantity = Number(item.quantity)

      if (!Number.isInteger(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product',
        })
      }

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive integer',
        })
      }

      // -------------------------------------------------
      // Get product from database
      // -------------------------------------------------

      const productResult = await db.execute({
        sql: `
          SELECT
            id,
            product_code,
            product_name,
            cost_price
          FROM products
          WHERE id = ?
        `,
        args: [productId],
      })

      if (productResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} not found`,
        })
      }

      const product = productResult.rows[0]

      const costPrice = Number(product.cost_price)

      // -------------------------------------------------
      // Calculate quotation price
      // -------------------------------------------------

      const markupAmount =
        costPrice * (markupPercentage / 100)

      const quotationPrice =
        costPrice + markupAmount

      const lineTotal =
        quotationPrice * quantity

      subtotal += lineTotal

      quotationItems.push({
        productId,
        quantity,
        costPrice,
        markupPercentage,
        quotationPrice,
        lineTotal,
      })
    }

    // V1 has no tax or discount
    const total = subtotal

    // -------------------------------------------------
    // Generate quotation number
    // Example: QT-20260922-001
    // -------------------------------------------------

    const now = new Date()

    const datePart =
      `${now.getFullYear()}${String(
        now.getMonth() + 1
      ).padStart(2, '0')}${String(
        now.getDate()
      ).padStart(2, '0')}`

    const countResult = await db.execute(`
      SELECT COUNT(*) AS count
      FROM quotations
    `)

    const quotationCount =
      Number(countResult.rows[0].count) + 1

    const quotationNumber =
      `QT-${datePart}-${String(
        quotationCount
      ).padStart(3, '0')}`

    // -------------------------------------------------
    // Save quotation
    // -------------------------------------------------

    const quotationResult = await db.execute({
      sql: `
        INSERT INTO quotations
        (
          quotation_number,
          customer_id,
          customer_type_id,
          markup_percentage,
          subtotal,
          total
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        quotationNumber,
        customerId,
        customerTypeId,
        markupPercentage,
        subtotal,
        total,
      ],
    })

    const quotationId =
      Number(quotationResult.lastInsertRowid)

    // -------------------------------------------------
    // Save quotation items
    // -------------------------------------------------

    for (const item of quotationItems) {
      await db.execute({
        sql: `
          INSERT INTO quotation_items
          (
            quotation_id,
            product_id,
            quantity,
            cost_price,
            markup_percentage,
            quotation_price,
            line_total
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          quotationId,
          item.productId,
          item.quantity,
          item.costPrice,
          item.markupPercentage,
          item.quotationPrice,
          item.lineTotal,
        ],
      })
    }

    // -------------------------------------------------
    // Return created quotation
    // -------------------------------------------------

    res.status(201).json({
      success: true,
      message: 'Quotation created successfully',

      quotation: {
        id: quotationId,
        quotationNumber,
        customerId,
        customerTypeId,
        markupPercentage,
        subtotal,
        total,
        items: quotationItems,
      },
    })
  } catch (error) {
    console.error('Create quotation error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create quotation',
    })
  }
})

// =====================================================
// START SERVER
// =====================================================

const PORT = 3000

app.listen(PORT, () => {
  console.log(`QuoteFlow backend running on http://localhost:${PORT}`)
})