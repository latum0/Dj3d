"use client"

import { useState, useEffect } from "react"
import axios from "axios"

function ProductFormModal({ show, product, categories, onClose, onSave, onError }) {
    const [formData, setFormData] = useState({ name: "", description: "", price: "", category: "" })
    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                category: product.category,
            })
            setImageFiles([])
            setImagePreviews(Array.isArray(product.image) ? product.image : product.image ? [product.image] : [])
        } else {
            resetForm()
        }
    }, [product])

    const resetForm = () => {
        setFormData({ name: "", description: "", price: "", category: "" })
        setImageFiles([])
        setImagePreviews([])
    }

    const handleFilesChange = (files) => {
        const fileArray = Array.from(files)
        setImageFiles(fileArray)

        // Create preview URLs
        const previews = fileArray.map((file) => URL.createObjectURL(file))
        setImagePreviews(previews)
    }

    const handleFileInput = (e) => {
        handleFilesChange(e.target.files)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFilesChange(e.dataTransfer.files)
        }
    }

    const removeImage = (index) => {
        const newFiles = imageFiles.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)
        setImageFiles(newFiles)
        setImagePreviews(newPreviews)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            let imageUrls = []

            if (imageFiles.length > 0) {
                const uploadData = new FormData()
                imageFiles.forEach((file) => uploadData.append("files", file))
                const uploadRes = await axios.post("/api/upload", uploadData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                imageUrls = uploadRes.data.urls || []
            } else if (product && imagePreviews.length > 0) {
                // Keep existing images if no new files uploaded
                imageUrls = imagePreviews
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                price: Number.parseFloat(formData.price),
                category: formData.category,
                image: imageUrls,
            }

            const config = { headers: { Authorization: `Bearer ${token}` } }
            if (product) {
                await axios.put(`/api/products/${product._id}`, payload, config)
            } else {
                await axios.post("/api/products", payload, config)
            }

            onSave()
            resetForm()
        } catch (err) {
            console.error("Submission error:", err.response || err)
            onError(err.response?.data?.message || "Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!show) return null

    return (
        <div className="products-management-modal-overlay">
            <div className="products-management-modal products-management-modern-modal products-management-form-modal">
                <div className="products-management-modal-header">
                    <h3 className="products-management-modal-title">
                        <span className="products-management-modal-icon">{product ? "✏️" : "➕"}</span>
                        {product ? "Modifier le produit" : "Ajouter un produit"}
                    </h3>
                    <button className="products-management-modal-close" onClick={handleClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="products-management-modal-body">
                        <div className="products-management-form-sections">
                            {/* Basic Information Section */}
                            <section className="products-management-form-section">
                                <h4 className="products-management-section-title">
                                    <span className="products-management-section-icon">📝</span>
                                    Informations de base
                                </h4>
                                <div className="products-management-form-grid">
                                    <div className="products-management-form-group">
                                        <label className="products-management-form-label">
                                            Nom du produit <span className="products-management-required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="products-management-form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Entrez le nom du produit"
                                            required
                                        />
                                    </div>

                                    <div className="products-management-form-group">
                                        <label className="products-management-form-label">
                                            Prix <span className="products-management-required">*</span>
                                        </label>
                                        <div className="products-management-price-input-wrapper">
                                            <span className="products-management-currency-symbol"></span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="products-management-form-input products-management-price-input"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="0.00"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="products-management-form-group products-management-full-width">
                                        <label className="products-management-form-label">
                                            Catégorie <span className="products-management-required">*</span>
                                        </label>
                                        <select
                                            className="products-management-form-select"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories
                                                .filter((cat) => cat.isActive)
                                                .map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="products-management-form-group products-management-full-width">
                                        <label className="products-management-form-label">
                                            Description <span className="products-management-required">*</span>
                                        </label>
                                        <textarea
                                            className="products-management-form-textarea"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Décrivez le produit en détail..."
                                            rows="4"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Images Section */}
                            <section className="products-management-form-section">
                                <h4 className="products-management-section-title">
                                    <span className="products-management-section-icon">🖼️</span>
                                    Images du produit
                                </h4>

                                <div className="products-management-image-upload-section">
                                    <div
                                        className={`products-management-image-upload-area ${dragActive ? "drag-active" : ""}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileInput}
                                            className="products-management-image-input"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="products-management-image-upload-label">
                                            <div className="products-management-upload-placeholder">
                                                <div className="products-management-upload-icon">
                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M7 10L12 5L17 10"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M12 5V15"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="products-management-upload-text">
                                                    <p className="products-management-upload-primary">
                                                        Glissez-déposez vos images ici ou <span>cliquez pour parcourir</span>
                                                    </p>
                                                    <p className="products-management-upload-secondary">PNG, JPG, JPEG jusqu'à 10MB chacune</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="products-management-image-previews">
                                            <h5 className="products-management-previews-title">
                                                Images sélectionnées ({imagePreviews.length})
                                            </h5>
                                            <div className="products-management-previews-grid">
                                                {imagePreviews.map((src, index) => (
                                                    <div key={index} className="products-management-preview-item">
                                                        <img
                                                            src={src || "/placeholder.svg"}
                                                            alt={`Preview ${index + 1}`}
                                                            className="products-management-preview-image"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="products-management-remove-image"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M18 6L6 18M6 6L18 18"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="products-management-modal-footer">
                        <button
                            type="button"
                            className="products-management-btn products-management-btn-secondary"
                            onClick={handleClose}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="products-management-btn products-management-btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="products-management-btn-spinner"></div>
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 6L9 17L4 12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    {product ? "Modifier" : "Ajouter"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProductFormModal