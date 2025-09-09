import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, Mail, ArrowRight, Download, 
  Calendar, MapPin, CreditCard, AlertCircle, Loader, Eye, Phone } from 'lucide-react';
import axiosClient from '../api/axiosClient';

// Composants UI améliorés
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", variant = "default", onClick, disabled = false, ...props }) => {
  const baseClass = "px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-purple-200 text-purple-700 hover:bg-purple-50 focus:ring-purple-500 hover:border-purple-300",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg"
  };
  
  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const PaymentSuccessPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Fonction améliorée pour récupérer les paramètres URL
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const token = params.get('token') || params.get('invoice_token');
    const message = params.get('message');
    
    console.log('Paramètres URL détectés:', { orderId, token, message });
    
    return { orderId, token, message };
  };

  const { orderId, token, message } = getUrlParams();

  // NOUVELLE FONCTION: Trouver une commande par token si orderId manque
  const findOrderByToken = async (paymentToken) => {
    try {
      console.log('Recherche de commande par token:', paymentToken.substring(0, 8) + '...');
      const response = await axiosClient.get(`/payment/find-order/${paymentToken}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche par token:', error);
      throw new Error(error.response?.data?.message || 'Impossible de trouver la commande avec ce token.');
    }
  };

  // Fonction pour récupérer les détails de la commande
  const fetchOrderDetails = async (orderIdToFetch) => {
    try {
      console.log('Récupération des détails pour la commande:', orderIdToFetch);
      const response = await axiosClient.get(`/orders/${orderIdToFetch}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error);
      throw new Error(error.response?.data?.message || 'Commande non trouvée ou erreur de chargement.');
    }
  };

  // Fonction pour vérifier le statut du paiement
  const verifyPaymentStatus = async (orderIdToVerify) => {
    if (!orderIdToVerify) return;
    
    setVerifyingPayment(true);
    try {
      console.log('Vérification du paiement pour la commande:', orderIdToVerify);
      const response = await axiosClient.post(`/payment/verify/${orderIdToVerify}`);
      console.log('Vérification du paiement réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error.response?.data?.message || error.message);
      // Ne pas lever d'erreur ici, juste logger
      return null;
    } finally {
      setVerifyingPayment(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      
      const successTimer = setTimeout(() => {
        setShowSuccess(true);
      }, 500);

      console.log('Initialisation de la page de succès');
      console.log('URL actuelle:', window.location.href);
      console.log('Paramètres détectés:', { orderId, token, message });

      try {
        setLoading(true);
        let finalOrderId = orderId;
        let orderData = null;

        // CAS 1: orderId présent - utilisation directe
        if (orderId) {
          console.log('OrderId présent, récupération directe...');
          
          // Vérifier le paiement d'abord (sans bloquer si ça échoue)
          await verifyPaymentStatus(orderId);
          
          // Récupérer les détails de la commande
          orderData = await fetchOrderDetails(orderId);
        }
        // CAS 2: Seulement token présent - recherche par token
        else if (token) {
          console.log('Seulement token présent, recherche de commande...');
          
          const tokenResult = await findOrderByToken(token);
          finalOrderId = tokenResult.orderId;
          orderData = tokenResult.order;
          
          console.log('Commande trouvée via token:', finalOrderId);
        }
        // CAS 3: Ni orderId ni token - erreur
        else {
          throw new Error('Aucun identifiant de commande trouvé dans l\'URL (orderId ou token manquant)');
        }

        if (!orderData) {
          throw new Error('Impossible de récupérer les données de la commande');
        }

        console.log('Commande récupérée avec succès:', orderData._id);
        setOrder(orderData);

        // Mettre à jour l'URL si on a récupéré l'orderId via le token
        if (!orderId && finalOrderId) {
          const newUrl = new URL(window.location);
          newUrl.searchParams.set('orderId', finalOrderId);
          window.history.replaceState({}, '', newUrl);
        }

      } catch (err) {
        console.error('Erreur lors de l\'initialisation:', err);
        setError(err.message || 'Erreur lors du chargement de la commande.');
      } finally {
        setLoading(false);
      }

      return () => clearTimeout(successTimer);
    };

    initializePage();
  }, [orderId, token]);// Ajouter token comme dépendance

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusBadge = (isPaid) => {
    if (isPaid) {
      return <Badge variant="success" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Payé
      </Badge>;
    }
    return <Badge variant="warning">En attente</Badge>;
  };

  const handleContinueShopping = () => {
    window.location.href = '/products';
  };

  const handleViewOrder = () => {
    window.location.href = `/historique-commandes`;
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleContactSupport = () => {
    window.location.href = `mailto:contact@ruedesparfums.ci?subject=Commande ${orderId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <Loader className="animate-spin h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {orderId ? 'Vérification du paiement...' : 'Recherche de votre commande...'}
            </h2>
            <p className="text-gray-600">
              {orderId ? 'Nous vérifions les détails de votre commande' : 'Nous localisons votre commande avec le token de paiement'}
            </p>
            {verifyingPayment && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Synchronisation avec PayDunya en cours...
                </p>
              </div>
            )}
            
            {/* Informations de debug en mode développement */}
            {import.meta.env.MODE === 'development' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-600 mb-1">Debug Info:</p>
                <p className="text-xs text-gray-600">OrderID: {orderId || 'Non trouvé'}</p>
                <p className="text-xs text-gray-600">Token: {token ? `${token.substring(0, 10)}...` : 'Non trouvé'}</p>
                <p className="text-xs text-gray-600">URL: {window.location.href}</p>
                <p className="text-xs text-gray-600">Mode: {orderId ? 'Direct' : token ? 'Recherche par token' : 'Erreur'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Une erreur inconnue est survenue. Impossible de récupérer la commande.'}
            </p>
            
            {/* Message personnalisé si disponible */}
            {message && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">{decodeURIComponent(message)}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/products'}
                className="w-full"
              >
                Retour aux achats
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = `mailto:contact@ruedesparfums.ci?subject=Erreur commande - Token: ${token || 'N/A'}`}
                className="w-full"
              >
                Contacter le support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">
              {error || 'Une erreur inconnue est survenue. Impossible de récupérer la commande.'}
            </p>
            
            {/* Message personnalisé si disponible */}
            {message && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">{decodeURIComponent(message)}</p>
              </div>
            )}

            
            <div className="space-y-3">
              <Button 
                onClick={handleContinueShopping}
                className="w-full"
              >
                Retour aux achats
              </Button>
              <Button 
                variant="outline"
                onClick={handleContactSupport}
                className="w-full"
              >
                Contacter le support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* En-tête de succès avec animation */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 transition-all duration-1000 transform ${
            showSuccess ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paiement Réussi ! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Merci pour votre commande, {order?.user?.name || 'cher client'} !
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500">
            <span>
              Commande <span className="font-semibold text-purple-600">#{order._id.slice(-8).toUpperCase()}</span>
            </span>
            {getPaymentStatusBadge(order.isPaid, order.paymentResult?.status)}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Détails de la commande */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations de paiement */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Détails du Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Statut du paiement</p>
                      <div className="flex items-center gap-2">
                        {getPaymentStatusBadge(order.isPaid, order.paymentResult?.status)}
                        {verifyingPayment && <Loader className="w-4 h-4 animate-spin text-blue-500" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date de paiement</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {order.paidAt ? formatDate(order.paidAt) : 'Non payé'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Méthode de paiement</p>
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://paydunya.com/assets/img/paydunya-logo-small.png" 
                          alt="PayDunya" 
                          className="w-6 h-6 rounded"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="font-semibold">{order.paymentMethod || 'PayDunya'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">ID de transaction</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded border">
                        {order.paymentResult?.id || token || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles commandés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Articles Commandés ({order.orderItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                        <img
                          src={item.imageUrl || '/api/placeholder/64/64'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-gray-500 text-sm">Quantité: {item.qty}</p>
                        <p className="text-purple-600 font-medium">{formatPrice(item.price)} × {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Adresse de livraison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Adresse de Livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">{order.shippingAddress.address}</p>
                    <p className="text-gray-700">{order.shippingAddress.city}</p>
                    <p className="text-gray-700">{order.shippingAddress.country}</p>
                    <p className="flex items-center gap-2 text-gray-700 mt-3">
                      <Phone className="w-4 h-4" />
                      {order.shippingAddress.telephone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé et actions */}
          <div className="space-y-6">
            
            {/* Résumé de la commande */}
            <Card className="sticky top-4">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle>Résumé de la Commande</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total:</span>
                    <span>{formatPrice(order.totalPrice - order.shippingPrice - order.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison:</span>
                    <span>{formatPrice(order.shippingPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes:</span>
                    <span>{formatPrice(order.taxPrice || 0)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-purple-600">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prochaines étapes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Prochaines Étapes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-600">Paiement confirmé</p>
                      <p className="text-sm text-gray-500">Votre commande a été payée avec succès</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-600">Préparation</p>
                      <p className="text-sm text-gray-500">Votre commande est en cours de préparation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-600">Expédition</p>
                      <p className="text-sm text-gray-500">Livraison sous 2-5 jours ouvrés</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-purple-600">Confirmation par email</p>
                      <p className="text-sm text-gray-500">Vérifiez votre boîte de réception</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                className="w-full"
                onClick={handleViewOrder}
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir les Détails de la Commande
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleContinueShopping}
              >
                Continuer les Achats
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handlePrintInvoice}
              >
                <Download className="w-4 h-4 mr-2" />
                Imprimer la Facture
              </Button>
            </div>
          </div>
        </div>

        {/* Message de remerciement */}
        <Card className="mt-12 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Merci pour votre confiance ! 💜
              </h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Votre commande nous fait plaisir et nous ferons tout notre possible pour que votre expérience soit parfaite. 
                N'hésitez pas à nous contacter si vous avez des questions.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="mailto:fragrancedemumu@gmail.com" className="flex items-center gap-2 hover:text-purple-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  contact@fragrancedemumu.com
                </a>
                <a href="tel:+2250767758052" className="flex items-center gap-2 hover:text-purple-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  +225 0767758052
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;