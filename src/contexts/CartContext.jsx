// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient'; // Importez votre client Axios
import { useAuth } from './AuthContext'; // Importez le contexte d'authentification
 import { toast } from 'react-hot-toast';


const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    
    try {
      const localCart = localStorage.getItem('cartItems');
      return localCart ? JSON.parse(localCart) : [];
    } catch (e) {
      console.error("Impossible de lire le panier depuis le localStorage", e);
      return [];
    }
  });

  const { user, token, loading: authLoading } = useAuth(); 
  const [loading, setLoading] = useState(false);
  // Synchroniser le panier avec le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fonction pour charger le panier depuis le backend
  const fetchCartFromBackend = useCallback(async () => {
    if (user && token && !authLoading) {
      try {
        const { data } = await axiosClient.get('/users/cart'); // Endpoint pour récupérer le panier de l'utilisateur
        setCartItems(data.cartItems || []); // Assurez-vous que votre backend renvoie le panier dans un champ 'cartItems'
      } catch (error) {
        console.error("Erreur lors du chargement du panier depuis le backend:", error);
        // Si erreur (ex: token expiré), le localStorage peut rester la source de vérité temporaire
        // ou vous pouvez décider de vider le panier local si l'erreur est grave
      }
    }
  }, [user, token, authLoading]);

  // Charger le panier depuis le backend au login ou au chargement initial si l'utilisateur est connecté
  useEffect(() => {
    if (user && !authLoading) {
      fetchCartFromBackend();
    } else if (!user && !authLoading) {
      // Si l'utilisateur est déconnecté, s'assurer que le panier ne contient que les éléments du localStorage
      // C'est déjà géré par l'initialisation de useState, mais on peut forcer un clear si le panier backend persiste
      // et que vous ne voulez pas de mélange après déconnexion
      // setCartItems([]); // Décommentez si vous voulez vider le panier local à la déconnexion
    }
  }, [user, authLoading, fetchCartFromBackend]);


   const addToCart = async (product, qty = 1) => {
    setLoading(true); 
    try {
      const existingItem = cartItems.find(item => item._id === product._id);
      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = cartItems.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        updatedCartItems = [...cartItems, { ...product, qty }];
      }
      setCartItems(updatedCartItems);

      // Synchronisation avec le backend
      if (user && !authLoading) {
         await axiosClient.post('/users/cart/add', { productId: product._id, qty: qty });
      }
      toast.success(`${qty}x ${product.name} ajouté au panier !`);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier côté backend:", error);
      toast.error("Échec de l'ajout au panier.");
    } finally {
      setLoading(false); // Désactive le chargement, qu'il y ait eu succès ou échec
    }
  };

  const removeFromCart = async (id) => {
  console.log('🔍 DEBUG - ID à supprimer:', id);
  console.log('🔍 DEBUG - Type de l\'ID:', typeof id);
  console.log('🔍 DEBUG - Panier actuel:', cartItems.map(item => ({
    _id: item._id,
    name: item.name,
    type: typeof item._id
  })));

  const updatedCartItems = cartItems.filter(item => item._id !== id);
  setCartItems(updatedCartItems);
  toast.success('Produit retiré du panier.');

  if (user && !authLoading) {
    try {
      console.log('🔍 DEBUG - URL appelée:', `/users/cart/remove/${id}`);
      const response = await axiosClient.delete(`/users/cart/remove/${id}`);
      console.log('✅ DEBUG - Réponse backend:', response.data);
    } catch (error) {
      console.error("❌ DEBUG - Erreur complète:", error);
      console.error("❌ DEBUG - Status:", error.response?.status);
      console.error("❌ DEBUG - Message:", error.response?.data);
    }
  }
};

  const updateCartQty = async (id, qty) => {
    let updatedCartItems = cartItems.map(item =>
      item._id === id
        ? { ...item, qty: qty }
        : item
    ).filter(item => item.qty > 0);
    setCartItems(updatedCartItems);

    // Synchroniser avec le backend si l'utilisateur est connecté
    if (user && !authLoading) {
      try {
        if (qty > 0) {
          await axiosClient.put(`/users/cart/update`, { productId: id, qty: qty });
        } else {
          await axiosClient.delete(`/users/cart/remove/${id}`);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la quantité côté backend:", error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    // toast.success('Panier vidé !');

    // Synchroniser avec le backend si l'utilisateur est connecté
    if (user && !authLoading) {
      try {
        await axiosClient.post('/users/cart/clear'); // Endpoint pour vider le panier de l'utilisateur
      } catch (error) {
        console.error("Erreur lors du vidage du panier côté backend:", error);
      }
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartItemsCount,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
