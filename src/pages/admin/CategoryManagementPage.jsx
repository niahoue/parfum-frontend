// src/pages/admin/CategoryManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, Edit, PlusCircle, Loader2, Search, Filter, FolderOpen } from 'lucide-react';
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
import { toast } from 'react-hot-toast';

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrer les catégories par nom
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour récupérer toutes les catégories
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      let res;
      if (editingCategory) {
        res = await axiosClient.put(`/categories/${editingCategory._id}`, { name: categoryName });
        toast.success('Catégorie mise à jour avec succès !');
        setCategories(categories.map(cat => cat._id === editingCategory._id ? { ...cat, name: res.data.name } : cat));
      } else {
        res = await axiosClient.post('/categories', { name: categoryName });
        toast.success('Catégorie ajoutée avec succès !');
        setCategories([...categories, res.data]);
      }
      setIsModalOpen(false);
      setCategoryName('');
    } catch (err) {
      console.error('Erreur lors de la soumission de la catégorie:', err);
      toast.error(err.response?.data?.message || 'Échec de l\'opération sur la catégorie.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setLoading(true);
      try {
        await axiosClient.delete(`/categories/${id}`);
        toast.success('Catégorie supprimée avec succès !');
        setCategories(categories.filter(cat => cat._id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression de la catégorie:', err);
        toast.error(err.response?.data?.message || 'Échec de la suppression de la catégorie.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-slate-600">Chargement des catégories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xl text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête moderne */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <FolderOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Catégories</h1>
                <p className="text-slate-600 mt-1">{categories.length} catégorie{categories.length > 1 ? 's' : ''} enregistrée{categories.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button 
                onClick={() => handleOpenModal()} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Nouvelle Catégorie
              </Button>
            </div>
          </div>
        </div>

        {/* Tableau moderne */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <TableHead className="font-semibold text-slate-700 py-4">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Nom de la Catégorie</TableHead>
                  <TableHead className="font-semibold text-slate-700">Date de Création</TableHead>
                  <TableHead className="font-semibold text-slate-700">Dernière Mise à Jour</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow 
                    key={category._id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <TableCell className="font-mono text-sm text-slate-500 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded-md">
                        #{String(index + 1).padStart(3, '0')}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                          <FolderOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-800">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{new Date(category.createdAt).toLocaleDateString('fr-FR')}</span>
                        <span className="text-xs text-slate-400">{new Date(category.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      <div className="flex flex-col">
                        <span className="font-medium">{new Date(category.updatedAt).toLocaleDateString('fr-FR')}</span>
                        <span className="text-xs text-slate-400">{new Date(category.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenModal(category)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(category._id)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg"
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

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                {searchTerm ? 'Aucune catégorie trouvée' : 'Aucune catégorie'}
              </h3>
              <p className="text-slate-500">
                {searchTerm ? 'Essayez de modifier votre recherche.' : 'Commencez par ajouter votre première catégorie.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal moderne */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl shadow-2xl border-0">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                Nom de la catégorie
              </label>
              <Input
                id="name"
                name="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Entrez le nom de la catégorie..."
                className="w-full border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                required
              />
            </div>
            <DialogFooter className="gap-3 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg px-6"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={formLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-6"
              >
                {formLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {editingCategory ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagementPage;