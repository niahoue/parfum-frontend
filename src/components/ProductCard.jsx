// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart(); 
  const { user } = useAuth(); 
  const navigate = useNavigate(); 

  // Mettre à jour l'état isLiked en fonction de la wishlist de l'utilisateur
  useEffect(() => {
    if (user && user.favorites && product) {
      setIsLiked(user.favorites.includes(product._id));
    } else {
      setIsLiked(false);
    }
  }, [user, product]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.countInStock > 0) {
      addToCart(product, 1);
       alert(`${product.name} ajouté au panier !`); 
    }
  };

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
       toast.error("Veuillez vous connecter pour ajouter des favoris.")
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await axiosClient.delete(`/users/wishlist/${product._id}`);
         toast.success("Produit retiré des favoris !");
      } else {
        await axiosClient.post('/users/wishlist', { productId: product._id });
         toast.success("Produit ajouté aux favoris !");
      }
      setIsLiked(!isLiked); 
    } catch (err) {
      console.error("Erreur wishlist:", err.response?.data?.message || err.message);
       toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`); 
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 rounded-t-xl">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold">
              Nouveau
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Best-Seller
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold">
              -{discountPercentage}%
            </Badge>
          )}
          {product.countInStock === 0 && ( 
            <Badge variant="secondary" className="bg-gray-500 text-white">
              Rupture
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleLike}
            className={`p-2 rounded-full backdrop-blur-sm border-white/20 ${
              isLiked ? 'bg-red-500 text-white border-red-500' : 'bg-white/80 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewDetails} 
            className="p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border-white/20"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>

        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl} 
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>

        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">
            {product.brand}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.numReviews})</span> 
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>

        {/* Product Type & Size */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>{product.type}</span>
          <span>•</span>
          <span>{product.size}</span>
        </div>

        {/* Notes */}
        <div className="flex flex-wrap gap-1">
          {product.notes && product.notes.slice(0, 2).map((note, index) => ( 
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
            >
              {note}
            </span>
          ))}
          {product.notes && product.notes.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
              +{product.notes.length - 2}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.countInStock === 0} 
          className={`w-full mt-4 rounded-full font-semibold transition-all duration-300 ${
            product.countInStock > 0
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.countInStock > 0 ? (
            <>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Ajouter au panier
            </>
          ) : (
            'Rupture de stock'
          )}
        </Button>
      </div>

      {/* Hover effect border */}
      <div className={`absolute inset-0 border-2 border-transparent rounded-xl transition-colors duration-300 pointer-events-none ${
        isHovered ? 'border-purple-200' : ''
      }`} />
    </div>
  );
};

export default ProductCard;
