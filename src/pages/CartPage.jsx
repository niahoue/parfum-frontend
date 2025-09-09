// src/pages/CartPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ShoppingCart,
  ArrowRight,
  Gift
} from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartQty, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [removingItems, setRemovingItems] = useState(new Set());

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      updateCartQty(id, Number(newQty));
    }
  };

  const handleRemoveItem = (id) => {
    setRemovingItems(prev => new Set(prev).add(id));
    setTimeout(() => {
      removeFromCart(id);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = () => {
    if (authLoading) return;
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Votre Panier</h1>
            <p className="text-purple-100 text-lg">
              {cartItems.length > 0 
                ? `${totalItems} article${totalItems > 1 ? 's' : ''} dans votre panier`
                : "Votre panier vous attend"
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Panier vide</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Découvrez notre sélection de produits et ajoutez vos favoris à votre panier.
              </p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Découvrir nos produits
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-3 text-purple-600" />
                    Articles sélectionnés
                    <span className="ml-3 bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                      {totalItems}
                    </span>
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div 
                      key={item._id} 
                      className={`p-8 transition-all duration-300 ${
                        removingItems.has(item._id) 
                          ? 'opacity-50 scale-95 bg-red-50' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0 w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <Link 
                            to={`/products/${item._id}`} 
                            className="block group"
                          >
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 truncate">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mt-1 font-medium">{item.brand}</p>
                          <div className="mt-3 flex items-center gap-4">
                            <span className="text-2xl font-bold text-gray-900">
                              {item.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                            </span>
                            {item.qty > 1 && (
                              <span className="text-lg text-gray-600">
                                × {item.qty} = {(item.price * item.qty).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-200 p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                              disabled={item.qty <= 1}
                              className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleUpdateQty(item._id, Number(e.target.value))}
                              className="w-16 text-center border-0 bg-transparent font-bold text-lg focus:ring-0"
                              min="1"
                              max={item.countInStock}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                              disabled={item.qty >= item.countInStock}
                              className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item._id)}
                            className="w-12 h-12 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 bg-gray-50 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-xl px-6 py-3 font-medium"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vider le panier
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Gift className="w-6 h-6 mr-2" />
                    Résumé
                  </h2>
                </div>

                <div className="p-8 space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="font-medium">Sous-total ({totalItems} articles)</span>
                      <span className="font-bold text-lg">
                        {cartTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-gray-600 border-b border-gray-200 pb-4">
                      <span className="font-medium">Livraison</span>
                      <span className="font-medium">Calculé à la caisse</span>
                    </div>

                    <div className="flex justify-between items-center text-2xl font-bold text-gray-900 pt-2">
                      <span>Total</span>
                      <span className="text-purple-600">
                        {cartTotal.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="flex items-center justify-center">
                      Passer à la caisse
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </span>
                  </Button>

                  <div className="text-center">
                    <Link 
                      to="/products"
                      className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center transition-colors duration-200"
                    >
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      Continuer les achats
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;