// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Utilise le contexte d'authentification
// import { toast } from 'react-hot-toast'; // Décommentez si vous utilisez react-hot-toast

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth(); // Fonction d'inscription du contexte
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs précédentes

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      // toast.error('Les mots de passe ne correspondent pas.'); // Décommentez si vous utilisez react-hot-toast
      return;
    }

    setLoading(true); // Activer l'état de chargement
    try {
      await register(name, email, password);
      // toast.success('Inscription réussie et connexion automatique !'); // Décommentez si vous utilisez react-hot-toast
      navigate('/profile'); // Redirige vers la page de profil utilisateur
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.');
      // toast.error(err.response?.data?.message || 'Échec de l\'inscription.'); // Décommentez si vous utilisez react-hot-toast
    } finally {
      setLoading(false); // Désactiver l'état de chargement
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] py-10 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">Inscription</CardTitle>
          <CardDescription className="text-center">
            Créez votre compte Fragrance de Mumu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-center text-sm">{error}</div>} {/* Affichage des erreurs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Nom Complet
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Adresse Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Mot de Passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                Confirmer le Mot de Passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2"
              disabled={loading} // Désactiver le bouton pendant le chargement
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
