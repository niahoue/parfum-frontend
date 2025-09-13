// src/pages/MyAccountPage.jsx (Page du compte utilisateur)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom'; // Importez useLocation
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, ShoppingBag, Heart, Settings, LayoutDashboard, Edit, Save, Loader2, Phone, MapPin } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-hot-toast';

// Sous-composant pour l'édition du profil
const UserProfileEdit = ({ user, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
    phone: user.phone || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Modifier Mon Profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="country">Pays</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleInputChange} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            Sauvegarder
          </Button>
        </div>
      </form>
    </div>
  );
};


// Sous-composant pour l'affichage du profil
const UserProfile = ({ user, onEditClick }) => {
  if (!user) return <div>Veuillez vous connecter.</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Mon Profil</h2>
      <div className="space-y-4 text-lg">
        <p><strong>Nom :</strong> {user.name || 'Non spécifié'}</p> 
        <p><strong>Email :</strong> {user.email}</p>
        {user.phone && <p className="flex items-center"><Phone className="mr-2 h-5 w-5 text-gray-600" /><strong>Téléphone :</strong> {user.phone}</p>}
        {user.address && <p className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-gray-600" /><strong>Adresse :</strong> {user.address}</p>}
        {user.city && <p><strong>Ville :</strong> {user.city}</p>}
        {user.country && <p><strong>Pays :</strong> {user.country}</p>}
        <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" onClick={onEditClick}>
          <Edit className="mr-2 h-4 w-4" /> Modifier le profil
        </Button>
      </div>
    </div>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/orders/myorders'); // Route pour les commandes de l'utilisateur connecté
        setOrders(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement de vos commandes.');
        console.error(err);
        toast.error('Erreur lors du chargement de vos commandes.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement de vos commandes...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (orders.length === 0) return <div className="text-center py-10 text-gray-600">Vous n'avez pas encore passé de commandes.</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Mes Commandes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
              <th className="py-3 px-4 border-b">ID Commande</th>
              <th className="py-3 px-4 border-b">Date</th>
              <th className="py-3 px-4 border-b">Total</th>
              <th className="py-3 px-4 border-b">Payé</th>
              <th className="py-3 px-4 border-b">Livré</th>
              <th className="py-3 px-4 border-b">Articles</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50 border-b border-gray-100">
                <td className="py-3 px-4 text-sm">{order._id.substring(0, 8)}...</td>
                <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="py-3 px-4">{order.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</td>
                <td className="py-3 px-4">{order.isPaid ? 'Oui' : 'Non'}</td>
                <td className="py-3 px-4">{order.isDelivered ? 'Oui' : 'Non'}</td>
                <td className="py-3 px-4">
                  <ul className="list-disc list-inside text-sm">
                    {order.orderItems.map(item => (
                      <li key={item.product._id}>{item.product.name} (x{item.qty})</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data: userData } = await axiosClient.get('/users/profile');
        if (userData.favorites && userData.favorites.length > 0) {
          const productDetailsPromises = userData.favorites.map(productId =>
            axiosClient.get(`/products/${productId}`)
          );
          const results = await Promise.all(productDetailsPromises);
          setWishlistItems(results.map(res => res.data));
        } else {
          setWishlistItems([]);
        }
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement de votre liste de souhaits.');
        console.error(err);
        toast.error('Erreur lors du chargement de votre liste de souhaits.');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement de votre liste de souhaits...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (wishlistItems.length === 0) return <div className="text-center py-10 text-gray-600">Votre liste de souhaits est vide.</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Ma Liste de Souhaits</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlistItems.map(item => (
          <Card key={item._id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Link to={`/product/${item._id}`}>
              <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover object-center" />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                <p className="text-gray-600 font-bold mt-1">{item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</p>
                {/* Ajoutez un bouton pour retirer de la wishlist ou ajouter au panier */}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};


const MyAccountPage = () => {
  const { user, authLoading,  updateAuthUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Utilisez useLocation pour obtenir le chemin actuel
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Veuillez vous connecter pour accéder à cette page.');
      navigate('/login?redirect=/mon-compte');
    }
  }, [user, authLoading, navigate]);

  const handleSaveProfile = async (updatedData) => {
    setProfileUpdateLoading(true);
    try {
      const { data } = await axiosClient.put('/users/profile', updatedData);
      updateAuthUserProfile(data);
      toast.success('Profil mis à jour avec succès !');
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      toast.error(err.response?.data?.message || 'Échec de la mise à jour du profil.');
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
        <span className="ml-2 text-lg text-gray-700">Chargement ou redirection...</span>
      </div>
    );
  }

  // Déterminez si un lien doit être "actif" pour le style
  const isActiveLink = (path) => {
    // Vérifie si le chemin actuel commence par le chemin du lien
    return location.pathname.startsWith(`/mon-compte/${path}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Mon Compte</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de navigation du compte */}
        <nav className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md flex-shrink-0">
          <ul className="space-y-4">
            <li>
              <Link
                to="/mon-compte"
                className={`flex items-center text-lg font-medium transition-colors ${
                  location.pathname === '/mon-compte' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <LayoutDashboard className="mr-3 w-5 h-5" /> Vue d'ensemble
              </Link>
            </li>
            <li>
              <Link
                to="/mon-compte/profile"
                className={`flex items-center text-lg font-medium transition-colors ${
                  isActiveLink('profile') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <User className="mr-3 w-5 h-5" /> Mon Profil
              </Link>
            </li>
            <li>
              <Link
                to="/mon-compte/orders"
                className={`flex items-center text-lg font-medium transition-colors ${
                  isActiveLink('orders') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <ShoppingBag className="mr-3 w-5 h-5" /> Mes Commandes
              </Link>
            </li>
            <li>
              <Link
                to="/mon-compte/wishlist"
                className={`flex items-center text-lg font-medium transition-colors ${
                  isActiveLink('wishlist') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <Heart className="mr-3 w-5 h-5" /> Ma Liste de Souhaits
              </Link>
            </li>
            <li>
              <Link
                to="/mon-compte/settings"
                className={`flex items-center text-lg font-medium transition-colors ${
                  isActiveLink('settings') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                <Settings className="mr-3 w-5 h-5" /> Paramètres
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contenu principal du compte */}
        <div className="flex-grow bg-white p-8 rounded-lg shadow-md">
          <Routes>
            <Route
              index
              element={
                isEditingProfile ? (
                  <UserProfileEdit
                    user={user}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditingProfile(false)}
                    loading={profileUpdateLoading}
                  />
                ) : (
                  <UserProfile user={user} onEditClick={() => setIsEditingProfile(true)} />
                )
              }
            />
            <Route
              path="profile"
              element={
                isEditingProfile ? (
                  <UserProfileEdit
                    user={user}
                    onSave={handleSaveProfile}
                    onCancel={() => setIsEditingProfile(false)}
                    loading={profileUpdateLoading}
                  />
                ) : (
                  <UserProfile user={user} onEditClick={() => setIsEditingProfile(true)} />
                )
              }
            />
            <Route path="orders" element={<UserOrders />} />
            <Route path="wishlist" element={<UserWishlist />} />
            <Route path="settings" element={<div><h2 className="text-3xl font-bold mb-6">Paramètres du Compte</h2><p className="text-gray-700">Page des paramètres du compte utilisateur.</p></div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
