// src/pages/marques/AllBrandsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import ProductCard from '../../components/ProductCard'; // Importez le composant ProductCard
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { useNavigate } from 'react-router-dom'; // Pour la navigation si nécessaire

const AllBrandsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Récupérer tous les produits, sans filtre de marque spécifique ici
        // La pagination peut être ajoutée si nécessaire, mais pour un aperçu, on prend tout.
        const { data } = await axiosClient.get('/products');
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de tous les produits par marque:', err);
        setError(err.response?.data?.message || 'Échec du chargement des produits.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Fonction de gestion pour la vue détaillée
  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Toutes les Marques</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez notre sélection complète de produits de toutes nos marques partenaires.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des produits par marque...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucun produit trouvé pour le moment.
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

export default AllBrandsPage;
