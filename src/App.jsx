import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AccountPage from "./pages/AccountPage";
import Cart from "./pages/Cart";
import ProductListingPage from "./pages/ProductListingPage";
import Checkout from "./pages/Checkout";
import CustomOrder from "./pages/CustomOrder";

import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";

import PrivateAdminRoute from "./components/ui/PrivateAdminRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/Dashboard";
import ProductsAdmin from "./admin/pages/Products";
import OrdersAdmin from "./admin/pages/Orders";
import ClientsAdmin from "./admin/pages/Clients";
import PaymentsAdmin from "./admin/pages/Payments";
import TransactionsAdmin from "./admin/pages/Transactions";
import CategoryManagement from "./admin/pages/CategoryManagement";

import ProductManagement from "./pages/seller/EditProduct";

import "./App.css";

function LayoutWrapper() {
  const location = useLocation();

  const adminPaths = [
    "/dashboard",
    "/produits",
    "/commandes",
    "/clients",
    "/paiements",
    "/transactions",
    "/category"

  ];
  const sellerPaths = ["/DashboardSeller"];
  const hideHeaderFooter =
    adminPaths.some((p) => location.pathname.startsWith(p)) ||
    sellerPaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/accountpage" element={<AccountPage />} />
        <Route path="/productlistingpage" element={<ProductListingPage />} />


        <Route path="/Editproducts" element={<ProductManagement />} />
        <Route path="/custom-order" element={<CustomOrder />} />

        {/* Admin (protected) */}
        <Route element={<PrivateAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/produits" element={<ProductsAdmin />} />
            <Route path="/commandes" element={<OrdersAdmin />} />
            <Route path="/clients" element={<ClientsAdmin />} />
            <Route path="/paiements" element={<PaymentsAdmin />} />
            <Route path="/transactions" element={<TransactionsAdmin />} />
            <Route path="/category" element={<CategoryManagement />} />
          </Route>
        </Route>
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}
