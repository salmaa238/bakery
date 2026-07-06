import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Calendar, Phone, CheckCircle2, Award, Heart, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const CakeBuilder: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, token } = useAuth();

  // Core specs state
  const [shape, setShape] = useState("round");
  const [size, setSize] = useState("medium");
  const [tiers, setTiers] = useState("1");
  const [flavor, setFlavor] = useState("chocolate");
  const [frosting, setFrosting] = useState("buttercream");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [inscription, setInscription] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const shapes = [
    { id: "round", name: t("shape_round"), base: 15, emoji: "⚪" },
    { id: "square", name: t("shape_square"), base: 20, emoji: "⬜" },
    { id: "heart", name: t("shape_heart"), base: 25, emoji: "❤️" },
  ];

  const sizes = [
    { id: "small", name: t("size_small"), multiplier: 1.0 },
    { id: "medium", name: t("size_medium"), multiplier: 1.5 },
    { id: "large", name: t("size_large"), multiplier: 2.1 },
  ];

  const tierOptions = [
    { id: "1", name: t("tiers_1"), addedCost: 0 },
    { id: "2", name: t("tiers_2"), addedCost: 15 },
    { id: "3", name: t("tiers_3"), addedCost: 35 },
  ];

  const flavors = [
    { id: "chocolate", name: t("flavor_chocolate"), color: "bg-[#4e2b10]" },
    { id: "vanilla", name: t("flavor_vanilla"), color: "bg-[#f5e6c4]" },
    { id: "redvelvet", name: t("flavor_redvelvet"), color: "bg-[#800c14]" },
    { id: "pistachio", name: t("flavor_pistachio"), color: "bg-[#93c572]" },
  ];

  const frostingOptions = [
    { id: "buttercream", name: t("frosting_buttercream") },
    { id: "creamcheese", name: t("frosting_creamcheese") },
    { id: "ganache", name: t("frosting_ganache") },
  ];

  const toppings = [
    { id: "berries", name: t("topping_berries"), cost: 4.5 },
    { id: "macarons", name: t("topping_macarons"), cost: 6.0 },
    { id: "goldleaf", name: t("topping_goldleaf"), cost: 8.0 },
    { id: "flowers", name: t("topping_flowers"), cost: 5.0 },
    { id: "sprinkles", name: t("topping_sprinkles"), cost: 2.0 },
  ];

  // Calculate instant estimated price
  const basePrice = shapes.find((s) => s.id === shape)?.base || 15;
  const sizeMult = sizes.find((sz) => sz.id === size)?.multiplier || 1.5;
  const tierCost = tierOptions.find((tr) => tr.id === tiers)?.addedCost || 0;
  const toppingsCost = selectedToppings.reduce((total, topId) => {
    const tItem = toppings.find((tp) => tp.id === topId);
    return total + (tItem?.cost || 0);
  }, 0);

  const estimatedPrice = basePrice * sizeMult + tierCost + toppingsCost;

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg(isRtl ? "يجب تسجيل الدخول أولاً لإرسال طلب الكعك المخصص." : "Please login first to submit custom cake requests.");
      return;
    }
    if (!dateNeeded || !phone) {
      setErrorMsg(isRtl ? "الرجاء تحديد تاريخ الاستلام ورقم الهاتف." : "Please fill in the receipt date and phone number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/custom-cakes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          shape,
          size,
          tiers,
          flavor,
          frosting,
          toppings: selectedToppings,
          inscription,
          dateNeeded,
          phone,
          estimatedPrice: parseFloat(estimatedPrice.toFixed(2))
        })
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setErrorMsg(data.error || "Failed to submit order");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection error");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-8 text-center max-w-xl mx-auto my-6 shadow-sm">
        <CheckCircle2 className="w-16 h-16 text-amber-800 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-stone-900">
          {isRtl ? "تم إرسال طلب كعكتك المخصصة بنجاح!" : "Custom Cake Order Submitted Successfully!"}
        </h3>
        <p className="text-sm text-stone-600 mt-2.5 leading-relaxed">
          {isRtl
            ? "لقد استلم خبازونا طموحات كعكتك الجميلة. سيقوم رئيس الطهاة بمراجعة التصميم وتحديد تفاصيل الخبز الدقيقة ثم الاتصال بك هاتفياً لتأكيد السعر النهائي وميعاد التسليم!"
            : "Our bakers have received your gorgeous cake blueprint. The head chef will inspect your parameters and call you within 24 hours to confirm the final quotation and delivery schedule!"}
        </p>
        <div className="mt-6 p-4 bg-white rounded-xl border border-stone-150 text-left text-xs font-mono text-stone-600 space-y-1.5">
          <p><strong>Blueprint:</strong> {tiers} Tiers, {shape} shape, {flavor} base</p>
          <p><strong>Toppings:</strong> {selectedToppings.join(", ") || "None"}</p>
          <p><strong>Estimated Quote:</strong> {estimatedPrice.toFixed(2)} USD</p>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2 bg-amber-850 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          {isRtl ? "صمم كعكة أخرى" : "Design Another Cake"}
        </button>
      </div>
    );
  }

  // Visual preview helper for cake decoration
  const activeFlavorColor = flavors.find((f) => f.id === flavor)?.color || "bg-amber-700";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Visual Live Canvas mockup on Left */}
      <div className="lg:col-span-5 bg-stone-100 rounded-2xl border border-stone-200/60 p-6 flex flex-col items-center justify-center sticky top-24 min-h-[420px]">
        <h4 className="text-stone-500 font-bold uppercase text-[10px] tracking-wider mb-6">
          ✨ {isRtl ? "مخطط كعكتك الحي ثلاثي الأبعاد" : "Your Live Cake Blueprint"}
        </h4>

        {/* Dynamic Interactive SVG Cake representation */}
        <div className="relative w-48 h-64 flex flex-col items-center justify-end">
          {/* Render tiers */}
          <AnimatePresence>
            {/* Tiers rendering stacked from bottom */}
            {parseInt(tiers) >= 3 && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className={`w-20 h-10 ${activeFlavorColor} rounded-t-lg border-x-4 border-t-2 border-white/20 shadow-md relative z-30 mb-[-10px]`}
              />
            )}
            {parseInt(tiers) >= 2 && (
              <motion.div
                initial={{ scale: 0, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                className={`w-32 h-12 ${activeFlavorColor} rounded-t-lg border-x-4 border-t-2 border-white/20 shadow-md relative z-20 mb-[-10px]`}
              />
            )}
            <motion.div
              animate={{ scale: 1 }}
              className={`w-44 h-14 ${activeFlavorColor} rounded-t-xl border-x-4 border-t-2 border-white/20 shadow-lg relative z-10`}
            >
              {/* Frosting drips if buttercream or ganache */}
              <div className="absolute top-0 inset-x-0 h-3 flex justify-around overflow-hidden opacity-50">
                <div className="w-2 h-4 bg-white/70 rounded-full" />
                <div className="w-3.5 h-6 bg-white/70 rounded-full" />
                <div className="w-1.5 h-3 bg-white/70 rounded-full" />
                <div className="w-3 h-5 bg-white/70 rounded-full" />
                <div className="w-2 h-3.5 bg-white/70 rounded-full" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stand base plate */}
          <div className="w-52 h-4 bg-stone-300 rounded-full border border-stone-400 relative z-5" />
          <div className="w-24 h-6 bg-stone-200 border-x border-stone-350 relative z-1" />
          <div className="w-36 h-3 bg-stone-300 rounded-full" />
        </div>

        {/* Live Specifications read-out */}
        <div className="w-full mt-6 space-y-2 border-t border-stone-200/60 pt-4 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>{isRtl ? "الهيكل المختار:" : "Blueprint Structure:"}</span>
            <span className="font-bold text-stone-900">
              {t(`shape_${shape}`)} • {tiers} {isRtl ? "طبقات" : "Tiers"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{isRtl ? "الإضافات العلوية:" : "Toppings Selection:"}</span>
            <span className="font-bold text-stone-900 truncate max-w-[200px]">
              {selectedToppings.map((t) => toppings.find((tp) => tp.id === t)?.name).join(", ") || (isRtl ? "بدون إضافات" : "Plain")}
            </span>
          </div>
        </div>

        {/* Price read-out */}
        <div className="w-full bg-amber-50 rounded-xl border border-amber-100 p-4 mt-6 text-center">
          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
            {t("estimated_cost")}
          </p>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className="text-3xl font-black text-amber-900">
              {estimatedPrice.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-800">{t("currency")}</span>
          </div>
          <p className="text-[9px] text-stone-500 mt-1">
            {isRtl
              ? "*هذا تقدير أولي يتغير بالتأكيد النهائي بعد تفاصيل النقش والتزيين الدقيق مع رئيس الطهاة."
              : "*Final invoice is settled over phone based on decor details with our pastry artist."}
          </p>
        </div>
      </div>

      {/* Inputs Form on Right */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-2xl border border-stone-100 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-serif font-bold text-stone-900">{t("cake_builder_title")}</h3>
          <p className="text-xs text-stone-500 mt-1">{t("cake_builder_subtitle")}</p>
        </div>

        {/* Shape selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
            {t("cake_shape")}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {shapes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setShape(s.id)}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  shape === s.id
                    ? "border-amber-700 bg-amber-50 text-amber-800 font-bold"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-xs">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
            {t("cake_size")}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {sizes.map((sz) => (
              <button
                key={sz.id}
                type="button"
                onClick={() => setSize(sz.id)}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  size === sz.id
                    ? "border-amber-700 bg-amber-50 text-amber-800 font-bold"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className="block text-xs font-bold">{sz.name}</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">x{sz.multiplier} multiplier</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tiers Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
            {t("cake_tiers")}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {tierOptions.map((tr) => (
              <button
                key={tr.id}
                type="button"
                onClick={() => setTiers(tr.id)}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  tiers === tr.id
                    ? "border-amber-700 bg-amber-50 text-amber-800 font-bold"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className="block text-xs font-bold">{tr.name}</span>
                <span className="text-[10px] text-amber-800 font-bold mt-0.5 block">
                  {tr.addedCost > 0 ? `+${tr.addedCost} $` : "Included"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Flavors Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
            {t("cake_flavor")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {flavors.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFlavor(f.id)}
                className={`py-2.5 px-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                  flavor === f.id
                    ? "border-amber-700 bg-amber-50 text-amber-800 font-bold"
                    : "border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${f.color} border border-black/10 shrink-0`} />
                <span className="text-xs truncate leading-none">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toppings Multi-selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
            {t("cake_toppings")}
          </label>
          <div className="flex flex-wrap gap-2.5">
            {toppings.map((tp) => {
              const selected = selectedToppings.includes(tp.id);
              return (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => toggleTopping(tp.id)}
                  className={`px-3.5 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                    selected
                      ? "bg-amber-800 border-amber-800 text-white shadow-sm"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300"
                  }`}
                >
                  <span>{tp.name}</span>
                  <span className={`text-[10px] font-bold ${selected ? "text-amber-200" : "text-amber-800"}`}>
                    (+{tp.cost} $)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Written message on cake */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase">
            {t("cake_inscription")}
          </label>
          <input
            type="text"
            value={inscription}
            onChange={(e) => setInscription(e.target.value)}
            placeholder={isRtl ? "مثال: عيد ميلاد سعيد أحمد 25!" : "e.g. Happy Birthday Sarah!"}
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            maxLength={100}
          />
        </div>

        {/* Delivery / Contact coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-150">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{t("delivery_date")} *</span>
            </label>
            <input
              type="date"
              required
              value={dateNeeded}
              onChange={(e) => setDateNeeded(e.target.value)}
              className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              <span>{t("phone")} *</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 50 123 4567"
              className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {!user ? (
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-800 text-center">
            {isRtl 
              ? "الرجاء تسجيل الدخول أولاً لتتمكن من حجز وإرسال طلب الكعك المخصص ومتابعته."
              : "Please login to your account to build and submit your custom cake blueprint."}
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-850 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all text-center text-sm cursor-pointer"
          >
            {loading ? t("loading") : t("builder_submit")}
          </button>
        )}
      </form>
    </div>
  );
};
