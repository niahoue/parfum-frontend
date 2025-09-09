// src/pages/admin/ManagePromotionPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, Edit, PlusCircle, Loader2, ToggleRight, ToggleLeft } from 'lucide-react';
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
  DialogDescription, // Importez DialogDescription pour l'accessibilité
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
// import { toast } from 'react-hot-toast'; // Décommentez si utilisé

const ManagePromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null); // Pour la modification
  const [formData, setFormData] = useState({
    message: '',
    code: '',
    discountType: 'percentage', // Nouveau champ: type de réduction (percentage ou fixed)
    discountValue: 0,           // Nouveau champ: valeur de la réduction
    minAmount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/promotions');
      setPromotions(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des promotions:', err);
      setError(err.response?.data?.message || 'Échec du chargement des promotions.');
      // toast.error(err.response?.data?.message || 'Échec du chargement des promotions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        type === 'checkbox'
          ? checked
          : (name === 'discountValue' || name === 'minAmount')
            ? // Convertit en nombre, ou 0 si la valeur est vide ou non valide.
              // Ceci aide à éviter l'avertissement "uncontrolled to controlled" et assure que les nombres sont stockés.
              Number(value) || 0
            : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      ...promotion,
      // Convertir les dates ISO en format YYYY-MM-DD pour les inputs HTML
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
      // Assurer que les valeurs numériques sont des nombres pour le formulaire
      discountValue: Number(promotion.discountValue) || 0,
      minAmount: Number(promotion.minAmount) || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      try {
        setLoading(true);
        await axiosClient.delete(`/promotions/${id}`);
        // toast.success('Promotion supprimée avec succès !');
        fetchPromotions(); // Recharger les promotions
      } catch (err) {
        console.error('Erreur lors de la suppression de la promotion:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de la promotion.');
        // toast.error('Échec de la suppression de la promotion.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (promotionId, currentStatus) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/promotions/${promotionId}/toggle`);
      // toast.success(`Promotion ${currentStatus ? 'désactivée' : 'activée'} avec succès !`);
      fetchPromotions(); // Recharger les promotions pour voir le statut mis à jour
    } catch (err) {
      console.error('Erreur lors du changement de statut de la promotion:', err);
      setError(err.response?.data?.message || 'Échec de la mise à jour du statut de la promotion.');
      // toast.error('Échec de la mise à jour du statut de la promotion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Les dates doivent être envoyées au format ISO ou Date object
      const payload = {
        ...formData,
        // Assurez-vous que les dates sont envoyées comme chaînes ISO 8601 ou null
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        // Assurez-vous que discountValue et minAmount sont des nombres pour le backend
        discountValue: Number(formData.discountValue),
        minAmount: Number(formData.minAmount),
      };

      if (editingPromotion) {
        await axiosClient.put(`/promotions/${editingPromotion._id}`, payload);
        // toast.success('Promotion mise à jour avec succès !');
      } else {
        await axiosClient.post('/promotions', payload);
        // toast.success('Promotion ajoutée avec succès !');
      }
      setIsModalOpen(false);
      setEditingPromotion(null);
      setFormData({ // Réinitialiser le formulaire
        message: '',
        code: '',
        discountType: 'percentage', // Réinitialiser avec les valeurs par défaut
        discountValue: 0,
        minAmount: 0,
        startDate: '',
        endDate: '',
        isActive: true,
      });
      fetchPromotions(); // Recharger les promotions
    } catch (err) {
      console.error('Erreur lors de la soumission de la promotion:', err);
      // Pour les erreurs 500, le message peut être générique. Tentez d'afficher le message du backend.
      setError(err.response?.data?.message || 'Échec de l\'opération sur la promotion. Veuillez vérifier les champs.');
      // toast.error(err.response?.data?.message || 'Échec de l\'opération sur la promotion.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
    setFormData({ // Réinitialiser le formulaire
      message: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minAmount: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    });
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin inline-block mr-2" />Chargement des promotions...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Promotions</h1>
        <Button onClick={() => { setEditingPromotion(null); setIsModalOpen(true); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <PlusCircle className="h-5 w-5 mr-2" /> Ajouter une Promotion
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Code</TableHead> {/* Ajout de la colonne Code */}
              <TableHead>Type</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Min. Achat</TableHead>
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promo) => (
              <TableRow key={promo._id}>
                <TableCell className="text-sm">{promo._id.substring(0, 8)}...</TableCell>
                <TableCell className="font-medium">{promo.message}</TableCell>
                <TableCell><code className="bg-gray-100 p-1 rounded text-sm">{promo.code}</code></TableCell>
                <TableCell>{promo.discountType === 'percentage' ? 'Pourcentage' : 'Fixe'}</TableCell>
                <TableCell>
                  {/* Correction ici: S'assure que la valeur est un nombre avant toLocaleString */}
                  {promo.discountType === 'percentage'
                    ? `${promo.discountValue || 0}%`
                    : `${(typeof promo.discountValue === 'number' ? promo.discountValue : 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}`}
                </TableCell>
                <TableCell>{(typeof promo.minAmount === 'number' ? promo.minAmount : 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</TableCell>
                <TableCell>{new Date(promo.startDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{new Date(promo.endDate).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(promo._id, promo.isActive)}
                    className={promo.isActive ? 'text-green-600' : 'text-red-600'}
                    title={promo.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {promo.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                  </Button>
                </TableCell>
                <TableCell className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(promo)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(promo._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Promotion Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Modifier la Promotion' : 'Ajouter une Promotion'}</DialogTitle>
            {/* Ajout de la description pour l'accessibilité */}
            <DialogDescription>
              {editingPromotion ? 'Modifiez les détails de cette promotion.' : 'Créez une nouvelle promotion en remplissant les informations ci-dessous.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="message" className="text-right">Message</label>
              <Input id="message" name="message" value={formData.message} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="code" className="text-right">Code Promo</label> {/* Ajout du champ code */}
              <Input id="code" name="code" value={formData.code} onChange={handleInputChange} className="col-span-3" required placeholder="CODEPROMO123" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="discountType" className="text-right">Type de Réduction</label>
              <Select name="discountType" value={formData.discountType} onValueChange={(value) => handleSelectChange('discountType', value)} className="col-span-3">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                  <SelectItem value="fixed">Montant Fixe (FCFA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="discountValue" className="text-right">Valeur de Réduction</label>
              <Input id="discountValue" name="discountValue" type="number" step="0.01" value={formData.discountValue} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="minAmount" className="text-right">Min. Achat (FCFA)</label>
              <Input id="minAmount" name="minAmount" type="number" step="0.01" value={formData.minAmount} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="startDate" className="text-right">Date de début</label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="endDate" className="text-right">Date de fin</label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="isActive" className="text-right">Active</label>
              <input id="isActive" name="isActive" type="checkbox" checked={formData.isActive} onChange={handleInputChange} className="col-span-3 w-4 h-4" />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingPromotion ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePromotionPage;
