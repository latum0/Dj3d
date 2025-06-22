"use client"

function ProductDetailsModal({ show, product, categories, onClose, onEdit, onDelete, getCategoryName }) {
    if (!show || !product) return null

    const handleEdit = () => {
        onEdit(product)
        onClose()
    }

    const handleDelete = () => {
        onDelete(product._id)
        onClose()
    }

    const images = Array.isArray(product.image) ? product.image : product.image ? [product.image] : []

    return (
        <div className="products-management-modal-overlay">
            <div className="products-management-modal products-management-modern-modal products-management-details-modal">
                <div className="products-management-modal-header">
                    <h3 className="products-management-modal-title">
                        <span className="products-management-modal-icon">👁️</span>
                        Détails du produit
                    </h3>
                    <button className="products-management-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="products-management-modal-body">
                    <div className="products-management-details-grid">
                        {/* Product Images */}
                        {images.length > 0 && (
                            <section className="products-management-detail-section products-management-images-section">
                                <h4 className="products-management-section-title">
                                    <span className="products-management-section-icon">🖼️</span>
                                    Images
                                </h4>
                                <div className="products-management-product-images">
                                    {images.length === 1 ? (
                                        <div className="products-management-single-image">
                                            <img
                                                src={images[0] || "/placeholder.svg"}
                                                alt={product.name}
                                                className="products-management-main-image"
                                                onError={(e) => {
                                                    e.target.src = "/placeholder.svg?height=400&width=400"
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="products-management-image-gallery">
                                            {images.map((image, index) => (
                                                <div key={index} className="products-management-gallery-item">
                                                    <img
                                                        src={image || "/placeholder.svg"}
                                                        alt={`${product.name} ${index + 1}`}
                                                        className="products-management-gallery-image"
                                                        onError={(e) => {
                                                            e.target.src = "/placeholder.svg?height=200&width=200"
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Product Information */}
                        <section className="products-management-detail-section">
                            <h4 className="products-management-section-title">
                                <span className="products-management-section-icon">📝</span>
                                Informations du produit
                            </h4>
                            <div className="products-management-detail-list">
                                <div className="products-management-detail-item">
                                    <span className="products-management-detail-label">Nom:</span>
                                    <span className="products-management-detail-value products-management-product-name">
                                        {product.name}
                                    </span>
                                </div>
                                <div className="products-management-detail-item">
                                    <span className="products-management-detail-label">Prix:</span>
                                    <span className="products-management-detail-value products-management-product-price">
                                        {product.price?.toFixed(2)}
                                    </span>
                                </div>
                                <div className="products-management-detail-item">
                                    <span className="products-management-detail-label">Catégorie:</span>
                                    <span className="products-management-detail-value">
                                        <span className="products-management-category-badge">{getCategoryName(product.category)}</span>
                                    </span>
                                </div>
                                <div className="products-management-detail-item products-management-description-item">
                                    <span className="products-management-detail-label">Description:</span>
                                    <div className="products-management-detail-value products-management-product-description">
                                        {product.description}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Product Metadata */}
                        <section className="products-management-detail-section">
                            <h4 className="products-management-section-title">
                                <span className="products-management-section-icon">📊</span>
                                Métadonnées
                            </h4>
                            <div className="products-management-detail-list">
                                <div className="products-management-detail-item">
                                    <span className="products-management-detail-label">ID:</span>
                                    <span className="products-management-detail-value products-management-product-id">{product._id}</span>
                                </div>
                                <div className="products-management-detail-item">
                                    <span className="products-management-detail-label">Date de création:</span>
                                    <span className="products-management-detail-value">
                                        {new Date(product.createdAt).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                {product.updatedAt && (
                                    <div className="products-management-detail-item">
                                        <span className="products-management-detail-label">Dernière modification:</span>
                                        <span className="products-management-detail-value">
                                            {new Date(product.updatedAt).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="products-management-modal-footer">
                    <button className="products-management-btn products-management-btn-secondary" onClick={onClose}>
                        Fermer
                    </button>
                    <div className="products-management-action-buttons">
                        <button className="products-management-btn products-management-btn-primary" onClick={handleEdit}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Modifier
                        </button>
                        <button className="products-management-btn products-management-btn-danger" onClick={handleDelete}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsModal
