"use client"

import { useState, useEffect } from "react"
import axios from "axios"
function OrderDetailsModal({ show, order, onClose, onOrderUpdate, onError, getBadgeClass, frDate }) {

    const [newStatus, setNewStatus] = useState("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

    const RAW_API = import.meta.env.VITE_API_URL || "";
    const API_BASE = RAW_API.replace(/\/$/, "");

    useEffect(() => {
        if (order) {
            setNewStatus(order.status);
            setStatusUpdateSuccess(false);
        }
    }, [order]);

    const handleStatusUpdate = async () => {
        if (!order || newStatus === order.status) return;
        setIsUpdatingStatus(true);

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_BASE}/orders/${order._id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onOrderUpdate({ ...order, status: newStatus });
            setStatusUpdateSuccess(true);
            setTimeout(() => setStatusUpdateSuccess(false), 3000);
        } catch (err) {
            console.error("Status update error:", err.response || err);
            onError(
                err.response?.data?.message ||
                "Erreur lors de la mise à jour du statut"
            );
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (!show || !order) return null;
    const isCustomOrder = order.items?.some(item => !!item.customImage);
    return (
        <div className="orders-management-modal-overlay">
            <div className="orders-management-modal orders-management-modern-modal">
                <div className="orders-management-modal-header">
                    <h3 className="orders-management-modal-title">
                        <span className="orders-management-modal-icon">📋</span>
                        Détails de la commande ORD-{order._id.slice(0, 6).toUpperCase()}
                    </h3>
                    <button className="orders-management-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="orders-management-modal-body">
                    <div className="orders-management-details-grid">
                        {/* Status Management Section */}
                        <section className="orders-management-detail-section orders-management-status-management-section">
                            <h4 className="orders-management-section-title">
                                <span className="orders-management-section-icon">🔄</span>
                                Gestion du Statut
                            </h4>

                            {statusUpdateSuccess && (
                                <div className="orders-management-status-success-alert">
                                    <span className="orders-management-alert-icon">✅</span>
                                    <span>Statut mis à jour avec succès!</span>
                                </div>
                            )}

                            <div className="orders-management-status-management-content">
                                <div className="orders-management-current-status">
                                    <div className="orders-management-status-label">Statut actuel:</div>
                                    <span className={`orders-management-status-badge ${getBadgeClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="orders-management-status-update-form">
                                    <div className="orders-management-form-group">
                                        <label className="orders-management-form-label">Nouveau statut:</label>
                                        <select
                                            className="orders-management-status-select"
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            disabled={isUpdatingStatus}
                                        >
                                            <option value="Pending">En attente</option>
                                            <option value="Paid">Payée</option>
                                            <option value="Shipped">Expédiée</option>
                                            <option value="Delivered">Livrée</option>
                                            <option value="Cancelled">Annulée</option>
                                        </select>
                                    </div>

                                    <div className="orders-management-status-actions">
                                        <button
                                            className="orders-management-btn orders-management-btn-primary orders-management-status-update-btn"
                                            onClick={handleStatusUpdate}
                                            disabled={isUpdatingStatus || newStatus === order.status}
                                        >
                                            {isUpdatingStatus ? (
                                                <>
                                                    <div className="orders-management-btn-spinner"></div>
                                                    Mise à jour...
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
                                                    Mettre à jour le statut
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="orders-management-status-history">
                                    <div className="orders-management-status-timeline">
                                        <div className="orders-management-timeline-item">
                                            <div className="orders-management-timeline-dot"></div>
                                            <div className="orders-management-timeline-content">
                                                <div className="orders-management-timeline-status">Commande créée</div>
                                                <div className="orders-management-timeline-date">{frDate(order.createdAt)}</div>
                                            </div>
                                        </div>
                                        <div className="orders-management-timeline-item">
                                            <div className="orders-management-timeline-dot orders-management-timeline-dot-current"></div>
                                            <div className="orders-management-timeline-content">
                                                <div className="orders-management-timeline-status">Statut actuel: {order.status}</div>
                                                <div className="orders-management-timeline-date">
                                                    {frDate(order.updatedAt || order.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="orders-management-detail-section">
                            <h4 className="orders-management-section-title">
                                <span className="orders-management-section-icon">👤</span>
                                Informations client
                            </h4>
                            <div className="orders-management-detail-list">
                                <div className="orders-management-detail-item">
                                    <span className="orders-management-detail-label">Nom:</span>
                                    <span className="orders-management-detail-value">
                                        {order.user?.name || order.guestDetails?.name || "Non spécifié"}
                                    </span>
                                </div>
                                <div className="orders-management-detail-item">
                                    <span className="orders-management-detail-label">Email:</span>
                                    <span className="orders-management-detail-value">
                                        {order.user?.email || order.guestDetails?.email || "Non spécifié"}
                                    </span>
                                </div>
                                <div className="orders-management-detail-item">
                                    <span className="orders-management-detail-label">Téléphone:</span>
                                    <span className="orders-management-detail-value">{order.guestDetails?.phone || "—"}</span>
                                </div>
                            </div>

                            {/* Address Information */}
                            {(order.guestDetails?.address || order.shippingInfo) && (
                                <>


                                    <h5 className="orders-management-subsection-title">Adresse de livraison</h5>
                                    <div className="orders-management-address-info">
                                        <p>
                                            {order.shippingInfo?.street || "123 Rue de la Paix"}
                                            <br />
                                            {order.shippingInfo?.city || "Paris"}, {order.shippingInfo?.postalCode || "75001"}
                                            <br />

                                        </p>
                                        {order.shippingInfo?.phone && (
                                            <p>
                                                <strong>Tél:</strong> {order.shippingInfo.phone}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </section>

                        <section className="orders-management-detail-section">
                            <h4 className="orders-management-section-title">
                                <span className="orders-management-section-icon">🛍️</span>
                                Articles commandés
                            </h4>
                            <div className="orders-management-items-table-container">
                                <table className="orders-management-items-table">
                                    <thead>
                                        <tr>
                                            {isCustomOrder && <th>Image</th>}
                                            <th>Produit</th>
                                            <th>Qté</th>
                                            <th>Prix</th>
                                            <th>Total</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items?.map((item, i) => (
                                            <tr key={i}>
                                                {isCustomOrder && (
                                                    <td className="orders-management-item-image">
                                                        {item.customImage ? (
                                                            <a href={item.customImage} download target="_blank" rel="noopener noreferrer">
                                                                <img
                                                                    src={item.customImage}
                                                                    alt="Custom"
                                                                    style={{ maxWidth: 80, maxHeight: 80, cursor: 'pointer' }}
                                                                />
                                                            </a>
                                                        ) : (
                                                            <span>—</span>
                                                        )}
                                                    </td>)}
                                                <td className="orders-management-item-name">
                                                    {item.product?.name || item.product || "Produit inconnu"}
                                                </td>
                                                <td className="orders-management-item-qty">{item.quantity}</td>
                                                <td className="orders-management-item-price">
                                                    {(item.priceAtPurchase ?? item.product?.price ?? 0).toFixed(2)} DA
                                                </td>
                                                <td className="orders-management-item-total">
                                                    {((item.priceAtPurchase ?? item.product?.price ?? 0) * item.quantity).toFixed(2)} DA
                                                </td>
                                                <td className="orders-management-item-options">
                                                    {item.size && <span className="orders-management-option-tag">Taille: {item.size}</span>}
                                                    {item.color && <span className="orders-management-option-tag">Couleur: {item.color}</span>}
                                                    {item.customName && (
                                                        <span className="orders-management-option-tag">Nom: {item.customName}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="orders-management-detail-section">
                            <h4 className="orders-management-section-title">
                                <span className="orders-management-section-icon">💰</span>
                                Résumé financier
                            </h4>
                            <div className="orders-management-summary-list">
                                <div className="orders-management-summary-item">
                                    <span>Sous-total:</span>
                                    <span>{order.subTotal?.toFixed(2) || order.totalAmount?.toFixed(2) || "0.00"} DA</span>
                                </div>
                                <div className="orders-management-summary-item">
                                    <span>Frais de livraison:</span>
                                    <span>{order.shippingPrice?.toFixed(2) || "0.00"} DA</span>
                                </div>
                                <div className="orders-management-summary-item total">
                                    <span>Total:</span>
                                    <span>{order.totalAmount?.toFixed(2) || "0.00"} DA</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="orders-management-modal-footer">
                    <button className="orders-management-btn orders-management-btn-secondary" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailsModal