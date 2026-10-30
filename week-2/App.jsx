import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)

  // Fetch products from API
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }
        return response.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Products load nahi huay. Please try again.')
        setLoading(false)
      })
  }, [])

  // Categories
  const categories = [
    'all',
    ...new Set(products.map((product) => product.category)),
  ]

  // Search and category filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'all' || product.category === category

    return matchesSearch && matchesCategory
  })

  // Add Product
  function addProduct(e) {
    e.preventDefault()

    if (!newTitle.trim() || !newPrice || Number(newPrice) <= 0) {
      alert('Please enter a valid product name and price.')
      return
    }

    const newProduct = {
      id: Date.now(),
      title: newTitle.trim(),
      price: Number(newPrice),
      category: 'new product',
      image: 'https://placehold.co/200x200?text=New+Product',
      description: 'New product added by the user.',
      rating: { rate: 0, count: 0 },
    }

    setProducts((previousProducts) => [
      newProduct,
      ...previousProducts,
    ])

    setNewTitle('')
    setNewPrice('')
    setSearch('')
    setCategory('all')
  }

  // Update Productnction
  function saveProduct(e) {
    e.preventDefault()

    if (!editingProduct) return

    const updatedTitle = editingProduct.title.trim()
    const updatedPrice = Number(editingProduct.price)

    if (!updatedTitle || !Number.isFinite(updatedPrice) || updatedPrice <= 0) {
      alert('Please enter a valid product name and price.')
      return
    }

    const updatedProduct = {
      ...editingProduct,
      title: updatedTitle,
      price: updatedPrice,
    }

    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        String(product.id) === String(editingProduct.id)
          ? { ...product, ...updatedProduct }
          : product
      )
    )

    // Update details window too, if it is open
    setSelectedProduct((previousProduct) =>
      previousProduct &&
        String(previousProduct.id) === String(editingProduct.id)
        ? { ...previousProduct, ...updatedProduct }
        : previousProduct
    )

    setEditingProduct(null)
  }

  // Delete Product
  function deleteProduct(productId) {
    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => String(product.id) !== String(productId)
      )
    )

    if (
      selectedProduct &&
      String(selectedProduct.id) === String(productId)
    ) {
      setSelectedProduct(null)
    }

    if (
      editingProduct &&
      String(editingProduct.id) === String(productId)
    ) {
      setEditingProduct(null)
    }
  }

  return (
    <div className="app">

      <header className="header">
        <h1>Product Dashboard</h1>
        <p>Week 2 Internship Project | React + REST API</p>
      </header>

      <main className="container">

        <h2>Products</h2>

        {/* Add Product Form */}
        <form className="add-product-form" onSubmit={addProduct}>
          <input
            type="text"
            placeholder="Enter product name"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Enter price"
            min="0.01"
            step="0.01"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            required
          />

          <button type="submit">Add Product</button>
        </form>

        {/* Search and Category Filter */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All Categories' : item}
              </option>
            ))}
          </select>
        </div>

        {/* Loading and Error Messages */}
        {loading && (
          <p className="message">Loading products...</p>
        )}

        {error && (
          <p className="error">{error}</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="message">No products found.</p>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <form
            className="add-product-form"
            onSubmit={saveProduct}
          >
            <h3>Edit Product</h3>

            <input
              type="text"
              placeholder="Product name"
              value={editingProduct.title}
              onChange={(e) =>
                setEditingProduct((previous) => ({
                  ...previous,
                  title: e.target.value,
                }))
              }
              required
            />

            <input
              type="number"
              placeholder="Price"
              min="0.01"
              step="0.01"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct((previous) => ({
                  ...previous,
                  price: e.target.value,
                }))
              }
              required
            />

            <button type="submit">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditingProduct(null)}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Product Cards */}
        <div className="product-grid">

          {!loading && !error && filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>

              <img
                src={product.image}
                alt={product.title}
              />

              <h3>{product.title}</h3>

              <p className="category">
                {product.category}
              </p>

              <p className="price">
                ${product.price}
              </p>

              <p className="rating">
                Rating: {product.rating?.rate ?? 'N/A'} / 5
              </p>

              {/* View Details */}
              <button
                type="button"
                className="details-button"
                onClick={() => setSelectedProduct(product)}
              >
                View Details
              </button>

              {/* Update Product */}
              <button
                type="button"
                className="update-button"
                onClick={() =>
                  setEditingProduct({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                  })
                }
              >
                Update Product
              </button>

              {/* Delete Product */}
              <button
                type="button"
                className="delete-button"
                onClick={() => deleteProduct(product.id)}
              >
                Delete Product
              </button>

            </article>
          ))}

        </div>

        {/* Product Details */}
        {selectedProduct && (
          <div className="details-overlay">
            <section className="details-panel">

              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedProduct(null)}
              >
                Close ✕
              </button>

              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
              />

              <h2>{selectedProduct.title}</h2>

              <p className="category">
                {selectedProduct.category}
              </p>

              <p className="price">
                ${selectedProduct.price}
              </p>

              <p>
                <strong>Rating:</strong>{' '}
                {selectedProduct.rating?.rate ?? 'N/A'} / 5
              </p>

              <p>
                <strong>Description:</strong>{' '}
                {selectedProduct.description}
              </p>

            </section>
          </div>
        )}

      </main>
    </div>
  )
}

export default App