// src/pages/admin/ManagePromotionPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Trash2, 
  Edit, 
  PlusCircle, 
  Loader2, 
  ToggleRight, 
  ToggleLeft, 
  Search, 
  Tag, 
  Calendar,
  DollarSign,
  Percent,
  Gift
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
  DialogDescription,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const ManagePromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    message: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minAmount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  // Filtrer les promotions
  const filteredPromotions = promotions.filter(promo =>
    promo.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/promotions');
      setPromotions(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des promotions:', err);
      setError(err.response?.data?.message || 'Échec du chargement des promotions.');
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
            ? Number(value) || 0
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
      startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
      endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
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
        fetchPromotions();
      } catch (err) {
        console.error('Erreur lors de la suppression de la promotion:', err);
        setError(err.response?.data?.message || 'Échec de la suppression de la promotion.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (promotionId) => {
    try {
      setLoading(true);
      await axiosClient.patch(`/promotions/${promotionId}/toggle`);
      fetchPromotions();
    } catch (err) {
      console.error('Erreur lors du changement de statut de la promotion:', err);
      setError(err.response?.data?.message || 'Échec de la mise à jour du statut de la promotion.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        discountValue: Number(formData.discountValue),
        minAmount: Number(formData.minAmount),
      };

      if (editingPromotion) {
        await axiosClient.put(`/promotions/${editingPromotion._id}`, payload);
      } else {
        await axiosClient.post('/promotions', payload);
      }
      setIsModalOpen(false);
      setEditingPromotion(null);
      setFormData({
        message: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minAmount: 0,
        startDate: '',
        endDate: '',
        isActive: true,
      });
      fetchPromotions();
    } catch (err) {
      console.error('Erreur lors de la soumission de la promotion:', err);
      setError(err.response?.data?.message || 'Échec de l\'opération sur la promotion. Veuillez vérifier les champs.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
    setFormData({
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

  const getDiscountIcon = (type) => {
    return type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />;
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
            <p className="text-lg text-slate-600">Chargement des promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xl text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête moderne */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des Promotions</h1>
                <p className="text-slate-600 mt-1">{promotions.length} promotion{promotions.length > 1 ? 's' : ''} enregistrée{promotions.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une promotion..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-slate-300 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button 
                onClick={() => { setEditingPromotion(null); setIsModalOpen(true); }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Nouvelle Promotion
              </Button>
            </div>
          </div>
        </div>

        {/* Tableau moderne */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <TableHead className="font-semibold text-slate-700 py-4">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Message</TableHead>
                  <TableHead className="font-semibold text-slate-700">Code</TableHead>
                  <TableHead className="font-semibold text-slate-700">Type</TableHead>
                  <TableHead className="font-semibold text-slate-700">Réduction</TableHead>
                  <TableHead className="font-semibold text-slate-700">Min. Achat</TableHead>
                  <TableHead className="font-semibold text-slate-700">Période</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Statut</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promo, index) => (
                  <TableRow 
                    key={promo._id} 
                    className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-purple-25 hover:to-pink-25 transition-all duration-200"
                  >
                    <TableCell className="font-mono text-sm text-slate-500 py-4">
                      <span className="bg-slate-100 px-2 py-1 rounded-md">
                        #{String(index + 1).padStart(3, '0')}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                          <Tag className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-slate-800 truncate">{promo.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-lg font-mono text-sm font-semibold">
                        {promo.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${promo.discountType === 'percentage' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          {getDiscountIcon(promo.discountType)}
                        </div>
                        <span className="text-sm font-medium">
                          {promo.discountType === 'percentage' ? 'Pourcentage' : 'Montant fixe'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-lg">
                        {promo.discountType === 'percentage'
                          ? <span className="text-green-600">{promo.discountValue || 0}%</span>
                          : <span className="text-blue-600">{(typeof promo.discountValue === 'number' ? promo.discountValue : 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600 font-medium">
                        {(typeof promo.minAmount === 'number' ? promo.minAmount : 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span className="text-slate-600">
                            {new Date(promo.startDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400">au</span>
                          <span className="text-slate-600">
                            {new Date(promo.endDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(promo._id, promo.isActive)}
                          className={`p-2 rounded-xl transition-all duration-200 ${
                            promo.isActive 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-red-100 text-red-600 hover:bg-red-200'
                          }`}
                          title={promo.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {promo.isActive ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(promo)}
                          className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(promo._id)}
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

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                {searchTerm ? 'Aucune promotion trouvée' : 'Aucune promotion'}
              </h3>
              <p className="text-slate-500">
                {searchTerm ? 'Essayez de modifier votre recherche.' : 'Commencez par créer votre première promotion.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal moderne */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <Gift className="h-6 w-6 text-white" />
              </div>
              {editingPromotion ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {editingPromotion ? 'Modifiez les détails de cette promotion.' : 'Créez une nouvelle promotion en remplissant les informations ci-dessous.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message et Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Message de la promotion
                </label>
                <Input 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Remise de printemps..." 
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Code Promo
                </label>
                <Input 
                  id="code" 
                  name="code" 
                  value={formData.code} 
                  onChange={handleInputChange} 
                  placeholder="SPRING2024" 
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg font-mono"
                  required 
                />
              </div>
            </div>

            {/* Type et Valeur de réduction */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Type de Réduction
                </label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => handleSelectChange('discountType', value)}
                >
                  <SelectTrigger className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-green-600" />
                        Pourcentage (%)
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        Montant Fixe (FCFA)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="discountValue" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  {formData.discountType === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                  Valeur de Réduction
                </label>
                <Input 
                  id="discountValue" 
                  name="discountValue" 
                  type="number" 
                  step="0.01" 
                  value={formData.discountValue} 
                  onChange={handleInputChange} 
                  placeholder={formData.discountType === 'percentage' ? '10' : '5000'}
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                  required 
                />
              </div>
            </div>

            {/* Montant minimum */}
            <div className="space-y-2">
              <label htmlFor="minAmount" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Montant Minimum d'Achat (FCFA)
              </label>
              <Input 
                id="minAmount" 
                name="minAmount" 
                type="number" 
                step="0.01" 
                value={formData.minAmount} 
                onChange={handleInputChange} 
                placeholder="0"
                className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                required 
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de Début
                </label>
                <Input 
                  id="startDate" 
                  name="startDate" 
                  type="date" 
                  value={formData.startDate} 
                  onChange={handleInputChange} 
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de Fin
                </label>
                <Input 
                  id="endDate" 
                  name="endDate" 
                  type="date" 
                  value={formData.endDate} 
                  onChange={handleInputChange} 
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                  required 
                />
              </div>
            </div>

            {/* Statut actif */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <input 
                id="isActive" 
                name="isActive" 
                type="checkbox" 
                checked={formData.isActive} 
                onChange={handleInputChange} 
                className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">
                Activer cette promotion immédiatement
              </label>
            </div>
            
            <DialogFooter className="gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCloseModal}
                className="border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg px-6"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={formLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg px-6"
              >
                {formLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {editingPromotion ? 'Modifier' : 'Créer la Promotion'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePromotionPage;