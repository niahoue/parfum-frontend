// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard'; // Utilisez le même ProductCard que pour la liste des produits
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const FavoritesPage = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false);
        setError("Veuillez vous connecter pour voir vos favoris.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Récupérer le profil utilisateur qui contient la liste des favoris (IDs)
        const { data: userData } = await axiosClient.get('/users/profile');
        
        // Si l'utilisateur a des favoris, récupérer les détails de chaque produit
        if (userData.favorites && userData.favorites.length > 0) {
          const productDetailsPromises = userData.favorites.map(productId =>
            axiosClient.get(`/products/${productId}`)
          );
          const productsResponses = await Promise.all(productDetailsPromises);
          const productsData = productsResponses.map(res => res.data);
          setFavoriteProducts(productsData);
        } else {
          setFavoriteProducts([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des favoris:', err);
        setError(err.response?.data?.message || 'Impossible de charger vos favoris.');
      } finally {
        setLoading(false);
      }
    };

    // Charger les favoris uniquement si l'état d'authentification est prêt
    if (!authLoading) {
      fetchFavorites();
    }
  }, [user, authLoading]); // Dépend de l'utilisateur et de l'état de chargement de l'authentification

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-gray-700">Chargement des informations utilisateur...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <p className="text-lg text-red-500">{error}</p>
        {!user && (
          <Link to="/login" className="ml-4 text-purple-600 hover:underline">Se connecter</Link>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Accès Refusé</h2>
        <p className="text-gray-600 mb-6">Veuillez vous connecter pour accéder à votre liste de favoris.</p>
        <Link to="/login">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full">
            Se connecter
          </Button>
        </Link>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Mes Favoris</h1>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <p className="text-xl text-gray-600 mb-4">Votre liste de favoris est vide.</p>
          <Link to="/products">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full">
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favoriteProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
