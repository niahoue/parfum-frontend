// src/pages/parfums/FemmeParfumsPage.jsx - Version corrigée
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FemmeParfumsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all'); // Nouveau state pour le filtre
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFemalePerfumes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Récupérer d'abord les catégories pour trouver l'ID exact
        const categoriesRes = await axiosClient.get('/categories');
        const femaleCategory = categoriesRes.data.find(cat => 
          cat.name.toLowerCase().includes('femme')
        );

        if (!femaleCategory) {
          setError('Catégorie "Femme" non trouvée. Veuillez la créer dans le panneau d\'administration.');
          setLoading(false);
          return;
        }

        // Récupérer tous les produits de la catégorie "Femme"
        const { data } = await axiosClient.get('/products', {
          params: {
            category: femaleCategory._id, 
            pageSize: 100
          }
        });
        setProducts(data.products || []);
        
      } catch (err) {
        console.error('Erreur lors du chargement des parfums femme:', err);
        setError(err.response?.data?.message || 'Échec du chargement des parfums femme.');
      } finally {
        setLoading(false);
      }
    };

    fetchFemalePerfumes();
  }, []);

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  // Filtrer les produits selon le type sélectionné
  const filteredProducts = selectedType === 'all' 
    ? products 
    : products.filter(product => 
        product.type && product.type.toLowerCase().includes(selectedType.toLowerCase())
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Parfums Femme</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez notre sélection complète de parfums pour femme.
      </p>

      {/* Filtres par type de parfum */}
      {!loading && products.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedType === 'all'
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'
              }`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setSelectedType('eau de parfum')}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedType === 'eau de parfum'
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'
              }`}
            >
              Eau de Parfum ({products.filter(p => p.type && p.type.toLowerCase().includes('eau de parfum')).length})
            </button>
            <button
              onClick={() => setSelectedType('eau de toilette')}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedType === 'eau de toilette'
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'
              }`}
            >
              Eau de Toilette ({products.filter(p => p.type && p.type.toLowerCase().includes('eau de toilette')).length})
            </button>
            <button
              onClick={() => setSelectedType('parfum')}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedType === 'parfum' 
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'
              }`}
            >
              Parfum ({products.filter(p => p.type && p.type.toLowerCase().includes('parfum') && !p.type.toLowerCase().includes('eau')).length})
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />
          Chargement des parfums...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          >
            Réessayer
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <p className="text-lg mb-2">Aucun parfum femme trouvé pour le moment.</p>
          <p className="text-sm text-gray-500">
            Vérifiez que des produits sont assignés à la catégorie "Femme" dans l'administration.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              {selectedType !== 'all' && ` - ${selectedType}`}
            </p>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-600 py-10">
              <p className="text-lg">Aucun produit trouvé pour le filtre "{selectedType}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FemmeParfumsPage;