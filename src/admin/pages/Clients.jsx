import React, { useEffect, useState } from 'react';
import './Clients.css';
import axios from 'axios';

function Clients() {
  // États
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Actif',
    password: 'default123'
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [sortOption, setSortOption] = useState('Par défaut');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupération des clients
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users/clients', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Filtrer pour exclure les admins
      const filteredClients = response.data.filter(client => client.role !== 'admin');
      setClients(filteredClients);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      setError('Impossible de charger les clients');
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des formulaires
  const handleAddClient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/signup', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await fetchClients();
      setFormData({ name: '', email: '', phone: '', status: 'Actif', password: 'default123' });
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      setError('Erreur lors de l\'ajout du client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingClient._id}`,
        { status: editingClient.status },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setClients(clients.map(client =>
        client._id === editingClient._id ? { ...client, status: editingClient.status } : client
      ));
      setEditingClient(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Échec de la modification');
      fetchClients();
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des menus
  const toggleMenu = (clientId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === clientId ? null : clientId);
  };

  const closeAllMenus = () => {
    setActiveMenu(null);
  };

  // Actions
  const handleViewProfile = (client) => {
    setSelectedClient(client);
    setShowProfile(true);
    setActiveMenu(null);
  };

  const handleEditClient = (client) => {
    setEditingClient({ ...client });
    setActiveMenu(null);
  };

  const handleDisableAccount = async (clientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir désactiver ce compte ?')) {
      try {
        await axios.put(
          `http://localhost:5000/api/users/${clientId}/disable`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        fetchClients();
      } catch (error) {
        console.error('Erreur lors de la désactivation:', error);
        setError('Échec de la désactivation');
      }
    }
  };

  // Effets
  useEffect(() => {
    const handleClickOutside = () => closeAllMenus();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filtrage et tri
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Tous les statuts' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortOption === 'Date d\'inscription (récent)') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === 'Date d\'inscription (ancien)') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  // Utilitaires
  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return '#28a745';
      case 'VIP': return '#ffc107';
      case 'Inactif': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Rendu
  return (
    <div className="clients-page">
      {/* En-tête */}
      <div className="page-header">
        <h1 className="page-title">Gestion des Clients</h1>
        <button
          className="button button-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="button-icon">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {showForm ? 'Annuler' : 'Ajouter un client'}
        </button>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="close-alert">&times;</button>
        </div>
      )}

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Ajouter un client</h2>
            <form onSubmit={handleAddClient} className="modal-form">
              <label>
                Nom complet
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </label>

              <label>
                Téléphone
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </label>

              <label>
                Statut
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option>Actif</option>
                  <option>VIP</option>
                  <option>Inactif</option>
                </select>
              </label>

              <div className="form-buttons">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'En cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire de modification */}
      {editingClient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modifier le client</h2>
            <form onSubmit={handleUpdateClient} className="modal-form">
              <label>
                Nom complet
                <input
                  type="text"
                  value={editingClient.name}
                  disabled
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={editingClient.email}
                  disabled
                />
              </label>

              <label>
                Statut
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                  style={{ color: getStatusColor(editingClient.status) }}
                >
                  <option value="Actif" style={{ color: '#28a745' }}>Actif</option>
                  <option value="VIP" style={{ color: '#ffc107' }}>VIP</option>
                  <option value="Inactif" style={{ color: '#dc3545' }}>Inactif</option>
                </select>
              </label>

              <div className="form-buttons">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setEditingClient(null)}
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'En cours...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="search-icon">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher des clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="filters-container">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={isLoading}
        >
          <option>Tous les statuts</option>
          <option>Actif</option>
          <option>VIP</option>
          <option>Inactif</option>
        </select>

        <select
          className="filter-select"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          disabled={isLoading}
        >
          <option>Par défaut</option>
          <option>Date d'inscription (récent)</option>
          <option>Date d'inscription (ancien)</option>
        </select>
      </div>

      {/* Tableau des clients */}
      {isLoading && clients.length === 0 ? (
        <div className="loading-indicator">Chargement en cours...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Commandes</th>
              <th>Dépenses</th>
              <th>Statut</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedClients.map((client, index) => (
              <tr key={client._id}>
                <td>
                  <div className="client-info">
                    <div className="client-avatar">{client.name?.charAt(0).toUpperCase()}</div>
                    <div className="client-details">
                      <div className="client-name">{client.name}</div>
                      <div className="client-id">{client._id?.slice(-6).toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{client.email}</div>
                  <div className="client-phone">{client.phone || 'N/A'}</div>
                </td>
                <td>0</td>
                <td>€0.00</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(client.status) }}
                  >
                    {client.status || 'Actif'}
                  </span>
                </td>
                <td>{client.createdAt ? new Date(client.createdAt).toISOString().split('T')[0] : 'N/A'}</td>
                <td>
                  <div className="action-menu">
                    <button
                      className="action-button"
                      onClick={(e) => toggleMenu(client._id, e)}
                      disabled={isLoading}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div
                      className={`action-menu-content ${activeMenu === client._id ? 'show' : ''} ${index >= sortedClients.length - 2 ? 'menu-up' : ''
                        }`}
                    >
                      <button
                        className="action-menu-item"
                        onClick={() => handleViewProfile(client)}
                      >
                        Voir le profil
                      </button>
                      <button
                        className="action-menu-item"
                        onClick={() => handleEditClient(client)}
                      >
                        Modifier
                      </button>
                      <button
                        className="action-menu-item"
                        onClick={() => handleDisableAccount(client._id)}
                      >
                        Désactiver le compte
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de profil */}
      {showProfile && selectedClient && (
        <div className="modal-overlay">
          <div className="modal-content profile-modal">
            <div className="profile-header">
              <h2>Profil du Client</h2>
              <button
                className="close-button"
                onClick={() => setShowProfile(false)}
              >
                &times;
              </button>
            </div>

            <div className="profile-content">
              <div className="profile-section">
                <div className="profile-avatar">
                  {selectedClient.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h3>{selectedClient.name}</h3>
                  <p>ID: {selectedClient._id?.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedClient.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Téléphone:</span>
                  <span className="detail-value">{selectedClient.phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Statut:</span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedClient.status) }}
                  >
                    {selectedClient.status || 'Actif'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date d'inscription:</span>
                  <span className="detail-value">
                    {selectedClient.createdAt ? new Date(selectedClient.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Commandes:</span>
                  <span className="detail-value">0</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Dépenses totales:</span>
                  <span className="detail-value">€0.00</span>
                </div>
              </div>
            </div>

            <div className="profile-footer">
              <button
                className="button button-secondary"
                onClick={() => setShowProfile(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;