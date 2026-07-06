import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Order, Reservation, CustomCakeOrder } from "../types";
import { User, ShoppingBag, Calendar, Sparkles, LogOut, Clock, ShieldCheck, Mail } from "lucide-react";

export const UserProfile: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { t, language, isRtl } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cakes, setCakes] = useState<CustomCakeOrder[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        // Fetch orders, reservations, custom cakes
        const [ordersRes, resRes, cakesRes] = await Promise.all([
          fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/reservations", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/custom-cakes", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (ordersRes.ok) setOrders(await ordersRes.json());
        if (resRes.ok) setReservations(await resRes.json());
        if (cakesRes.ok) setCakes(await cakesRes.json());
      } catch (err) {
        console.error("Failed to load user historical records", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto my-8 space-y-8">
      {/* User Card */}
      <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs justify-between">
        <div className="flex items-center gap-4.5">
          <div className="w-16 h-16 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-1.5">
              <span>{user.name}</span>
              {user.role === "admin" && (
                <span className="text-[10px] uppercase tracking-wide bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  {t("dashboard")}
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t("logout")}</span>
        </button>
      </div>

      {/* Booking and Order lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column (Purchase Orders) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <ShoppingBag className="w-5.5 h-5.5 text-amber-800" />
            <h4 className="text-lg font-serif font-bold text-stone-900">
              {isRtl ? "طلبات الشراء وتاريخ المعاملات" : "My Purchase Orders"}
            </h4>
          </div>

          {loading ? (
            <p className="text-xs text-stone-400 py-6 text-center">{t("loading")}</p>
          ) : orders.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">{t("no_orders")}</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id || order._id} className="bg-white border border-stone-150 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-start gap-2 border-b border-stone-50 pb-3">
                    <div>
                      <p className="text-[10px] font-bold text-stone-400 font-mono">ID: {order.id || order._id}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                      order.status === "delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                      order.status === "cancelled" ? "bg-red-50 text-red-600 border border-red-200" :
                      "bg-amber-50 text-amber-800 border border-amber-200 animate-pulse"
                    }`}>
                      {t(`status_${order.status}`)}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-2">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-stone-700 font-medium">
                          {it.quantity}x {language === "ar" ? it.name_ar : it.name_en}
                        </span>
                        <span className="text-stone-500 font-medium">
                          {(it.price * it.quantity).toFixed(2)} $
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-stone-50 pt-3 text-xs">
                    <span className="text-stone-500 font-medium">
                      {isRtl ? "العنوان:" : "Address:"} <strong className="text-stone-700">{order.shippingAddress}</strong>
                    </span>
                    <span className="text-amber-850 font-black text-sm">
                      {order.totalAmount.toFixed(2)} {t("currency")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column (Table reservations & Custom Cakes) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Table Bookings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Calendar className="w-5.5 h-5.5 text-amber-800" />
              <h4 className="text-lg font-serif font-bold text-stone-900">
                {isRtl ? "حجوزات الصالة والطاولات" : "My Table Reservations"}
              </h4>
            </div>

            {loading ? (
              <p className="text-xs text-stone-400 py-6 text-center">{t("loading")}</p>
            ) : reservations.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">{t("no_reservations")}</p>
            ) : (
              <div className="space-y-3.5">
                {reservations.map((res) => (
                  <div key={res.id || res._id} className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <strong className="text-stone-800">{res.date}</strong>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-600 font-medium">{res.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {res.guests} {isRtl ? "ضيوف" : "Guests"}
                      </p>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      res.status === "confirmed" ? "bg-green-100 text-green-700" :
                      res.status === "cancelled" ? "bg-red-100 text-red-600" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {t(`status_${res.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Cake Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-5.5 h-5.5 text-amber-800" />
              <h4 className="text-lg font-serif font-bold text-stone-900">
                {isRtl ? "طلبات الكعك المخصص" : "My Bespoke Cake Orders"}
              </h4>
            </div>

            {loading ? (
              <p className="text-xs text-stone-400 py-6 text-center">{t("loading")}</p>
            ) : cakes.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">{t("no_custom")}</p>
            ) : (
              <div className="space-y-3.5">
                {cakes.map((cake) => (
                  <div key={cake.id || cake._id} className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800 truncate max-w-[180px]">
                        {cake.tiers} {isRtl ? "طبقات" : "Tiers"} {cake.shape} {cake.flavor}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1">
                        {isRtl ? "الاستلام:" : "Pickup:"} {cake.dateNeeded}
                      </p>
                      <p className="text-[11px] text-amber-800 font-bold mt-1">
                        Quote: {cake.estimatedPrice} USD
                      </p>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      cake.status === "completed" ? "bg-green-100 text-green-700" :
                      cake.status === "cancelled" ? "bg-red-100 text-red-600" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {t(`status_${cake.status}`)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
