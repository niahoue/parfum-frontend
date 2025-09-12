// src/pages/DashboardPage.jsx (Page Admin - Design Moderne)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Package, Users, ShoppingBag, Settings, LayoutDashboard, CheckCircle, X, Percent, Mail, Info,
  TrendingUp, Star, Activity, BarChart3, ArrowUpRight, Calendar, Clock, DollarSign
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-hot-toast';
import NotFoundPage from '../NotFoundPage';
import ProductManagementPage from './ProductManagementPage';
import CategoryManagementPage from './CategoryManagementPage'; 
import OrderManagementPage from './OrderManagementPage';
import UserManagementPage from './UserManagementPage';
import NewsletterManagementPage from './NewsletterManagementPage'
import StatisticsPage from './StatisticsPage';
import ManagePromotionPage from './ManagePromotionPage';

// Sous-composants pour le tableau de bord moderne
const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Simulation de chargement des statistiques
    const loadStats = async () => {
      try {
        // Remplacez par vos vraies API calls
        const productsRes = await axiosClient.get('/products');
        const ordersRes = await axiosClient.get('/orders');
        const usersRes = await axiosClient.get('/users');
        
        setStats({
          totalProducts: productsRes.data.products?.length || 0,
          totalOrders: ordersRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          totalRevenue: ordersRes.data?.reduce((sum, order) => sum + (order.totalPrice || 0), 0) || 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Statistiques principales avec design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Revenus Totaux</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} XOF</p>
                <div className="flex items-center mt-2 text-blue-100">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+12% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Commandes</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <div className="flex items-center mt-2 text-emerald-100">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  <span className="text-sm">+8% ce mois</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-full">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Produits</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
                <div className="flex items-center mt-2 text-purple-100">
                  <Activity className="w-4 h-4 mr-1" />
                  <span className="text-sm">En stock</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-full">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Utilisateurs</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <div className="flex items-center mt-2 text-orange-100">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm">Actifs</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-full">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides avec design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center group-hover:text-purple-600 transition-colors">
              <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              Gestion des Produits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérez l'inventaire des produits, ajoutez ou modifiez des articles.</p>
            <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg transition-all duration-300">
              <Link to="products" className="flex items-center justify-center">
                Gérer les produits
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center group-hover:text-blue-600 transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              Gestion des Catégories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérez les catégories, ajoutez ou modifiez les catégories.</p>
            <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300">
              <Link to="categories" className="flex items-center justify-center">
                Gérer les catégories
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center group-hover:text-emerald-600 transition-colors">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3 group-hover:bg-emerald-200 transition-colors">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
              </div>
              Gestion des Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Suivez et traitez les commandes des clients.</p>
            <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg transition-all duration-300">
              <Link to="orders" className="flex items-center justify-center">
                Gérer les commandes
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center group-hover:text-pink-600 transition-colors">
              <div className="p-2 bg-pink-100 rounded-lg mr-3 group-hover:bg-pink-200 transition-colors">
                <Percent className="w-5 h-5 text-pink-600" />
              </div>
              Gestion des Promotions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérez les promotions des produits.</p>
            <Button asChild className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 shadow-lg transition-all duration-300">
              <Link to="promotions" className="flex items-center justify-center">
                Gérer les promotions
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center group-hover:text-indigo-600 transition-colors">
              <div className="p-2 bg-indigo-100 rounded-lg mr-3 group-hover:bg-indigo-200 transition-colors">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              Gestion des Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérez les comptes clients et les rôles.</p>
            <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-lg transition-all duration-300">
              <Link to="users" className="flex items-center justify-center">
                Gérer les utilisateurs
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center group-hover:text-teal-600 transition-colors">
              <div className="p-2 bg-teal-100 rounded-lg mr-3 group-hover:bg-teal-200 transition-colors">
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              Gestion des Newsletters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérez les abonnements et les envois de newsletters.</p>
            <Button asChild className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg transition-all duration-300">
              <Link to="newsletters" className="flex items-center justify-center">
                Gérer les newsletters
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sous-composant AdminProducts (pour afficher la liste simplifiée)
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/products');
        setProducts(data.products || []);
      } catch (err) {
        setError('Erreur lors du chargement des produits.');
        console.error(err);
        toast.error('Erreur lors du chargement des produits.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      <span className="ml-2 text-gray-600">Chargement des produits...</span>
    </div>
  );
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Aperçu des Produits</h2>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
          <Link to="products" className="flex items-center">
            Voir tout
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
      
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Nom</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Marque</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Prix</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.slice(0, 5).map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600 font-mono">{product._id.substring(0, 8)}...</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                    <td className="py-4 px-6 text-gray-600">{product.brand}</td>
                    <td className="py-4 px-6 font-semibold text-green-600">{product.price} XOF</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.countInStock > 10 
                          ? 'bg-green-100 text-green-800' 
                          : product.countInStock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.countInStock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant de navigation latérale moderne
const ModernSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Vue d\'ensemble', color: 'text-blue-600' },
    { path: '/admin/products', icon: Package, label: 'Produits', color: 'text-purple-600' },
    { path: '/admin/categories', icon: Info, label: 'Catégories', color: 'text-indigo-600' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Commandes', color: 'text-emerald-600' },
    { path: '/admin/users', icon: Users, label: 'Utilisateurs', color: 'text-orange-600' },
    { path: '/admin/promotions', icon: Percent, label: 'Promotions', color: 'text-pink-600' },
    { path: '/admin/newsletters', icon: Mail, label: 'Newsletters', color: 'text-teal-600' },
    { path: '/admin/stats', icon: BarChart3, label: 'Statistiques', color: 'text-cyan-600' },
  ];

  return (
    <nav className="w-64 bg-white rounded-2xl shadow-xl p-6 sticky top-6 h-fit">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Administration
        </h2>
        <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-2"></div>
      </div>
      
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                          (item.path === '/admin' && location.pathname === '/admin/');
          
          return (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md border border-purple-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 w-5 h-5 ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center text-blue-700 mb-2">
          <Activity className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Système</span>
        </div>
        <div className="text-xs text-blue-600">
          <div className="flex justify-between mb-1">
            <span>Performance</span>
            <span>98%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{width: '98%'}}></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      toast.error('Accès refusé. Vous devez être administrateur.');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (!user || !user.isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                Tableau de Bord
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Bienvenue, {user?.name} • {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar moderne */}
          <ModernSidebar />

          {/* Contenu principal */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[600px]">
              <Routes>
                <Route index element={<AdminOverview />} />
                <Route path="products" element={<ProductManagementPage />} />
                <Route path="categories" element={<CategoryManagementPage />} />
                <Route path="orders" element={<OrderManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="promotions" element={<ManagePromotionPage />} />
                <Route path="newsletters" element={<NewsletterManagementPage />} />
                <Route path="stats" element={<StatisticsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;