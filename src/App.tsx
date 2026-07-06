import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistDrawer } from "./components/WishlistDrawer";

// Pages
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Menu } from "./components/Menu";
import { CakeBuilder } from "./components/CakeBuilder";
import { TableReservation } from "./components/TableReservation";
import { Checkout } from "./components/Checkout";
import { Contact } from "./components/Contact";
import { AuthPage } from "./components/AuthPage";
import { UserProfile } from "./components/UserProfile";
import { AdminDashboard } from "./components/AdminDashboard";

import { motion, AnimatePresence } from "motion/react";

// Route Guard for Administrators
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const { isRtl } = useLanguage();

  if (loading) return <div className="text-center py-16 text-stone-400">Loading...</div>;
  if (!user || user.role !== "admin") {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Route Guard for Authenticated Users
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center py-16 text-stone-400">Loading...</div>;
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50/20 text-stone-850 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navbar Accessories */}
      <Navbar
        onCartToggle={() => setCartOpen(!cartOpen)}
        onWishlistToggle={() => setWishlistOpen(!wishlistOpen)}
      />

      {/* Main Body */}
      <main className="flex-1 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/custom-cake" element={<CakeBuilder />} />
          <Route path="/booking" element={<TableReservation />} />
          <Route path="/delivery" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Slide-over panels */}
      <AnimatePresence>
        {cartOpen && <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />}
        {wishlistOpen && <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
