// src/pages/ValuesPage.jsx
import React from 'react';
import { Sparkles, Leaf, Heart, Handshake, Box } from 'lucide-react';

const ValuesPage = () => {
  const values = [
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: "Authenticité et Qualité",
      description: "Nous garantissons l'authenticité de tous nos parfums. Chaque produit est rigoureusement sélectionné pour son excellence et sa qualité supérieure, vous assurant une expérience olfactive inégalée."
    },
    {
      icon: <Handshake className="w-8 h-8 text-green-600" />,
      title: "Transparence et Confiance",
      description: "La confiance de nos clients est notre priorité. Nous nous engageons à une transparence totale sur l'origine de nos produits, nos prix et nos conditions de vente, pour une relation commerciale saine et durable."
    },
    {
      icon: <Leaf className="w-8 h-8 text-amber-600" />,
      title: "Innovation et Créativité",
      description: "Nous explorons sans cesse le monde de la parfumerie pour vous proposer des fragrances uniques et des marques de niche. Nous aimons la créativité et la diversité pour enrichir votre collection de parfums."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Passion et Expertise",
      description: "Fondée sur une passion profonde pour les fragrances, notre équipe est composée d'experts dédiés à vous guider. Nous partageons notre savoir-faire pour vous aider à trouver le parfum qui vous correspond vraiment."
    },
    {
      icon: <Box className="w-8 h-8 text-blue-600" />,
      title: "Engagement et Service Client",
      description: "Votre satisfaction est le moteur de notre travail. Nous nous engageons à offrir un service client réactif et personnalisé, de la commande à la livraison, pour que votre expérience soit toujours parfaite."
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-purple-800">
        Nos Valeurs
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        Chez Fragrance de Mumu, chaque parfum a une histoire, et chaque interaction est guidée par nos principes fondamentaux.
      </p>

      <div className="space-y-12">
        {values.map((value, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 p-6 bg-white rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            <div className="flex-shrink-0">
              {value.icon}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">
                {value.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuesPage;