import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Payments.css';

function VendorPayments() {
  // Récupération du token directement depuis localStorage
  const token = localStorage.getItem('token');

  // États pour la gestion des données
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [methodFilter, setMethodFilter] = useState('Toutes les méthodes');

  // États pour le formulaire
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorEmail: '',
    amount: '',
    method: 'Virement bancaire',
    reference: generateReference(),
    bankAccount: '',
    description: ''
  });

  // Génération d'une référence aléatoire
  function generateReference() {
    return `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  }

  // Lecture de l'URL de l'API
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Instance axios configurée
  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    withCredentials: true
  });

  // Chargement initial des paiements
  useEffect(() => {
    setLoading(true);
    api.get('/payments')
      .then(res => setPayments(res.data))
      .catch(err => {
        console.error('API Error:', err);
        if (err.response?.status === 404) setPayments([]);
        else if (err.response?.status === 403) setError('Accès non autorisé');
        else setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, []); // Exécuter seulement au montage, le token étant lu en interne

  // Fonctions de formatage
  const formatStatus = status => ({
    'Success': 'Payé',
    'Initiated': 'En attente',
    'Failed': 'Échoué',
    'Refunded': 'Remboursé'
  }[status] || status);

  const getStatusClass = status => ({
    'Success': 'status-paid',
    'Initiated': 'status-waiting',
    'Failed': 'status-failed',
    'Refunded': 'status-refunded'
  }[status] || '');

  const formatDate = dateString => new Date(dateString)
    .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatCurrency = amount => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 2
  }).format(amount);

  // Gestion du formulaire
  const handlePaymentButtonClick = () => setShowPaymentForm(true);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPayment = e => {
    e.preventDefault();
    const payload = {
      reference: formData.reference,
      vendor: { name: formData.vendorName, email: formData.vendorEmail, bankAccount: formData.bankAccount },
      amount: parseFloat(formData.amount),
      method: formData.method,
      description: formData.description
    };

    api.post('/payments', payload)
      .then(res => {
        setPayments(prev => [res.data, ...prev]);
        setShowPaymentForm(false);
        setFormData({
          vendorName: '', vendorEmail: '', amount: '', method: 'Virement bancaire',
          reference: generateReference(), bankAccount: '', description: ''
        });
        alert('Paiement créé avec succès!');
      })
      .catch(err => {
        console.error('API Error:', err);
        alert(err.response?.data?.error || 'Erreur lors de la création du paiement');
      });
  };

  // Filtrage des paiements
  const filteredPayments = payments.filter(p => {
    const search = searchTerm.toLowerCase();
    const matchSearch = p.vendor?.name.toLowerCase().includes(search)
      || p.vendor?.email.toLowerCase().includes(search)
      || p.reference.toLowerCase().includes(search);
    const matchStatus = statusFilter === 'Tous les statuts' || formatStatus(p.status) === statusFilter;
    const matchMethod = methodFilter === 'Toutes les méthodes' || p.method === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  if (loading) return <div className="payments-page">Chargement des paiements...</div>;
  if (error) return <div className="payments-page"><div className="error-message">Erreur: {error}</div></div>;



  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Paiements aux Vendeurs</h1>
        <button className="button button-primary" onClick={handlePaymentButtonClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="button-icon">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Effectuer un paiement
        </button>
      </div>

      {/* Formulaire de paiement modal */}
      {showPaymentForm && (
        <div className="payment-form-modal">
          <div className="payment-form-container">
            <div className="payment-form-header">
              <h2>Nouveau Paiement</h2>
              <button
                className="close-button"
                onClick={() => setShowPaymentForm(false)}
                aria-label="Fermer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitPayment}>
              <div className="form-group">
                <label htmlFor="vendorName">Nom du vendeur</label>
                <input
                  id="vendorName"
                  type="text"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleFormChange}
                  required
                  placeholder="Nom complet du vendeur"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vendorEmail">Email du vendeur</label>
                <input
                  id="vendorEmail"
                  type="email"
                  name="vendorEmail"
                  value={formData.vendorEmail}
                  onChange={handleFormChange}
                  required
                  placeholder="email@exemple.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Montant (DA)</label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  required
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="method">Méthode de paiement</label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Espèces">Espèces</option>
                  <option value="Chèque">Chèque</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reference">Référence</label>
                <input
                  id="reference"
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleFormChange}
                  required
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="bankAccount">Compte bancaire (si virement)</label>
                <input
                  id="bankAccount"
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleFormChange}
                  required={formData.method === 'Virement bancaire'}
                  disabled={formData.method !== 'Virement bancaire'}
                  placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optionnel)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Motif du paiement..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowPaymentForm(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                >
                  Confirmer le paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher par vendeur, email ou référence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Rechercher des paiements"
        />
      </div>

      <div className="filters-container">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrer par statut"
        >
          <option>Tous les statuts</option>
          <option>Payé</option>
          <option>En attente</option>
          <option>Échoué</option>
          <option>Remboursé</option>
        </select>

        <select
          className="filter-select"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          aria-label="Filtrer par méthode"
        >
          <option>Toutes les méthodes</option>
          <option>Virement bancaire</option>
          <option>PayPal</option>
          <option>Espèces</option>
          <option>Chèque</option>
        </select>
      </div>

      <div className="payments-summary">
        <div className="summary-card">
          <div className="summary-label">Total payé</div>
          <div className="summary-value">
            {formatCurrency(payments
              .filter(p => p.status === 'Success')
              .reduce((sum, p) => sum + p.amount, 0)
            )}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">En attente</div>
          <div className="summary-value">
            {formatCurrency(payments
              .filter(p => p.status === 'Initiated')
              .reduce((sum, p) => sum + p.amount, 0)
            )}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Nombre de vendeurs</div>
          <div className="summary-value">
            {[...new Set(payments.map(p => p.vendor?.email))].length}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Vendeur</th>
              <th>Compte bancaire</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Méthode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.reference || 'N/A'}</td>
                  <td>
                    <div className="vendor-info">
                      <div className="vendor-name">{payment.vendor?.name || 'N/A'}</div>
                      <div className="vendor-email">{payment.vendor?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="bank-account">
                    {payment.method === 'Virement bancaire'
                      ? payment.vendor?.bankAccount || 'N/A'
                      : '-'}
                  </td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {formatStatus(payment.status)}
                    </span>
                  </td>
                  <td>{formatDate(payment.transactionDate)}</td>
                  <td>{payment.method || 'N/A'}</td>
                  <td>
                    <button className="action-button" title="Options">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  Aucun paiement trouvé avec les critères sélectionnés
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VendorPayments;