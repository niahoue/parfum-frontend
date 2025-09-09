// src/pages/ShippingReturnsPage.jsx
import React from 'react';
import { Truck, PackageCheck, Repeat, Clock } from 'lucide-react';

const ShippingReturnsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-purple-800">
        Livraison et Retours
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        Découvrez notre politique de livraison rapide et nos conditions de retour flexibles pour une expérience d'achat en toute sérénité.
      </p>

      {/* Section Livraison */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <Truck className="w-10 h-10 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Livraison</h2>
        </div>
        <p className="mb-4 text-gray-700">
          Nous nous engageons à expédier vos commandes dans les plus brefs délais afin que vous puissiez profiter de vos parfums au plus vite.
        </p>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-start space-x-3">
            <PackageCheck className="flex-shrink-0 w-6 h-6 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Délais d'expédition</h3>
              <p>Toute commande passée avant 12h00 est expédiée le jour même (hors week-ends et jours fériés). Les commandes passées après 12h00 sont expédiées le jour ouvré suivant.</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Clock className="flex-shrink-0 w-6 h-6 text-indigo-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Délais de livraison</h3>
              <p>
                La livraison standard prend généralement entre **2 et 5 jours ouvrables** après l'expédition. Pour certaines zones éloignées, les délais peuvent être légèrement plus longs.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Truck className="flex-shrink-0 w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Frais de livraison</h3>
              <p>
                Les frais de livraison sont calculés au moment du paiement en fonction de votre localisation. La livraison est **gratuite pour toute commande de plus de 30.000 FCFA**.
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* Section Retours */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <Repeat className="w-10 h-10 text-orange-600" />
          <h2 className="text-3xl font-bold text-gray-900">Retours et Échanges</h2>
        </div>
        <p className="mb-4 text-gray-700">
          Votre satisfaction est notre priorité. Si un produit ne vous convient pas, vous pouvez nous le retourner facilement.
        </p>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-start space-x-3">
            <Clock className="flex-shrink-0 w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Période de retour</h3>
              <p>Vous disposez d'un délai de **14 jours** à compter de la réception de votre commande pour effectuer un retour.</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <PackageCheck className="flex-shrink-0 w-6 h-6 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Conditions de retour</h3>
              <p>
                Les produits doivent être retournés dans leur état d'origine, scellés, non ouverts et dans leur emballage d'origine. Tout produit ouvert ou utilisé ne pourra être ni repris ni échangé.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <Repeat className="flex-shrink-0 w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Processus de retour</h3>
              <p>
                Pour initier un retour, veuillez nous contacter par e-mail à **support@fragrancedemumu.com** en indiquant votre numéro de commande. Nous vous enverrons les instructions détaillées.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ShippingReturnsPage;