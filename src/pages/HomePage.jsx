// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

import {
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Star,
  ChevronRight,
  Heart,
  Gift,
  Sparkles,
  Award,
  Loader2,
  Zap,
  Crown,
  Flower,
  Gem,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast'; // Importez toast

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]); // Nouveau state pour les promotions
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingPromotions, setLoadingPromotions] = useState(true); // Nouveau state de chargement
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorCategories, setErrorCategories] = useState(null);
  const [errorPromotions, setErrorPromotions] = useState(null); // Nouveau state d'erreur
  const [newsletterEmail, setNewsletterEmail] = useState(''); // Nouvel état pour l'email de la newsletter
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState(null);

  // Charger les produits vedettes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const { data } = await axiosClient.get("/products");
        // Limiter aux 8 premiers produits comme "Coups de Cœur"
        setProducts(data.products.slice(0, 8));
        setErrorProducts(null);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setErrorProducts("Échec du chargement des produits. Veuillez réessayer.");
        toast.error("Échec du chargement des produits.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data } = await axiosClient.get("/categories");
        setCategories(data);
        setErrorCategories(null);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
        setErrorCategories("Échec du chargement des catégories. Veuillez réessayer.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Charger la promotion active
  useEffect(() => {
    const fetchActivePromotion = async () => {
      setLoadingPromotions(true);
      try {
        const { data } = await axiosClient.get("/promotions/active");
        // La route '/promotions/active' renvoie soit un objet promotion, soit { message: '...', isActive: false }
        if (data && data.isActive !== false) { // Vérifie explicitement si une promotion est active
          setActivePromotions([data]); // Met la promotion active dans un tableau pour l'affichage
        } else {
          setActivePromotions([]);
        }
        setErrorPromotions(null);
      } catch (err) {
        console.error("Erreur lors du chargement de la promotion active:", err);
        setErrorPromotions("Échec du chargement des promotions.");
      } finally {
        setLoadingPromotions(false);
      }
    };
    fetchActivePromotion();
  }, []);


  const handleViewProduct = (product) => {
    console.log("Voir les détails du produit:", product);
  };

  // Fonction pour gérer l'inscription à la newsletter
  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterError(null);

    if (!newsletterEmail) {
      setNewsletterError('Veuillez entrer une adresse email.');
      toast.error('Veuillez entrer une adresse email.');
      setNewsletterLoading(false);
      return;
    }

    try {
      // Envoyer l'email au backend pour l'inscription à la newsletter
      await axiosClient.post('/newsletter/subscribe', { email: newsletterEmail });
      toast.success('Merci de vous être inscrit à notre newsletter !');
      setNewsletterEmail(''); // Vider le champ après succès
    } catch (err) {
      console.error('Erreur inscription newsletter:', err);
      const errorMessage = err.response?.data?.message || 'Échec de l\'inscription à la newsletter.';
      setNewsletterError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setNewsletterLoading(false);
    }
  };


  // Couleurs dynamiques pour les catégories
  const getCategoryGradient = (index) => {
    const gradients = [
      "from-rose-400 via-pink-500 to-purple-600",
      "from-purple-400 via-violet-500 to-indigo-600",
      "from-amber-400 via-orange-500 to-red-600",
      "from-emerald-400 via-teal-500 to-cyan-600",
      "from-blue-400 via-indigo-500 to-purple-600",
      "from-pink-400 via-rose-500 to-red-600"
    ];
    return gradients[index % gradients.length];
  };

  const features = [
    {
      icon: Truck,
      title: "Livraison Express",
      subtitle: "Gratuite dès 30000 CFA",
      accent: "text-emerald-600",
      bgAccent: "bg-emerald-50"
    },
    {
      icon: Shield,
      title: "Authenticité Garantie",
      subtitle: "Produits 100% originaux",
      accent: "text-blue-600",
      bgAccent: "bg-blue-50"
    },
    {
      icon: RefreshCw,
      title: "Retours Faciles",
      subtitle: "7 jours pour changer d'avis",
      accent: "text-purple-600",
      bgAccent: "bg-purple-50"
    },
    {
      icon: Award,
      title: "Service VIP",
      subtitle: "Conseils personnalisés 7j/7",
      accent: "text-rose-600",
      bgAccent: "bg-rose-50"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Koffi",
      comment: "Service impeccable, parfums authentiques et livraison rapide. Je recommande vivement !",
      product: "Chanel N°5",
      rating: 5,
      verified: true
    },
    {
      id: 2,
      name: "Jean-Paul Adepo",
      comment: "Large choix de parfums de qualité. L'équipe est très professionnelle et de bon conseil.",
      product: "Dior Sauvage",
      rating: 5,
      verified: true
    },
    {
      id: 3,
      name: "Kone Maimouna ",
      comment: "J'ai trouvé mon parfum préféré à un prix imbattable. Site sérieux et fiable.",
      product: "Tom Ford Black Orchid",
      rating: 5,
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <Hero />

      {/* Enhanced Features Bar */}
      <section className="relative bg-white/80 backdrop-blur-sm py-12 border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`group relative ${feature.bgAccent} p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20`}>
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 p-3 rounded-xl bg-white shadow-md group-hover:shadow-lg transition-shadow ${feature.accent}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.subtitle}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
           {/* Enhanced Featured Products */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-lg animate-pulse">
                <Gem className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Nos Coups de Cœur
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une sélection raffinée de parfums d'exception, choisis avec passion par nos experts pour vous offrir une expérience olfactive inoubliable
            </p>
          </div>

          {loadingProducts ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg border">
                <Loader2 className="animate-spin w-6 h-6 text-amber-600 mr-3" />
                <span className="text-gray-600 font-medium">Chargement de nos pépites...</span>
              </div>
            </div>
          ) : errorProducts ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-full">
                <span className="text-red-600 font-medium">{errorProducts}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="group relative">
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewProduct}
                  />
                  {/* Badge "Coup de cœur" sur les produits */}
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-2 rounded-full shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Button asChild size="lg" className="group bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white px-12 py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <Link to="/products">
                <Sparkles className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Découvrir Toute la Collection
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 via-transparent to-pink-100/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Collections Exclusives
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Plongez dans l'univers envoûtant de nos parfums d'exception, soigneusement sélectionnés pour révéler votre personnalité unique
            </p>
          </div>

          {loadingCategories ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg">
                <Loader2 className="animate-spin w-6 h-6 text-purple-600 mr-3" />
                <span className="text-gray-600 font-medium">Chargement des collections...</span>
              </div>
            </div>
          ) : errorCategories ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-full">
                <span className="text-red-600 font-medium">{errorCategories}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link to={`/products?category=${category._id}`} key={category._id}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0 relative">
                      <div className={`h-64 bg-gradient-to-br ${getCategoryGradient(index)} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-300" />

                        {/* Decorative elements */}
                        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity">
                          <Flower className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Sparkles className="w-24 h-24 text-white" />
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                          <div className="transform group-hover:scale-105 transition-transform duration-300">
                            <h3 className="text-3xl font-bold mb-3 text-white drop-shadow-lg">
                              {category.name}
                            </h3>
                            <p className="text-lg text-white/90 mb-4 drop-shadow">
                              Découvrez notre sélection
                            </p>
                            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium">
                              <span>Explorer</span>
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                            <ChevronRight className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

 

      {/* Enhanced Promo Offers */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl shadow-lg">
                <Gift className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Offres Exclusives
            </h2>
            <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-2xl mx-auto">
              Profitez de nos promotions exceptionnelles et codes avantages pour vous faire plaisir à prix réduit
            </p>
          </div>

          {loadingPromotions ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg border">
                <Loader2 className="animate-spin w-6 h-6 text-emerald-400 mr-3" />
                <span className="text-gray-600 font-medium">Chargement des offres...</span>
              </div>
            </div>
          ) : errorPromotions ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-full">
                <span className="text-red-600 font-medium">{errorPromotions}</span>
              </div>
            </div>
          ) : activePromotions.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">Aucune offre promotionnelle active pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activePromotions.map((offer) => (
                <Card key={offer._id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/5 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className={`bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity transform skew-x-12 -translate-x-full group-hover:translate-x-full duration-700"></div>
                      <div className="relative z-10">
                        <div className="mb-4">
                          <Zap className="w-12 h-12 mx-auto text-white/80 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{offer.message}</h3> {/* Utilise le message de la promotion */}
                        <p className="text-lg mb-6 opacity-90">
                           {/* Correction: Assurer que discountValue est un nombre avant d'appeler toLocaleString */}
                           {offer.discountType === 'percentage'
                              ? `${offer.discountValue || 0}% de réduction`
                              : `${(offer.discountValue || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })} de réduction`
                           }
                           {offer.minAmount > 0 && ` (Min. ${(offer.minAmount || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })})`}
                        </p>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 group-hover:bg-white/30 transition-colors">
                          <code className="text-xl font-mono font-bold tracking-wider">{offer.code}</code>
                        </div>
                        <p className="text-sm opacity-75">
                          Valide jusqu'au {new Date(offer.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <Star className="w-8 h-8 text-white fill-current" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ils Nous Font Confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez les témoignages authentiques de nos clients satisfaits qui ont trouvé leur fragrance parfaite
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating
                              ? 'text-amber-400 fill-current'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-medium">
                        ✓ Vérifié
                      </Badge>
                    )}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                    "{testimonial.comment}"
                  </blockquote>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-gray-600 mt-1">A acheté: <span className="font-medium text-purple-600">{testimonial.product}</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-800 opacity-20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">Restez à la Pointe</h2>
            <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-2xl mx-auto">
              Soyez les premiers informés de nos nouvelles collections, offres exclusives et conseils beauté personnalisés
            </p>
          </div>

          <form onSubmit={handleNewsletterSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium border-none"
              value={newsletterEmail}
              onChange={(e) => {
                setNewsletterEmail(e.target.value);
                setNewsletterError(null); // Clear error on change
              }}
              required
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold whitespace-nowrap transform hover:scale-105 transition-all duration-200 shadow-lg"
              disabled={newsletterLoading}
            >
              {newsletterLoading ? (
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
              ) : (
                <Heart className="w-5 h-5 mr-2" />
              )}
              S'inscrire
            </Button>
          </form>
          {newsletterError && <p className="text-red-300 mt-4 text-sm">{newsletterError}</p>}
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-200 mt-8">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-emerald-300" />
              Données protégées
            </div>
            <div className="flex items-center">
              <Gift className="w-4 h-4 mr-2 text-purple-300" />
              Offres exclusives
            </div>
            <div className="flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-pink-300" />
              Désabonnement facile
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
