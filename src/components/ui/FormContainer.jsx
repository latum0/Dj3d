import React, { useState } from "react";
import "./FormContainer.css";
import { FaGoogle } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function FormContainer({
  title,
  subtitle,
  showNameInput,
  buttonText,
  linkText,
  linkUrl,
  linkLabel,
  onSubmit,
  errorMessage,
  language = 'en',
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError(false);

    if (showNameInput) {
      if (!password) {
        setPasswordError(true);
        return;
      }
      onSubmit({ name, email, password });
    } else {
      if (!password) {
        setPasswordError(true);
        return;
      }
      onSubmit({ email, password });
    }
  };

  const messages = {
    en: {
      emailRequired: "Email is required",
      passwordRequired: "Password is required",
      incorrectCredentials: "Incorrect email or password",
    },
    fr: {
      emailRequired: "L'email est requis",
      passwordRequired: "Le mot de passe est requis",
      incorrectCredentials: "Email ou mot de passe incorrect",
    },
  };

  const errorText = errorMessage ? messages[language][errorMessage] : null;

  return (
    <div className="form-section animate-right">
      {/* Affichage du message d'erreur personnalisé */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage.toLowerCase().includes("incorrect") ? (
            <>
              <p><strong>The password you entered is incorrect.</strong></p>
             
            </>
          ) : (
            <p>{errorMessage}</p>
          )}
        </div>
      )}

      <h2>{title}</h2>
      <p>{subtitle}</p>
      <form onSubmit={handleSubmit}>
        {showNameInput && (
          <input
            type="text"
            placeholder={language === 'en' ? "Name" : "Nom"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder={language === 'en' ? "Email or Phone Number" : "Email ou numéro de téléphone"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={language === 'en' ? "Password" : "Mot de passe"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && (
          <p className="error-message">
            {language === 'en' ? "Password is required" : "Le mot de passe est requis"}
          </p>
        )}
        <button type="submit" className="create-btn">{buttonText}</button>
      </form>

      <div className="divider">or</div>
      <button className="google-btn" type="button">
        <FaGoogle className="google-icon" />
        {language === 'en' ? "Sign up with Google" : "S'inscrire avec Google"}
      </button>

      <p className="login-link">
        {linkText} <Link to={linkUrl}>{linkLabel}</Link>
      </p>
    </div>
  );
}
