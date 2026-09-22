import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Package,
  Tags,
  FileText,
  Settings,
  Pencil,
  Plus,
  X,
} from 'lucide-react'

type CustomerType = {
  id: number
  type_name: string
  markup_percentage: number
}

type Customer = {
  id: number
  customer_name: string
  phone: string
  customer_type_id: number
  type_name: string
  markup_percentage: number
}

type Product = {
  id: number
  product_code: string
  product_name: string
  cost_price: number
  stock_quantity: number
}

type QuotationItem = {
  productId: string
  quantity: string
}

type QuotationRow = {
  productId: number
  quantity: number
  costPrice: number
  markupAmount: number
  quotationPrice: number
  lineTotal: number
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  // ============================================================
  // CUSTOMER TYPES
  // ============================================================

  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([])

  // ============================================================
  // CUSTOMERS
  // ============================================================

  const [customers, setCustomers] = useState<Customer[]>([])

  const [showCustomerModal, setShowCustomerModal] = useState(false)

  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
    null,
  )

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerTypeId, setCustomerTypeId] = useState('')

  // ============================================================
  // PRODUCTS
  // ============================================================

  const [products, setProducts] = useState<Product[]>([])

  const [showProductModal, setShowProductModal] = useState(false)

  const [editingProductId, setEditingProductId] = useState<number | null>(
    null,
  )

  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')

  // ============================================================
  // QUOTATIONS
  // ============================================================

  const [quotationCustomerId, setQuotationCustomerId] = useState('')

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([
    {
      productId: '',
      quantity: '1',
    },
  ])

  const [savingQuotation, setSavingQuotation] = useState(false)

  // ============================================================
  // LOAD CUSTOMER TYPES
  // ============================================================

const loadCustomerTypes = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/customer-types',
    )

    const data = await response.json()

    setCustomerTypes(data)
  } catch (error) {
    console.error('Failed to load customer types:', error)
  }
}

  // ============================================================
  // LOAD CUSTOMERS
  // ============================================================
