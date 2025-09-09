// src/pages/admin/UserManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Trash2, CheckCircle, X, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
// import { toast } from 'react-hot-toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/users'); // Assurez-vous d'avoir une route GET /api/users (Admin)
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.response?.data?.message || 'Échec du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        setLoading(true);
        await axiosClient.delete(`/users/${id}`); // Assurez-vous d'avoir une route DELETE /api/users/:id (Admin)
        // toast.success('Utilisateur supprimé !');
        fetchUsers();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de l\'utilisateur.');
        // toast.error('Échec de la suppression de l\'utilisateur.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Logique pour changer le rôle ou l'état actif de l'utilisateur (à implémenter sur le backend d'abord)
  // const toggleAdminStatus = async (user) => { ... };
  // const toggleActiveStatus = async (user) => { ... };


  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement des utilisateurs...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NOM</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ADMIN</TableHead>
              <TableHead>ACTIF</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="text-sm">{user._id.substring(0, 8)}...</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {/* Ajouter des boutons pour modifier le rôle ou le statut actif si backend implémenté */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagementPage;
