import React from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { t, language, isRtl } = useLanguage();

  if (!isOpen) return null;

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product); // remove from wishlist after moving
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <motion.div
          initial={{ x: isRtl ? "-100%" : "100%" }}
          animate={{ x: 0 }}
          exit={{ x: isRtl ? "-100%" : "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-red-50/30">
            <div className="flex items-center gap-2">
              <Heart className="w-5.5 h-5.5 text-red-600 fill-red-600/10" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {t("wishlist")} ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                <div className="p-4 bg-red-50 rounded-full text-red-600/80">
                  <Heart className="w-12 h-12" />
                </div>
                <div>
                  <p className="text-stone-700 font-medium text-base">{t("empty_wishlist")}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {isRtl ? "اضغط على أيقونة القلب في المنتجات لحفظها هنا والعودة إليها لاحقاً!" : "Click the heart icon on any product to save it here for later!"}
                  </p>
                </div>
              </div>
            ) : (
              wishlist.map((p) => {
                const name = language === "ar" ? p.name_ar : p.name_en;
                return (
                  <div key={p.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100 relative items-center">
                    <img
                      src={p.image}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-stone-800 truncate leading-tight">
                        {name}
                      </h4>
                      <p className="text-xs text-amber-800 font-medium mt-0.5">
                        {p.price} {t("currency")}
                      </p>

                      <div className="flex gap-2.5 mt-2.5">
                        <button
                          onClick={() => handleMoveToCart(p)}
                          className="flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 border border-amber-800/30 hover:border-amber-900/60 px-2 py-1 rounded-md transition-colors bg-white cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>{isRtl ? "نقل للسلة" : "Move to Cart"}</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p)}
                          className="flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-red-600 border border-stone-200 hover:border-red-200 px-2 py-1 rounded-md transition-colors bg-white cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{t("remove")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
