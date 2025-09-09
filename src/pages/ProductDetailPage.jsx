// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Loader2, 
  ArrowLeft, 
  Shield, 
  Truck, 
  RefreshCw,
  Check,
  Info,
  MessageCircle,
  User
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  // États pour les avis
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/products/${id}`);
        setProduct(data);
        setError(null);
        
        if (user && user.favorites) {
          setIsLiked(user.favorites.includes(data._id));
        }

        if (data.reviews) {
          setReviews(data.reviews);
          if (user) {
            setHasReviewed(data.reviews.some(review => review.user === user._id));
          }
        }

      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Produit non trouvé ou erreur de chargement.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      addToCart(product, qty);
      // toast.success(`${qty}x ${product.name} ajouté au panier !`);
    } else {
      alert("Le produit est en rupture de stock.");
    }
  };

  const toggleLike = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour ajouter des favoris.");
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await axiosClient.delete(`/users/wishlist/${product._id}`);
      } else {
        await axiosClient.post('/users/wishlist', { productId: product._id });
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Erreur wishlist:", err.response?.data?.message || err.message);
      alert("Erreur lors de la mise à jour des favoris.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Veuillez vous connecter pour laisser un avis.");
      navigate('/login');
      return;
    }
    if (newReviewRating === 0) {
      setReviewError("Veuillez donner une note (étoiles) au produit.");
      return;
    }
    if (!newReviewText.trim()) {
      setReviewError("Veuillez laisser un commentaire.");
      return;
    }

    setReviewLoading(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await axiosClient.post(`/products/${id}/reviews`, {
        rating: newReviewRating,
        comment: newReviewText,
      });
      setReviewSuccess(true);
      setNewReviewText('');
      setNewReviewRating(0);
      setHasReviewed(true);

      const { data } = await axiosClient.get(`/products/${id}`);
      setProduct(data);
      setReviews(data.reviews);

    } catch (err) {
      const msg = err.response?.data?.message || "Échec de la soumission de l'avis.";
      setReviewError(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-purple-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => navigate('/products')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retourner à la liste
          </Button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const tabs = [
    { id: 'description', label: 'Description', icon: Info },
    { id: 'specifications', label: 'Spécifications', icon: Shield },
    { id: 'reviews', label: `Avis (${reviews.length})`, icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header avec breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost"
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image du produit */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:p-12">
              <div className="aspect-square flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
                />
              </div>
              
              {/* Badge de réduction */}
              {discountPercentage > 0 && (
                <div className="absolute top-6 right-6">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg px-4 py-2 rounded-full shadow-lg">
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Détails du produit */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {product.rating}/5
                  </span>
                  <span className="text-gray-400">
                    ({product.numReviews} avis)
                  </span>
                </div>
              </div>

              {/* Prix */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl lg:text-5xl font-bold text-purple-600">
                    {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">
                      {product.originalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <p className="text-green-600 font-semibold text-lg">
                    Vous économisez {(product.originalPrice - product.price).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </p>
                )}
              </div>

              {/* Disponibilité */}
              <div className="mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  product.countInStock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.countInStock > 0 ? (
                    <>
                      <Check className="w-4 h-4" />
                      {product.countInStock} en stock
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4" />
                      Rupture de stock
                    </>
                  )}
                </div>
              </div>

              {/* Actions d'achat */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Quantité:</label>
                    <Input
                      type="number"
                      min="1"
                      max={product.countInStock}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(product.countInStock, Number(e.target.value))))}
                      className="w-20 text-center border-2 border-gray-200 focus:border-purple-500 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.countInStock === 0}
                    className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      product.countInStock > 0
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5 mr-3" />
                    Ajouter au panier
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className={`w-16 h-16 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isLiked 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                    }`}
                    onClick={toggleLike}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Avantages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Livraison gratuite</p>
                    <p className="text-xs text-gray-600">Dès 30 000 FCFA</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Garantie qualité</p>
                    <p className="text-xs text-gray-600">Produit authentique</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">Retour facile</p>
                    <p className="text-xs text-gray-600">7 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section avec onglets */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200 bg-gray-50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-8 lg:p-12">
              {/* Contenu des onglets */}
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Description du produit</h3>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">{product.description}</p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Spécifications techniques</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h4 className="font-semibold text-gray-900 mb-4">Informations générales</h4>
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Type:</dt>
                          <dd className="font-medium text-gray-900">{product.type}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Taille:</dt>
                          <dd className="font-medium text-gray-900">{product.size}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Catégorie:</dt>
                          <dd className="font-medium text-gray-900">{product.category?.name || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Marque:</dt>
                          <dd className="font-medium text-gray-900">{product.brand}</dd>
                        </div>
                      </dl>
                    </div>

                    {product.notes && product.notes.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-2xl">
                        <h4 className="font-semibold text-gray-900 mb-4">Notes Olfactives</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.notes.map((note, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Avis clients ({reviews.length})
                  </h3>
                  
                  {/* Formulaire d'avis */}
                  {user ? (
                    hasReviewed ? (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                          <p className="text-green-800 font-medium">
                            Merci ! Vous avez déjà soumis un avis pour ce produit.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4">Laisser votre avis</h4>
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Votre note</label>
                            <div className="flex gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                                    i < newReviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  } hover:text-yellow-300 hover:fill-current`}
                                  onClick={() => setNewReviewRating(i + 1)}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-3">
                              Votre commentaire
                            </label>
                            <Textarea
                              id="reviewComment"
                              placeholder="Partagez votre expérience avec ce produit..."
                              value={newReviewText}
                              onChange={(e) => setNewReviewText(e.target.value)}
                              rows="4"
                              className="w-full border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0"
                              required
                            />
                          </div>
                          
                          {reviewError && (
                            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{reviewError}</p>
                          )}
                          {reviewSuccess && (
                            <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">Avis soumis avec succès !</p>
                          )}
                          
                          <Button
                            type="submit"
                            disabled={reviewLoading}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                          >
                            {reviewLoading ? (
                              <><Loader2 className="animate-spin mr-2 w-4 h-4" /> Soumission...</>
                            ) : (
                              'Soumettre l\'avis'
                            )}
                          </Button>
                        </form>
                      </div>
                    )
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mb-8">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-blue-900 mb-2">Connectez-vous pour laisser un avis</h4>
                      <p className="text-blue-700 mb-4">Partagez votre expérience avec ce produit</p>
                      <Button 
                        onClick={() => navigate('/login')} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                      >
                        Se connecter
                      </Button>
                    </div>
                  )}

                  {/* Liste des avis */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg">Aucun avis pour l'instant.</p>
                      <p className="text-gray-500">Soyez le premier à donner votre avis !</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{review.name || 'Utilisateur Anonyme'}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;