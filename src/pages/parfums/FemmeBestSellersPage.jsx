
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FemmeBestSellersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Chargement des best-sellers femme...');
        
        const { data } = await axiosClient.get('/products', {
          params: {
            category: 'femme',
            isBestSeller: 'true', // Utiliser exactement ce paramètre
            pageSize: 100
          }
        });
        
        console.log('Best-sellers reçus:', data);
        setProducts(data.products || []);
        
      } catch (err) {
        console.error('Erreur lors du chargement des best-sellers femme:', err);
        setError(err.response?.data?.message || 'Échec du chargement des best-sellers parfums femme.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Best-Sellers Parfums Femme</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez notre collection exclusive des parfums femme les plus populaires et les plus vendus.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />
          Chargement des parfums best-sellers...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <p className="text-lg mb-2">Aucun parfum best-seller pour femme trouvé pour le moment.</p>
          <p className="text-sm text-gray-500">
            Vérifiez que des produits femme sont marqués comme "best-sellers" dans l'administration.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-gray-600">
              {products.length} best-seller{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onViewDetails={handleViewDetails} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FemmeBestSellersPage;