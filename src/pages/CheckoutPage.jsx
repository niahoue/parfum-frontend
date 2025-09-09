// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Lock,
  User,
  Phone,
  Globe,
  ArrowRight,
  Shield,
  Tag,
  X,
  Check
} from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Frais de livraison fixe
  const baseShippingPrice = 1500;

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    telephone: '',
    country: 'Côte d\'Ivoire',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayDunya');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep] = useState(1);

  // États pour les codes promo
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Calculs avec promotion
  // S'assurer que discountAmount est toujours un nombre, même si appliedPromo est null
  const discountAmount = appliedPromo && typeof appliedPromo.discountAmount === 'number' ? appliedPromo.discountAmount : 0;
  const finalCartTotal = cartTotal - discountAmount;

  // Gestion de la livraison gratuite
  const isFreeShipping = appliedPromo &&
    (appliedPromo.promotion.code === 'FREE30000' ||
     appliedPromo.promotion.discountType === 'free_shipping'); // Utilisez appliedPromo.promotion.discountType
  const shippingPrice = isFreeShipping ? 0 : baseShippingPrice;

  const finalTotal = finalCartTotal + shippingPrice;

  // Pré-remplir l'adresse de livraison si l'utilisateur est connecté
  useEffect(() => {
    if (user && !authLoading) {
      setShippingAddress({
        address: user.address || '',
        city: user.city || '',
        telephone: user.telephone || '',
        country: user.country || 'Côte d\'Ivoire',
      });
    }
  }, [user, authLoading]);

  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // Fonction pour appliquer le code promo
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Veuillez entrer un code promotionnel');
      return;
    }

    setPromoLoading(true);
    setPromoError('');
    setPromoSuccess('');

    try {
      const response = await axiosClient.post('/promotions/apply', {
        code: promoCode.trim(),
        cartTotal: cartTotal
      });

      setAppliedPromo(response.data);
      setPromoSuccess(response.data.message);
      setPromoCode('');

      // Effacer le message de succès après 3 secondes
      setTimeout(() => setPromoSuccess(''), 3000);

    } catch (error) {
      console.error('Erreur lors de l\'application du code promo:', error);
      setPromoError(error.response?.data?.message || 'Code promotionnel invalide');

      // Effacer le message d'erreur après 5 secondes
      setTimeout(() => setPromoError(''), 5000);
    } finally {
      setPromoLoading(false);
    }
  };

  // Fonction pour gérer l'appui sur Entrée dans le champ promo code
  const handlePromoCodeKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyPromo();
    }
  };

  // Fonction pour retirer le code promo
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
    setPromoSuccess('');
    setPromoCode('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (cartItems.length === 0) {
      setError('Votre panier est vide. Veuillez ajouter des produits.');
      setLoading(false);
      return;
    }

    if (!user) {
        navigate('/login?redirect=/checkout');
        setLoading(false);
        return;
    }

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          imageUrl: item.imageUrl,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod,
        taxPrice: 0,
        shippingPrice: shippingPrice,
        totalPrice: finalTotal,
        appliedPromotion: appliedPromo ? {
          code: appliedPromo.promotion.code,
          discountAmount: appliedPromo.discountAmount,
          discountType: appliedPromo.promotion.discountType
        } : null,
      };

      const res = await axiosClient.post('/orders', orderData);
      const createdOrder = res.data;

      if (paymentMethod === 'PayDunya') {
        const paymentRes = await axiosClient.post('/payment/create', { orderId: createdOrder._id });
        window.location.href = paymentRes.data.invoice_url;
        clearCart()
      } else if (paymentMethod === 'DeliveryPayment') {
        clearCart();
        navigate(`/delivery-payment/${createdOrder._id}`);
      } else {
        clearCart();
        navigate(`/order/${createdOrder._id}`);
      }

    } catch (err) {
      console.error('Erreur lors du passage de la commande:', err);
      setError(err.response?.data?.message || 'Échec de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !authLoading) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const steps = [
    { number: 1, title: "Livraison", icon: Truck },
    { number: 2, title: "Paiement", icon: CreditCard },
    { number: 3, title: "Confirmation", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 mr-4 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Finaliser votre commande
              </h1>
            </div>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Plus qu'une étape pour recevoir vos produits préférés
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center space-x-8 mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                currentStep >= step.number
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <step.icon className="w-6 h-6" />
              </div>
              <span className={`ml-2 font-medium transition-colors duration-300 ${
                currentStep >= step.number ? 'text-purple-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="w-5 h-5 mx-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">Découvrez nos produits exceptionnels</p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Découvrir nos produits
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section Informations de Livraison */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center">
                    <MapPin className="w-8 h-8 mr-3" />
                    Informations de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" htmlFor="address">
                      <User className="w-4 h-4 mr-2 text-purple-600" />
                      Adresse complète
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={shippingAddress.address}
                      onChange={handleShippingChange}
                      required
                      className="border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-300 rounded-lg"
                      placeholder="Votre adresse complète"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" htmlFor="city">
                        <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                        Ville
                      </label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                        className="border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-300 rounded-lg"
                        placeholder="Votre ville"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" htmlFor="telephone">
                        <Phone className="w-4 h-4 mr-2 text-purple-600" />
                        Téléphone
                      </label>
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        value={shippingAddress.telephone}
                        onChange={handleShippingChange}
                        required
                        className="border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-300 rounded-lg"
                        placeholder="+225 XX XX XX XX"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center" htmlFor="country">
                        <Globe className="w-4 h-4 mr-2 text-purple-600" />
                        Pays
                      </label>
                      <Input
                        id="country"
                        name="country"
                        type="text"
                        value={shippingAddress.country}
                        onChange={handleShippingChange}
                        required
                        className="border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-300 rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Code Promotionnel */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center">
                    <Tag className="w-8 h-8 mr-3" />
                    Code promotionnel
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 mt-2">
                  {!appliedPromo ? (
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <Input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          onKeyPress={handlePromoCodeKeyPress}
                          placeholder="Entrez votre code promo"
                          className="flex-1 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors duration-300 rounded-lg"
                          disabled={promoLoading}
                        />
                        <Button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoCode.trim()}
                          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center"
                        >
                          {promoLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Check className="w-4 h-4 mr-2" />
                          )}
                          Appliquer
                        </Button>
                      </div>

                      {promoError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm font-medium">{promoError}</p>
                        </div>
                      )}

                      {promoSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-600 text-sm font-medium">{promoSuccess}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-green-800">{appliedPromo.promotion.code}</p>
                            <p className="text-sm text-green-700">{appliedPromo.promotion.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-bold text-green-800">
                              {/* Corrige l'affichage du discountAmount pour la livraison gratuite */}
                              {isFreeShipping ? (
                                <span>Livraison Offerte</span>
                              ) : (
                                <span>-{Number(discountAmount || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                              )}
                            </p>
                            {isFreeShipping && (
                              <p className="text-sm text-green-700 font-medium">(Code: {appliedPromo.promotion.code})</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            onClick={handleRemovePromo}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Méthode de Paiement */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center">
                    <CreditCard className="w-8 h-8 mr-3" />
                    Méthode de paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="paydunya"
                      name="paymentMethod"
                      value="PayDunya"
                      checked={paymentMethod === 'PayDunya'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <label htmlFor="paydunya" className="flex items-center space-x-2 cursor-pointer">
                      <Shield className="w-5 h-5 text-purple-600" />
                      <span>Paiement sécurisé via PayDunya</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="deliveryPayment"
                      name="paymentMethod"
                      value="DeliveryPayment"
                      checked={paymentMethod === 'DeliveryPayment'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-purple-600"
                    />
                    <label htmlFor="deliveryPayment" className="flex items-center space-x-2 cursor-pointer">
                      <Truck className="w-5 h-5 text-purple-600" />
                      <span>Paiement à la livraison</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Résumé de Commande */}
            <div>
              <Card className="border-0 shadow-xl sticky top-6 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center">
                    <ShoppingBag className="w-8 h-8 mr-3" />
                    Résumé de commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantité: {item.qty}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          {Number(item.price * item.qty || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Sous-total</span>
                      <span>{Number(cartTotal || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction ({appliedPromo.promotion.code})</span>
                        {/* Gère l'affichage pour la livraison gratuite */}
                        {isFreeShipping ? (
                          <span>OFFERTE</span>
                        ) : (
                          <span>-{Number(discountAmount || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>Frais de livraison</span>
                       {/* Gère l'affichage pour la livraison gratuite */}
                       {isFreeShipping ? (
                          <span className="text-green-600">OFFERT</span>
                       ) : (
                          <span>{Number(shippingPrice || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                       )}
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                      <span>Total</span>
                       <span>{Number(finalTotal || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-lg font-medium text-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Traitement...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Passer la commande
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
