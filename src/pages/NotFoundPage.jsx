// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] bg-gray-50 text-center px-4 py-10">
      <h1 className="text-9xl font-extrabold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-6">Page Non Trouvée</h2>
      <p className="text-lg text-gray-600 mb-8">
        Désolé, la page que vous recherchez n'existe pas.
      </p>
      <Link to="/">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg">
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;