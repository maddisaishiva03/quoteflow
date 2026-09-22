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
  name: string
  markup: number
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

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  // CUSTOMER TYPES
  const [customerTypes, setCustomerTypes] = useState<CustomerType[]>([])
  const [loadingTypes, setLoadingTypes] = useState(true)

  // CUSTOMERS
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState<number | null>(
    null,
  )

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [customerTypeId, setCustomerTypeId] = useState('')

  // PRODUCTS
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProductId, setEditingProductId] = useState<number | null>(
    null,
  )

  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [stockQuantity, setStockQuantity] = useState('')

  // -----------------------------
  // LOAD CUSTOMER TYPES
  // -----------------------------
  useEffect(() => {
    fetch('http://localhost:3000/api/customer-types')
      .then((response) => response.json())
      .then((data) => {
        const formattedTypes = data.map(
          (type: {
            id: number
            type_name: string
            markup_percentage: number
          }) => ({
            id: type.id,
            name: type.type_name,
            markup: type.markup_percentage,
          }),
        )

        setCustomerTypes(formattedTypes)
      })
      .catch((error) => {
        console.error('Failed to load customer types:', error)
      })
      .finally(() => {
        setLoadingTypes(false)
      })
  }, [])

  // -----------------------------
  // LOAD CUSTOMERS
  // -----------------------------
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = () => {
    setLoadingCustomers(true)

    fetch('http://localhost:3000/api/customers')
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data)
      })
      .catch((error) => {
        console.error('Failed to load customers:', error)
      })
      .finally(() => {
        setLoadingCustomers(false)
      })
  }

  // -----------------------------
  // LOAD PRODUCTS
  // -----------------------------
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    setLoadingProducts(true)

    fetch('http://localhost:3000/api/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.error('Failed to load products:', error)
      })
      .finally(() => {
        setLoadingProducts(false)
      })
  }

  // -----------------------------
  // UPDATE MARKUP
  // -----------------------------
  const updateMarkup = async (id: number, markup: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/customer-types/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            markup,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to update markup')
        return
      }

      setCustomerTypes((previousTypes) =>
        previousTypes.map((type) =>
          type.id === id ? { ...type, markup } : type,
        ),
      )

      alert('Markup updated successfully')
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  // ============================================================
  // CUSTOMER FUNCTIONS
  // ============================================================

  const resetCustomerForm = () => {
    setCustomerName('')
    setPhone('')
    setCustomerTypeId('')
    setEditingCustomerId(null)
    setShowCustomerModal(false)
  }

  const openAddCustomer = () => {
    setCustomerName('')
    setPhone('')
    setCustomerTypeId('')
    setEditingCustomerId(null)
    setShowCustomerModal(true)
  }

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomerId(customer.id)
    setCustomerName(customer.customer_name)
    setPhone(customer.phone)
    setCustomerTypeId(customer.customer_type_id.toString())
    setShowCustomerModal(true)
  }

  const addCustomer = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name')
      return
    }

    if (!phone.trim()) {
      alert('Please enter phone number')
      return
    }

    if (!customerTypeId) {
      alert('Please select customer type')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/customers',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName,
            phone,
            customerTypeId: Number(customerTypeId),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to add customer')
        return
      }

      alert('Customer added successfully')

      resetCustomerForm()
      loadCustomers()
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  const editCustomer = async () => {
    if (editingCustomerId === null) {
      return
    }

    if (!customerName.trim()) {
      alert('Please enter customer name')
      return
    }

    if (!phone.trim()) {
      alert('Please enter phone number')
      return
    }

    if (!customerTypeId) {
      alert('Please select customer type')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/${editingCustomerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName,
            phone,
            customerTypeId: Number(customerTypeId),
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to update customer')
        return
      }

      alert('Customer updated successfully')

      resetCustomerForm()
      loadCustomers()
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  const selectedCustomerType = customerTypes.find(
    (type) => type.id === Number(customerTypeId),
  )

  // ============================================================
  // PRODUCT FUNCTIONS
  // ============================================================

  const resetProductForm = () => {
    setProductCode('')
    setProductName('')
    setCostPrice('')
    setStockQuantity('')
    setEditingProductId(null)
    setShowProductModal(false)
  }

  const openAddProduct = () => {
    setProductCode('')
    setProductName('')
    setCostPrice('')
    setStockQuantity('')
    setEditingProductId(null)
    setShowProductModal(true)
  }

  const openEditProduct = (product: Product) => {
    setEditingProductId(product.id)
    setProductCode(product.product_code)
    setProductName(product.product_name)
    setCostPrice(product.cost_price.toString())
    setStockQuantity(product.stock_quantity.toString())
    setShowProductModal(true)
  }

  const addProduct = async () => {
    if (!productCode.trim()) {
      alert('Please enter product code')
      return
    }

    if (!productName.trim()) {
      alert('Please enter product name')
      return
    }

    const price = Number(costPrice)
    const stock = Number(stockQuantity)

    if (costPrice === '' || Number.isNaN(price) || price < 0) {
      alert('Please enter a valid cost price')
      return
    }

    if (
      stockQuantity === '' ||
      Number.isNaN(stock) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      alert('Please enter a valid stock quantity')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3000/api/products',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productCode,
            productName,
            costPrice: price,
            stockQuantity: stock,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to add product')
        return
      }

      alert('Product added successfully')

      resetProductForm()
      loadProducts()
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  const editProduct = async () => {
    if (editingProductId === null) {
      return
    }

    if (!productCode.trim()) {
      alert('Please enter product code')
      return
    }

    if (!productName.trim()) {
      alert('Please enter product name')
      return
    }

    const price = Number(costPrice)
    const stock = Number(stockQuantity)

    if (costPrice === '' || Number.isNaN(price) || price < 0) {
      alert('Please enter a valid cost price')
      return
    }

    if (
      stockQuantity === '' ||
      Number.isNaN(stock) ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      alert('Please enter a valid stock quantity')
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${editingProductId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productCode,
            productName,
            costPrice: price,
            stockQuantity: stock,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Failed to update product')
        return
      }

      alert('Product updated successfully')

      resetProductForm()
      loadProducts()
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  // -----------------------------
  // SIDEBAR MENU
  // -----------------------------
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
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 text-white">
          <div className="border-b border-slate-700 px-6 py-5">
            <h1 className="text-2xl font-bold">QuoteFlow</h1>
            <p className="mt-1 text-sm text-slate-400">
              Quotation Management
            </p>
          </div>

          <nav className="p-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.name

              return (
                <button
                  key={item.name}
                  onClick={() => setActivePage(item.name)}
                  className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1">
          <header className="border-b bg-white px-8 py-5">
            <h2 className="text-2xl font-bold text-gray-800">
              {activePage}
            </h2>
          </header>

          <div className="p-8">
            {/* ========================= */}
            {/* DASHBOARD */}
            {/* ========================= */}
            {activePage === 'Dashboard' && (
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">
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
                          Today's Quotations
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-800">
                          0
                        </p>
                      </div>

                      <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                        <FileText size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Total Customers
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-800">
                          {customers.length}
                        </p>
                      </div>

                      <div className="rounded-lg bg-green-100 p-3 text-green-600">
                        <Users size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Total Products
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-800">
                          {products.length}
                        </p>
                      </div>

                      <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                        <Package size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================= */}
            {/* CUSTOMERS */}
            {/* ========================= */}
            {activePage === 'Customers' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Customers
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Manage your customers and their markup types.
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
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Customer
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
                      {loadingCustomers ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-gray-500"
                          >
                            Loading customers...
                          </td>
                        </tr>
                      ) : customers.length === 0 ? (
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

                            <td className="px-6 py-4">
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                {customer.type_name}
                              </span>
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                              {customer.markup_percentage}%
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() =>
                                  openEditCustomer(customer)
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================= */}
            {/* PRODUCTS */}
            {/* ========================= */}
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
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Product Code
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Product Name
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Cost Price
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Stock
                        </th>

                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loadingProducts ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-10 text-center text-gray-500"
                          >
                            Loading products...
                          </td>
                        </tr>
                      ) : products.length === 0 ? (
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

                            <td className="px-6 py-4 text-gray-700">
                              {product.product_name}
                            </td>

                            <td className="px-6 py-4 font-medium text-gray-800">
                              ₹{product.cost_price.toFixed(2)}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`font-medium ${
                                  product.stock_quantity === 0
                                    ? 'text-red-600'
                                    : product.stock_quantity <= 5
                                      ? 'text-orange-600'
                                      : 'text-green-600'
                                }`}
                              >
                                {product.stock_quantity}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() =>
                                  openEditProduct(product)
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================= */}
            {/* CUSTOMER TYPES */}
            {/* ========================= */}
            {activePage === 'Customer Types' && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Customer Types
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Configure markup percentages for each customer type.
                    </p>
                  </div>

                  <button
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                    onClick={() =>
                      alert('Add Type feature coming next')
                    }
                  >
                    <Plus size={18} />
                    Add Type
                  </button>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Type
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                          Markup %
                        </th>

                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loadingTypes ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-10 text-center text-gray-500"
                          >
                            Loading customer types...
                          </td>
                        </tr>
                      ) : (
                        customerTypes.map((type) => (
                          <tr
                            key={type.id}
                            className="border-t border-gray-100"
                          >
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {type.name}
                            </td>

                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-800">
                                {type.markup}%
                              </span>
                            </td>

                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => {
                                  const newMarkup = window.prompt(
                                    `Enter markup percentage for ${type.name}`,
                                    type.markup.toString(),
                                  )

                                  if (newMarkup !== null) {
                                    const value = Number(newMarkup)

                                    if (
                                      Number.isNaN(value) ||
                                      value < 0
                                    ) {
                                      alert(
                                        'Please enter a valid markup percentage.',
                                      )
                                      return
                                    }

                                    updateMarkup(type.id, value)
                                  }
                                }}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================= */}
            {/* QUOTATIONS */}
            {/* ========================= */}
            {activePage === 'Quotations' && (
              <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                <FileText
                  size={48}
                  className="mx-auto mb-4 text-gray-400"
                />

                <h3 className="text-xl font-bold text-gray-800">
                  Quotations
                </h3>

                <p className="mt-2 text-gray-500">
                  Quotation management will be built after products.
                </p>
              </div>
            )}

            {/* ========================= */}
            {/* SETTINGS */}
            {/* ========================= */}
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
                  Settings will be added later.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ====================================================== */}
      {/* CUSTOMER MODAL */}
      {/* ====================================================== */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingCustomerId === null
                    ? 'Add Customer'
                    : 'Edit Customer'}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {editingCustomerId === null
                    ? 'Create a new customer'
                    : 'Update customer details'}
                </p>
              </div>

              <button
                onClick={resetCustomerForm}
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
                  Phone Number
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
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
                    setCustomerTypeId(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select customer type</option>

                  {customerTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {type.markup}%
                    </option>
                  ))}
                </select>
              </div>

              {selectedCustomerType && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      Current Markup
                    </span>

                    <span className="text-lg font-bold text-blue-700">
                      {selectedCustomerType.markup}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
              <button
                onClick={resetCustomerForm}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={
                  editingCustomerId === null
                    ? addCustomer
                    : editCustomer
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                {editingCustomerId === null
                  ? 'Save Customer'
                  : 'Update Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* PRODUCT MODAL */}
      {/* ====================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {editingProductId === null
                    ? 'Add Product'
                    : 'Edit Product'}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {editingProductId === null
                    ? 'Create a new product'
                    : 'Update product details'}
                </p>
              </div>

              <button
                onClick={resetProductForm}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* PRODUCT CODE */}
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

              {/* PRODUCT NAME */}
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
                  placeholder="Example: Cotton Shirt"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* COST PRICE */}
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
                  placeholder="Example: 500"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* STOCK */}
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
                    setStockQuantity(event.target.value)
                  }
                  placeholder="Example: 25"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
              <button
                onClick={resetProductForm}
                className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={
                  editingProductId === null
                    ? addProduct
                    : editProduct
                }
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
              >
                {editingProductId === null
                  ? 'Save Product'
                  : 'Update Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App