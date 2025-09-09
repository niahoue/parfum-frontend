// src/components/Hero.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Importez axiosClient

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bestSellers, setBestSellers] = useState([]); // Nouvel état pour les best-sellers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        // Récupérer les produits marqués comme isBestSeller
        const { data } = await axiosClient.get('/products', {
          params: { isBestSeller: true, limit: 5 } // Limiter à quelques produits pour le héros
        });
        
        // Si aucun best-seller n'est trouvé, ou s'il y en a moins de 2 (pour éviter les erreurs de modulo)
        // vous pouvez définir un contenu par défaut ou gérer cela.
        if (data.products && data.products.length > 0) {
          setBestSellers(data.products);
        } else {
          // Fallback ou message si aucun best-seller n'est disponible
          setBestSellers([]); 
          console.warn("Aucun produit best-seller trouvé. Le carrousel du héros pourrait être vide ou afficher un contenu générique.");
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des best-sellers pour le Hero:', err);
        setError(err.response?.data?.message || 'Échec du chargement des produits vedettes.');
        setBestSellers([]); // Assurez-vous que bestSellers est vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  useEffect(() => {
    if (bestSellers.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bestSellers.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [bestSellers]); // Redéclencher le timer si les bestSellers changent

  const nextSlide = () => {
    if (bestSellers.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % bestSellers.length);
    }
  };

  const prevSlide = () => {
    if (bestSellers.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + bestSellers.length) % bestSellers.length);
    }
  };

  // Afficher un indicateur de chargement ou un message d'erreur si nécessaire
  if (loading) {
    return (
      <div className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white">
        <Loader2 className="animate-spin w-10 h-10 mr-2" /> Chargement des offres spéciales...
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-[80vh] flex items-center justify-center bg-red-900 text-white">
        Erreur: {error}
      </div>
    );
  }

  // Si aucun best-seller n'est trouvé après le chargement
  if (bestSellers.length === 0) {
    return (
      <div className="relative h-[80vh] flex items-center justify-center bg-gray-800 text-white">
        <p className="text-xl">Aucun produit vedette disponible pour le moment.</p>
      </div>
    );
  }

  const currentProduct = bestSellers[currentSlide];

  return (
    <div className="relative h-[80vh] overflow-hidden bg-black">
      {/* Background Images */}
      {bestSellers.map((product, index) => (
        <div
          key={product._id} // Utilisez l'ID du produit comme clé
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
          <img
            src={product.imageUrl} // Utilisez l'image du produit
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 transform translate-y-8 opacity-0 animate-fade-in-up">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                <Star className="w-4 h-4 mr-2" />
                Best-Seller
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight transform translate-y-8 opacity-0 animate-fade-in-up animation-delay-200">
              {currentProduct.name} {/* Nom du produit */}
            </h1>

            {/* Subtitle (peut-être la marque ou la catégorie) */}
            <h2 className="text-xl md:text-2xl text-gray-200 mb-4 font-light transform translate-y-8 opacity-0 animate-fade-in-up animation-delay-400">
              {currentProduct.brand} {/* Marque du produit */}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed transform translate-y-8 opacity-0 animate-fade-in-up animation-delay-600">
              {currentProduct.description.substring(0, 100)}... {/* Description courte */}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 transform translate-y-8 opacity-0 animate-fade-in-up animation-delay-800">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                asChild
              >
                <Link to={`/products/${currentProduct._id}`}> {/* Lien vers la page du produit */}
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Voir le produit
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link to="/products">
                  Voir la Collection
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {bestSellers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-30">
        <div className="flex flex-col items-center text-white">
          <span className="text-sm mb-2 opacity-75">Découvrir</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// Ajoutez cet import si vous ne l'avez pas déjà
import { Loader2 } from 'lucide-react';

export default Hero;
