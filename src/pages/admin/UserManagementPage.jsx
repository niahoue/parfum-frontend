// src/pages/admin/UserManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { 
  Trash2, 
  CheckCircle, 
  X, 
  Loader2, 
  Edit, 
  User, 
  ToggleRight, 
  ToggleLeft,
  Search,
  Filter,
  UserPlus,
  Mail,
  Shield,
  ShieldCheck,
  Users,
  RefreshCw,
  AlertCircle,
  MoreVertical
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdownMenu';
import {
  Avatar,
  AvatarFallback,
  AvatarInitials,
} from '../../components/ui/avatar';
import { toast } from 'react-hot-toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/users');
      setUsers(data);
      setFilteredUsers(data);
      calculateStats(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.response?.data?.message || 'Échec du chargement des utilisateurs.');
      toast.error(err.response?.data?.message || 'Échec du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersData) => {
    const total = usersData.length;
    const active = usersData.filter(user => user.isActive !== false).length;
    const inactive = total - active;
    const admins = usersData.filter(user => user.role === 'admin').length;
    
    setStats({ total, active, inactive, admins });
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isActive !== false);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => user.isActive === false);
      }
    }

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleOpenModal = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        setLoading(true);
        await axiosClient.delete(`/users/${id}`);
        toast.success('Utilisateur supprimé !');
        fetchUsers();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de l\'utilisateur.');
        toast.error(err.response?.data?.message || 'Échec de la suppression de l\'utilisateur.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axiosClient.put(`/users/${userId}`, { role: newRole });
      toast.success('Rôle mis à jour avec succès !');
      fetchUsers();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la mise à jour du rôle.');
    }
  };
  
  const handleUpdateActiveStatus = async (userId, currentStatus) => {
    try {
      await axiosClient.put(`/users/${userId}`, { isActive: !currentStatus });
      toast.success(`Statut de l'utilisateur mis à jour !`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la mise à jour du statut.');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Administrateur</Badge>;
    }
    return <Badge variant="outline">Utilisateur</Badge>;
  };

  const getStatusBadge = (isActive) => {
    if (isActive !== false) {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inactif</Badge>;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Chargement des utilisateurs...</p>
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
              <Button onClick={fetchUsers} className="w-full">
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
              <p className="mt-2 text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={fetchUsers} disabled={loading} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel Utilisateur
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Utilisateurs</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Comptes Actifs</p>
                  <p className="text-3xl font-bold">{stats.active}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Comptes Inactifs</p>
                  <p className="text-3xl font-bold">{stats.inactive}</p>
                </div>
                <X className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Administrateurs</p>
                  <p className="text-3xl font-bold">{stats.admins}</p>
                </div>
                <ShieldCheck className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateurs</SelectItem>
                  <SelectItem value="user">Utilisateurs</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Liste des Utilisateurs</span>
              <Badge variant="outline">{filteredUsers.length} utilisateur(s)</Badge>
            </CardTitle>
            <CardDescription>
              Gérez les comptes utilisateurs, leurs rôles et permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Utilisateur</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Rôle</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Date d'inscription</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.isActive)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateActiveStatus(user._id, user.isActive)}
                            title={user.isActive !== false ? 'Désactiver le compte' : 'Activer le compte'}
                            className="h-8 w-8 p-0"
                          >
                            {user.isActive !== false ? (
                              <ToggleRight className="h-5 w-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-red-500" />
                            )}
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenModal(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier le rôle
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                    : 'Il n\'y a pas encore d\'utilisateurs à afficher.'
                  }
                </p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un utilisateur
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de modification de l'utilisateur */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Modifier l'utilisateur</span>
              </DialogTitle>
            </DialogHeader>
            
            {editingUser && (
              <div className="py-6 space-y-6">
                {/* Informations utilisateur */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {getInitials(editingUser.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{editingUser.name}</h4>
                    <p className="text-sm text-gray-600">{editingUser.email}</p>
                    <p className="text-xs text-gray-500">ID: {editingUser._id.substring(0, 16)}...</p>
                  </div>
                </div>

                {/* Modification du rôle */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Rôle de l'utilisateur</label>
                  <Select 
                    value={editingUser.role}
                    onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Utilisateur</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Administrateur</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {editingUser.role === 'admin' 
                      ? 'Les administrateurs ont accès à toutes les fonctionnalités de gestion.'
                      : 'Les utilisateurs ont accès aux fonctionnalités de base.'
                    }
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={() => handleUpdateRole(editingUser._id, editingUser.role)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagementPage;