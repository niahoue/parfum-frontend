// src/pages/TermsPage.jsx
import React from 'react';
import { ShoppingBag, DollarSign, Truck, RefreshCw, Lock } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-purple-800">
        Conditions Générales de Vente (CGV)
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Veuillez lire attentivement les présentes conditions avant de passer commande sur notre site. Toute commande implique l'acceptation sans réserve de ces CGV.
      </p>

      {/* Section 1: Objet et Acceptation */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <ShoppingBag className="mr-2" /> 1. Objet et Champ d'application
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Les présentes Conditions Générales de Vente régissent la relation contractuelle entre le vendeur, Fragrance de Mumu, et le client. Elles s'appliquent à toutes les commandes passées via notre site de vente en ligne. Le fait de passer une commande implique l'acceptation entière et sans réserve de ces conditions.
        </p>
      </section>
      
      {/* Section 2: Produits */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <RefreshCw className="mr-2" /> 2. Produits
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Les produits proposés sont des parfums et cosmétiques. Chaque produit est accompagné d'une description précise et d'images non contractuelles. Nous nous efforçons de garantir que les informations affichées sont les plus exactes possibles.
        </p>
      </section>

      {/* Section 3: Prix */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <DollarSign className="mr-2" /> 3. Prix et Paiement
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Les prix sont indiqués en Francs CFA (XOF). Ils s'entendent hors frais de livraison. Le paiement est exigible immédiatement à la commande. Nous acceptons les paiements par <strong className="font-bold text-purple-600">Paydunya</strong>, qui inclut les paiements par carte de crédit et mobiles (MoMo, Flooz).
        </p>
      </section>

      {/* Section 4: Commande */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <ShoppingBag className="mr-2" /> 4. Commande
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Le processus de commande comprend les étapes suivantes :
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Validation du panier.</li>
            <li>Renseignement des informations de livraison.</li>
            <li>Choix du mode de paiement.</li>
            <li>Validation finale de la commande après acceptation des CGV.</li>
          </ul>
          Fragrance de Mumu se réserve le droit d’annuler ou de refuser une commande en cas de litige avec le client ou pour toute autre raison légitime.
        </p>
      </section>

      {/* Section 5: Livraison */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <Truck className="mr-2" /> 5. Livraison
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Les livraisons sont effectuées à l’adresse de livraison indiquée lors de la commande. Les délais de livraison sont indiqués à titre purement informatif et peuvent varier en fonction des disponibilités et de votre localisation. Fragrance de Mumu ne pourra être tenue responsable des retards de livraison imputables au transporteur.
        </p>
      </section>

      {/* Section 6: Retours et Droit de Rétractation */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <RefreshCw className="mr-2" /> 6. Droit de Rétractation et Retours
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Conformément aux lois en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation. Les produits doivent être retournés dans leur emballage d'origine, non ouverts et en parfait état. Les frais de retour sont à votre charge.
        </p>
      </section>

      {/* Section 7: Protection des données */}
      <section className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-3 flex items-center text-purple-700">
          <Lock className="mr-2" /> 7. Données Personnelles
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Les informations et données vous concernant sont nécessaires à la gestion de votre commande et à nos relations commerciales. Elles sont stockées en toute sécurité et ne sont partagées qu'avec les tiers impliqués dans le processus de livraison et de paiement, dans le respect de notre politique de confidentialité.
        </p>
      </section>

      {/* Pied de page */}
      <div className="text-center text-sm text-gray-500 mt-12">
        <p>&copy; {new Date().getFullYear()} Fragrance de Mumu. Tous droits réservés.</p>
        <p className="mt-2">
          Pour toute question, veuillez consulter notre <a href="/faq" className="text-purple-600 hover:underline font-medium">FAQ</a> ou nous contacter à <a href="mailto:contact@fragrancedemumu.com" className="text-purple-600 hover:underline font-medium">contact@fragrancedemumu.com</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;