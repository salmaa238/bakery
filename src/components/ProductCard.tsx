import React from "react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { Heart, ShoppingCart, Star, Clock } from "lucide-react";
import { motion } from "motion/react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { t, language, isRtl } = useLanguage();

  const name = language === "ar" ? product.name_ar : product.name_en;
  const desc = language === "ar" ? product.description_ar : product.description_en;
  const prep = language === "ar" ? product.prepTime_ar : product.prepTime_en;
  const favorited = isInWishlist(product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-xs hover:shadow-lg transition-all flex flex-col h-full group"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100 shrink-0">
        <img
          src={product.image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-red-500 shadow-sm cursor-pointer transition-colors"
        >
          <Heart className={`w-4.5 h-4.5 ${favorited ? "text-red-500 fill-red-500" : ""}`} />
        </button>

        {/* Prep Time Ribbon */}
        <div className={`absolute bottom-3 ${isRtl ? "right-3" : "left-3"} flex items-center gap-1 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white rounded-lg text-[10px] font-medium`}>
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{prep}</span>
        </div>
      </div>

      {/* Content Space */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-stone-500 mt-0.5">({product.rating})</span>
          </div>

          <h3
            onClick={() => onQuickView?.(product)}
            className="font-serif font-bold text-stone-950 text-base leading-snug group-hover:text-amber-800 transition-colors cursor-pointer"
          >
            {name}
          </h3>

          <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {desc}
          </p>

          {product.allergens_en && (
            <p className="text-[10px] text-stone-400 mt-2 font-medium">
              ⚠️ {isRtl ? "مسببات الحساسية: " : "Allergens: "}
              {language === "ar" ? product.allergens_ar : product.allergens_en}
            </p>
          )}
        </div>

        {/* Footer Accessories */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-stone-50 shrink-0">
          <div>
            <span className="text-amber-800 font-extrabold text-lg leading-none">
              {product.price.toFixed(2)}
            </span>
            <span className="text-stone-500 text-[10px] font-bold mx-1">
              {t("currency")}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{t("add_to_cart")}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
