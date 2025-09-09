// src/pages/cosmetiques/HairCarePage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import ProductCard from '../../components/ProductCard'; // Importez le composant ProductCard
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { useNavigate } from 'react-router-dom'; // Pour la navigation si nécessaire

const HairCarePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHairCareProducts = async () => {
      setLoading(true);
      try {
        // Étapes pour trouver la catégorie "Cosmétique" par son nom
        const categoriesRes = await axiosClient.get('/categories');
        const cosmeticCategory = categoriesRes.data.find(cat => cat.name.toLowerCase() === 'cosmetique');

        if (!cosmeticCategory) {
          setError('Catégorie "Cosmétique" non trouvée. Veuillez la créer dans le panneau d\'administration.');
          setLoading(false);
          return;
        }

        // Récupérer les produits de la catégorie "Cosmétique" et de type "Soins des Cheveux"
        const { data } = await axiosClient.get('/products', {
          params: {
            type: 'Soins des Cheveux', // <--- IMPORTANT: Adaptez ceci si "Soins des Cheveux" est une note ou un autre champ
            category: cosmeticCategory._id
          }
        });
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des soins des cheveux:', err);
        setError(err.response?.data?.message || 'Échec du chargement des soins des cheveux.');
      } finally {
        setLoading(false);
      }
    };

    fetchHairCareProducts();
  }, []);

  // Fonction de gestion pour la vue détaillée
  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Soins des Cheveux</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez les produits essentiels pour la santé et la beauté de vos cheveux.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des produits de soins des cheveux...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
          {error.includes("Catégorie") && (
            <p className="mt-4 text-gray-700">Veuillez vous assurer qu'une catégorie nommée "Cosmétique" existe et que des produits de type "Soins des Cheveux" lui sont associés.</p>
          )}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucun produit de soin des cheveux trouvé pour le moment.
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

export default HairCarePage;
