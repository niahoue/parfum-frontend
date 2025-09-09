// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Récupérer l'utilisateur et l'état de chargement

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="ml-2 text-gray-700">Chargement de l'authentification...</p>
      </div>
    );
  }

  // Si l'utilisateur est connecté ET qu'il est administrateur, rendre les enfants de la route
  if (user && user.isAdmin) {
    return children ? children : <Outlet />; // Utilise Outlet pour les sous-routes imbriquées
  } else {
    // Sinon, rediriger vers la page de connexion (ou une page d'accès refusé)
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
