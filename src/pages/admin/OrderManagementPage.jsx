// src/pages/admin/OrderManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { 
  Truck, 
  CheckCircle, 
  Loader2, 
  X, 
  Trash2, 
  Search, 
  Filter,
  Eye,
  Calendar,
  DollarSign,
  Package,
  Users,
  RefreshCw,
  AlertCircle,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Badge
} from '../../components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Input
} from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'react-hot-toast';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    totalRevenue: 0
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/orders');
      setOrders(data);
      setFilteredOrders(data);
      calculateStats(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError(err.response?.data?.message || 'Échec du chargement des commandes.');
      toast.error(err.response?.data?.message || 'Échec du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const delivered = ordersData.filter(order => order.isDelivered).length;
    const pending = total - delivered;
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalPrice, 0);
    
    setStats({ total, pending, delivered, totalRevenue });
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const orderId = order._id?.toLowerCase() || '';
        const userName = order.user?.name?.toLowerCase() || '';
        const userEmail = order.user?.email?.toLowerCase() || '';
        const searchLower = searchTerm.toLowerCase();
        
        return orderId.includes(searchLower) || 
               userName.includes(searchLower) || 
               userEmail.includes(searchLower);
      });
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      if (statusFilter === 'delivered') {
        filtered = filtered.filter(order => order.isDelivered);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(order => !order.isDelivered);
      } else if (statusFilter === 'paid') {
        filtered = filtered.filter(order => order.isPaid);
      } else if (statusFilter === 'unpaid') {
        filtered = filtered.filter(order => !order.isPaid);
      }
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const handleDeliver = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette commande comme livrée ?')) {
      try {
        setLoading(true);
        await axiosClient.put(`/orders/${orderId}/deliver`);
        toast.success('Commande marquée comme livrée !');
        fetchOrders();
      } catch (err) {
        console.error('Erreur lors de la mise à jour du statut de livraison:', err);
        setError(err.response?.data?.message || 'Échec de la mise à jour du statut de livraison.');
        toast.error(err.response?.data?.message || 'Échec de la mise à jour du statut de livraison.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande définitivement ? Cette action est irréversible.')) {
      try {
        setLoading(true);
        await axiosClient.delete(`/orders/${orderId}`);
        toast.success('Commande supprimée avec succès !');
        fetchOrders();
      } catch (err) {
        console.error('Erreur lors de la suppression de la commande:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de la commande.');
        toast.error(err.response?.data?.message || 'Échec de la suppression de la commande.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (order) => {
    if (order.isDelivered) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Livrée</Badge>;
    } else if (order.isPaid) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Payée</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>;
    }
  };

  // Fonction pour obtenir le nom d'affichage de l'utilisateur
  const getUserDisplayName = (order) => {
    if (order.user?.name) {
      return order.user.name;
    }
    if (order.user?.email) {
      return order.user.email.split('@')[0]; 
    }
    return 'Utilisateur inconnu';
  };

  // Fonction pour obtenir l'email d'affichage de l'utilisateur
  const getUserDisplayEmail = (order) => {
    return order.user?.email || 'Email non disponible';
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchOrders} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
              <p className="mt-2 text-gray-600">Gérez et suivez toutes les commandes de votre boutique</p>
            </div>
            <Button onClick={fetchOrders} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Commandes</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">En Attente</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Livrées</p>
                  <p className="text-3xl font-bold">{stats.delivered}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold">
                    {stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par ID, nom client ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="delivered">Livrées</SelectItem>
                  <SelectItem value="paid">Payées</SelectItem>
                  <SelectItem value="unpaid">Non payées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des commandes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Liste des Commandes</span>
              <Badge variant="outline">{filteredOrders.length} commande(s)</Badge>
            </CardTitle>
            <CardDescription>
              Gérez les commandes, mettez à jour leur statut et effectuez des actions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID Commande</TableHead>
                    <TableHead className="font-semibold">Client</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Paiement</TableHead>
                    <TableHead className="font-semibold">Livraison</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">
                        #{order._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{getUserDisplayName(order)}</p>
                            <p className="text-sm text-gray-500">{getUserDisplayEmail(order)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {order.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {order.isPaid ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                          <span className="ml-2 text-sm">
                            {order.isPaid ? 'Payé' : 'Non payé'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {order.isDelivered ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                          <span className="ml-2 text-sm">
                            {order.isDelivered ? 'Livrée' : 'En attente'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!order.isDelivered && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeliver(order._id)}
                              disabled={loading}
                              className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                              title="Marquer comme livrée"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order._id)}
                            disabled={loading}
                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                            title="Supprimer la commande"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Aucune commande ne correspond à vos critères de recherche.'
                    : 'Il n\'y a pas encore de commandes à afficher.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderManagementPage;