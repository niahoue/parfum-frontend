// src/pages/NewArrivalsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../src/api/axiosClient'; // Assurez-vous que le chemin est correct
import ProductCard from '../../src/components/ProductCard'; // Importez le composant ProductCard
import { Loader2, Sparkles } from 'lucide-react'; // Pour l'icône de chargement et de nouveauté
import { useNavigate } from 'react-router-dom'; // Pour la navigation si nécessaire

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      setLoading(true);
      try {
        // Récupérer tous les produits marqués comme "nouveaux"
        const { data } = await axiosClient.get('/products', {
          params: {
            isNewProduct: true // Filtrer par les nouveaux produits
          }
        });
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des nouveautés:', err);
        setError(err.response?.data?.message || 'Échec du chargement des nouveautés.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Fonction de gestion pour la vue détaillée
  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`); // Navigue vers la page de détails du produit
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-center mb-8">
        <Sparkles className="w-10 h-10 text-purple-600 mr-4" />
        <h1 className="text-4xl font-bold text-gray-900 text-center">Nos Nouveautés</h1>
      </div>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez les dernières arrivées dans notre collection de parfums et cosmétiques.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des nouveautés...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucune nouveauté disponible pour le moment. Revenez bientôt !
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

export default NewArrivalsPage;
