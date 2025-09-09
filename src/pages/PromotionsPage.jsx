// src/pages/PromotionsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../src/api/axiosClient'; 
import ProductCard from '../../src/components/ProductCard'; 
import { Loader2, Percent } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; 

const PromotionsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        // Récupérer tous les produits
        const { data } = await axiosClient.get('/products');
        
        const promotionalProducts = data.products.filter(
          product => product.originalPrice && product.price < product.originalPrice
        );
        
        setProducts(promotionalProducts || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des promotions:', err);
        setError(err.response?.data?.message || 'Échec du chargement des promotions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Fonction de gestion pour la vue détaillée
  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-center mb-8">
        <Percent className="w-10 h-10 text-pink-600 mr-4" />
        <h1 className="text-4xl font-bold text-gray-900 text-center">Toutes nos Promotions</h1>
      </div>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez nos offres spéciales et réductions exclusives sur une large sélection de produits.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des promotions...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucune promotion disponible pour le moment. Revenez bientôt !
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onViewDetails={handleViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
