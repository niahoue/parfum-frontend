// src/pages/admin/NewsletterManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Trash2, Loader2, Mail, Users, Edit, PlusCircle } from 'lucide-react'; // Ajout de Edit et PlusCircle
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog, // Importez le composant Dialog
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input'; // Importez le composant Input
import { toast } from 'react-hot-toast';

const NewsletterManagementPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true); // Pour le chargement initial de la table
  const [error, setError] = useState(null); // Pour les erreurs générales
  
  // États pour le modal d'ajout/édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null); // Stocke l'abonné en cours d'édition
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberIsActive, setSubscriberIsActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false); // Pour le chargement du formulaire modal

  // Fonction pour récupérer tous les abonnés
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      // Assurez-vous que cette route est protégée par 'admin' côté backend
      const { data } = await axiosClient.get('/newsletter/subscribers');
      setSubscribers(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des abonnés à la newsletter:', err);
      setError(err.response?.data?.message || 'Échec du chargement des abonnés à la newsletter.');
      toast.error(err.response?.data?.message || 'Échec du chargement des abonnés.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les abonnés au montage du composant
  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Gérer l'ouverture du modal (pour ajout ou édition)
  const handleOpenModal = (subscriber = null) => {
    setEditingSubscriber(subscriber);
    setSubscriberEmail(subscriber ? subscriber.email : '');
    setSubscriberIsActive(subscriber ? subscriber.isActive : true);
    setIsModalOpen(true);
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscriber(null);
    setSubscriberEmail('');
    setSubscriberIsActive(true);
    setFormLoading(false); // Réinitialiser le loading du formulaire
  };

  // Gérer la soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null); // Réinitialiser les erreurs API
    
    // Validation simple
    if (!subscriberEmail.trim()) {
      toast.error("L'adresse email est requise.");
      setFormLoading(false);
      return;
    }
    // Simple email regex for client-side check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscriberEmail)) {
        toast.error("Veuillez entrer une adresse email valide.");
        setFormLoading(false);
        return;
    }


    try {
      if (editingSubscriber) {
        // Logique de modification
        await axiosClient.put(`/newsletter/subscribers/${editingSubscriber._id}`, { 
          email: subscriberEmail, 
          isActive: subscriberIsActive 
        });
        toast.success('Abonné mis à jour avec succès !');
      } else {
        // Logique d'ajout
        await axiosClient.post('/newsletter/subscribe', { email: subscriberEmail });
        toast.success('Nouvel abonné ajouté avec succès !');
      }
      handleCloseModal(); // Fermer le modal après succès
      fetchSubscribers(); // Recharger la liste des abonnés
    } catch (err) {
      console.error('Erreur lors de la soumission de l\'abonné:', err);
      setError(err.response?.data?.message || 'Échec de l\'opération sur l\'abonné.');
      toast.error(err.response?.data?.message || 'Échec de l\'opération sur l\'abonné.');
    } finally {
      setFormLoading(false);
    }
  };

  // Gérer la suppression d'un abonné
  const handleDeleteSubscriber = async (id) => {
    // Utilisation d'une modale personnalisée au lieu de window.confirm est préférable en production
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
      setLoading(true); // Active le loader pendant la suppression
      try {
        await axiosClient.delete(`/newsletter/subscribers/${id}`);
        toast.success('Abonné supprimé avec succès !');
        fetchSubscribers(); // Recharger la liste des abonnés
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'abonné:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de l\'abonné.');
        toast.error(err.response?.data?.message || 'Échec de la suppression de l\'abonné.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Affichage du loader global pour la table
  if (loading && !isModalOpen) return ( // N'affiche le loader global que si le modal n'est pas ouvert
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      <span className="ml-2 text-lg">Chargement des abonnés...</span>
    </div>
  );

  // Affichage des erreurs globales
  if (error && !isModalOpen) return ( // N'affiche l'erreur globale que si le modal n'est pas ouvert
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg p-6">
        <p className="text-lg font-medium">Erreur</p>
        <p className="mt-2">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gestion des Newsletters
          </h1>
          <p className="text-gray-600 mt-2">Gérez vos abonnés à la newsletter</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
          size="lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> Ajouter un Abonné
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Date d'abonnement</TableHead>
                <TableHead className="font-semibold">Dernière MAJ</TableHead> {/* Ajout de la colonne */}
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                    Aucun abonné trouvé pour le moment.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-sm text-gray-600">
                      {subscriber._id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-500" />
                      {subscriber.email}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        subscriber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(subscriber.updatedAt).toLocaleDateString('fr-FR')} {/* Affichage de updatedAt */}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(subscriber)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSubscriber(subscriber._id)}
                          className="hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal d'ajout/édition d'abonné */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>{editingSubscriber ? 'Modifier l\'Abonné' : 'Ajouter un Nouvel Abonné'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4 ">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="col-span-3"
                placeholder="nom@exemple.com"
                required
              />
            </div>
            {editingSubscriber && ( // N'afficher le statut actif que lors de la modification
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="isActive" className="text-right">Actif</label>
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={subscriberIsActive}
                  onChange={(e) => setSubscriberIsActive(e.target.checked)}
                  className="col-span-3 w-4 h-4"
                />
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingSubscriber ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsletterManagementPage;
