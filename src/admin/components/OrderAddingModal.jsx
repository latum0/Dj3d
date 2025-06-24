// src/components/OrderAddingModal.jsx
"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
// adjust path as needed

export default function OrderAddingModal({
    show,
    onClose,
    onOrderAdd,
    onError,
}) {
    // 1️⃣ Fetch product list on mount
    const [productOptions, setProductOptions] = useState([])
    useEffect(() => {
        ; (async () => {
            try {
                const token = localStorage.getItem("token")
                const resp = await axios.get(
                    "http://localhost:5000/api/products",
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                const list = Array.isArray(resp.data.data)
                    ? resp.data.data
                    : Array.isArray(resp.data)
                        ? resp.data
                        : resp.data.data
                setProductOptions(list)
            } catch (err) {
                console.error("Could not load products:", err)
            }
        })()
    }, [])

    // 2️⃣ Your existing initial state
    const initialNewOrder = {
        guestDetails: {
            name: "",
            email: "",
            phone: "",
            address: { street: "", city: "", postalCode: "", country: "" },
        },
        items: [
            {
                product: "",            // now will hold a product _id
                quantity: 1,
                priceAtPurchase: 0,
                size: "",
                color: "",
                customName: "",
            },
        ],
        shippingInfo: {
            street: "",
            city: "",
            postalCode: "",
            country: "",
            phone: "",
            email: "",
        },
        paymentMethod: "CreditCard",
        status: "Pending",
    }

    const [newOrder, setNewOrder] = useState(initialNewOrder)
    const [loading, setLoading] = useState(false)

    const handleAddOrderInputChange = (
        field,
        value,
        index = null,
        subField = null
    ) => {
        setNewOrder((prev) => {
            const copy = { ...prev }
            if (field === "items" && index !== null) {
                copy.items[index] = { ...copy.items[index], [subField]: value }
            } else if (field === "guestDetails" && subField) {
                if (subField === "address") {
                    copy.guestDetails.address = {
                        ...copy.guestDetails.address,
                        ...value,
                    }
                } else {
                    copy.guestDetails[subField] = value
                }
            } else if (field === "shippingInfo" && subField) {
                copy.shippingInfo[subField] = value
            } else {
                copy[field] = value
            }
            return copy
        })
    }

    const addOrderItem = () =>
        setNewOrder((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                { product: "", quantity: 1, priceAtPurchase: 0, size: "", color: "", customName: "" },
            ],
        }))

    const removeOrderItem = (i) =>
        setNewOrder((prev) => ({
            ...prev,
            items: prev.items.filter((_, idx) => idx !== i),
        }))

    const calculateTotal = () =>
        newOrder.items.reduce((sum, it) => sum + it.priceAtPurchase * it.quantity, 0)

    const handleSubmitNewOrder = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            const payload = {
                ...newOrder,
                isGuest: true,
                totalAmount: calculateTotal(),
            }
            const resp = await axios.post(
                "http://localhost:5000/api/orders",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            const created = resp.data.data
            onOrderAdd(created)
            onClose()
            setNewOrder(initialNewOrder)
        } catch (err) {
            console.error("Error creating order:", err.response || err)
            onError(
                err.response?.data?.message ||
                "Erreur lors de la création de la commande"
            )
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        onClose()
        setNewOrder(initialNewOrder)
    }

    if (!show) return null

    return (
        <div className="orders-management-modal-overlay">
            <div className="orders-management-modal orders-management-modern-modal orders-management-add-order-modal">
                <div className="orders-management-modal-header">
                    <h3 className="orders-management-modal-title">
                        <span className="orders-management-modal-icon">➕</span>
                        Nouvelle Commande
                    </h3>
                    <button
                        className="orders-management-modal-close"
                        onClick={handleClose}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmitNewOrder}>
                    <div className="orders-management-modal-body">
                        <div className="orders-management-form-sections">
                            {/* Guest Details Section */}
                            <section className="orders-management-form-section">
                                <h4 className="orders-management-section-title">
                                    <span className="orders-management-section-icon">👤</span>
                                    Informations Client
                                </h4>
                                <div className="orders-management-form-grid">

                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Nom complet *</label>
                                        <input
                                            type="text"
                                            className="orders-management-form-input"
                                            value={newOrder.guestDetails.name}
                                            onChange={(e) => handleAddOrderInputChange("guestDetails", e.target.value, null, "name")}
                                            required
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="orders-management-form-input"
                                            value={newOrder.guestDetails.email}
                                            onChange={(e) => handleAddOrderInputChange("guestDetails", e.target.value, null, "email")}
                                            required
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Téléphone *</label>
                                        <input
                                            type="tel"
                                            className="orders-management-form-input"
                                            value={newOrder.guestDetails.phone}
                                            onChange={(e) => handleAddOrderInputChange("guestDetails", e.target.value, null, "phone")}
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Items Section */}
                            <section className="orders-management-form-section">
                                <div className="orders-management-section-header">
                                    <h4 className="orders-management-section-title">
                                        <span className="orders-management-section-icon">🛍️</span>
                                        Articles commandés
                                    </h4>
                                    <button
                                        type="button"
                                        className="orders-management-add-item-btn"
                                        onClick={addOrderItem}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M12 5V19M5 12H19"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        Ajouter un article
                                    </button>
                                </div>

                                {newOrder.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="orders-management-item-form"
                                    >
                                        <div className="orders-management-item-header">
                                            <h5 className="orders-management-item-title">Article {index + 1}</h5>
                                            {newOrder.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="orders-management-remove-item-btn"
                                                    onClick={() => removeOrderItem(index)}
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
                                            )}
                                        </div>


                                        <div className="orders-management-form-grid">
                                            {/* PRODUCT SELECT ▶️ */}
                                            <div className="orders-management-form-group">
                                                <label className="orders-management-form-label">
                                                    Produit *
                                                </label>
                                                <select
                                                    className="orders-management-form-select"
                                                    value={item.product}
                                                    onChange={(e) =>
                                                        handleAddOrderInputChange(
                                                            "items",
                                                            e.target.value,
                                                            index,
                                                            "product"
                                                        )
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        — Sélectionner un produit —
                                                    </option>
                                                    {productOptions.map((p) => (
                                                        <option key={p._id} value={p._id}>
                                                            {p.name} ({p.price.toFixed(2)} DA)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="orders-management-form-group">
                                                <label className="orders-management-form-label">Quantité *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="orders-management-form-input"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleAddOrderInputChange("items", Number.parseInt(e.target.value), index, "quantity")
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="orders-management-form-group">
                                                <label className="orders-management-form-label">Prix unitaire (DA) *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="orders-management-form-input"
                                                    value={item.priceAtPurchase}
                                                    onChange={(e) =>
                                                        handleAddOrderInputChange(
                                                            "items",
                                                            Number.parseFloat(e.target.value),
                                                            index,
                                                            "priceAtPurchase",
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                            <div className="orders-management-form-group">
                                                <label className="orders-management-form-label">Taille *</label>
                                                <select
                                                    className="orders-management-form-select"
                                                    value={item.size}
                                                    onChange={(e) => handleAddOrderInputChange("items", e.target.value, index, "size")}
                                                    required
                                                >
                                                    <option value="">Sélectionner une taille</option>
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                            </div>
                                            <div className="orders-management-form-group">
                                                <label className="orders-management-form-label">Couleur *</label>
                                                <input
                                                    type="text"
                                                    className="orders-management-form-input"
                                                    value={item.color}
                                                    onChange={(e) => handleAddOrderInputChange("items", e.target.value, index, "color")}
                                                    required
                                                />
                                            </div>
                                            <div className="orders-management-form-group">
                                                <label className="orders-management-form-label">Nom personnalisé</label>
                                                <input
                                                    type="text"
                                                    className="orders-management-form-input"
                                                    value={item.customName}
                                                    onChange={(e) => handleAddOrderInputChange("items", e.target.value, index, "customName")}
                                                />
                                            </div>

                                        </div>
                                        <div className="orders-management-item-total">
                                            Total: DA
                                            {(item.priceAtPurchase * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* Shipping Info Section */}
                            {/* Shipping Info Section */}
                            <section className="orders-management-form-section">
                                <h4 className="orders-management-section-title">
                                    <span className="orders-management-section-icon">🚚</span>
                                    Informations de livraison
                                </h4>
                                <div className="orders-management-form-grid">
                                    <div className="orders-management-form-group orders-management-form-group-full">
                                        <label className="orders-management-form-label">Rue</label>
                                        <input
                                            type="text"
                                            className="orders-management-form-input"
                                            value={newOrder.shippingInfo.street}
                                            onChange={(e) => handleAddOrderInputChange("shippingInfo", e.target.value, null, "street")}
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Ville</label>
                                        <input
                                            type="text"
                                            className="orders-management-form-input"
                                            value={newOrder.shippingInfo.city}
                                            onChange={(e) => handleAddOrderInputChange("shippingInfo", e.target.value, null, "city")}
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Code postal</label>
                                        <input
                                            type="text"
                                            className="orders-management-form-input"
                                            value={newOrder.shippingInfo.postalCode}
                                            onChange={(e) => handleAddOrderInputChange("shippingInfo", e.target.value, null, "postalCode")}
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Pays</label>
                                        <input
                                            type="text"
                                            className="orders-management-form-input"
                                            value={newOrder.shippingInfo.country}
                                            onChange={(e) => handleAddOrderInputChange("shippingInfo", e.target.value, null, "country")}
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Téléphone</label>
                                        <input
                                            type="tel"
                                            className="orders-management-form-input"
                                            value={newOrder.shippingInfo.phone}
                                            onChange={(e) => handleAddOrderInputChange("shippingInfo", e.target.value, null, "phone")}
                                        />
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Email</label>
                                        <input
                                            type="email"
                                            className="orders-management-form-input"
                                            value={newOrder.shippingInfo.email}
                                            onChange={(e) => handleAddOrderInputChange("shippingInfo", e.target.value, null, "email")}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment & Status Section */}
                            <section className="orders-management-form-section">
                                <h4 className="orders-management-section-title">
                                    <span className="orders-management-section-icon">💳</span>
                                    Paiement et Statut
                                </h4>
                                <div className="orders-management-form-grid">
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Méthode de paiement *</label>
                                        <select
                                            className="orders-management-form-select"
                                            value={newOrder.paymentMethod}
                                            onChange={(e) => handleAddOrderInputChange("paymentMethod", e.target.value)}
                                            required
                                        >
                                            <option value="CreditCard">Carte bancaire</option>
                                            <option value="PayPal">PayPal</option>
                                            <option value="CashOnDelivery">Espèces à la livraison</option>
                                        </select>
                                    </div>
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Statut *</label>
                                        <select
                                            className="orders-management-form-select"
                                            value={newOrder.status}
                                            onChange={(e) => handleAddOrderInputChange("status", e.target.value)}
                                            required
                                        >
                                            <option value="Pending">En attente</option>
                                            <option value="Paid">Payée</option>
                                            <option value="Shipped">Expédiée</option>
                                            <option value="Delivered">Livrée</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Financial Summary */}
                            <section className="orders-management-form-section">
                                <h4 className="orders-management-section-title">
                                    <span className="orders-management-section-icon">💰</span>
                                    Résumé financier
                                </h4>
                                <div className="orders-management-financial-summary">
                                    <div className="orders-management-summary-row">
                                        <span>Total des articles:</span>
                                        <span className="orders-management-summary-amount">{calculateTotal().toFixed(2)} DA</span>
                                    </div>
                                    <div className="orders-management-summary-row orders-management-summary-total">
                                        <span>Total de la commande:</span>
                                        <span className="orders-management-summary-amount">€{calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                    <div className="orders-management-modal-footer">
                        <button
                            type="button"
                            className="orders-management-btn orders-management-btn-secondary"
                            onClick={handleClose}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="orders-management-btn orders-management-btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Création..." : "Créer la commande"}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    )
}
