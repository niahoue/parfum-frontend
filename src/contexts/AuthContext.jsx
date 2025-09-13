// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false); 

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Valider le token avec le backend et récupérer les infos utilisateur
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axiosClient.get('/users/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Erreur lors du chargement du profil utilisateur:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
      setAuthReady(true); // L'authentification est prête, même si l'utilisateur n'est pas connecté
    };

    loadUser();
  }, [token]);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const { data } = await axiosClient.post('/users/login', { email, password });
      localStorage.setItem('token', data.token);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
    toast.success('Connexion réussie !'); 
      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
     toast.error(error.response?.data?.message || 'Échec de la connexion.'); 
    }
  };

  // Fonction d'inscription
  const register = async (name, email, password) => {
    try {
      const res = await axiosClient.post('/users/register', { name, email, password });

      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);

      const userData = res.data.user || res.data;
      setUser(userData);

      return res.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axiosClient.defaults.headers.common['Authorization']; 
    toast.success('Déconnexion réussie !'); 
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateAuthUserProfile = async (updatedData) => {
    try {
      const { data } = await axiosClient.put('/users/profile', updatedData);
      setUser(data); 
       toast.success('Profil mis à jour avec succès !'); 
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error(error.response?.data?.message || 'Échec de la mise à jour du profil.'); 
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, authReady, login, register, logout, updateAuthUserProfile }}>
      {authReady && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
