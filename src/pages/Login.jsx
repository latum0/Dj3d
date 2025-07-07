

// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CardImage from "../components/ui/cardimage";
import FormContainer from "../components/ui/FormContainer";
import "./Login.css";

export default function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const RAW_API = import.meta.env.VITE_API_URL || "";
  const API_BASE = RAW_API.replace(/\/$/, "");

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") navigate("/dashboard");
    else if (user.role === "client") navigate("/");
    else navigate("/about");
  }, [user, navigate]);

  const handleSubmit = async ({ email, password }) => {
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      await login({ user: data.user, accessToken: data.accessToken });
      // After login, guestId cookie is cleared by backend merge
      // You can now fetch cart in components or via context update
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Une erreur de connexion est survenue."
      );
    }
  };

  return (
    <div className="loginWrapper slide-page-right">
      <div className="authCard">
        <CardImage />
        <FormContainer
          title="Welcome Back"
          subtitle="Please log in to your account"
          showNameInput={false}
          buttonText="Log In"
          linkText="Don't have an account?"
          linkUrl="/signup"
          linkLabel="Sign up"
          onSubmit={handleSubmit}
          errorMessage={error}
        />
      </div>
    </div>
  );
}
