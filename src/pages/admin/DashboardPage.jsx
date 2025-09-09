// src/pages/DashboardPage.jsx (Page Admin)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, Users, ShoppingBag, Settings, LayoutDashboard, CheckCircle, X, Percent,Mail,Info} from 'lucide-react';
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

// Sous-composants pour le tableau de bord
const AdminOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Package className="mr-2" /> Gestion des Produits</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Gérez l'inventaire des produits, ajoutez ou modifiez des articles.</p>
        <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700">
          <Link to="products">Gérer les produits</Link>
        </Button>
      </CardContent>
    </Card>
      <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Info className="mr-2" /> Gestion des Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Gérez les categories, ajoutez ou modifiez les categories.</p>
        <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700">
          <Link to="categories">Gérer les categories</Link>
        </Button>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><ShoppingBag className="mr-2" /> Gestion des Commandes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Suivez et traitez les commandes des clients.</p>
        <Button asChild className="mt-4 bg-pink-600 hover:bg-pink-700">
          <Link to="orders">Gérer les commandes</Link>
        </Button>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Percent className="mr-2" /> Gestion des Promotions </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Gérez les Promotions des produits </p>
        <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
          <Link to="promotions">Gérer les Promotions</Link>
        </Button>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Users className="mr-2" /> Gestion des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Gérez les comptes clients et les rôles.</p>
        <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
          <Link to="users">Gérer les utilisateurs</Link>
        </Button>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Mail className="mr-2" /> Gestion des Newsletters</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Gérez les abonnements et les envois de newsletters.</p>
        <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700">
          <Link to="newsletters">Gérer les newsletters</Link>
        </Button>
      </CardContent>
    </Card>
  </div>
);

// Sous-composant AdminProducts (pour afficher la liste simplifiée)
// Ce composant est un simple aperçu. Le composant complet ProductManagementPage est rendu via la route.
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/products');
        setProducts(data.products || []); // S'assurer que 'products' est un tableau
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

  if (loading) return <div>Chargement des produits...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Aperçu des Produits</h2>
      <Button asChild className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Link to="products">Voir la gestion complète des produits</Link>
      </Button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Nom</th>
              <th className="py-3 px-4 border-b">Marque</th>
              <th className="py-3 px-4 border-b">Prix</th>
              <th className="py-3 px-4 border-b">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map(product => ( // Limiter à 5 produits pour l'aperçu
              <tr key={product._id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="py-3 px-4">{product._id.substring(0, 8)}...</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.brand}</td>
                <td className="py-3 px-4">{product.price} XOF</td>
                <td className="py-3 px-4">{product.countInStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sous-composant AdminCategories pour afficher un aperçu des catégories
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/categories');
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError(err.response?.data?.message || 'Échec du chargement des catégories.');
        toast.error('Échec du chargement des catégories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div>Chargement des catégories...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Aperçu des Catégories</h2>
      <Button asChild className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Link to="categories">Voir la gestion complète des catégories</Link>
      </Button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Nom</th>
              <th className="py-3 px-4 border-b">Créée le</th>
            </tr>
          </thead>
          <tbody>
            {categories.slice(0, 5).map(category => ( // Limiter à 5 catégories pour l'aperçu
              <tr key={category._id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="py-3 px-4">{category._id.substring(0, 8)}...</td>
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">{new Date(category.createdAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// Sous-composant AdminOrders (pour afficher la liste simplifiée)
// Ce composant est un simple aperçu. Le composant complet OrderManagementPage est rendu via la route.
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/orders'); // Route admin pour toutes les commandes
        setOrders(data);
      } catch (err) {
        setError('Erreur lors du chargement des commandes.');
        console.error(err);
        toast.error('Erreur lors du chargement des commandes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Chargement des commandes...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Aperçu des Commandes</h2>
      <Button asChild className="mb-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
        <Link to="orders">Voir la gestion complète des commandes</Link>
      </Button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">ID Commande</th>
              <th className="py-3 px-4 border-b">Client</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Total</th>
              <th className="py-3 px-4 border-b">Payé</th>
              <th className="py-3 px-4 border-b">Livré</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => ( // Limiter à 5 commandes pour l'aperçu
              <tr key={order._id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="py-3 px-4">{order._id.substring(0, 8)}...</td>
                <td className="py-3 px-4">{order.user?.name || 'N/A'}</td>
                <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="py-3 px-4">{order.totalPrice} XOF</td>
                <td className="py-3 px-4">
                  {order.isPaid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                </td>
                <td className="py-3 px-4">
                  {order.isDelivered ? <CheckCircle className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sous-composant AdminUsers (pour afficher la liste simplifiée)
// Ce composant est un simple aperçu. Le composant complet UserManagementPage est rendu via la route.
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/users'); // Route admin pour tous les utilisateurs
        setUsers(data);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs.');
        console.error(err);
        toast.error('Erreur lors du chargement des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Chargement des utilisateurs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Aperçu des Utilisateurs</h2>
      <Button asChild className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        <Link to="users">Voir la gestion complète des utilisateurs</Link>
      </Button>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Nom</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map(user => ( // Limiter à 5 utilisateurs pour l'aperçu
              <tr key={user._id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="py-3 px-4">{user._id.substring(0, 8)}...</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.isAdmin ? 'Oui' : 'Non'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
       toast.error('Accès refusé. Vous devez être administrateur.');
      navigate('/'); // Redirige si pas admin
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (!user || !user.isAdmin)) {
    return <div className="text-center py-10">Chargement ou redirection...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tableau de Bord Administrateur</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de navigation Admin */}
        <nav className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md flex-shrink-0">
          <ul className="space-y-4">
            <li>
              {/* Liens absolus pour la navigation dans le tableau de bord */}
              <Link to="/admin" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <LayoutDashboard className="mr-3 w-5 h-5" /> Vue d'ensemble
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <Package className="mr-3 w-5 h-5" /> Produits
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <Package className="mr-3 w-5 h-5" /> Catégories
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <ShoppingBag className="mr-3 w-5 h-5" /> Commandes
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <Users className="mr-3 w-5 h-5" /> Utilisateurs
              </Link>
            </li>
            <li>
              <Link
                to="/admin/promotions" 
                className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors"
              >
                <Percent className="mr-3 w-5 h-5" /> {/* Icône pour promotions */}
                Promotions
              </Link>
            </li>
            <li>
              <Link to="/admin/newsletters" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <Mail className="mr-3 w-5 h-5" /> Newsletters
              </Link>
            </li>
            <li>
              <Link to="/admin/stats" className="flex items-center text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors">
                <Settings className="mr-3 w-5 h-5" /> Statistiques
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contenu principal du tableau de bord */}
        <div className="flex-grow bg-white p-8 rounded-lg shadow-md">
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
  );
};

export default DashboardPage;
