// src/pages/marques/BrandsPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient'; // Assurez-vous que le chemin est correct
import { Loader2 } from 'lucide-react'; // Pour l'icône de chargement
import { Link } from 'react-router-dom'; // Pour naviguer vers les pages de marque

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        // Récupérer tous les produits pour extraire les marques uniques
        // Idéalement, une API backend qui retourne les marques serait plus efficace.
        const { data } = await axiosClient.get('/products');
        const uniqueBrands = [...new Set(data.products.map(product => product.brand))];
        setBrands(uniqueBrands.sort()); // Tri alphabétique
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des marques:', err);
        setError(err.response?.data?.message || 'Échec du chargement des marques.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Nos Marques</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Découvrez toutes les marques de parfums et cosmétiques que nous proposons.
      </p>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin inline-block mr-2" />Chargement des marques...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-600">
          <p className="text-lg">{error}</p>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          Aucune marque trouvée pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brandName) => (
            <Link to={`/products?brand=${encodeURIComponent(brandName)}`} key={brandName}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-center h-24">
                <h3 className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors">
                  {brandName}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
