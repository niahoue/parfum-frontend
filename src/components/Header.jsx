// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient'; 

const Header = ({ onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItemsCount } = useCart();
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [promo, setPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(true);

  // Charger les catégories au montage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosClient.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories pour le header:', err);
      }
    };
    fetchCategories();
  }, []);

  // useEffect pour charger dynamiquement la promotion active
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setPromoLoading(true);
        const { data } = await axiosClient.get('/promotions/active');
       
        if (data && data.message && data.startDate && data.endDate) {
          const now = new Date();
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);
          
          const isCurrentlyActive = startDate <= now && endDate >= now && (data.isActive !== false);
          
          if (isCurrentlyActive) {
            setPromo(data);
          } else {
            setPromo(null);
          }
        } 
        else if (data && data.isActive === false) {
          setPromo(null);
        }
        else {
          setPromo(null);
        }
        
      } catch (error) {
        console.error("Erreur lors du chargement des promotions:", error);
        setPromo(null);
      } finally {
        setPromoLoading(false);
      }
    };

    fetchPromotions();
    
    const intervalId = setInterval(fetchPromotions, 5 * 60 * 1000); 
    return () => clearInterval(intervalId); 
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const isUserAdmin = () => {
    if (!user) return false;
    if (user.role) {
      return user.role === 'admin';
    }
    if (typeof user.isAdmin !== 'undefined') {
      return user.isAdmin === true || user.isAdmin === 'true';
    }
    return user.admin === true ||
           user.admin === 'true' ||
           user.type === 'admin';
  };

  // Fonction améliorée pour gérer la navigation avec les filtres
  const handleNavigateWithFilters = (categoryName, type = null, isNew = null, isBestSeller = null) => {
    // Trouve la catégorie correspondante
    const category = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (category) {
      const params = new URLSearchParams();
      params.append('category', category._id);
      
      // Ajouter les autres filtres si spécifiés
      if (type) params.append('type', type);
      if (isNew === true) params.append('isNewProduct', 'true');
      if (isBestSeller === true) params.append('isBestSeller', 'true');
      
      // Navigation vers la page de listing avec les paramètres
      navigate(`/products?${params.toString()}`);
    } else {
      console.warn(`Catégorie "${categoryName}" non trouvée.`);
      // Fallback: si la catégorie n'est pas trouvée, naviguer avec juste le type si spécifié
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (isNew === true) params.append('isNewProduct', 'true');
      if (isBestSeller === true) params.append('isBestSeller', 'true');
      
      navigate(`/products?${params.toString()}`);
    }
    
    // Fermer les menus après navigation
    setIsMenuOpen(false);
  };

  // Fonction pour gérer la navigation pour les marques
  const handleNavigateToBrand = (brandName) => {
    const params = new URLSearchParams();
    params.append('brand', brandName);
    navigate(`/products?${params.toString()}`);
    setIsMenuOpen(false);
  };

  // Fonction pour la recherche globale
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('keyword', searchQuery.trim());
    }
    navigate(`/products?${params.toString()}`);
    setIsMenuOpen(false);
  };

  // Configuration de la navigation avec les sous-menus améliorés
  const navigation = [
    { 
      name: 'Parfums Femme', 
      href: '/products?category=' + (categories.find(cat => cat.name.toLowerCase() === 'femme')?._id || ''),
      type: 'category', 
      categoryName: 'femme', 
      submenu: [
        { 
          name: 'Eau de Parfum', 
          onClick: () => handleNavigateWithFilters('femme', 'Eau de Parfum') 
        },
        { 
          name: 'Eau de Toilette', 
          onClick: () => handleNavigateWithFilters('femme', 'Eau de Toilette') 
        },
        { 
          name: 'Nouveautés', 
          onClick: () => handleNavigateWithFilters('femme', null, true, null) 
        },
        { 
          name: 'Best-Sellers', 
          onClick: () => handleNavigateWithFilters('femme', null, null, true) 
        }
      ]
    },
    { 
      name: 'Parfums Homme', 
      href: '/products?category=' + (categories.find(cat => cat.name.toLowerCase() === 'homme')?._id || ''),
      type: 'category', 
      categoryName: 'homme', 
      submenu: [
        { 
          name: 'Eau de Parfum', 
          onClick: () => handleNavigateWithFilters('homme', 'Eau de Parfum') 
        },
        { 
          name: 'Eau de Toilette', 
          onClick: () => handleNavigateWithFilters('homme', 'Eau de Toilette') 
        },
        { 
          name: 'Nouveautés', 
          onClick: () => handleNavigateWithFilters('homme', null, true, null) 
        },
        { 
          name: 'Best-Sellers', 
          onClick: () => handleNavigateWithFilters('homme', null, null, true) 
        }
      ]
    },
    { 
      name: 'Parfums Mixte', 
      href: '/products?category=' + (categories.find(cat => cat.name.toLowerCase() === 'mixte')?._id || ''),
      type: 'category', 
      categoryName: 'mixte', 
      submenu: [
        { 
          name: 'Unisexe', 
          onClick: () => handleNavigateWithFilters('mixte', 'Unisexe') 
        },
        { 
          name: 'Niche', 
          onClick: () => handleNavigateWithFilters('mixte', 'Niche') 
        },
        { 
          name: 'Artisanal', 
          onClick: () => handleNavigateWithFilters('mixte', 'Artisanal') 
        }
      ]
    },
    { 
      name: 'Marques', 
      href: '/marques', 
      submenu: [
        { name: 'Chanel', onClick: () => handleNavigateToBrand('Chanel') },
        { name: 'Dior', onClick: () => handleNavigateToBrand('Dior') },
        { name: 'Tom Ford', onClick: () => handleNavigateToBrand('Tom Ford') },
        { name: 'YSL', onClick: () => handleNavigateToBrand('Yves Saint Laurent') },
        { name: 'Toutes les marques', href: '/marques/all' }
      ]
    },
    {
      name:'Cosmétiques',
      href: '/products?category=' + (categories.find(cat => cat.name.toLowerCase() === 'cosmetiques')?._id || ''),
      type: 'category', 
      categoryName: 'cosmetiques', 
      submenu: [
        { 
          name: 'Soins de Cheveux', 
          onClick: () => handleNavigateWithFilters('cosmetiques', 'Soins de Cheveux') 
        },
        { 
          name: 'Soins de Visage', 
          onClick: () => handleNavigateWithFilters('cosmetiques', 'Soins de Visage') 
        },
        { 
          name: 'Pommade', 
          onClick: () => handleNavigateWithFilters('cosmetiques', 'Pommade') 
        },
        { 
          name: 'Nouveautés', 
          onClick: () => handleNavigateWithFilters('cosmetiques', null, true, null) 
        },
        { 
          name: 'Best-Sellers', 
          onClick: () => handleNavigateWithFilters('cosmetiques', null, null, true) 
        }
      ]
    },
    { name: 'Promotions', href: '/promotions' },
    { name: 'Nouveautés', href: '/nouveautes' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      {/* Top bar with promo */}
      {!promoLoading && promo && promo.message && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm">
          <p>{promo.message}</p>
        </div>
      )}

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fragrance de Mumu
              </div>
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher un parfum, une marque..."
                className="pl-10 pr-4 w-full border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Button variant="ghost" size="sm" className="hidden sm:flex items-center" asChild>
              <Link to="/favoris">
                <Heart className="h-5 w-5" />
                <span className="ml-1 text-sm">Favoris</span>
              </Link>
            </Button>

            {/* Account - Conditional Link or Dropdown */}
            <div className="relative hidden sm:block">
              {authLoading ? (
                <span className="flex items-center text-sm text-gray-500 ml-2">Chargement...</span>
              ) : user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User className="h-5 w-5" />
                    <span className="ml-1 text-sm">
                      {isUserAdmin() ? "Dashboard" : "Mon Compte"}
                    </span>
                  </Button>

                  {/* Menu déroulant */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        {isUserAdmin() ? (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Dashboard Admin
                          </Link>
                        ) : (
                          <>
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Mon Profil
                            </Link>
                            <Link
                              to="/historique-commandes"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Mes Commandes
                            </Link>
                          </>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                  <User className="h-5 w-5 mr-1" /> Connexion
                </Link>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative flex items-center"
              onClick={onCartClick}
              asChild
            >
              <Link to="/panier">
                <ShoppingBag className="h-5 w-5" />
                <span className="ml-1 text-sm hidden sm:inline">Panier</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item, index) => (
              <div key={index} className="relative group">
                <Button
                  variant="ghost"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-transparent"
                  asChild
                >
                  {item.href ? (
                    <Link to={item.href}>
                      {item.name}
                    </Link>
                  ) : (
                    <span>{item.name}</span> 
                  )}
                </Button>
                {item.submenu && (
                  <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={(e) => {
                            e.preventDefault();
                            if (subItem.onClick) {
                              subItem.onClick();
                            } else if (subItem.href) {
                              navigate(subItem.href);
                            }
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile search */}
            <form onSubmit={handleSearchSubmit} className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {navigation.map((item, index) => (
              <div key={index}>
                {/* Liens de menu principal mobile */}
                {item.href ? (
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="block px-3 py-2 text-base font-medium text-gray-700">{item.name}</span>
                )}

                {/* Sous-menu mobile */}
                {item.submenu && (
                  <div className="pl-4 border-l border-gray-200 ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={(e) => {
                          e.preventDefault();
                          if (subItem.onClick) {
                            subItem.onClick();
                          } else if (subItem.href) {
                            navigate(subItem.href);
                          }
                        }}
                        className="w-full text-left block px-3 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile - User links based on auth status */}
            <div className="border-t border-gray-200 my-2 pt-2">
              {authLoading ? (
                <span className="block px-3 py-2 text-base font-medium text-gray-500">Chargement...</span>
              ) : user ? (
                <>
                  {isUserAdmin() ? (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard Admin
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mon Profil
                      </Link>
                      <Link
                        to="/historique-commandes"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mes Commandes
                      </Link>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start block px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" /> Déconnexion
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;