import React, { useEffect, useState } from 'react';
import { XCircle, ArrowLeft, RefreshCw, ShoppingCart, AlertTriangle, Clock, CreditCard, Phone, Mail, HelpCircle, ArrowRight, Home, Package, Loader } from 'lucide-react';
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
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg",
    primary: "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500 shadow-md hover:shadow-lg",
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 hover:border-gray-400",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg"
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
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const PaymentCancelPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes en secondes

  // Fonction améliorée pour récupérer les paramètres URL
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const token = params.get('token') || params.get('invoice_token');
    const reason = params.get('reason') || 'cancelled';
    const message = params.get('message');

    console.log('Paramètres URL détectés:', { orderId, token, reason, message });

    return { orderId, token, reason, message };
  };

  const { orderId, token, reason, message } = getUrlParams();

  // Timer pour l'expiration de la commande
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

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

  useEffect(() => {
    const initializePage = async () => {
      // Animation de l'icône d'annulation
      const animationTimer = setTimeout(() => {
        setShowAnimation(true);
      }, 500);

      console.log('Initialisation de la page d\'annulation');
      console.log('URL actuelle:', window.location.href);
      console.log('Paramètres détectés:', { orderId, token, reason, message });

      try {
        setLoading(true);
        let finalOrderId = orderId;
        let orderData = null;

        // CAS 1: orderId présent - utilisation directe
        if (orderId) {
          console.log('OrderId présent, récupération directe...');
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

      return () => clearTimeout(animationTimer);
    };

    // Corrected dependency array: added message and reason
    initializePage();
  }, [orderId, token, message, reason]); // <-- HERE: Added 'message' and 'reason' to dependencies

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCancelReason = (reason) => {
    const reasons = {
      'cancelled': 'Paiement annulé par l\'utilisateur',
      'timeout': 'Délai de paiement dépassé',
      'failed': 'Échec du paiement',
      'rejected': 'Paiement rejeté',
      'error': 'Erreur technique'
    };
    return reasons[reason] || 'Paiement annulé';
  };

  const getReasonIcon = (reason) => {
    switch (reason) {
      case 'timeout':
        return <Clock className="w-5 h-5" />;
      case 'failed':
      case 'rejected':
        return <AlertTriangle className="w-5 h-5" />;
      case 'error':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return <XCircle className="w-5 h-5" />;
    }
  };

  const handleRetryPayment = async () => {
    if (!order) return;

    setRetryAttempts(prev => prev + 1);

    try {
      const response = await axiosClient.post('/payment/create', { orderId: order._id });
      if (response.data.invoice_url) {
        window.location.href = response.data.invoice_url;
      }
    } catch (error) {
      console.error('Erreur retry payment:', error.response?.data?.message || error.message);
      // Use a custom modal or toast notification instead of alert()
      // For now, I'll log to console.
      console.error('Erreur lors de la tentative de paiement. Détail: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleContinueShopping = () => {
    window.location.href = '/products';
  };

  const handleGoToCart = () => {
    window.location.href = '/cart';
  };

  const handleContactSupport = () => {
    const finalOrderId = order?._id || orderId || 'N/A';
    const tokenForSupport = token || 'N/A';
    window.location.href = `mailto:contact@ruedesparfums.ci?subject=Problème de paiement - Commande ${finalOrderId} - Token: ${tokenForSupport}`;
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center mb-4">
              <Loader className="animate-spin h-12 w-12 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {orderId ? 'Chargement de la commande...' : 'Recherche de votre commande...'}
            </h2>
            <p className="text-gray-600">
              {orderId ? 'Récupération des informations' : 'Nous localisons votre commande avec le token de paiement'}
            </p>

            {/* Informations de debug en mode développement */}
            {import.meta.env.MODE === 'development' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-600 mb-1">Debug Info:</p>
                <p className="text-xs text-gray-600">OrderID: {orderId || 'Non trouvé'}</p>
                <p className="text-xs text-gray-600">Token: {token ? `${token.substring(0, 10)}...` : 'Non trouvé'}</p>
                <p className="text-xs text-gray-600">Reason: {reason}</p>
                <p className="text-xs text-gray-600">URL: {window.location.href}</p>
                <p className="text-xs text-gray-600">Mode: {orderId ? 'Direct' : token ? 'Recherche par token' : 'Erreur'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affiche l'erreur si orderId est manquant ou si une autre erreur survient
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
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

            {/* Informations de debug en mode développement */}
            {import.meta.env.MODE === 'development' && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg text-left">
                <p className="text-xs text-gray-600 mb-2">Informations de debug:</p>
                <p className="text-xs text-gray-600">URL: {window.location.href}</p>
                <p className="text-xs text-gray-600">OrderID détecté: {orderId || 'Aucun'}</p>
                <p className="text-xs text-gray-600">Token détecté: {token || 'Aucun'}</p>
                <p className="text-xs text-gray-600">Reason: {reason}</p>
                <p className="text-xs text-gray-600">Message: {message || 'Aucun'}</p>
                <p className="text-xs text-gray-600">Erreur: {error || 'Commande non récupérée'}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* En-tête d'annulation avec animation */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 transition-all duration-1000 transform ${
            showAnimation ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paiement Annulé
          </h1>

          <p className="text-xl text-gray-600 mb-4">
            Votre paiement n'a pas pu être finalisé
          </p>

          {message && (
            <div className="max-w-md mx-auto mb-4">
              <Badge variant="error" className="text-base px-4 py-2">
                {decodeURIComponent(message)}
              </Badge>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              {getReasonIcon(reason)}
              <span>{getCancelReason(reason)}</span>
            </div>
            <span>
              Commande <span className="font-semibold text-red-600">#{order._id.slice(-8).toUpperCase()}</span>
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* Informations sur l'annulation */}
          <div className="lg:col-span-2 space-y-6">

            {/* Détails de l'annulation */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Que s'est-il passé ?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {getReasonIcon(reason)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {getCancelReason(reason)}
                      </h4>
                      <p className="text-gray-600 mt-1">
                        {reason === 'cancelled' && "Vous avez choisi d'annuler le paiement ou avez fermé la page de paiement."}
                        {reason === 'timeout' && "Le délai pour effectuer le paiement a été dépassé."}
                        {reason === 'failed' && "Une erreur est survenue lors du traitement de votre paiement."}
                        {reason === 'rejected' && "Votre paiement a été rejeté par votre banque ou PayDunya."}
                        {reason === 'error' && "Une erreur technique a empêché le traitement du paiement."}
                      </p>
                    </div>
                  </div>

                  {token && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Référence de transaction:</p>
                      <p className="font-mono text-sm break-all">{token}</p>
                    </div>
                  )}

                  {/* Informations de paiement */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">Statut du paiement</h4>
                      </div>
                      <Badge variant="error">Non payé</Badge>
                      <p className="text-blue-700 text-sm mt-2">
                        Aucun débit n'a été effectué sur votre compte
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-900">Articles réservés</h4>
                      </div>
                      <p className="text-purple-700 text-sm">
                        Vos articles restent en réserve pendant {formatTime(timeLeft)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Que faire maintenant ? */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Que faire maintenant ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Réessayer le paiement</h4>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">
                      Tentez à nouveau de payer votre commande
                    </p>
                    <Button
                      variant="default"
                      onClick={handleRetryPayment}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={retryAttempts >= 3}
                    >
                      {retryAttempts >= 3 ? 'Limite atteinte' : 'Réessayer maintenant'}
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Modifier votre panier</h4>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      Ajustez vos articles avant de payer
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleGoToCart}
                      className="w-full"
                    >
                      Aller au panier
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-1">Votre commande expire dans:</h4>
                      <div className="text-2xl font-bold text-yellow-800 mb-2">
                        {formatTime(timeLeft)}
                      </div>
                      <p className="text-yellow-700 text-sm">
                        Après expiration, vous devrez repasser votre commande.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles dans la commande */}
            {order && order.orderItems && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                    Articles en attente ({order.orderItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.orderItems.slice(0, 3).map((item, index) => (
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

                    {order.orderItems.length > 3 && (
                      <p className="text-center text-gray-500 text-sm py-2">
                        Et {order.orderItems.length - 3} autre(s) article(s)...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions et informations */}
          <div className="space-y-6">

            {/* Résumé rapide */}
            {order && (
              <Card className="sticky top-4">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                  <CardTitle>Résumé de la Commande</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Commande:</span>
                      <span className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{formatPrice(order.totalPrice - order.shippingPrice - (order.taxPrice || 0))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison:</span>
                      <span>{formatPrice(order.shippingPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span>{formatPrice(order.taxPrice || 0)}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-red-600">{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Statut:</span>
                      <Badge variant="error">Non payé</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions principales */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={handleRetryPayment}
                    className="w-full"
                    disabled={retryAttempts >= 3}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retryAttempts >= 3 ? 'Limite atteinte' : 'Réessayer le paiement'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleGoToCart}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Modifier le panier
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleContinueShopping}
                    className="w-full"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continuer les achats
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={handleGoHome}
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Retour à l'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Notre équipe est là pour vous aider avec vos problèmes de paiement.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleContactSupport}
                    className="w-full"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter le support
                  </Button>

                  <a
                    href="tel:+22501234567"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +225 0767758052
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ rapide */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Questions Fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mon argent a-t-il été débité ?</h4>
                <p className="text-gray-600 text-sm">
                  Non, si le paiement a été annulé, aucun débit n'a été effectué sur votre compte.
                  Si vous constatez un débit, contactez-nous immédiatement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Puis-je modifier ma commande ?</h4>
                <p className="text-gray-600 text-sm">
                  Oui, tant que la commande n'est pas payée, vous pouvez retourner au panier
                  pour modifier vos articles avant de finaliser l'achat.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Combien de temps ai-je ?</h4>
                <p className="text-gray-600 text-sm">
                  Votre commande est réservée pendant 15 minutes. Passé ce délai,
                  vous devrez repasser votre commande.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Autres moyens de paiement ?</h4>
                <p className="text-gray-600 text-sm">
                  Actuellement, nous acceptons les paiements via PayDunya (Orange Money, MTN Mobile Money, Visa, Mastercard).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
