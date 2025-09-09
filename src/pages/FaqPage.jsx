// src/pages/FAQPage.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Données de la FAQ
const faqData = [
  {
    category: 'Commandes et Paiements',
    questions: [
      {
        q: 'Quels sont les modes de paiement acceptés ?',
        a: `Nous acceptons les paiements par carte de crédit (Visa, Mastercard), les paiements mobiles (MoMo, Flooz) via notre partenaire Paydunya, et les virements bancaires. Toutes les transactions sont sécurisées.`
      },
      {
        q: 'Puis-je modifier ou annuler ma commande ?',
        a: `Toute modification ou annulation doit être demandée dans les 2 heures suivant la validation de la commande. Veuillez nous contacter immédiatement par email à contact@fragrancedemumu.com ou par téléphone.`
      },
      {
        q: 'Comment utiliser un code promotionnel ?',
        a: `Pour utiliser un code promotionnel, entrez le code dans le champ dédié sur la page de votre panier ou sur la page de paiement avant de finaliser votre achat.`
      }
    ]
  },
  {
    category: 'Livraison',
    questions: [
      {
        q: 'Quels sont les délais de livraison ?',
        a: `Les délais de livraison varient en fonction de votre localisation. En général, les commandes sont livrées sous 2 à 5 jours ouvrables pour Abidjan et 5 à 10 jours pour le reste de la Côte d'Ivoire. Nous vous enverrons un email avec un lien de suivi dès que votre commande sera expédiée.`
      },
      {
        q: 'Quels sont les frais de livraison ?',
        a: `Les frais de livraison sont calculés au moment de la commande en fonction de votre adresse de livraison. Ils sont affichés clairement sur la page de paiement avant la validation finale.`
      },
      {
        q: 'Puis-je suivre ma commande ?',
        a: `Oui, dès que votre commande est expédiée, vous recevrez un email contenant un numéro de suivi. Vous pourrez suivre l'état de votre livraison en temps réel sur le site de notre partenaire de livraison.`
      }
    ]
  },
  {
    category: 'Produits et Authenticité',
    questions: [
      {
        q: 'Vos produits sont-ils authentiques ?',
        a: `Absolument. Chez Fragrance de Mumu, nous nous engageons à ne proposer que des parfums et cosmétiques 100% originaux, directement sourcés auprès des marques et des distributeurs officiels.`
      },
      {
        q: 'Comment choisir le bon parfum ?',
        a: `Pour vous aider à trouver le parfum parfait, nous proposons des descriptions détaillées pour chaque produit. N'hésitez pas à nous contacter pour des conseils personnalisés.`
      },
      {
        q: 'Les cosmétiques sont-ils adaptés à tous les types de peau ?',
        a: `Nos produits de soins sont sélectionnés pour convenir à une large gamme de peaux. Cependant, nous vous recommandons de lire attentivement la liste des ingrédients et d'effectuer un test cutané avant toute utilisation pour éviter les réactions allergiques.`
      }
    ]
  },
  {
    category: 'Retours et Remboursements',
    questions: [
      {
        q: 'Quelle est votre politique de retour ?',
        a: `Si un produit ne vous satisfait pas, vous pouvez le retourner dans les 14 jours suivant la réception, à condition qu'il soit dans son emballage d'origine, non ouvert et en parfait état. Veuillez nous contacter pour initier le processus de retour.`
      },
      {
        q: 'Comment se déroule le remboursement ?',
        a: `Une fois le produit retourné et inspecté, nous procéderons au remboursement sur votre mode de paiement initial sous 5 à 10 jours ouvrables. Les frais de livraison initiaux ne sont pas remboursables.`
      }
    ]
  }
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-purple-800">
        Foire Aux Questions (FAQ)
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Trouvez rapidement les réponses aux questions les plus fréquemment posées sur nos produits et services.
      </p>

      <div className="space-y-8">
        {faqData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              {section.category}
            </h2>
            {section.questions.map((item, itemIndex) => {
              const globalIndex = `${sectionIndex}-${itemIndex}`;
              const isOpen = openIndex === globalIndex;
              return (
                <div key={globalIndex} className="border-b last:border-b-0 py-4">
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => toggleAnswer(globalIndex)}
                  >
                    <span className="text-lg font-semibold text-gray-700 hover:text-purple-600">
                      {item.q}
                    </span>
                    <span className="text-purple-600 transition-transform duration-300">
                      {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <p className="mt-2 text-gray-600 pr-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="text-center mt-12 py-6 bg-purple-50 rounded-lg">
        <p className="text-xl font-medium text-gray-700 mb-2">
          Vous n'avez pas trouvé de réponse à votre question ?
        </p>
        <p className="text-gray-600 mb-4">
          N'hésitez pas à contacter notre service client. Nous serons ravis de vous aider !
        </p>
        <a 
          href="mailto:contact@fragrancedemumu.com" 
          className="inline-block px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md font-bold"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  );
};

export default FAQPage;