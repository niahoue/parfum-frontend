// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext'; // Utilise le contexte d'authentification
// import { toast } from 'react-hot-toast'; // Décommentez si vous utilisez react-hot-toast

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // État pour gérer les erreurs du backend
  const { login } = useAuth(); // Fonction de connexion du contexte
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs précédentes
    setLoading(true); // Activer l'état de chargement

    try {
      await login(email, password);
      // toast.success('Connexion réussie !'); // Décommentez si vous utilisez react-hot-toast
      navigate('/profile'); // Redirige vers la page de profil utilisateur
    } catch (err) {
      // Gérer l'erreur renvoyée par le backend (via axiosClient.js)
      setError(err.response?.data?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
      // toast.error(err.response?.data?.message || 'Échec de la connexion.'); // Décommentez si vous utilisez react-hot-toast
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Se connecter</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenue ! Connectez-vous à votre compte.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>} {/* Affichage des erreurs */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>
          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={loading} // Désactiver le bouton pendant le chargement
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
            Inscrivez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;