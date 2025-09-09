// src/pages/parfums/FemmeParfumsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import ProductCard from '../../components/ProductCard'; // Importez le composant ProductCard
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { useNavigate } from 'react-router-dom'; // Pour la navigation si nécessaire

const FemmeParfumsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFemalePerfumes = async () => {
      setLoading(true);
      try {
        // Étapes pour trouver la catégorie "Femme" par son nom
        const categoriesRes = await axiosClient.get('/categories');
        const femaleCategory = categoriesRes.data.find(cat => cat.name.toLowerCase() === 'femme');

        if (!femaleCategory) {
          setError('Catégorie "Femme" non trouvée. Veuillez la créer dans le panneau d\'administration.');
          setLoading(false);
          return;
        }

        // Récupérer tous les produits de la catégorie "Femme"
        const { data } = await axiosClient.get('/products', {
          params: {
            category: femaleCategory._id // Filtrer par l'ID de la catégorie "Femme"
          }
        });
        setProducts(data.products || []); // Votre API retourne data.products
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des parfums femme:', err);
        setError(err.response?.data?.message || 'Échec du chargement des parfums femme.');
      } finally {
        setLoading(false);
      }
    };

    fetchFemalePerfumes();
  }, []);

  // Fonction de gestion pour la vue détaillée (si ProductCard le nécessite)
  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`); // Navigue vers la page de détails du produit
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Parfums Femme</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez notre sélection complète de parfums pour femme.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des parfums...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
          {error.includes("Catégorie") && (
            <p className="mt-4 text-gray-700">Veuillez vous assurer qu'une catégorie nommée "Femme" existe et contient des produits.</p>
          )}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucun parfum femme trouvé pour le moment.
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

export default FemmeParfumsPage;
