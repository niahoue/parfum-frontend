// src/pages/admin/ProductManagementPage.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Trash2, Edit, PlusCircle, Loader2, Upload, X } from 'lucide-react';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: 0,
    originalPrice: 0,
    countInStock: 0,
    imageUrl: '',
    type: '',
    size: '',
    notes: '',
    isNew: false,
    isBestSeller: false,
    rating: 0,
    numReviews: 0,
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const productsRes = await axiosClient.get('/products');
      setProducts(productsRes.data.products || []);

      const categoriesRes = await axiosClient.get('/categories');
      setCategories(categoriesRes.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.response?.data?.message || 'Échec du chargement des produits ou catégories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      brand: '',
      category: '',
      price: 0,
      originalPrice: 0,
      countInStock: 0,
      imageUrl: '',
      type: '',
      size: '',
      notes: '',
      isNew: false,
      isBestSeller: false,
      rating: 0,
      numReviews: 0,
    });
    setFile(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      category: product.category._id,
      notes: product.notes.join(', '),
    });
    setImagePreview(product.imageUrl);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        setLoading(true);
        await axiosClient.delete(`/products/${id}`);
        fetchProductsAndCategories();
      } catch (err) {
        console.error('Erreur lors de la suppression du produit:', err);
        setError(err.response?.data?.message || 'Échec de la suppression du produit.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation : pour un nouveau produit, l'image est obligatoire
    if (!editingProduct && !file) {
      setError('Veuillez sélectionner une image pour le nouveau produit.');
      setLoading(false);
      return;
    }

    // Créer un FormData pour envoyer les données et le fichier
    const dataToSend = new FormData();
    
    // Ajouter tous les champs du formulaire
    Object.keys(formData).forEach(key => {
      if (key === 'notes') {
        // Traiter les notes comme une chaîne séparée par des virgules
        dataToSend.append(key, formData[key]);
      } else if (key === 'isNew' || key === 'isBestSeller') {
        // S'assurer que les booléens sont envoyés correctement
        dataToSend.append(key, formData[key].toString());
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    // Ajouter le fichier image s'il existe
    if (file) {
      dataToSend.append('image', file);
    }

    // Debug : afficher le contenu du FormData
    console.log('FormData content:');
    for (let [key, value] of dataToSend.entries()) {
      console.log(key, value);
    }

    try {
      if (editingProduct) {
        await axiosClient.put(`/products/${editingProduct._id}`, dataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosClient.post('/products', dataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      setIsModalOpen(false);
      resetForm();
      fetchProductsAndCategories();
    } catch (err) {
      console.error('Erreur lors de la soumission du produit:', err);
      setError(err.response?.data?.message || 'Échec de l\'opération sur le produit.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
    setError(null); // Reset error when closing modal
  };

  if (loading && products.length === 0) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      <span className="ml-2 text-lg">Chargement...</span>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Gestion des Produits
          </h1>
          <p className="text-gray-600 mt-2">Gérez votre catalogue de produits</p>
        </div>
        <Button 
          onClick={handleOpenModal} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          size="lg"
        >
          <PlusCircle className="h-5 w-5 mr-2" /> 
          Ajouter un Produit
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Image</TableHead>
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Marque</TableHead>
                <TableHead className="font-semibold">Catégorie</TableHead>
                <TableHead className="font-semibold">Prix</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="text-sm text-gray-600">
                    {product._id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-200" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.brand}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {product.category?.name || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      product.countInStock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.countInStock > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.countInStock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(product)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(product._id)}
                        className="hover:bg-red-600"
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
      </div>

      {/* Modal amélioré */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto z-50 bg-white rounded-xl shadow-2xl">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCloseModal}
                className="hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="py-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="general" className="data-[state=active]:bg-purple-100">
                  Informations générales
                </TabsTrigger>
                <TabsTrigger value="pricing" className="data-[state=active]:bg-purple-100">
                  Prix & Stock
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-purple-100">
                  Image & Détails
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nom du produit *
                    </label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="Entrez le nom du produit"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="brand" className="text-sm font-medium text-gray-700">
                      Marque *
                    </label>
                    <Input 
                      id="brand" 
                      name="brand" 
                      value={formData.brand} 
                      onChange={handleInputChange} 
                      placeholder="Entrez la marque"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    rows="4"
                    placeholder="Décrivez votre produit en détail..."
                    className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Catégorie *
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <Input 
                      id="type" 
                      name="type" 
                      value={formData.type} 
                      onChange={handleInputChange} 
                      placeholder="Type de produit"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Prix (XOF) *
                    </label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      value={formData.price} 
                      onChange={handleInputChange} 
                      placeholder="0.00"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="originalPrice" className="text-sm font-medium text-gray-700">
                      Prix Original (XOF)
                    </label>
                    <Input 
                      id="originalPrice" 
                      name="originalPrice" 
                      type="number" 
                      step="0.01" 
                      value={formData.originalPrice} 
                      onChange={handleInputChange} 
                      placeholder="0.00"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="countInStock" className="text-sm font-medium text-gray-700">
                      Quantité en stock *
                    </label>
                    <Input 
                      id="countInStock" 
                      name="countInStock" 
                      type="number" 
                      value={formData.countInStock} 
                      onChange={handleInputChange} 
                      placeholder="0"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="size" className="text-sm font-medium text-gray-700">
                      Taille
                    </label>
                    <Input 
                      id="size" 
                      name="size" 
                      value={formData.size} 
                      onChange={handleInputChange} 
                      placeholder="Ex: 50ml, L, XL..."
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Notes (séparées par des virgules)
                    </label>
                    <Input 
                      id="notes" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      placeholder="Ex: Floral, Boisé, Fruité"
                      className="focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <input 
                      id="isNew" 
                      name="isNew" 
                      type="checkbox" 
                      checked={formData.isNew} 
                      onChange={handleInputChange} 
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isNew" className="text-sm font-medium text-gray-700">
                      Nouveau produit
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      id="isBestSeller" 
                      name="isBestSeller" 
                      type="checkbox" 
                      checked={formData.isBestSeller} 
                      onChange={handleInputChange} 
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isBestSeller" className="text-sm font-medium text-gray-700">
                      Best-seller
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <div className="space-y-4">
                  <label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Image du produit {!editingProduct && <span className="text-red-500">*</span>}
                  </label>
                  
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={imagePreview} 
                            alt="Aperçu" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white text-sm">Cliquer pour changer</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquer pour télécharger</span> ou glisser-déposer
                          </p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG ou GIF (MAX. 800x400px)</p>
                          {!editingProduct && (
                            <p className="text-xs text-red-500 mt-1">* Image obligatoire pour un nouveau produit</p>
                          )}
                        </div>
                      )}
                      <input 
                        id="image" 
                        name="image" 
                        type="file" 
                        onChange={handleFileChange} 
                        accept="image/*"
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {file && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      ✓ Fichier sélectionné: {file.name}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="pt-6 border-t">
              <div className="flex space-x-3 w-full justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCloseModal}
                  className="px-6"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      {editingProduct ? 'Modification...' : 'Ajout...'}
                    </>
                  ) : (
                    <>
                      {editingProduct ? 'Modifier le Produit' : 'Ajouter le Produit'}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagementPage;