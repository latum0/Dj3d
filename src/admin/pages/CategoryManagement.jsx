"use client"

import { useState, useEffect } from "react"
import "./CategoryManagement.css"
import axios from "axios"

function CategoryManagement() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [openDropdown, setOpenDropdown] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        isActive: true,
        customNameAllowed: false,
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(
                "http://localhost:5000/api/categories", // <-- note the “http://”
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setCategories(response.data.data || response.data)
        } catch (err) {
            console.error("Error fetching categories:", err)
            setError("Erreur lors du chargement des catégories")
        } finally {
            setLoading(false)
        }
    }
    const handlePermanentDelete = async (categoryId) => {
        if (!window.confirm("Supprimer définitivement cette catégorie ?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `http://localhost:5000/api/categories/${categoryId}/permanent`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchCategories();
            setError(null);
        } catch (err) {
            console.error("Error permanently deleting category:", err);
            setError("Erreur lors de la suppression permanente");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem("token")

            if (editingCategory) {
                await axios.put(`http://localhost:5000/api/categories/${editingCategory._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            } else {
                await axios.post("http://localhost:5000/api/categories", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                })
            }

            await fetchCategories()
            resetForm()
            setError(null)
        } catch (err) {
            console.error("Error saving category:", err)
            setError(err.response?.data?.message || "Erreur lors de la sauvegarde")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            isActive: category.isActive,
            customNameAllowed: category.customNameAllowed,
        })
        setShowForm(true)
        setOpenDropdown(null)
    }

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return

        try {
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            await fetchCategories()
            setError(null)
        } catch (err) {
            console.error("Error deleting category:", err)
            setError("Erreur lors de la suppression")
        }
    }

    const toggleStatus = async (category) => {
        try {
            const token = localStorage.getItem("token")
            await axios.put(
                `http://localhost:5000/api/categories/${category._id}`,
                {
                    ...category,
                    isActive: !category.isActive,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            await fetchCategories()
        } catch (err) {
            console.error("Error toggling status:", err)
            setError("Erreur lors de la modification du statut")
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            isActive: true,
            customNameAllowed: false,
        })
        setEditingCategory(null)
        setShowForm(false)
    }

    const filteredCategories = categories.filter((category) =>
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (loading && categories.length === 0) {
        return (
            <div className="category-management-loading-container">
                <div className="category-management-loading-spinner"></div>
                <p>Chargement des catégories...</p>
            </div>
        )
    }

    return (
        <div className="category-management-page">
            <div className="category-management-page-header">
                <div className="category-management-header-content">
                    <div className="category-management-header-left">
                        <h1 className="category-management-page-title">
                            <span className="category-management-title-icon">🏷️</span>
                            Gestion des Catégories
                        </h1>
                        <p className="category-management-page-subtitle">Organisez et gérez les catégories de vos produits</p>
                    </div>
                    <button
                        className="category-management-btn category-management-btn-primary"
                        onClick={() => setShowForm(true)}
                        disabled={loading}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Ajouter une catégorie
                    </button>
                </div>
            </div>

            {error && (
                <div className="category-management-alert category-management-alert-error">
                    <span className="category-management-alert-icon">⚠️</span>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="category-management-alert-close">
                        ×
                    </button>
                </div>
            )}

            <div className="category-management-controls-section">
                <div className="category-management-search-container">
                    <div className="category-management-search-input-wrapper">

                        <input
                            type="text"
                            placeholder="Rechercher des catégories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="category-management-search-input"
                        />
                    </div>
                </div>
            </div>

            <div className="category-management-grid">
                {filteredCategories.map((category) => (
                    <div key={category._id} className={`category-management-card ${!category.isActive ? "inactive" : ""}`}>
                        <div className="category-management-card-header">
                            <div className="category-management-card-info">
                                <h3 className="category-management-card-name">{category.name}</h3>
                                <div className="category-management-card-badges">
                                    <span className={`category-management-status-badge ${category.isActive ? "active" : "inactive"}`}>
                                        {category.isActive ? "Actif" : "Inactif"}
                                    </span>
                                    {category.customNameAllowed && (
                                        <span className="category-management-feature-badge">Nom personnalisé</span>
                                    )}
                                </div>
                            </div>
                            <div className={`category-management-action-dropdown${openDropdown === category._id ? " active" : ""}`}>
                                <button
                                    className="category-management-action-trigger"
                                    onClick={() => setOpenDropdown(openDropdown === category._id ? null : category._id)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                                <div className="category-management-dropdown-menu">
                                    <button className="category-management-dropdown-item" onClick={() => handleEdit(category)}>
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
                                    <button className="category-management-dropdown-item" onClick={() => toggleStatus(category)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {category.isActive ? "Désactiver" : "Activer"}
                                    </button>
                                    <button
                                        className="category-management-dropdown-item danger"
                                        onClick={() => handlePermanentDelete(category._id)}
                                    >
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

                        <div className="category-management-card-stats">
                            <div className="category-management-stat-item">
                                <span className="category-management-stat-label">Produits</span>
                                <span className="category-management-stat-value">{category.productCount || 0}</span>
                            </div>
                            <div className="category-management-stat-item">
                                <span className="category-management-stat-label">Créée le</span>
                                <span className="category-management-stat-value">
                                    {new Date(category.createdAt).toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCategories.length === 0 && !loading && (
                <div className="category-management-no-data">
                    <div className="category-management-no-data-content">
                        <div className="category-management-no-data-icon">🏷️</div>
                        <p>Aucune catégorie trouvée</p>
                    </div>
                </div>
            )}

            {/* Category Form Modal */}
            {showForm && (
                <div className="category-management-modal-overlay">
                    <div className="category-management-modal category-management-modern-modal">
                        <div className="category-management-modal-header">
                            <h3 className="category-management-modal-title">
                                <span className="category-management-modal-icon">{editingCategory ? "✏️" : "➕"}</span>
                                {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
                            </h3>
                            <button className="category-management-modal-close" onClick={resetForm}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="category-management-modal-body">
                                <div className="category-management-form-grid">
                                    <div className="category-management-form-group category-management-full-width">
                                        <label className="category-management-form-label">
                                            Nom de la catégorie <span className="category-management-required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="category-management-form-input"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Entrez le nom de la catégorie"
                                            required
                                        />
                                    </div>

                                    <div className="category-management-form-group">
                                        <label className="category-management-form-label">Statut</label>
                                        <div className="category-management-toggle-group">
                                            <label className="category-management-toggle-option">
                                                <input
                                                    type="radio"
                                                    name="isActive"
                                                    checked={formData.isActive}
                                                    onChange={() => setFormData({ ...formData, isActive: true })}
                                                />
                                                <span className="category-management-toggle-label active">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        />
                                                    </svg>
                                                    Actif
                                                </span>
                                            </label>
                                            <label className="category-management-toggle-option">
                                                <input
                                                    type="radio"
                                                    name="isActive"
                                                    checked={!formData.isActive}
                                                    onChange={() => setFormData({ ...formData, isActive: false })}
                                                />
                                                <span className="category-management-toggle-label inactive">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                    Inactif
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="category-management-form-group">
                                        <label className="category-management-form-label">Options</label>
                                        <div className="category-management-checkbox-group">
                                            <label className="category-management-checkbox-option">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.customNameAllowed}
                                                    onChange={(e) => setFormData({ ...formData, customNameAllowed: e.target.checked })}
                                                />
                                                <span className="category-management-checkbox-label">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    Autoriser les noms personnalisés
                                                </span>
                                            </label>
                                        </div>
                                        <p className="category-management-form-help">
                                            Les clients pourront personnaliser les produits de cette catégorie avec leur nom
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="category-management-modal-footer">
                                <button
                                    type="button"
                                    className="category-management-btn category-management-btn-secondary"
                                    onClick={resetForm}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="category-management-btn category-management-btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? "Enregistrement..." : editingCategory ? "Modifier" : "Ajouter"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryManagement
