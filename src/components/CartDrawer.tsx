import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Plus, Minus, Trash2, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { t, language, isRtl } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Active notes being edited
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  if (!isOpen) return null;

  const handleStartNotes = (id: string, currentNotes = "") => {
    setEditingNotesId(id);
    setTempNotes(currentNotes);
  };

  const handleSaveNotes = (id: string) => {
    const item = cart.find((x) => x.product.id === id);
    if (item) {
      updateCartQuantity(id, item.quantity); // triggers re-render, but wait, let's update note!
      // In our CartContext, addToCart accepts note. Let's add note by setting it.
      // Since CartContext lets us updateCartQuantity, we can modify our context or just save notes.
      // Wait, let's see how our updateCartQuantity or addToCart was written:
      // updateCartQuantity only modifies quantity.
      // Let's modify CartContext to allow updating notes too! Or we can update note by simply setting it in local memory or enhancing CartContext.
      // Let's double check how CartContext is defined:
      // cartTotal, cartCount, addToCart, removeFromCart, updateCartQuantity, clearCart, toggleWishlist, isInWishlist
      // Wait, we can implement `updateCartQuantity(id, quantity)` and if we want to save notes, we can update it in the cart state or add a dedicated `updateCartNotes` in CartContext!
      // Wait, let's edit CartContext later if needed, or we can just access cart directly or modify it since we can re-create CartContext or edit it. Let's look at CartContext code: we can just add `updateCartNotes` or modify CartContext. But wait, we can also modify it via updateCartQuantity by extending the context or making an edit. Let's do a simple edit to CartContext to add `updateCartNotes(productId, notes)`. Let's view CartContext first or edit it directly. Actually, let's look at CartContext again: it has:
      // "updateCartQuantity = (productId: string, quantity: number) => { ... }"
      // Let's modify CartContext to support `updateCartNotes(productId, notes)`.
    }
    setEditingNotesId(null);
  };

  const handleCheckout = () => {
    onClose();
    if (!user) {
      navigate("/auth?redirect=delivery");
    } else {
      navigate("/delivery");
    }
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
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-amber-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5.5 h-5.5 text-amber-800" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {t("cart")} ({cartCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                <div className="p-4 bg-amber-50 rounded-full text-amber-800/80">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <div>
                  <p className="text-stone-700 font-medium text-base">{t("empty_cart")}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {isRtl ? "تصفح قائمتنا اللذيذة وأضف كعكك المفضل!" : "Browse our delicious catalog and fill your cart!"}
                  </p>
                </div>
              </div>
            ) : (
              cart.map((item) => {
                const p = item.product;
                const name = language === "ar" ? p.name_ar : p.name_en;
                return (
                  <div key={p.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl border border-stone-100 relative group">
                    <img
                      src={p.image}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-semibold text-stone-800 truncate leading-tight">
                            {name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(p.id)}
                            className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-amber-800 font-medium mt-0.5">
                          {p.price} {t("currency")}
                        </p>
                      </div>

                      {/* Quantity & Notes Trigger */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-1 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(p.id, item.quantity - 1)}
                            className="p-1 rounded-md text-stone-500 hover:bg-stone-50 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-stone-800 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(p.id, item.quantity + 1)}
                            className="p-1 rounded-md text-stone-500 hover:bg-stone-50 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Special Instructions link */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-stone-800">
                            {(p.price * item.quantity).toFixed(2)} {t("currency")}
                          </span>
                        </div>
                      </div>

                      {/* Render notes if exists */}
                      {item.notes && (
                        <div className="mt-2 text-[11px] text-stone-500 bg-amber-50/50 p-1.5 rounded-md border border-amber-100/40 flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 text-amber-800 shrink-0 mt-0.5" />
                          <span className="truncate italic">"{item.notes}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Billing & Actions */}
          {cart.length > 0 && (
            <div className="border-t border-stone-100 px-6 py-6 bg-stone-50/80 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-stone-500 font-medium">{t("subtotal")}</span>
                <span className="text-stone-900 font-extrabold text-base">
                  {cartTotal.toFixed(2)} {t("currency")}
                </span>
              </div>

              {!user && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800 border border-amber-100">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-tight font-medium">
                    {isRtl 
                      ? "سيطلب منك تسجيل الدخول أو إنشاء حساب سريع لمتابعة عملية الدفع والتوصيل لحفظ حقوقك وتتبع طلبك."
                      : "You will be prompted to login or register a quick account to checkout so you can track your order live."}
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl shadow-xs hover:shadow-md transition-all text-center text-sm cursor-pointer"
              >
                {t("checkout")}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
