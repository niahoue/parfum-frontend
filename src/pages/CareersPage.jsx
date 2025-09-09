// src/pages/CareersPage.jsx
import React from 'react';
import { Briefcase, Send, Users, Sparkles } from 'lucide-react'; // Icônes pour embellir
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const CareersPage = () => {
  const handleSubmitSpontaneousApplication = (e) => {
    e.preventDefault();
    // Logique pour gérer la soumission de la candidature spontanée
    // Dans un vrai scénario, vous enverriez ces données à votre backend
    alert("Merci pour votre candidature spontanée ! Nous l'examinerons attentivement.");
    // Réinitialiser le formulaire si nécessaire
    e.target.reset();
  };

  const jobListings = [
    {
      id: 1,
      title: 'Conseiller(ère) de Vente Parfumerie',
      location: 'Abidjan, Côte d\'Ivoire',
      description: 'Rejoignez notre équipe dynamique en boutique pour offrir une expérience client exceptionnelle et partager votre passion pour les parfums.',
      requirements: ['Expérience en vente', 'Connaissance des produits de luxe', 'Excellent relationnel'],
    },
    {
      id: 2,
      title: 'Spécialiste Marketing Digital',
      location: 'Abidjan, Côte d\'Ivoire (Télétravail possible)',
      description: 'Développez et exécutez nos stratégies marketing digital pour accroître notre visibilité et engager notre communauté en ligne.',
      requirements: ['Maîtrise du SEO/SEA', 'Expérience en gestion de campagnes social media', 'Créativité et esprit d\'analyse'],
    },
    {
      id: 3,
      title: 'Développeur(se) Frontend React.js',
      location: 'Abidjan, Côte d\'Ivoire (Télétravail)',
      description: 'Contribuez à l\'évolution de notre plateforme e-commerce en développant des interfaces utilisateur performantes et intuitives.',
      requirements: ['Expertise React.js, JavaScript, HTML, CSS', 'Expérience avec Tailwind CSS', 'Sensibilité UI/UX'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <Briefcase className="w-16 h-16 mx-auto text-purple-600 mb-4" />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Rejoignez l'Équipe Fragrance de Mumu
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Nous sommes une équipe passionnée par les parfums et la beauté, dédiée à offrir des produits de qualité et un service exceptionnel. Si vous partagez nos valeurs et cherchez une carrière enrichissante, découvrez nos opportunités !
        </p>
      </div>

      {/* Section Offres d'Emploi */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
          <Users className="w-8 h-8 mr-3 text-blue-600" />
          Nos Offres d'Emploi Actuelles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobListings.length > 0 ? (
            jobListings.map((job) => (
              <Card key={job.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-700">{job.title}</CardTitle>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <h4 className="font-semibold text-gray-800 mb-2">Compétences requises :</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                    Postuler maintenant
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600 py-10">
              Aucune offre d'emploi disponible pour le moment.
            </div>
          )}
        </div>
      </section>

      {/* Section Candidature Spontanée */}
      <section className="bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
          <Sparkles className="w-8 h-8 mr-3 text-pink-600" />
          Candidature Spontanée
        </h2>
        <p className="text-center text-gray-700 mb-6 max-w-2xl mx-auto">
          Vous ne trouvez pas d'offre qui corresponde à votre profil ? Envoyez-nous votre candidature spontanée et nous l'étudierons pour de futures opportunités.
        </p>
        <form onSubmit={handleSubmitSpontaneousApplication} className="max-w-lg mx-auto space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Votre Nom Complet</label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Votre Adresse Email</label>
            <Input id="email" type="email" placeholder="votre.email@example.com" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Votre Message / Lettre de Motivation</label>
            <Textarea id="message" rows="5" placeholder="Parlez-nous de vous, de vos compétences et de ce que vous recherchez..." required />
          </div>
          <div>
            <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-2">Télécharger votre CV (Optionnel)</label>
            <Input id="cv" type="file" accept=".pdf,.doc,.docx" />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
            <Send className="w-5 h-5 mr-2" /> Envoyer ma Candidature
          </Button>
        </form>
      </section>
    </div>
  );
};

export default CareersPage;