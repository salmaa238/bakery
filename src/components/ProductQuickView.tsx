import React, { useState } from "react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { X, ShoppingCart, Star, MessageSquare, Clock, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { t, language, isRtl } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  if (!product) return null;

  const name = language === "ar" ? product.name_ar : product.name_en;
  const desc = language === "ar" ? product.description_ar : product.description_en;
  const prep = language === "ar" ? product.prepTime_ar : product.prepTime_en;
  const allergens = language === "ar" ? product.allergens_ar : product.allergens_en;

  const handleAdd = () => {
    addToCart(product, quantity, notes);
    setQuantity(1);
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden relative z-10 border border-stone-100 flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-sm transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side (Image Panel) */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-auto bg-stone-50 relative">
          <img
            src={product.image}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side (Details Form) */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                {product.category === "cakes" ? t("cakes") : t("bread")}
              </span>
              <div className="flex items-center gap-0.5 text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{product.rating}</span>
              </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-stone-900 leading-tight">
              {name}
            </h3>

            <p className="text-stone-500 text-xs leading-relaxed mt-3">
              {desc}
            </p>

            {/* Meta row */}
            <div className="grid grid-cols-2 gap-4 mt-5 py-3.5 border-y border-stone-100">
              <div className="flex items-start gap-1.5">
                <Clock className="w-4.5 h-4.5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">{isRtl ? "وقت التحضير" : "Prep Time"}</p>
                  <p className="text-xs text-stone-800 font-semibold">{prep}</p>
                </div>
              </div>

              {allergens && (
                <div className="flex items-start gap-1.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase">{isRtl ? "الحساسية" : "Allergens"}</p>
                    <p className="text-xs text-stone-800 font-semibold">{allergens}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Notes Input */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                <span>{isRtl ? "ملاحظات وتخصيص الخباز" : "Baker Instructions (Optional)"}</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isRtl ? "مثال: اكتب 'عيد ميلاد سعيد سارة'، أو 'أريد تزيين الفراولة مكثفاً'" : "e.g. Write 'Happy Birthday Sarah' on cake, or 'Extra strawberries'..."}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-none h-16 transition-colors"
                maxLength={200}
              />
            </div>
          </div>

          {/* Quantity and Actions footer */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-4 justify-between">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase">{isRtl ? "السعر الإجمالي" : "Total Price"}</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-amber-800">
                  {(product.price * quantity).toFixed(2)}
                </span>
                <span className="text-xs font-bold text-stone-500">{t("currency")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector */}
              <div className="flex items-center bg-stone-100 rounded-xl px-2.5 py-1.5 border border-stone-200/50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 rounded-md text-stone-600 font-bold"
                >
                  -
                </button>
                <span className="px-3 font-bold text-sm text-stone-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 rounded-md text-stone-600 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-1.5 px-5 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t("add_to_cart")}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
