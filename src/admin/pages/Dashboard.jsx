import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Users, Package, CreditCard } from 'react-feather';
import './Dashboard.css';

// Données fictives pour les graphiques
const revenueData = [
  { name: "Jan", total: 1800 },
  { name: "Fév", total: 2200 },
  { name: "Mar", total: 2800 },
  { name: "Avr", total: 2400 },
  { name: "Mai", total: 2900 },
  { name: "Juin", total: 3500 },
  { name: "Juil", total: 3200 },
];

const categoryData = [
  { name: "Composants", value: 35 },
  { name: "Périphériques", value: 25 },
  { name: "Refroidissement", value: 15 },
  { name: "Stockage", value: 10 },
  { name: "Réseaux", value: 8 },
  { name: "Autres", value: 7 },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Tableau de bord</h1>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card-dash">
          <div className="stat-header">
            <div>
              <p className="stat-title">Ventes totales</p>
              <p className="stat-value">24,532 DA</p>
            </div>
            <div className="stat-icon">
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} />
            <span>+12.5% depuis le mois dernier</span>
          </div>
        </div>

        <div className="stat-card-dash">
          <div className="stat-header">
            <div>
              <p className="stat-title">Nouveaux clients</p>
              <p className="stat-value">342</p>
            </div>
            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} />
            <span>+8.2% depuis le mois dernier</span>
          </div>
        </div>

        <div className="stat-card-dash">
          <div className="stat-header">
            <div>
              <p className="stat-title">Produits actifs</p>
              <p className="stat-value">1,245</p>
            </div>
            <div className="stat-icon">
              <Package size={20} />
            </div>
          </div>
          <div className="stat-change negative">
            <ArrowDownRight size={16} />
            <span>-2.3% depuis le mois dernier</span>
          </div>
        </div>

        <div className="stat-card-dash">
          <div className="stat-header">
            <div>
              <p className="stat-title">Paiements vendeurs</p>
              <p className="stat-value">12,234 DA</p>
            </div>
            <div className="stat-icon">
              <CreditCard size={20} />
            </div>
          </div>
          <div className="stat-change positive">
            <ArrowUpRight size={16} />
            <span>+5.7% depuis le mois dernier</span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Overview section */}
      <h2 className="section-title">Vue d'ensemble</h2>

      <div className="analytics-grid">
        {/* Analytics column */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3>Analytiques</h3>
            <h4>Revenus</h4>
            <p className="analytics-description">Revenus mensuels pour l'année en cours</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Revenus (DA)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports column */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h3>Rapports</h3>
            <h4>Ventes par catégorie</h4>
            <p className="analytics-description">Répartition des ventes par catégorie</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Pourcentage (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;