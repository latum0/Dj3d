
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import "./EditProduct.css"
import "./AdminStyles.css";

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState(null)

  // Mock product data - in a real app, you would fetch this from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct({
        id,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 129.99,
        category: "Electronics",
        inventory: 45,
        sku: "WH-NC-100",
        images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
        specifications: [
          { name: "Battery Life", value: "20 hours" },
          { name: "Connectivity", value: "Bluetooth 5.0" },
          { name: "Weight", value: "250g" },
        ],
      })
      setLoading(false)
    }, 800)
  }, [id])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
    sku: "",
    images: [],
    specifications: [],
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        inventory: product.inventory,
        sku: product.sku,
        images: product.images,
        specifications: product.specifications,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value,
    }
    setFormData({
      ...formData,
      specifications: updatedSpecs,
    })
  }

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { name: "", value: "" }],
    })
  }

  const removeSpecification = (index) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs.splice(index, 1)
    setFormData({
      ...formData,
      specifications: updatedSpecs,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your API
    console.log("Updated product:", formData)
    alert("Product updated successfully!")
    navigate("/products")
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product data...</p>
      </div>
    )
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-header">
        <div className="header-content">
          <h1>Edit Product</h1>
          <p>Update your product information</p>
        </div>
        <div className="header-actions">
          <Link to="/products" className="back-button">
            Back to Products
          </Link>
        </div>
      </div>

      <div className="edit-product-content">
        <form className="edit-product-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                  <option value="Toys">Toys</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="inventory">Inventory</label>
                <input
                  type="number"
                  id="inventory"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Images</h2>
            <div className="product-images">
              {formData.images.map((image, index) => (
                <div key={index} className="product-image">
                  <img src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => {
                      const updatedImages = [...formData.images]
                      updatedImages.splice(index, 1)
                      setFormData({
                        ...formData,
                        images: updatedImages,
                      })
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="add-image">
                <button
                  type="button"
                  className="add-image-button"
                  onClick={() => {
                    // In a real app, you would open a file picker
                    setFormData({
                      ...formData,
                      images: [...formData.images, "/placeholder.svg?height=200&width=200"],
                    })
                  }}
                >
                  + Add Image
                </button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h2>Specifications</h2>
              <button type="button" className="add-spec-button" onClick={addSpecification}>
                + Add Specification
              </button>
            </div>

            {formData.specifications.map((spec, index) => (
              <div key={index} className="spec-row">
                <div className="form-group">
                  <label htmlFor={`spec-name-${index}`}>Name</label>
                  <input
                    type="text"
                    id={`spec-name-${index}`}
                    value={spec.name}
                    onChange={(e) => handleSpecChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`spec-value-${index}`}>Value</label>
                  <input
                    type="text"
                    id={`spec-value-${index}`}
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                    required
                  />
                </div>
                <button type="button" className="remove-spec-button" onClick={() => removeSpecification(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Update Product
            </button>
            <Link to="/products" className="cancel-button">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
