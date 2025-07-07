// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guestId, setGuestId] = useState(null);

  useEffect(() => {
    const existingGuestId = getCookie("guestId");
    if (existingGuestId) setGuestId(existingGuestId);

    const RAW_API = import.meta.env.VITE_API_URL || "";
    const API_BASE = RAW_API.replace(/\/$/, "");

    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        // Fetch profile
        const profileRes = await fetch(
          `${API_BASE}/users/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!profileRes.ok) throw new Error("Not authenticated");
        const profile = await profileRes.json();
        setUser(profile);

        // Merge cart
        await fetch(`${API_BASE}/cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        setGuestId(null);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    })();
  }, []);

  const login = async ({ user: u, accessToken }) => {
    localStorage.setItem("token", accessToken);
    setUser(u);
    const RAW_API = import.meta.env.VITE_API_URL || "";
    const API_BASE = RAW_API.replace(/\/$/, "");

    await fetch(`${API_BASE}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    setGuestId(null);
  };

  const logout = async () => {
    const RAW_API = import.meta.env.VITE_API_URL || "";
    const API_BASE = RAW_API.replace(/\/$/, "");
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed", err);
    }
    localStorage.removeItem("token");
    setUser(null);
    setGuestId(null);
  };

  return (
    <AuthContext.Provider value={{ user, guestId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};