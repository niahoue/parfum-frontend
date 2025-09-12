// src/pages/ProductListingPage.jsx - Version finale et optimisée
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Import de HelmetProvider
import ProductCard from '../components/ProductCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import useDebounce from '../hooks/useDebounce'; // Un hook personnalisé pour les prix

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); 
  const [isNewFilter, setIsNewFilter] = useState('');
  const [isBestSellerFilter, setIsBestSellerFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Débounce pour les filtres de prix pour éviter des requêtes trop fréquentes
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  // Fonction utilitaire pour obtenir le nom de la catégorie par ID
  const getCategoryNameById = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : '';
  };

  // Effet pour initialiser les filtres à partir des paramètres d'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('keyword') || '');
    setSelectedCategory(params.get('category') || 'all');
    setMinPrice(params.get('minPrice') || '');
    setMaxPrice(params.get('maxPrice') || '');
    setSelectedBrand(params.get('brand') || 'all');
    setSelectedType(params.get('type') || 'all');
    setIsNewFilter(params.get('isNewProduct') === 'true' ? 'true' : '');
    setIsBestSellerFilter(params.get('isBestSeller') === 'true' ? 'true' : '');
  }, [location.search]);

  // Effet pour charger les données de référence (catégories, marques, types)
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [categoriesRes, brandsRes, typesRes] = await Promise.all([
          axiosClient.get('/categories'),
          axiosClient.get('/products/brands'),
          axiosClient.get('/products/types')
        ]);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
        setProductTypes(typesRes.data);
        setFiltersLoaded(true);
      } catch (err) {
        console.error('Erreur lors du chargement des données de filtre:', err);
        setFiltersLoaded(true); 
      }
    };
    fetchFiltersData();
  }, []);

  // Effet principal pour charger les produits avec filtres
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        
        if (searchQuery) params.append('keyword', searchQuery);
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);
        if (debouncedMinPrice) params.append('minPrice', debouncedMinPrice);
        if (debouncedMaxPrice) params.append('maxPrice', debouncedMaxPrice);
        if (selectedBrand && selectedBrand !== 'all') params.append('brand', selectedBrand);
        if (selectedType && selectedType !== 'all') params.append('type', selectedType);
        if (isNewFilter === 'true') params.append('isNew', 'true');
        if (isBestSellerFilter === 'true') params.append('isBestSeller', 'true');

        console.log('Paramètres de requête:', params.toString());

        const { data } = await axiosClient.get(`/products?${params.toString()}`);
        console.log('Données reçues:', data);
        
        setProducts(data.products || []); 
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        setError(err.response?.data?.message || 'Impossible de charger les produits. Veuillez réessayer plus tard.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (filtersLoaded) {
      fetchProducts();
    }
  }, [searchQuery, selectedCategory, debouncedMinPrice, debouncedMaxPrice, selectedBrand, selectedType, isNewFilter, isBestSellerFilter, filtersLoaded]);

  // Fonction pour mettre à jour l'URL avec les nouveaux filtres
  const updateURLParams = (newParams) => {
    const params = new URLSearchParams(location.search);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    navigate(`/products?${params.toString()}`, { replace: true });
  };

  
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    updateURLParams({ category: value });
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    updateURLParams({ brand: value });
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
    updateURLParams({ type: value });
  };

  const handleNewFilterChange = (checked) => {
    const value = checked ? 'true' : '';
    setIsNewFilter(value);
    updateURLParams({ isNewProduct: value });
  };

  const handleBestSellerFilterChange = (checked) => {
    const value = checked ? 'true' : '';
    setIsBestSellerFilter(value);
    updateURLParams({ isBestSeller: value });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('all');
    setSelectedType('all');
    setIsNewFilter('');
    setIsBestSellerFilter('');
    navigate('/products', { replace: true });
  };

  // Fonction pour générer le titre dynamique de la page
  const getPageTitle = () => {
    let title = 'Notre Catalogue';
    let subtitle = '';

    if (selectedCategory !== 'all') {
      const categoryName = getCategoryNameById(selectedCategory);
      if (categoryName) {
        title = `Parfums ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}`;
      }
    }

    if (selectedType && selectedType !== 'all') {
      subtitle += selectedType;
    }

    if (isNewFilter === 'true') {
      subtitle += subtitle ? ' - Nouveautés' : 'Nouveautés';
    }

    if (isBestSellerFilter === 'true') {
      subtitle += subtitle ? ' - Best-Sellers' : 'Best-Sellers';
    }

    if (selectedBrand && selectedBrand !== 'all') {
      subtitle += subtitle ? ` - ${selectedBrand}` : selectedBrand;
    }

    return { title, subtitle };
  };

  if (loading) return (
    <div className="text-center py-10">
      <Loader2 className="animate-spin inline-block mr-2" />
      Chargement des produits...
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-600">
      <p className="text-lg mb-4">{error}</p>
      <Button onClick={() => window.location.reload()} variant="outline">
        Réessayer
      </Button>
    </div>
  );

  const { title, subtitle } = getPageTitle();

  return (
    <>
      <Helmet>
        <title>{title}{subtitle ? ` - ${subtitle}` : ''}</title>
        <meta name="description" content={`Découvrez notre sélection de ${title.toLowerCase()}. ${subtitle}. Trouvez le parfum parfait chez Fragrance de Mumu.`} />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Titre dynamique */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-lg text-gray-600">{subtitle}</p>
          )}
          {products.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Section de filtres et recherche */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher un parfum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => updateURLParams({ keyword: searchQuery })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') updateURLParams({ keyword: searchQuery });
                }}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Filtre par catégorie */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre par marque */}
            <Select value={selectedBrand} onValueChange={handleBrandChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les marques</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre par type de produit */}
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type de produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtres de prix avec boutons d'application */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 items-center">
            <Input
              type="number"
              placeholder="Prix minimum"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
            <Input
              type="number"
              placeholder="Prix maximum"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
            <Button
              onClick={() => updateURLParams({ minPrice, maxPrice })}
              className="w-full py-2"
              disabled={minPrice === debouncedMinPrice && maxPrice === debouncedMaxPrice}
            >
              Appliquer le filtre de prix
            </Button>
          </div>

          {/* Filtres par checkboxes */}
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewFilter === 'true'}
                onChange={(e) => handleNewFilterChange(e.target.checked)}
                className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">Nouveautés</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSellerFilter === 'true'}
                onChange={(e) => handleBestSellerFilterChange(e.target.checked)}
                className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">Best-Sellers</span>
            </label>
          </div>

          {/* Bouton pour effacer les filtres */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClearFilters}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Effacer les filtres
            </Button>
          </div>
        </div>

        {/* Grille de produits */}
        {products.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            <p className="text-lg mb-2">Aucun produit trouvé avec ces critères.</p>
            <p className="text-sm">Essayez de modifier vos filtres ou de rechercher autre chose.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} /> 
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductListingPage;