import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Product, Order, Reservation, CustomCakeOrder } from "../types";
import {
  TrendingUp,
  Package,
  Calendar,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  PlusCircle,
  FileEdit,
  DollarSign,
  Layers,
  ChevronDown,
  Info
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const { t, language, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState<"products" | "orders" | "reservations" | "custom_cakes">("products");

  // Collections state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cakes, setCakes] = useState<CustomCakeOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("cakes");
  const [image, setImage] = useState("");
  const [prepAr, setPrepAr] = useState("");
  const [prepEn, setPrepEn] = useState("");
  const [allergensAr, setAllergensAr] = useState("");
  const [allergensEn, setAllergensEn] = useState("");
  const [featured, setFeatured] = useState(false);

  // Status updates custom cakes
  const [quotePriceId, setQuotePriceId] = useState<string | null>(null);
  const [customQuotePrice, setCustomQuotePrice] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    fetchCollections();
  }, [token, user]);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const [prodRes, ordersRes, resRes, cakesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/reservations", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/custom-cakes", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (resRes.ok) setReservations(await resRes.json());
      if (cakesRes.ok) setCakes(await cakesRes.json());
    } catch (err) {
      console.error("Failed to load admin collections", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr || !nameEn || !price) {
      setErrorMsg("All core product details must be completed.");
      return;
    }

    const payload = {
      name_ar: nameAr,
      name_en: nameEn,
      description_ar: descAr,
      description_en: descEn,
      price: parseFloat(price),
      category,
      image: image || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
      prepTime_ar: prepAr,
      prepTime_en: prepEn,
      allergens_ar: allergensAr,
      allergens_en: allergensEn,
      featured
    };

    try {
      const method = editingProductId ? "PUT" : "POST";
      const endpoint = editingProductId ? `/api/products/${editingProductId}` : "/api/products";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowProductForm(false);
        setEditingProductId(null);
        resetProductForm();
        fetchCollections();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Failed to save product");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection failed");
    }
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProductId(p.id);
    setNameAr(p.name_ar);
    setNameEn(p.name_en);
    setDescAr(p.description_ar);
    setDescEn(p.description_en);
    setPrice(p.price.toString());
    setCategory(p.category);
    setImage(p.image);
    setPrepAr(p.prepTime_ar);
    setPrepEn(p.prepTime_en);
    setAllergensAr(p.allergens_ar);
    setAllergensEn(p.allergens_en);
    setFeatured(p.featured);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm(isRtl ? "هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من القائمة؟" : "Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchCollections();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCakeStatus = async (id: string, status: string, finalPrice?: string) => {
    try {
      const payload: any = { status };
      if (finalPrice) payload.finalPrice = finalPrice;

      const res = await fetch(`/api/custom-cakes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setQuotePriceId(null);
        setCustomQuotePrice("");
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetProductForm = () => {
    setNameAr("");
    setNameEn("");
    setDescAr("");
    setDescEn("");
    setPrice("");
    setCategory("cakes");
    setImage("");
    setPrepAr("");
    setPrepEn("");
    setAllergensAr("");
    setAllergensEn("");
    setFeatured(false);
    setErrorMsg("");
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-8 text-center bg-red-50 text-red-700 border border-red-200 rounded-xl my-12 font-bold">
        ⚠️ {isRtl ? "ممنوع الدخول! هذه الصلاحيات تقتصر على الخبازين المسؤولين فقط." : "Access Denied! Administrators only."}
      </div>
    );
  }

  // Statistics Metrics calculations
  const totalSalesVal = orders
    .filter((o) => o.status === "delivered")
    .reduce((tot, o) => tot + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">{t("admin_title")}</h2>
        <p className="text-xs text-stone-500 mt-1">{t("admin_subtitle")}</p>
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-stone-150 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-800">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400">{t("total_sales")}</p>
            <p className="text-xl font-black text-stone-900 mt-0.5">{totalSalesVal.toFixed(2)} USD</p>
          </div>
        </div>

        <div className="bg-white border border-stone-150 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400">{t("total_orders")}</p>
            <p className="text-xl font-black text-stone-900 mt-0.5">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white border border-stone-150 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl text-green-700">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400">{t("total_bookings")}</p>
            <p className="text-xl font-black text-stone-900 mt-0.5">
              {reservations.filter((r) => r.status === "confirmed").length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-stone-150 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-stone-400">{t("total_custom_cakes")}</p>
            <p className="text-xl font-black text-stone-900 mt-0.5">{cakes.length}</p>
          </div>
        </div>
      </div>

      {/* Responsive interactive Sales & Orders analytics using SVGs */}
      <div className="bg-white rounded-2xl border border-stone-150 p-6 shadow-xs">
        <h3 className="text-base font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-800" />
          <span>{t("sales_analytics")}</span>
        </h3>

        {/* Custom SVG Line Chart */}
        <div className="h-44 w-full relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Background Grid Lines */}
            <line x1="0" y1="20" x2="100%" y2="20" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="65" x2="100%" y2="65" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="110" x2="100%" y2="110" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="150" x2="100%" y2="150" stroke="#e5e7eb" strokeWidth="2" />

            {/* Simulated Line Plot with smooth curve */}
            <path
              d="M 50,130 C 150,110 250,50 350,75 S 550,20 650,45 S 850,90 950,25 S 1050,15 1200,30"
              fill="none"
              stroke="#b45309"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Interactive Data dots */}
            <circle cx="350" cy="75" r="5" fill="#ffffff" stroke="#b45309" strokeWidth="3" />
            <circle cx="650" cy="45" r="5" fill="#ffffff" stroke="#b45309" strokeWidth="3" />
            <circle cx="950" cy="25" r="5" fill="#ffffff" stroke="#b45309" strokeWidth="3" />
          </svg>

          {/* Label coordinates */}
          <div className="absolute bottom-1 right-2 text-[9px] font-mono font-bold text-stone-400">Week-to-Date</div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-stone-200 gap-1.5 overflow-x-auto pb-px">
        {[
          { id: "products", name: t("tab_products") },
          { id: "orders", name: t("tab_orders") },
          { id: "reservations", name: t("tab_reservations") },
          { id: "custom_cakes", name: t("tab_custom_cakes") },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3.5 px-5 font-semibold text-sm transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "border-amber-700 text-amber-800"
                : "border-transparent text-stone-500 hover:text-stone-800"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Render selected Tabs content */}
      <div className="pt-2">
        {loading ? (
          <div className="text-center py-12 text-stone-400 text-xs">{t("loading")}</div>
        ) : (
          <>
            {/* Tab 1: Products */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-base font-serif font-bold text-stone-900">{t("product_list")}</h4>
                  <button
                    onClick={() => {
                      resetProductForm();
                      setEditingProductId(null);
                      setShowProductForm(!showProductForm);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t("add_new_product")}</span>
                  </button>
                </div>

                {/* Create/Edit Product Form dropdown drawer */}
                {showProductForm && (
                  <form
                    onSubmit={handleCreateOrEditProduct}
                    className="bg-stone-50 border border-stone-150 rounded-2xl p-6 space-y-5"
                  >
                    <h4 className="text-xs font-bold text-stone-800 uppercase border-b border-stone-150 pb-2">
                      {editingProductId ? "تعديل بيانات الصنف" : "بيانات الصنف الجديد"}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_name_ar")} *</label>
                        <input
                          type="text"
                          required
                          value={nameAr}
                          onChange={(e) => setNameAr(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_name_en")} *</label>
                        <input
                          type="text"
                          required
                          value={nameEn}
                          onChange={(e) => setNameEn(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_desc_ar")}</label>
                        <textarea
                          value={descAr}
                          onChange={(e) => setDescAr(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white h-16 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_desc_en")}</label>
                        <textarea
                          value={descEn}
                          onChange={(e) => setDescEn(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white h-16 resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_price")} *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_category")}</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        >
                          <option value="cakes">{t("cakes")}</option>
                          <option value="bread">{t("bread")}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_image")}</label>
                        <input
                          type="url"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_prep_ar")}</label>
                        <input
                          type="text"
                          value={prepAr}
                          onChange={(e) => setPrepAr(e.target.value)}
                          placeholder="مثال: طازج يومياً، أو 24 ساعة"
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_prep_en")}</label>
                        <input
                          type="text"
                          value={prepEn}
                          onChange={(e) => setPrepEn(e.target.value)}
                          placeholder="e.g. Fresh Daily, or 24 hours"
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_allergens_ar")}</label>
                        <input
                          type="text"
                          value={allergensAr}
                          onChange={(e) => setAllergensAr(e.target.value)}
                          placeholder="الغلوتين، الحليب، المكسرات"
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-700 mb-1">{t("prod_allergens_en")}</label>
                        <input
                          type="text"
                          value={allergensEn}
                          onChange={(e) => setAllergensEn(e.target.value)}
                          placeholder="Gluten, Dairy, Nuts"
                          className="w-full text-xs p-2.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 text-amber-700 focus:ring-amber-500 rounded border-stone-300"
                      />
                      <label htmlFor="featured" className="text-xs font-semibold text-stone-700 select-none cursor-pointer">
                        {t("prod_featured")}
                      </label>
                    </div>

                    {errorMsg && <p className="text-xs text-red-600 font-bold">{errorMsg}</p>}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {t("save")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProductForm(false);
                          setEditingProductId(null);
                        }}
                        className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </form>
                )}

                {/* Products Grid list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((p) => {
                    const name = language === "ar" ? p.name_ar : p.name_en;
                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-stone-150 rounded-2xl overflow-hidden p-4 flex flex-col justify-between"
                      >
                        <div className="flex gap-3.5">
                          <img
                            src={p.image}
                            alt={name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-lg bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-stone-900 truncate leading-tight">{name}</h5>
                            <p className="text-[10px] text-stone-400 font-bold mt-1 uppercase">
                              {p.category === "cakes" ? t("cakes") : t("bread")}
                            </p>
                            <p className="text-xs text-amber-800 font-bold mt-1">
                              {p.price.toFixed(2)} USD
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 border-t border-stone-100 pt-3 mt-4">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 rounded-lg text-[10px] font-bold border border-stone-200 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>تعديل</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="flex items-center justify-center p-1.5 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg border border-stone-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Orders */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-8">{t("no_orders")}</p>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-stone-150 bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-150 text-stone-500 font-bold">
                          <th className="p-4">{isRtl ? "رقم الطلب" : "Order ID"}</th>
                          <th className="p-4">{t("customer")}</th>
                          <th className="p-4">{isRtl ? "المشتريات" : "Purchased Items"}</th>
                          <th className="p-4">{t("total_amount")}</th>
                          <th className="p-4">{t("status")}</th>
                          <th className="p-4">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.map((o) => (
                          <tr key={o.id || o._id} className="hover:bg-stone-50/50">
                            <td className="p-4 font-mono text-[10px] font-bold text-stone-400">
                              {(o.id || o._id || "").substring(0, 10)}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-stone-800">{o.userName}</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">{o.contactPhone}</p>
                            </td>
                            <td className="p-4 max-w-xs">
                              <p className="font-medium text-stone-700 truncate">
                                {o.items.map((it) => `${it.quantity}x ${language === "ar" ? it.name_ar : it.name_en}`).join(", ")}
                              </p>
                              {o.notes && (
                                <p className="text-[10px] text-amber-800 italic mt-1 font-mono">"{o.notes}"</p>
                              )}
                            </td>
                            <td className="p-4 font-bold text-stone-900">
                              {o.totalAmount.toFixed(2)} $
                            </td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                o.status === "delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                                o.status === "cancelled" ? "bg-red-50 text-red-600 border border-red-200" :
                                "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}>
                                {t(`status_${o.status}`)}
                              </span>
                            </td>
                            <td className="p-4">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id || o._id || "", e.target.value)}
                                className="p-1 border border-stone-200 rounded-lg bg-white text-[11px]"
                              >
                                <option value="pending">Pending</option>
                                <option value="baking">Baking</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Reservations */}
            {activeTab === "reservations" && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-8">{t("no_reservations")}</p>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-stone-150 bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-150 text-stone-500 font-bold">
                          <th className="p-4">{t("customer")}</th>
                          <th className="p-4">{t("date")}</th>
                          <th className="p-4">{isRtl ? "المقاعد" : "Guests"}</th>
                          <th className="p-4">{t("notes")}</th>
                          <th className="p-4">{t("status")}</th>
                          <th className="p-4">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {reservations.map((r) => (
                          <tr key={r.id || r._id} className="hover:bg-stone-50/50">
                            <td className="p-4">
                              <p className="font-bold text-stone-800">{r.userName}</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">{r.contactPhone}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-stone-700">{r.date}</p>
                              <p className="text-[10px] text-stone-400 mt-0.5">{r.time}</p>
                            </td>
                            <td className="p-4 font-bold text-stone-800">
                              {r.guests} Guests
                            </td>
                            <td className="p-4 max-w-xs truncate text-stone-500 italic">
                              {r.specialRequests || "None"}
                            </td>
                            <td className="p-4">
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                r.status === "confirmed" ? "bg-green-100 text-green-700" :
                                r.status === "cancelled" ? "bg-red-100 text-red-600" :
                                "bg-amber-100 text-amber-800"
                              }`}>
                                {t(`status_${r.status}`)}
                              </span>
                            </td>
                            <td className="p-4 flex gap-1">
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id || r._id || "", "confirmed")}
                                className="p-1 text-green-700 hover:bg-green-50 rounded-md border border-green-200 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleUpdateReservationStatus(r.id || r._id || "", "cancelled")}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-md border border-red-250 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Custom Cakes */}
            {activeTab === "custom_cakes" && (
              <div className="space-y-4">
                {cakes.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-8">{t("no_custom")}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cakes.map((ck) => (
                      <div key={ck.id || ck._id} className="bg-white border border-stone-150 p-5 rounded-2xl shadow-xs space-y-4">
                        <div className="flex justify-between items-start gap-2 border-b border-stone-50 pb-3">
                          <div>
                            <p className="font-bold text-stone-900 text-sm">
                              {ck.userName}
                            </p>
                            <p className="text-[10px] text-stone-400 font-bold font-mono mt-0.5">Needed by: {ck.dateNeeded}</p>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                            ck.status === "completed" ? "bg-green-100 text-green-700" :
                            ck.status === "cancelled" ? "bg-red-100 text-red-600" :
                            "bg-amber-100 text-amber-800"
                          }`}>
                            {t(`status_${ck.status}`)}
                          </span>
                        </div>

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 font-mono">
                          <p><strong>Shape:</strong> {ck.shape}</p>
                          <p><strong>Size:</strong> {ck.size}</p>
                          <p><strong>Tiers:</strong> {ck.tiers}</p>
                          <p><strong>Flavor:</strong> {ck.flavor}</p>
                          <p className="col-span-2 mt-1"><strong>Toppings:</strong> {ck.toppings.join(", ") || "None"}</p>
                          {ck.inscription && (
                            <p className="col-span-2 mt-1 text-amber-800 font-bold"><strong>Text:</strong> "{ck.inscription}"</p>
                          )}
                        </div>

                        {/* Estimate & Quote pricing controls */}
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <p className="text-stone-400 font-bold">Estimate Quote</p>
                            <p className="text-sm font-black text-amber-800">{ck.estimatedPrice} USD</p>
                          </div>

                          {quotePriceId === ck.id ? (
                            <div className="flex gap-1 items-center">
                              <input
                                type="number"
                                placeholder="Final $"
                                value={customQuotePrice}
                                onChange={(e) => setCustomQuotePrice(e.target.value)}
                                className="p-1 border border-stone-200 rounded-md w-20 text-xs text-center"
                              />
                              <button
                                onClick={() => handleUpdateCakeStatus(ck.id || ck._id || "", "quoted", customQuotePrice)}
                                className="p-1 bg-green-700 text-white rounded-md cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setQuotePriceId(ck.id || ck._id || null);
                                setCustomQuotePrice(ck.estimatedPrice.toString());
                              }}
                              className="px-3 py-1 text-[10px] font-bold text-amber-800 border border-amber-800/30 rounded-lg hover:bg-amber-50 cursor-pointer"
                            >
                              Final Quote
                            </button>
                          )}
                        </div>

                        {/* Quick state transitions */}
                        <div className="pt-3 border-t border-stone-100 flex gap-1.5 overflow-x-auto">
                          {[
                            { id: "design_approved", label: "Approve" },
                            { id: "baking", label: "Bake" },
                            { id: "ready_for_pickup", label: "Ready" },
                            { id: "completed", label: "Complete" },
                            { id: "cancelled", label: "Cancel" },
                          ].map((st) => (
                            <button
                              key={st.id}
                              onClick={() => handleUpdateCakeStatus(ck.id || ck._id || "", st.id)}
                              className={`px-2 py-1 border rounded-lg text-[9px] font-extrabold uppercase shrink-0 cursor-pointer ${
                                ck.status === st.id
                                  ? "bg-amber-850 border-amber-850 text-white"
                                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
