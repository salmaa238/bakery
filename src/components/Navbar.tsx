import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Heart, User, LogIn, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onCartToggle: () => void;
  onWishlistToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartToggle, onWishlistToggle }) => {
  const { language, setLanguage, t, isRtl } = useLanguage();
  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: t("home"), path: "/" },
    { name: t("about"), path: "/about" },
    { name: t("menu"), path: "/menu" },
    { name: t("custom_cake"), path: "/custom-cake" },
    { name: t("booking"), path: "/booking" },
    { name: t("delivery"), path: "/delivery" },
    { name: t("contact"), path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-amber-800 tracking-wide">
                {isRtl ? "🥖 الخباز الذهبي" : "Golden Crust 🥖"}
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex space-x-1 gap-1 xl:gap-2 items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                    isActive
                      ? "text-amber-800 bg-amber-50"
                      : "text-stone-600 hover:text-amber-800 hover:bg-stone-50"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side Accessories (Language, Wishlist, Cart, Profile) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-amber-800 hover:border-amber-400 transition-colors cursor-pointer text-xs font-semibold"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onWishlistToggle}
              className="relative p-2.5 rounded-full text-stone-600 hover:text-red-600 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Heart className="w-5.5 h-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="relative p-2.5 rounded-full text-stone-600 hover:text-amber-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Link */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 rounded-lg text-sm font-medium border border-stone-200 transition-colors"
                >
                  <User className="w-4.5 h-4.5" />
                  <span>{user.name.split(" ")[0]}</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {t("dashboard")}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-stone-500 hover:text-red-600 text-xs font-semibold cursor-pointer"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-sm font-medium shadow-xs transition-colors"
              >
                <LogIn className="w-4.5 h-4.5" />
                <span>{t("login")}</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Language Switch (Mobile Icon Only) */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="p-2 rounded-lg text-stone-500 hover:text-amber-800"
            >
              <Globe className="w-5.5 h-5.5" />
            </button>

            {/* Cart Icon */}
            <button
              onClick={onCartToggle}
              className="relative p-2 rounded-lg text-stone-500 hover:text-amber-800"
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-700 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-500 hover:text-amber-800 hover:bg-stone-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-stone-100 bg-white"
          >
            <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 text-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-50"
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-stone-100 flex flex-col gap-3 px-4">
                <button
                  onClick={() => {
                    onWishlistToggle();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 border border-stone-200 rounded-lg text-stone-700 font-medium"
                >
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>{t("wishlist")} ({wishlist.length})</span>
                </button>

                {user ? (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-stone-50 text-stone-700 border border-stone-200 rounded-lg font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>{user.name}</span>
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2.5 bg-amber-700 text-white rounded-lg font-medium text-center"
                      >
                        {t("dashboard")}
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-600 font-medium py-1 text-sm mt-1"
                    >
                      {t("logout")}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 bg-amber-800 text-white rounded-lg font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{t("login")}</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