const loadCustomers = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/customers',
    )

    const data = await response.json()

    setCustomers(data)
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}
  // ============================================================
  // LOAD PRODUCTS
  // ============================================================

  const loadProducts = async () => {
  try {
    const response = await fetch(
      'http://localhost:3000/api/products',
    )

    const data = await response.json()

    setProducts(data)
  } catch (error) {
    console.error('Failed to load products:', error)
  }
}

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadCustomerTypes()
    loadCustomers()
    loadProducts()
  }, [])

  // ============================================================
  // CUSTOMER TYPE UPDATE
  // ============================================================

  const updateMarkup = async (
    id: number,
    markupPercentage: string,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/customer-types/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            markupPercentage: Number(markupPercentage),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to update markup')
        return
      }

      await loadCustomerTypes()
      await loadCustomers()
    } catch (error) {
      console.error('Failed to update markup:', error)
      alert('Something went wrong')
    }
  }

  // ============================================================
  // CUSTOMER FUNCTIONS
  // ============================================================

  const resetCustomerForm = () => {
    setCustomerName('')
    setCustomerPhone('')
    setCustomerTypeId('')
    setEditingCustomerId(null)
  }

  const openAddCustomer = () => {
    resetCustomerForm()
    setShowCustomerModal(true)
  }

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomerId(customer.id)
    setCustomerName(customer.customer_name)
    setCustomerPhone(customer.phone)
    setCustomerTypeId(String(customer.customer_type_id))
    setShowCustomerModal(true)
  }

  const saveCustomer = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name')
      return
    }

    if (!customerPhone.trim()) {
      alert('Please enter phone number')
      return
    }

    if (!customerTypeId) {
      alert('Please select customer type')
      return
    }

    try {
      const url = editingCustomerId
        ? `http://localhost:3000/api/customers/${editingCustomerId}`
        : 'http://localhost:3000/api/customers'

      const method = editingCustomerId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: customerPhone.trim(),
          customerTypeId: Number(customerTypeId),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to save customer')
        return
      }

      await loadCustomers()

      setShowCustomerModal(false)
      resetCustomerForm()
    } catch (error) {
      console.error('Failed to save customer:', error)
      alert('Something went wrong while saving customer')
    }
  }

  // ============================================================
  // PRODUCT FUNCTIONS
  // ============================================================

  const resetProductForm = () => {
    setProductCode('')
    setProductName('')
    setCostPrice('')
    setStockQuantity('')
    setEditingProductId(null)
  }

  const openAddProduct = () => {
    resetProductForm()
    setShowProductModal(true)
  }

  const openEditProduct = (product: Product) => {
    setEditingProductId(product.id)
    setProductCode(product.product_code)
    setProductName(product.product_name)
    setCostPrice(String(product.cost_price))
    setStockQuantity(String(product.stock_quantity))
    setShowProductModal(true)
  }

  const saveProduct = async () => {
    if (!productCode.trim()) {
      alert('Please enter product code')
      return
    }

    if (!productName.trim()) {
      alert('Please enter product name')
      return
    }

    if (!costPrice || Number(costPrice) < 0) {
      alert('Please enter a valid cost price')
      return
    }

    if (!stockQuantity || Number(stockQuantity) < 0) {
      alert('Please enter a valid stock quantity')
      return
    }

    try {
      const url = editingProductId
        ? `http://localhost:3000/api/products/${editingProductId}`
        : 'http://localhost:3000/api/products'

      const method = editingProductId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productCode: productCode.trim(),
          productName: productName.trim(),
          costPrice: Number(costPrice),
          stockQuantity: Number(stockQuantity),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to save product')
        return
      }

      await loadProducts()

      setShowProductModal(false)
      resetProductForm()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Something went wrong while saving product')
    }
  }

  // ============================================================
  // QUOTATION FUNCTIONS
  // ============================================================

  const selectedQuotationCustomer = customers.find(
    (customer) => customer.id === Number(quotationCustomerId),
  )

  const quotationMarkup =
    selectedQuotationCustomer?.markup_percentage ?? 0

  const addQuotationItem = () => {
    setQuotationItems((previousItems) => [
      ...previousItems,
      {
        productId: '',
        quantity: '1',
      },
    ])
  }

  const removeQuotationItem = (index: number) => {
    setQuotationItems((previousItems) =>
      previousItems.filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const updateQuotationItem = (
    index: number,
    field: 'productId' | 'quantity',
    value: string,
  ) => {
    setQuotationItems((previousItems) =>
      previousItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    )
  }

  const getQuotationRows = (): QuotationRow[] => {
    return quotationItems
      .filter((item) => item.productId)
      .map((item) => {
        const product = products.find(
          (product) => product.id === Number(item.productId),
        )

        if (!product) {
          return null
        }

        const quantity = Number(item.quantity) || 0

        const costPrice = Number(product.cost_price)

        const markupAmount =
          costPrice * (quotationMarkup / 100)

        const quotationPrice =
          costPrice + markupAmount

        const lineTotal =
          quotationPrice * quantity

        return {
          productId: product.id,
          quantity,
          costPrice,
          markupAmount,
          quotationPrice,
          lineTotal,
        }
      })
      .filter(
        (row): row is QuotationRow =>
          row !== null,
      )
  }

  const quotationRows = getQuotationRows()

  const quotationTotal = quotationRows.reduce(
    (total, row) => total + row.lineTotal,
    0,
  )

  const resetQuotationForm = () => {
    setQuotationCustomerId('')

    setQuotationItems([
      {
        productId: '',
        quantity: '1',
      },
    ])
  }

  const saveQuotation = async () => {
    if (!quotationCustomerId) {
      alert('Please select a customer')
      return
    }

    const validItems = quotationItems.filter(
      (item) =>
        item.productId &&
        Number(item.quantity) > 0 &&
        Number.isInteger(Number(item.quantity)),
    )

    if (validItems.length === 0) {
      alert('Please add at least one valid product')
      return
    }

    setSavingQuotation(true)

    try {
      const response = await fetch(
        'http://localhost:3000/api/quotations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: Number(quotationCustomerId),
            items: validItems.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
            })),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to create quotation')
        return
      }

      alert(
        `Quotation ${data.quotation.quotationNumber} created successfully`,
      )

      resetQuotationForm()
    } catch (error) {
      console.error('Failed to create quotation:', error)
      alert('Something went wrong while creating quotation')
    } finally {
      setSavingQuotation(false)
    }
  }

  // ============================================================
  // SELECTED CUSTOMER TYPE
  // ============================================================

  const selectedCustomerType = customerTypes.find(
    (type) => type.id === Number(customerTypeId),
  )

  // ============================================================
  // SIDEBAR
  // ============================================================

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Customers',
      icon: Users,
    },
    {
      name: 'Products',
      icon: Package,
    },
    {
      name: 'Customer Types',
      icon: Tags,
    },
    {
      name: 'Quotations',
      icon: FileText,
    },
    {
      name: 'Settings',
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside className="w-64 bg-gray-900 text-white">
        <div className="border-b border-gray-800 px-6 py-5">
          <h1 className="text-2xl font-bold">
            QuoteFlow
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Quotation Management
          </p>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon

            const active = activePage === item.name

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />

                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <main className="flex-1">
        {/* TOP BAR */}

        <header className="border-b bg-white px-8 py-5">
          <h2 className="text-2xl font-bold text-gray-800">
            {activePage}
          </h2>
        </header>

        <div className="p-8">
          {/* ================================================= */}
          {/* DASHBOARD */}
          {/* ================================================= */}

          {activePage === 'Dashboard' && (
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800">
                  Welcome to QuoteFlow
                </h3>

                <p className="mt-1 text-gray-500">
                  Manage customers, products and quotations.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Customers
                      </p>

                      <p className="mt-2 text-3xl font-bold text-gray-800">
                        {customers.length}
                      </p>
                    </div>

                    <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                      <Users size={24} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Products
                      </p>

                      <p className="mt-2 text-3xl font-bold text-gray-800">
                        {products.length}
                      </p>
                    </div>

                    <div className="rounded-lg bg-green-100 p-3 text-green-600">
                      <Package size={24} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        Customer Types
                      </p>

                      <p className="mt-2 text-3xl font-bold text-gray-800">
                        {customerTypes.length}
                      </p>
                    </div>

                    <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                      <Tags size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* CUSTOMERS */}
          {/* ================================================= */}

          {activePage === 'Customers' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Customers
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your customers and their customer types.
                  </p>
                </div>

                <button
                  onClick={openAddCustomer}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Customer
                </button>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Name
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Phone
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Customer Type
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Markup
                        </th>

                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {customers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-gray-500"
                          >
                            No customers found.
                          </td>
                        </tr>
                      ) : (
                        customers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="border-t border-gray-100"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {customer.customer_name}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {customer.phone}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {customer.type_name}
                            </td>

                            <td className="px-6 py-4 font-semibold text-blue-600">
                              {customer.markup_percentage}%
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() =>
                                  openEditCustomer(customer)
                                }
                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* PRODUCTS */}
          {/* ================================================= */}

          {activePage === 'Products' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Products
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage products, cost prices and stock.
                  </p>
                </div>

                <button
                  onClick={openAddProduct}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  <Plus size={18} />
                  Add Product
                </button>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Code
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Product
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                          Cost Price
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                          Stock
                        </th>

                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-gray-500"
                          >
                            No products found.
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-t border-gray-100"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {product.product_code}
                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {product.product_name}
                            </td>

                            <td className="px-6 py-4 text-right font-semibold text-gray-800">
                              ₹{Number(product.cost_price).toFixed(2)}
                            </td>

                            <td className="px-6 py-4 text-right text-gray-600">
                              {product.stock_quantity}
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() =>
                                  openEditProduct(product)
                                }
                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                              >
                                <Pencil size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* CUSTOMER TYPES */}
          {/* ================================================= */}

          {activePage === 'Customer Types' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Customer Types
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Configure markup percentage for each customer type.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Type
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Markup %
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Example
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {customerTypes.map((type) => (
                        <tr
                          key={type.id}
                          className="border-t border-gray-100"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {type.type_name}
                          </td>

                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              defaultValue={type.markup_percentage}
                              onBlur={(event) =>
                                updateMarkup(
                                  type.id,
                                  event.target.value,
                                )
                              }
                              className="w-28 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                          </td>

                          <td className="px-6 py-4 text-gray-500">
                            Cost ₹100 → Quotation ₹
                            {(
                              100 +
                              100 *
                                (type.markup_percentage / 100)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* QUOTATIONS */}
          {/* ================================================= */}

          {/* QUOTATIONS */}
            {activePage === 'Quotations' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Quotation
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Create a quotation for a customer
                </p>
              </div>

              {/* Customer Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                  Customer Details
                </h2>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Customer */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Customer
                    </label>

                    <select
                      value={quotationCustomerId}
                      onChange={(e) =>
                        setQuotationCustomerId(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select customer
                      </option>

                      {customers.map((customer) => (
                        <option
                          key={customer.id}
                          value={customer.id}
                        >
                          {customer.customer_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>

                    <input
                      type="text"
                      value={selectedQuotationCustomer?.phone ?? ''}
                      readOnly
                      placeholder="Customer mobile number"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Products
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Add products and quantities to the quotation
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addQuotationItem}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-left">
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Product
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Quantity
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Quotation Price
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                          Line Total
                        </th>

                        <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {quotationItems.map((item, index) => {
                        const row = quotationRows.find(
                          (quotationRow) =>
                            quotationRow.productId ===
                            Number(item.productId),
                        )

                        const selectedProduct = products.find(
                          (product) =>
                            product.id === Number(item.productId),
                        )

                        return (
                          <tr
                            key={index}
                            className="border-b border-gray-100"
                          >
                            {/* Product */}
                            <td className="px-4 py-4">
                              <select
                                value={item.productId}
                                onChange={(e) =>
                                  updateQuotationItem(
                                    index,
                                    'productId',
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="">
                                  Select product
                                </option>

                                {products.map((product) => (
                                  <option
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.product_name}
                                  </option>
                                ))}
                              </select>

                              {selectedProduct && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {selectedProduct.product_code}
                                </p>
                              )}
                            </td>

                            {/* Quantity */}
                            <td className="px-4 py-4">
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuotationItem(
                                    index,
                                    'quantity',
                                    e.target.value,
                                  )
                                }
                                className="w-24 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                            </td>

                            {/* Quotation Price */}
                            <td className="px-4 py-4">
                              <span className="font-medium text-gray-900">
                                {row
                                  ? `₹${row.quotationPrice.toFixed(2)}`
                                  : '—'}
                              </span>
                            </td>

                            {/* Line Total */}
                            <td className="px-4 py-4">
                              <span className="font-semibold text-gray-900">
                                {row
                                  ? `₹${row.lineTotal.toFixed(2)}`
                                  : '—'}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="px-4 py-4 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  removeQuotationItem(index)
                                }
                                disabled={quotationItems.length === 1}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Remove product"
                              >
                                <X size={18} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="mt-6 flex justify-end">
                  <div className="w-full max-w-sm space-y-3">
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-base font-medium text-gray-700">
                        Subtotal
                      </span>

                      <span className="text-lg font-semibold text-gray-900">
                        ₹{quotationTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-blue-600">
                        ₹{quotationTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveQuotation}
                  disabled={savingQuotation}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FileText size={18} />

                  {savingQuotation
                    ? 'Saving Quotation...'
                    : 'Save Quotation'}
                </button>
              </div>
            </div>
            )}

          {/* ================================================= */}
          {/* SETTINGS */}
          {/* ================================================= */}

          {activePage === 'Settings' && (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <Settings
                size={48}
                className="mx-auto mb-4 text-gray-400"
              />

              <h3 className="text-xl font-bold text-gray-800">
                Settings
              </h3>

              <p className="mt-2 text-gray-500">
                Application settings will be added later.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ===================================================== */}
      {/* CUSTOMER MODAL */}
      {/* ===================================================== */}

      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800">
                {editingCustomerId
                  ? 'Edit Customer'
                  : 'Add Customer'}
              </h3>

              <button
                onClick={() => {
                  setShowCustomerModal(false)
                  resetCustomerForm()
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="Enter customer name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Customer Type
                </label>

                <select
                  value={customerTypeId}
                  onChange={(event) =>
                    setCustomerTypeId(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select customer type
                  </option>

                  {customerTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.id}
                    >
                      {type.type_name} -{' '}
                      {type.markup_percentage}%
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomerType && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">
                    Selected markup
                  </p>

                  <p className="mt-1 text-xl font-bold text-blue-800">
                    {selectedCustomerType.markup_percentage}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => {
                  setShowCustomerModal(false)
                  resetCustomerForm()
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={saveCustomer}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                {editingCustomerId
                  ? 'Update Customer'
                  : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* PRODUCT MODAL */}
      {/* ===================================================== */}

      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800">
                {editingProductId
                  ? 'Edit Product'
                  : 'Add Product'}
              </h3>

              <button
                onClick={() => {
                  setShowProductModal(false)
                  resetProductForm()
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Code
                </label>

                <input
                  type="text"
                  value={productCode}
                  onChange={(event) =>
                    setProductCode(event.target.value)
                  }
                  placeholder="Example: PROD001"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  type="text"
                  value={productName}
                  onChange={(event) =>
                    setProductName(event.target.value)
                  }
                  placeholder="Enter product name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cost Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={costPrice}
                    onChange={(event) =>
                      setCostPrice(event.target.value)
                    }
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stockQuantity}
                    onChange={(event) =>
                      setStockQuantity(
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => {
                  setShowProductModal(false)
                  resetProductForm()
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={saveProduct}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                {editingProductId
                  ? 'Update Product'
                  : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App