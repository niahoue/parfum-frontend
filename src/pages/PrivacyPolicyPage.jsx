// src/pages/PrivacyPolicyPage.jsx
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl font-sans text-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-purple-800">
        Politique de Confidentialité
      </h1>
      <p className="text-center text-lg text-gray-600 mb-12">
        Votre confiance est notre priorité. Cette politique de confidentialité détaille comment nous collectons, utilisons et protégeons vos informations personnelles.
      </p>

      {/* Section 1: Informations Collectées */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          1. Quelles informations collectons-nous ?
        </h2>
        <p className="mb-4 text-gray-700">
          Nous collectons des informations pour vous fournir nos services et améliorer votre expérience sur notre site. Ces informations peuvent inclure :
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong className="text-gray-900">Informations d'identification :</strong> nom, adresse e-mail, adresse de livraison et numéro de téléphone lorsque vous créez un compte ou passez une commande.
          </li>
          <li>
            <strong className="text-gray-900">Informations de paiement :</strong> bien que nous ne stockions pas directement vos informations de carte de crédit, notre prestataire de paiement sécurisé (PayDunya) collecte les données nécessaires pour traiter vos transactions.
          </li>
          <li>
            <strong className="text-gray-900">Données de navigation :</strong> adresse IP, type de navigateur, pages visitées et temps passé sur le site. Ces données sont collectées via des cookies et d'autres technologies de suivi pour analyser le trafic et personnaliser votre expérience.
          </li>
        </ul>
      </div>

      {/* Section 2: Utilisation des Informations */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          2. Comment utilisons-nous vos informations ?
        </h2>
        <p className="mb-4 text-gray-700">
          Nous utilisons les informations collectées pour les finalités suivantes :
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Traiter et exécuter vos commandes.</li>
          <li>Gérer votre compte et vos préférences.</li>
          <li>Améliorer nos produits, services et l'expérience utilisateur sur le site.</li>
          <li>Vous envoyer des communications marketing (si vous y avez consenti), comme des newsletters ou des offres spéciales.</li>
          <li>Personnaliser le contenu et les publicités qui vous sont affichés.</li>
        </ul>
      </div>

      {/* Section 3: Partage des Informations */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          3. Partageons-nous vos informations ?
        </h2>
        <p className="mb-4 text-gray-700">
          Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons cependant les partager avec :
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong className="text-gray-900">Prestataires de services :</strong> partenaires de paiement (PayDunya), services de livraison, et hébergeurs de site web qui nous aident à exploiter notre boutique en ligne. Ces tiers sont tenus de respecter la confidentialité de vos informations.
          </li>
          <li>
            <strong className="text-gray-900">Autorités légales :</strong> si la loi l'exige ou pour protéger nos droits, notre propriété ou notre sécurité.
          </li>
        </ul>
      </div>

      {/* Section 4: Sécurité */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          4. Comment protégeons-nous vos données ?
        </h2>
        <p className="mb-4 text-gray-700">
          Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos informations personnelles contre l'accès non autorisé, l'altération, la divulgation ou la destruction.
        </p>
        <p className="text-gray-700">
          Les informations de paiement sont traitées par notre partenaire PayDunya qui utilise le chiffrement SSL et se conforme aux normes de sécurité des données de l'industrie.
        </p>
      </div>
      
      {/* Section 5: Vos Droits */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          5. Vos droits
        </h2>
        <p className="mb-4 text-gray-700">
          Conformément à la réglementation sur la protection des données, vous disposez des droits suivants concernant vos informations personnelles :
        </p>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong className="text-gray-900">Droit d'accès :</strong> vous pouvez demander une copie des données que nous détenons à votre sujet.
          </li>
          <li>
            <strong className="text-gray-900">Droit de rectification :</strong> vous pouvez demander la correction de données inexactes.
          </li>
          <li>
            <strong className="text-gray-900">Droit de suppression :</strong> vous pouvez demander la suppression de vos données personnelles.
          </li>
          <li>
            <strong className="text-gray-900">Droit d'opposition :</strong> vous pouvez vous opposer au traitement de vos données à des fins de marketing.
          </li>
        </ul>
        <p className="mt-4 text-gray-700">
          Pour exercer ces droits, veuillez nous contacter à l'adresse **support@fragrancedemumu.com**.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;