import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [email, setEmail] = useState(() => localStorage.getItem("email") || null);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", credentials);
      setToken(data.token);
      setEmail(data.email);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        Message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", userData);
      setToken(data.token);
      setEmail(data.email);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        Message: error.response?.data?.message || "Error al registrarse",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  };

  const getProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        Message: error.response?.data?.message || "Error al obtener el perfil",
      };
    }
  };

  return (
    <UserContext.Provider value={{ token, email, login, register, logout, getProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
