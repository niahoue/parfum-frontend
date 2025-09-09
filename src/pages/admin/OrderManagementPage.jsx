// src/pages/admin/OrderManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Truck, CheckCircle, Loader2, X, Trash2 } from 'lucide-react'; // Ajout de X et Trash2
// import { toast } from 'react-hot-toast'; // Ajout du Badge
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
 import { toast } from 'react-hot-toast'; // Assurez-vous que toast est décommenté si vous l'utilisez

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/orders');
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError(err.response?.data?.message || 'Échec du chargement des commandes.');
      toast.error(err.response?.data?.message || 'Échec du chargement des commandes.'); // Afficher l'erreur avec toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    // Remplacer window.confirm par une modale personnalisée si vous ne voulez pas d'alertes natives
    if (window.confirm('Êtes-vous sûr de vouloir marquer cette commande comme livrée ?')) {
      try {
        setLoading(true);
        await axiosClient.put(`/orders/${orderId}/deliver`);
        toast.success('Commande marquée comme livrée !');
        fetchOrders(); // Recharger les commandes après la mise à jour
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
        fetchOrders(); // Recharger les commandes après la suppression
      } catch (err) {
        console.error('Erreur lors de la suppression de la commande:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de la commande.');
        toast.error(err.response?.data?.message || 'Échec de la suppression de la commande.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement des commandes...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Commandes</h1>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payé</TableHead>
              <TableHead>Livré</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="text-sm">{order._id.substring(0, 8)}...</TableCell>
                <TableCell>{order.user?.name || 'N/A'}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{order.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</TableCell>
                <TableCell>
                  {order.isPaid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  {!order.isDelivered && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeliver(order._id)}
                      disabled={loading}
                      className="mr-2"
                    >
                      <Truck className="h-4 w-4 mr-2" /> Livrer
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderManagementPage;
