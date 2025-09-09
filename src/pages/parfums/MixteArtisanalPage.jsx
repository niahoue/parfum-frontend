// src/pages/parfums/MixteArtisanalPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import ProductCard from '../../components/ProductCard'; // Importez le composant ProductCard
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { useNavigate } from 'react-router-dom'; // Pour la navigation si nécessaire

const MixteArtisanalPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtisanalPerfumes = async () => {
      setLoading(true);
      try {
        // Étapes pour trouver la catégorie "Mixte" par son nom
        const categoriesRes = await axiosClient.get('/categories');
        const mixteCategory = categoriesRes.data.find(cat => cat.name.toLowerCase() === 'mixte');

        if (!mixteCategory) {
          setError('Catégorie "Mixte" non trouvée. Veuillez la créer dans le panneau d\'administration.');
          setLoading(false);
          return;
        }

        // Récupérer les produits de la catégorie "Mixte" et de type "Artisanal" (vous devrez peut-être ajuster le 'type' si c'est une note)
        const { data } = await axiosClient.get('/products', {
          params: {
            // Assurez-vous que votre modèle de produit a un champ pour "Artisanal"
            // Si 'Artisanal' est un type de produit: type: 'Artisanal'
            // Si c'est une note olfactive: notes: 'Artisanal' (devra être géré par backend si c'est dans un tableau)
            // Pour l'exemple, nous allons supposer un champ 'isArtisanal' ou un 'type' spécifique.
            // Si 'Artisanal' est un type dans votre backend (product.type), utilisez:
            type: 'Artisanal', // <--- IMPORTANT: Adaptez ceci si "Artisanal" est une note ou un autre champ
            category: mixteCategory._id
          }
        });
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des parfums artisanaux mixtes:', err);
        setError(err.response?.data?.message || 'Échec du chargement des parfums artisanaux mixtes.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanalPerfumes();
  }, []);

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Parfums Artisanaux Mixtes</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez nos fragrances artisanales créées avec passion et savoir-faire pour tous.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des parfums artisanaux...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
          {error.includes("Catégorie") && (
            <p className="mt-4 text-gray-700">Veuillez vous assurer qu'une catégorie nommée "Mixte" existe et que des produits "Artisanal" lui sont associés.</p>
          )}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucun parfum artisanal mixte trouvé pour le moment.
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

export default MixteArtisanalPage;
