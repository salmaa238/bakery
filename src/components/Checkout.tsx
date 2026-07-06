import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Truck, Store, MapPin, Phone, MessageSquare, CheckCircle2, Ticket } from "lucide-react";

export const Checkout: React.FC = () => {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { t, language, isRtl } = useLanguage();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Inputs state
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Rates
  const deliveryFee = deliveryType === "delivery" ? 5.0 : 0.0;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg(isRtl ? "يجب تسجيل الدخول أولاً لإتمام الطلب." : "Please login first to submit your order.");
      return;
    }
    if (cart.length === 0) {
      setErrorMsg(isRtl ? "عربة تسوقك فارغة حالياً." : "Your shopping cart is empty.");
      return;
    }
    if (!phone || (deliveryType === "delivery" && !address)) {
      setErrorMsg(isRtl ? "الرجاء ملء جميع الحقول المطلوبة." : "Please complete all required fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const formattedItems = cart.map((item) => ({
        productId: item.product.id,
        name_en: item.product.name_en,
        name_ar: item.product.name_ar,
        price: item.product.price,
        quantity: item.quantity
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: formattedItems,
          totalAmount: parseFloat(grandTotal.toFixed(2)),
          shippingAddress: deliveryType === "delivery" ? address : "In-store pickup at Takhassusi St, Riyadh",
          contactPhone: phone,
          notes,
          deliveryType
        })
      });

      if (response.ok) {
        setSuccess(true);
        clearCart();
      } else {
        const d = await response.json();
        setErrorMsg(d.error || "Order placement failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-8 text-center max-w-xl mx-auto my-6 shadow-sm">
        <CheckCircle2 className="w-16 h-16 text-amber-800 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-stone-900">
          {t("delivery_success")}
        </h3>
        <p className="text-sm text-stone-600 mt-2.5 leading-relaxed">
          {isRtl
            ? "لقد تم تسجيل طلب الشراء الخاص بك بنجاح وجاري إرساله للفرن. يمكنك متابعة حالة تحضير وخبز طلبك من خلال لوحة التحكم الخاصة بملفك الشخصي!"
            : "Your purchase order has been logged and is heading straight to our ovens. You can track the real-time baking/delivery stage on your profile dashboard!"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/profile"
            className="px-6 py-2.5 bg-amber-850 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            {isRtl ? "تتبع طلبي الآن" : "Track My Order"}
          </Link>
          <Link
            to="/menu"
            className="px-6 py-2.5 bg-white border border-stone-250 text-stone-700 hover:text-amber-800 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
          >
            {isRtl ? "متابعة التسوق" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto space-y-4">
        <div className="p-4 bg-amber-50 rounded-full text-amber-850 w-16 h-16 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-stone-700 font-bold text-base">{t("empty_cart")}</h4>
          <p className="text-xs text-stone-400 mt-1">
            {isRtl ? "يرجى تعبئة السلة أولاً ببعض المخبوزات والحلويات الدافئة قبل متابعة الدفع." : "Please add some warm breads and pastries to your cart before checking out."}
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-block px-6 py-2.5 bg-amber-850 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          {t("view_menu")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Checkout Inputs Column (Left) */}
      <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-white rounded-2xl border border-stone-100 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-stone-900">{t("delivery_title")}</h3>
          <p className="text-xs text-stone-500 mt-1">{t("delivery_subtitle")}</p>
        </div>

        {/* Delivery Type Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
            {t("delivery_type")}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDeliveryType("delivery")}
              className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-bold ${
                deliveryType === "delivery"
                  ? "border-amber-700 bg-amber-50 text-amber-800"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>{t("delivery_type_home")}</span>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-bold ${
                deliveryType === "pickup"
                  ? "border-amber-700 bg-amber-50 text-amber-800"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              <Store className="w-4 h-4 shrink-0" />
              <span>{t("delivery_type_pickup")}</span>
            </button>
          </div>
        </div>

        {/* Home Shipping address */}
        {deliveryType === "delivery" && (
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-stone-500" />
              <span>{t("address")} *</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("checkout_address_placeholder")}
              className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        )}

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-stone-500" />
            <span>{t("phone")} *</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("checkout_phone_placeholder")}
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Order Notes */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-stone-500" />
            <span>{t("notes")}</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("order_notes_placeholder")}
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-none h-20 transition-colors"
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {!user ? (
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-800 text-center">
            {isRtl 
              ? "الرجاء تسجيل الدخول لتتمكن من إرسال طلب الشراء وحفظه تحت اسمك."
              : "Please login to your account to place and submit your order."}
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-850 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all text-center text-sm cursor-pointer"
          >
            {loading ? t("loading") : t("place_order")}
          </button>
        )}
      </form>

      {/* Order Invoice Column (Right) */}
      <div className="lg:col-span-5 bg-stone-50 border border-stone-200/60 rounded-2xl p-6 space-y-6">
        <h4 className="text-base font-serif font-bold text-stone-900 border-b border-stone-200/50 pb-3">
          {t("order_summary")}
        </h4>

        {/* Items map */}
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {cart.map((item) => {
            const name = language === "ar" ? item.product.name_ar : item.product.name_en;
            return (
              <div key={item.product.id} className="flex gap-3 justify-between items-start text-xs border-b border-stone-100 pb-2">
                <div>
                  <p className="font-bold text-stone-800">{name}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{item.quantity}x @ {item.product.price.toFixed(2)} $</p>
                  {item.notes && (
                    <p className="text-[10px] text-amber-800 italic mt-1 font-mono">"{item.notes}"</p>
                  )}
                </div>
                <span className="font-bold text-stone-800 shrink-0">
                  {(item.product.price * item.quantity).toFixed(2)} $
                </span>
              </div>
            );
          })}
        </div>

        {/* Pricing calculations */}
        <div className="space-y-3 pt-3 border-t border-stone-200/50 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span className="font-bold text-stone-800">{cartTotal.toFixed(2)} $</span>
          </div>

          <div className="flex justify-between">
            <span>{t("delivery_fee")}</span>
            <span className="font-bold text-stone-800">
              {deliveryFee > 0 ? `${deliveryFee.toFixed(2)} $` : "Free"}
            </span>
          </div>

          <div className="flex justify-between text-sm pt-3 border-t border-stone-200/50">
            <span className="font-black text-stone-900">{t("total")}</span>
            <span className="font-black text-amber-900 text-base">
              {grandTotal.toFixed(2)} {t("currency")}
            </span>
          </div>
        </div>

        {/* COD banner badge */}
        <div className="flex items-center gap-2.5 p-3.5 bg-amber-100/50 border border-amber-200/50 rounded-xl text-amber-900 text-[11px] leading-tight font-medium">
          <Ticket className="w-4.5 h-4.5 shrink-0 text-amber-800" />
          <p>
            {isRtl 
              ? "الدفع متاح حالياً عند الاستلام كاش أو مدى/شبكة مع المندوب لحين تشغيل بوابات فيزا وسداد."
              : "Payment is settled upon receipt (Cash or Card on Delivery) while online gateways are undergoing setup."}
          </p>
        </div>
      </div>
    </div>
  );
};
