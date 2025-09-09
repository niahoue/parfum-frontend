// src/App.jsx
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Contexts
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

// Pages
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import DeliveryPaymentPage from "./pages/DeliveryPaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccesPage";
import PaymentCancelPage from "./pages/paymentCancelPage"
import MyAccountPage from "./pages/MyAccountPage";
import OrderHistoryPage from './pages/OrderHistoryPage';
import PromotionsPage from './pages/PromotionsPage';
import NewArrivalsPage from './pages/NewArrivalsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ShippingReturnsPage from './pages/ShippingReturnsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LegalMentionsPage from './pages/LegalMentionsPage';
import CareersPage from './pages/CareersPage';
import ValuesPage from './pages/ValuesPage';
import NotFoundPage from "./pages/NotFoundPage";

// Admin Pages
import DashboardPage from "./pages/admin/DashboardPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import StatisticsPage from "./pages/admin/StatisticsPage";
import ManagePromotionPage from "./pages/admin/ManagePromotionPage";
import NewsletterManagementPage from "./pages/admin/NewsletterManagementPage";

// Parfums
import FemmeParfumsPage from './pages/parfums/FemmeParfumsPage';
import HommeParfumsPage from './pages/parfums/HommeParfumsPage';
import MixteParfumsPage from './pages/parfums/MixteParfumsPage';
// Marques
import BrandsPage from './pages/marques/BrandsPage';
// Cosmétiques
import CosmeticsPage from './pages/cosmetiques/CosmeticsPage';

// Route protégée pour utilisateurs connectés
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="ml-2 text-gray-700">Chargement...</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children || <Outlet />;
};

// Route protégée pour administrateurs
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="ml-2 text-gray-700">Chargement...</p>
      </div>
    );
  }
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children || <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Publiques */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListingPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/panier" element={<CartPage />} />
                <Route path="/promotions" element={<PromotionsPage />} />
                <Route path="/nouveautes" element={<NewArrivalsPage />} />

                <Route path="/parfums/femme" element={<FemmeParfumsPage />} />
                <Route path="/parfums/homme" element={<HommeParfumsPage />} />
                <Route path="/parfums/mixte" element={<MixteParfumsPage />} />
                <Route path="/marques" element={<BrandsPage />} />
                <Route path="/cosmetiques" element={<CosmeticsPage />} />
                
                {/* Routes protégées */}
                <Route path="/mon-compte/*" element={<PrivateRoute><MyAccountPage /></PrivateRoute>} />
                <Route path="/favoris" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
                <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
                <Route path="/delivery-payment/:orderId" element={<PrivateRoute><DeliveryPaymentPage /></PrivateRoute>} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/payment-cancel" element={<PaymentCancelPage />} />
                <Route path="/historique-commandes" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />

                {/* Administrateur */}
                <Route path="/admin/*" element={<AdminRoute><DashboardPage /></AdminRoute>}>
                  <Route index element={<StatisticsPage />} />
                  <Route path="products" element={<ProductManagementPage />} />
                  <Route path="categories" element={<CategoryManagementPage />} />
                  <Route path="orders" element={<OrderManagementPage />} />
                  <Route path="users" element={<UserManagementPage />} />
                  <Route path="stats" element={<StatisticsPage />} />
                  <Route path="promotions" element={<ManagePromotionPage />} /> 
                  <Route path="newsletters" element={<NewsletterManagementPage />} />
                </Route>

                {/* Footer Pages */}
                <Route path="/a-propos" element={<AboutUsPage />} />
                <Route path="/nos-valeurs" element={<ValuesPage />} />
                <Route path="/carrieres" element={<CareersPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/livraison-retours" element={<ShippingReturnsPage />} />
                <Route path="/cgv" element={<TermsPage />} />
                <Route path="/politique-confidentialite" element={<PrivacyPolicyPage />} />
                <Route path="/mentions-legales" element={<LegalMentionsPage />} />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;