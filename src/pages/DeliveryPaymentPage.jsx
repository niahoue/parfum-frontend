// src/pages/DeliveryPaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../contexts/AuthContext';

const DeliveryPaymentPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [orderStatus, setOrderStatus] = useState('confirmed');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosClient.get(`/orders/${orderId}`);
        setOrder(response.data);
        setOrderStatus(response.data.status || 'confirmed');
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération de la commande:', err);
        setError('Impossible de charger les détails de la commande.');
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleResendEmail = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      await axiosClient.post('/orders/resend-confirmation', {
        orderId: order._id,
        userEmail: user?.email || order.user?.email
      });
      setEmailSent(true);
      // toast.success('Email de confirmation renvoyé avec succès !');
    } catch (err) {
      console.error('Erreur lors du renvoi de l\'email:', err);
      // toast.error('Erreur lors du renvoi de l\'email.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleCancelOrder = async () => {
    if (!order || !window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;
    
    try {
      await axiosClient.patch(`/orders/${order._id}/cancel`);
      setOrderStatus('cancelled');
      // toast.success('Commande annulée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err);
      // toast.error('Impossible d\'annuler la commande');
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { id: 'confirmed', label: 'Commande confirmée', completed: true },
      { id: 'preparing', label: 'Préparation en cours', completed: orderStatus !== 'confirmed' },
      { id: 'shipped', label: 'En cours de livraison', completed: ['shipped', 'delivered'].includes(orderStatus) },
      { id: 'delivered', label: 'Livré', completed: orderStatus === 'delivered' }
    ];
    return steps;
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

  const getEstimatedDeliveryDate = () => {
    const orderDate = new Date(order?.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + 3); // 3 jours ouvrables en moyenne
    
    return estimatedDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !order) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Chargement des détails de la commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Erreur</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Réessayer
              </Button>
              <Link 
                to="/products" 
                className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Retourner aux produits
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <svg className="h-8 w-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Commande non trouvée</h2>
          <p className="text-gray-600 mb-4">La commande demandée n'existe pas ou a été supprimée.</p>
          <Link 
            to="/products" 
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
          >
            Retourner aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:py-4">
      {/* En-tête de confirmation */}
      <div className="text-center mb-8 print:mb-6">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          {orderStatus === 'cancelled' ? (
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
        <h1 className={`text-4xl font-bold mb-2 ${orderStatus === 'cancelled' ? 'text-red-900' : 'text-gray-900'}`}>
          {orderStatus === 'cancelled' ? 'Commande Annulée' : 'Commande Confirmée !'}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Numéro de commande: <span className="font-semibold text-green-600">#{order._id.slice(-8).toUpperCase()}</span>
        </p>
        <p className="text-gray-600">
          {orderStatus === 'cancelled' 
            ? 'Cette commande a été annulée.' 
            : 'Un email de confirmation a été envoyé à votre adresse.'
          }
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Commande passée le {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Détails de la commande */}
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">Détails de la Commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Produits commandés</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantité: {item.qty} × {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </p>
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mt-2 print:hidden"
                          />
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-900">
                          {(item.price * item.qty).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total:</span>
                  <span>{(order.totalPrice - order.shippingPrice).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Frais de livraison:</span>
                  <span>{order.shippingPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                </div>
                {order.taxPrice > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Taxes:</span>
                    <span>{order.taxPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total à payer à la livraison:</span>
                  <span className={orderStatus === 'cancelled' ? 'text-red-600' : 'text-green-600'}>
                    {order.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de livraison */}
        <Card className="print:break-inside-avoid">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">Informations de Livraison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStatus !== 'cancelled' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Mode de paiement</h3>
                  <p className="text-green-700 font-medium">💰 Paiement à la livraison</p>
                  <p className="text-sm text-green-600 mt-1">Préparez le montant exact en espèces</p>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adresse de livraison</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 font-medium">{order.shippingAddress.address}</p>
                  <p className="text-gray-700">{order.shippingAddress.city}</p>
                  <p className="text-gray-700">{order.shippingAddress.country}</p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold">Téléphone:</span> {order.shippingAddress.telephone}
                  </p>
                </div>
              </div>

              {orderStatus !== 'cancelled' && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Délai de livraison estimé</h3>
                    <p className="text-blue-700 font-medium">{getEstimatedDeliveryDate()}</p>
                    <p className="text-sm text-blue-600 mt-1">2-5 jours ouvrables • Vous serez contacté avant la livraison</p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Instructions importantes</h3>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• Gardez votre numéro de commande à portée de main</li>
                      <li>• Préparez le montant exact: {order.totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</li>
                      <li>• Vérifiez les produits avant de payer</li>
                      <li>• Assurez-vous d'être disponible aux heures de livraison</li>
                      <li>• Gardez votre téléphone allumé pour être joignable</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-8 text-center space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {orderStatus !== 'cancelled' && (
            <>
              <Button
                onClick={handleResendEmail}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                {loading ? 'Envoi...' : emailSent ? 'Email renvoyé ✓' : 'Renvoyer l\'email de confirmation'}
              </Button>
              
              <Button
                onClick={handlePrintOrder}
                variant="outline"
                className="border-gray-600 text-gray-600 hover:bg-gray-50 px-6 py-3"
              >
                📄 Imprimer la commande
              </Button>
            </>
          )}
          
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 px-6 py-3"
          >
            Continuer mes achats
          </Button>

          {orderStatus === 'confirmed' && (
            <Button
              onClick={handleCancelOrder}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 px-6 py-3"
            >
              Annuler la commande
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>Besoin d'aide ? Contactez notre service client:</p>
          <p className="font-medium">📞 +225 0767758052 | ✉️ fragrancedemumu.com</p>
          <p className="text-xs text-gray-500 mt-2">
            Service client disponible du lundi au vendredi de 8h à 18h
          </p>
        </div>
      </div>

      {/* Information de suivi */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Suivi de votre commande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getStatusSteps().map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                } ${orderStatus === 'cancelled' && index > 0 ? 'bg-red-300' : ''}`}></div>
                <span className={`${
                  step.completed ? 'text-green-700 font-medium' : 'text-gray-600'
                } ${orderStatus === 'cancelled' && index > 0 ? 'text-red-600 line-through' : ''}`}>
                  {step.label}
                </span>
                {step.completed && step.id === 'confirmed' && (
                  <span className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                )}
              </div>
            ))}
            
            {orderStatus === 'cancelled' && (
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 font-medium">Commande annulée</span>
                <span className="text-sm text-gray-500">
                  {order.cancelledAt ? formatDate(order.cancelledAt) : 'Récemment'}
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {orderStatus === 'cancelled' 
                ? 'Cette commande a été annulée. Si vous avez des questions, contactez notre service client.'
                : 'Vous recevrez des notifications par email et SMS à chaque étape de votre commande.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions de produits similaires ou relances */}
      {orderStatus !== 'cancelled' && (
        <Card className="mt-8 print:hidden">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">En attendant votre livraison...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">🛍️ Découvrez nos nouveautés</h3>
                <p className="text-purple-700 text-sm mb-3">
                  Profitez de votre visite pour découvrir nos derniers produits
                </p>
                <Link
                  to="/products?filter=new"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Voir les nouveautés
                </Link>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-800 mb-2">📱 Téléchargez notre app</h3>
                <p className="text-orange-700 text-sm mb-3">
                  Suivez vos commandes et profitez d'offres exclusives
                </p>
                <div className="flex space-x-2">
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                    Bientôt disponible
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryPaymentPage;