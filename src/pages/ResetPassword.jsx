import React, { useState } from "react";
import "./ResetPassword.css"; 

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (email) {
      setMessage("A password reset link has been sent to your email.");
    } else {
      setMessage("Please enter a valid email.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <p>Enter your email address to receive a password reset link.</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      
      {message && <p className="reset-message">{message}</p>}
    </div>
  );
}
