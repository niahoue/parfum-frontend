// src/pages/admin/CategoryManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, Edit, PlusCircle, Loader2 } from 'lucide-react';
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
import { toast } from 'react-hot-toast'; // Importez toast pour les notifications

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Pour la modification
  const [categoryName, setCategoryName] = useState(''); // État pour le nom de la catégorie dans le formulaire
  const [formLoading, setFormLoading] = useState(false); // État de chargement pour le formulaire (ajout/édition)

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

  // Charger les catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Gérer l'ouverture du modal pour ajouter/éditer
  const handleOpenModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category ? category.name : ''); // Pré-remplir si édition
    setIsModalOpen(true);
  };

  // Gérer la soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (editingCategory) {
        // Logique de modification
        await axiosClient.put(`/categories/${editingCategory._id}`, { name: categoryName });
        toast.success('Catégorie mise à jour avec succès !');
      } else {
        // Logique d'ajout
        await axiosClient.post('/categories', { name: categoryName });
        toast.success('Catégorie ajoutée avec succès !');
      }
      setIsModalOpen(false); // Fermer le modal
      setCategoryName(''); // Réinitialiser le champ
      fetchCategories(); // Recharger la liste des catégories
    } catch (err) {
      console.error('Erreur lors de la soumission de la catégorie:', err);
      setError(err.response?.data?.message || 'Échec de l\'opération sur la catégorie.');
      toast.error(err.response?.data?.message || 'Échec de l\'opération sur la catégorie.');
    } finally {
      setFormLoading(false);
    }
  };

  // Gérer la suppression d'une catégorie
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setLoading(true); // Utilisez loading global ou un état spécifique pour la suppression si vous préférez
      try {
        await axiosClient.delete(`/categories/${id}`);
        toast.success('Catégorie supprimée avec succès !');
        fetchCategories(); // Recharger la liste des catégories
      } catch (err) {
        console.error('Erreur lors de la suppression de la catégorie:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de la catégorie.');
        toast.error(err.response?.data?.message || 'Échec de la suppression de la catégorie.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement des catégories...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
        <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <PlusCircle className="h-5 w-5 mr-2" /> Ajouter une Catégorie
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date de Création</TableHead>
              <TableHead>Dernière Mise à Jour</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell className="text-sm">{category._id.substring(0, 8)}...</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{new Date(category.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(category.updatedAt).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal d'ajout/édition de catégorie */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] z-50 bg-white ">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Nouvelle Catégorie'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">Nom</label>
              <Input
                id="name"
                name="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? <Loader2 className="animate-spin mr-2" /> : null}
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
