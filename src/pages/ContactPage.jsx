import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosClient from '../api/axiosClient';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await axiosClient.post('/contact', formData);
    toast.success(res.data.message || "Votre message a été envoyé avec succès !");
    // ...
  } catch (error) {
    toast.error(error.response?.data?.message || "Une erreur est survenue.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-gray-900">Contactez-nous</h1>
      <p className="text-xl text-center text-gray-600 mb-12">
        Nous sommes là pour répondre à toutes vos questions. N'hésitez pas à nous contacter.
      </p>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Formulaire de contact */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Sujet</label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="mt-1 block w-full"
              />
            </div>
            <Button type="submit" className="w-full py-3 text-lg font-semibold bg-purple-600" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
          </form>
        </div>

        {/* Informations de contact et carte */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Nos coordonnées</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="text-purple-600 w-6 h-6 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Adresse</h3>
                <p className="text-gray-600">Abidjan, Marcory, Côte d'Ivoire</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="text-purple-600 w-6 h-6 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Téléphone</h3>
                <p className="text-gray-600">+225 0161556509</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="text-purple-600 w-6 h-6 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">
                  <Link to="mailto:fragrancedemumu@gmail.com" className="text-purple-600 hover:underline">
                    fragrancedemumu@gmail.com
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Trouvez-nous sur la carte</h3>
            <div className="relative overflow-hidden rounded-lg shadow-lg" style={{ height: '300px' }}>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.2655798627756!2d-3.999447985237996!3d5.309660296651058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ed6e96bde3af%3A0x55c93a9f6fcf9ef!2sMarcory!5e0!3m2!1sfr!2sci!4v1678892000000!5m2!1sfr!2sci"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
