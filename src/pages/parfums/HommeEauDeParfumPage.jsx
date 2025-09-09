// src/pages/parfums/HommeEauDeParfumPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import ProductCard from '../../components/ProductCard'; // Importez le composant ProductCard
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { useNavigate } from 'react-router-dom'; // Pour la navigation si nécessaire

const HommeEauDeParfumPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEauDeParfum = async () => {
      setLoading(true);
      try {
        // Étapes pour trouver la catégorie "Homme" par son nom
        const categoriesRes = await axiosClient.get('/categories');
        const maleCategory = categoriesRes.data.find(cat => cat.name.toLowerCase() === 'homme');

        if (!maleCategory) {
          setError('Catégorie "Homme" non trouvée. Veuillez la créer dans le panneau d\'administration.');
          setLoading(false);
          return;
        }

        // Récupérer les produits qui sont de type "Eau de Parfum" et de la catégorie "Homme"
        const { data } = await axiosClient.get('/products', {
          params: {
            type: 'Eau de Parfum', // Filtrer par le type "Eau de Parfum"
            category: maleCategory._id // Filtrer par l'ID de la catégorie "Homme"
          }
        });
        setProducts(data.products || []); // Votre API retourne data.products
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des eaux de parfum homme:', err);
        setError(err.response?.data?.message || 'Échec du chargement des eaux de parfum homme.');
      } finally {
        setLoading(false);
      }
    };

    fetchEauDeParfum();
  }, []);

  // Fonction de gestion pour la vue détaillée (si ProductCard le nécessite)
  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`); // Navigue vers la page de détails du produit
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Eau de Parfum Homme</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Explorez notre sélection d'eaux de parfum intenses pour homme.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des eaux de parfum...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
          {error.includes("Catégorie") && (
            <p className="mt-4 text-gray-700">Veuillez vous assurer qu'une catégorie nommée "Homme" existe et que des produits de type "Eau de Parfum" lui sont associés.</p>
          )}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucune eau de parfum homme trouvée pour le moment.
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

export default HommeEauDeParfumPage;
