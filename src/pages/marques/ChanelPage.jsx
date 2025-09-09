// src/pages/marques/ChanelPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChanelPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChanelProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/products', {
          params: {
            brand: 'Chanel' // Filtrer par la marque "Chanel"
          }
        });
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des produits Chanel:', err);
        setError(err.response?.data?.message || 'Échec du chargement des produits Chanel.');
      } finally {
        setLoading(false);
      }
    };

    fetchChanelProducts();
  }, []);

  const handleViewDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Marque Chanel</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Explorez notre collection exclusive de parfums et produits de la marque Chanel.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des produits Chanel...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucun produit Chanel trouvé pour le moment.
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

export default ChanelPage;
