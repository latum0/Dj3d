import React, { useState } from "react";
import "./Signup.css";
import CardImage from "../components/ui/cardimage";
import FormContainer from "../components/ui/FormContainer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({ name, email, password }) => {
    setLoading(true); // Début du chargement
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });

      // Si l'inscription réussit, on se connecte automatiquement
      localStorage.setItem("token", response.data.token); // Sauvegarder le token dans localStorage
      navigate("/dashboard"); // Rediriger vers une page protégée ou tableau de bord
    } catch (err) {
      setError(err.response?.data?.message || "Erreur inconnue"); // Afficher le message d'erreur
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  return (
    <>
      <div className="signupWrapper slide-page">
        <div className="authCard">
          <CardImage />
          <FormContainer
            title="Create an account"
            subtitle="Enter your details below"
            showNameInput={true}
            buttonText={loading ? "Signing up..." : "Sign up"} // Afficher "Signing up..." pendant le chargement
            linkText="Already have an account?"
            linkUrl="/login"
            linkLabel="Log in"
            onSubmit={handleSubmit} // Passer la fonction handleSubmit ici
          />
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
    </>
  );
}