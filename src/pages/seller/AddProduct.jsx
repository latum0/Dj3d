import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // State to store the selected file and its preview URL
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Handle file input change and generate a preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Function to upload image to Cloudinary using an unsigned upload preset
 const uploadImageToCloudinary = async (file) => {
  // Replace "unsigned_upload" with the actual preset name you created in Cloudinary.
  const unsignedUploadPreset = "unsigned_upload"; 
  const cloudName = "dxbfmrqsy"; // Your cloud name

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", unsignedUploadPreset);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  
  console.log("Cloudinary response:", data); // Check the console for details

  if (data.secure_url) {
    return data.secure_url;
  } else if (data.error) {
    throw new Error("Cloudinary error: " + data.error.message);
  }
  throw new Error("Image upload failed");
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.target;
    const productData = {
      name: form.name.value,
      description: form.description.value,
      category: form.category.value,
      price: parseFloat(form.price.value),
      tags: form.tags.value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      sku: form.sku.value,
      stock: parseInt(form.stock.value, 10),
      image: [] // default to empty array; will update if image is uploaded
    };

    try {
      // If an image file was selected, upload it to Cloudinary
      if (selectedFile) {
        const imageUrl = await uploadImageToCloudinary(selectedFile);
        productData.image = [imageUrl];
      }
      
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add product");
      }
      alert("Product added successfully!");
      navigate(`/DashboardSeller/${sellerId}/products`);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <main className="main-content">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Add New Product</h1>
            <p>Enter product details below to add a new product</p>
          </div>
        </div>

        {/* Single Tab Form */}
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="card">
            <div className="card-header">
              <h3>Product Information</h3>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  rows="4"
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" required>
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="beauty">Beauty & Personal Care</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stock">Stock Quantity</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  placeholder="Enter SKU"
                />
              </div>

              {/* Image Upload Section */}
              <div className="form-group">
                <label htmlFor="image">Product Image (optional)</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Link
              to={`/DashboardSeller/${sellerId}/products`}
              className="btn btn-outline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddProduct;
