import React, { useState, useEffect } from 'react';
import './Transactions.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Mock de transactions statiques
const mockTransactions = [
  {
    _id: '1',
    reference: 'TXN-1001',
    vendor: { name: 'Jean Dupont' },
    amount: 150.75,
    method: 'Sale',
    description: 'Vente de produit A',
    status: 'Completed',
    transactionDate: '2025-06-15T10:30:00Z'
  },
  {
    _id: '2',
    reference: 'TXN-1002',
    vendor: { name: 'Marie Martin' },
    amount: -50.00,
    method: 'Vendor Payment',
    description: 'Paiement fournisseur',
    status: 'Pending',
    transactionDate: '2025-06-17T14:45:00Z'
  },
  {
    _id: '3',
    reference: 'TXN-1003',
    vendor: { name: 'Pierre Durand' },
    amount: -20.00,
    method: 'Refund',
    description: 'Remboursement client',
    status: 'Failed',
    transactionDate: '2025-06-18T09:15:00Z'
  }
];

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous les types');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');

  // Chargement des données statiques
  useEffect(() => {
    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      transaction.reference.toLowerCase().includes(term) ||
      transaction.vendor.name.toLowerCase().includes(term) ||
      (transaction.description && transaction.description.toLowerCase().includes(term));

    const matchesType =
      typeFilter === 'Tous les types' ||
      (typeFilter === 'Vente' && transaction.amount > 0) ||
      (typeFilter === 'Paiement vendeur' && transaction.method === 'Vendor Payment') ||
      (typeFilter === 'Remboursement' && transaction.method === 'Refund');

    const matchesStatus =
      statusFilter === 'Tous les statuts' ||
      (statusFilter === 'Réussie' && transaction.status === 'Completed') ||
      (statusFilter === 'En attente' && transaction.status === 'Pending') ||
      (statusFilter === 'Échouée' && transaction.status === 'Failed');

    return matchesSearch && matchesType && matchesStatus;
  });

  // Export Excel simplifié
  const handleExportExcel = () => {
    const exportData = filteredTransactions.map(t => ({
      'ID': t.reference,
      'Type': t.amount > 0 ? 'Vente' : t.method === 'Refund' ? 'Remboursement' : 'Paiement vendeur',
      'Description': t.description,
      'Montant (€)': t.amount,
      'Statut': t.status === 'Completed' ? 'Réussie' : t.status === 'Pending' ? 'En attente' : 'Échouée',
      'Date': new Date(t.transactionDate).toLocaleString(),
      'Client/Vendeur': t.vendor.name
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `transactions_static.xlsx`);
  };

  // Export PDF simplifié
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Rapport des Transactions', 14, 20);
    const tableData = filteredTransactions.map(t => [
      t.reference,
      t.amount > 0 ? 'Vente' : t.method === 'Refund' ? 'Remboursement' : 'Paiement vendeur',
      t.description || 'N/A',
      `${t.amount >= 0 ? '+' : '-'}€${Math.abs(t.amount).toFixed(2)}`,
      t.status === 'Completed' ? 'Réussie' : t.status === 'Pending' ? 'En attente' : 'Échouée',
      new Date(t.transactionDate).toLocaleDateString(),
      t.vendor.name
    ]);
    doc.autoTable({ head: [['ID', 'Type', 'Desc', 'Montant', 'Statut', 'Date', 'Client']], body: tableData, startY: 30 });
    doc.save('transactions_static.pdf');
  };

  if (loading) return <div className="loading">Chargement des transactions...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Gestion des Transactions</h1>
        <div className="export-buttons">
          <button onClick={handleExportExcel}>Excel</button>
          <button onClick={handleExportPDF}>PDF</button>
        </div>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filters-container">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option>Tous les types</option>
          <option>Vente</option>
          <option>Paiement vendeur</option>
          <option>Remboursement</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option>Tous les statuts</option>
          <option>Réussie</option>
          <option>En attente</option>
          <option>Échouée</option>
        </select>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Description</th><th>Montant</th><th>Statut</th><th>Date</th><th>Client/Vendeur</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
            <tr key={t._id}>
              <td>{t.reference}</td>
              <td>{t.amount > 0 ? 'Vente' : t.method === 'Refund' ? 'Remboursement' : 'Paiement vendeur'}</td>
              <td>{t.description}</td>
              <td>{t.amount >= 0 ? '+' : '-'}€{Math.abs(t.amount).toFixed(2)}</td>
              <td>{t.status === 'Completed' ? 'Réussie' : t.status === 'Pending' ? 'En attente' : 'Échouée'}</td>
              <td>{new Date(t.transactionDate).toLocaleString()}</td>
              <td>{t.vendor.name}</td>
            </tr>
          )) : (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Aucune transaction trouvée</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;
