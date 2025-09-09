import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Loader2, Users, Package, ShoppingBag, DollarSign, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/stats/dashboard');
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError(err.response?.data?.message || 'Échec du chargement des statistiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement des statistiques...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Statistiques du Tableau de Bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Commandes Récentes</h2>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Commande</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payé</TableHead>
              <TableHead>Livré</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.recentOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">Aucune commande récente.</TableCell>
              </TableRow>
            ) : (
              stats.recentOrders.map(order => (
                <TableRow key={order._id}>
                  <TableCell className="text-sm">{order._id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.user?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{order.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</TableCell>
                  <TableCell>
                    {order.isPaid ? <CheckCircle className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered ? <CheckCircle className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatisticsPage;
