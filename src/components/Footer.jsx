// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Assurez-vous d'importer Link

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1: Logo et Description */}
          <div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Fragrance de Mumu
            </Link>
            <p className="mt-4 text-sm">
              Votre destination pour les parfums et cosmétiques de luxe.
              Découvrez une collection exquise pour sublimer votre essence.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Icônes de réseaux sociaux (exemple) */}
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
            </div>
          </div>

          {/* Section 2: À Propos de Nous */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">À Propos de Nous</h3>
            <ul>
              <li className="mb-2">
                <Link to="/a-propos" className="text-sm hover:text-white transition-colors duration-200">Qui sommes-nous ?</Link>
              </li>
              <li className="mb-2">
                <Link to="/nos-valeurs" className="text-sm hover:text-white transition-colors duration-200">Nos valeurs</Link>
              </li>
              <li className="mb-2">
                <Link to="/carrieres" className="text-sm hover:text-white transition-colors duration-200">Carrières</Link>
              </li>
              <li className="mb-2">
                <Link to="/promotions" className="text-sm hover:text-white transition-colors duration-200">Promotions</Link>
              </li>
              <li className="mb-2">
                <Link to="/nouveautes" className="text-sm hover:text-white transition-colors duration-200">Nouveautés</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Service Client */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Service Client</h3>
            <ul>
              <li className="mb-2">
                <Link to="/contact" className="text-sm hover:text-white transition-colors duration-200">Contactez-nous</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-sm hover:text-white transition-colors duration-200">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/livraison-retours" className="text-sm hover:text-white transition-colors duration-200">Livraison et Retours</Link>
              </li>
              <li className="mb-2">
                <Link to="/cgv" className="text-sm hover:text-white transition-colors duration-200">Conditions Générales de Vente</Link>
              </li>
              <li className="mb-2">
                <Link to="/politique-confidentialite" className="text-sm hover:text-white transition-colors duration-200">Politique de Confidentialité</Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Mon Compte */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Mon Compte</h3>
            <ul>
              <li className="mb-2">
                <Link to="/profile" className="text-sm hover:text-white transition-colors duration-200">Mon Compte</Link>
              </li>
              <li className="mb-2">
                <Link to="/historique-commandes" className="text-sm hover:text-white transition-colors duration-200">Historique des commandes</Link>
              </li>
              <li className="mb-2">
                <Link to="/favoris" className="text-sm hover:text-white transition-colors duration-200">Mes Favoris</Link>
              </li>
              <li className="mb-2">
                <Link to="/panier" className="text-sm hover:text-white transition-colors duration-200">Mon Panier</Link>
              </li>
              <li className="mb-2">
                <Link to="/checkout" className="text-sm hover:text-white transition-colors duration-200">Commander</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Fragrance de Mumu. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;