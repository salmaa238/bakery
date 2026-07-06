import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Product, Review } from "../types";
import { ProductCard } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";
import { Star, MessageSquare, Quote, Heart, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const Home: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, token } = useAuth();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Quick view state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    // Fetch products
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const featured = data.filter((p: Product) => p.featured);
        setFeaturedProducts(featured.slice(0, 4));
      })
      .catch((err) => console.error(err));

    // Fetch reviews
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewError(isRtl ? "يجب تسجيل الدخول لمشاركة تقييمك." : "Please login first to submit a review.");
      return;
    }
    if (!reviewText) {
      setReviewError(isRtl ? "الرجاء كتابة نص التقييم أولاً." : "Please type your review text.");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newRating,
          text_en: reviewText,
          text_ar: reviewText
        })
      });

      if (response.ok) {
        setReviewSuccess(true);
        setReviewText("");
        setNewRating(5);
        setReviewError("");
        // Reload reviews
        fetch("/api/reviews")
          .then((res) => res.json())
          .then((data) => setReviews(data));
      } else {
        const data = await response.json();
        setReviewError(data.error || "Review submission failed");
      }
    } catch (err: any) {
      setReviewError(err.message || "Connection failed");
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-50 border-b border-stone-100 py-16 sm:py-24">
        {/* Background visual graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/50 rounded-full blur-2xl opacity-40 -translate-x-12 translate-y-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{t("welcome")}</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-stone-950 tracking-tight leading-tight">
              {t("hero_title")}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              {t("hero_subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
              <Link
                to="/menu"
                className="px-8 py-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm text-center cursor-pointer"
              >
                {t("view_menu")}
              </Link>
              <Link
                to="/booking"
                className="px-8 py-4 bg-white border border-stone-250 text-stone-700 hover:text-amber-800 hover:border-amber-400 font-bold rounded-xl shadow-xs transition-all text-sm text-center cursor-pointer"
              >
                {t("book_table")}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Hero visual image */}
            <div className="relative w-full max-w-sm aspect-square bg-amber-550 rounded-3xl overflow-hidden border-8 border-white shadow-xl rotate-1">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
                alt="Golden Crust Pastries"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Absolute tiny card decoration */}
            <div className="absolute -bottom-4 -left-4 bg-white border border-stone-100 p-4 rounded-2xl shadow-lg flex items-center gap-3 max-w-xs animate-bounce" style={{ animationDuration: "3s" }}>
              <span className="text-2xl">🥐</span>
              <div>
                <h5 className="font-bold text-xs text-stone-900">{t("fresh_daily")}</h5>
                <p className="text-[10px] text-stone-500 mt-0.5">{isRtl ? "محمص طازجاً كل صباح" : "Baked fresh every morning"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900">{t("our_categories")}</h2>
          <div className="w-12 h-1 bg-amber-800 mx-auto mt-2.5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Category 1: Cakes */}
          <Link
            to="/menu?category=cakes"
            className="group relative h-64 rounded-2xl overflow-hidden border border-stone-100 shadow-xs hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80"
              alt="Cakes"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
              <h4 className="text-2xl font-serif font-bold text-white tracking-wide">
                {t("cakes")}
              </h4>
              <p className="text-xs text-amber-300 font-semibold mt-1 uppercase tracking-wider">
                {isRtl ? "تصفح التشكيلة الكاملة" : "Browse Collection"} &rarr;
              </p>
            </div>
          </Link>

          {/* Category 2: Breads */}
          <Link
            to="/menu?category=bread"
            className="group relative h-64 rounded-2xl overflow-hidden border border-stone-100 shadow-xs hover:shadow-lg transition-all"
          >
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-colors z-10" />
            <img
              src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80"
              alt="Breads"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
              <h4 className="text-2xl font-serif font-bold text-white tracking-wide">
                {t("bread")}
              </h4>
              <p className="text-xs text-amber-300 font-semibold mt-1 uppercase tracking-wider">
                {isRtl ? "تصفح التشكيلة الكاملة" : "Browse Collection"} &rarr;
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-stone-900">{t("featured_products")}</h2>
          <div className="w-12 h-1 bg-amber-800 mx-auto mt-2.5 rounded-full" />
        </div>

        {featuredProducts.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-6">{t("loading")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-stone-50 border-y border-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-serif font-bold text-stone-900">{t("why_us")}</h2>
            <p className="text-xs text-stone-500 mt-2">{t("why_us_desc")}</p>
            <div className="w-12 h-0.5 bg-amber-800 mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-white p-6 rounded-2xl border border-stone-150 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-3xl shrink-0">🥖</span>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base">{t("fresh_daily")}</h4>
                <p className="text-stone-500 text-xs leading-relaxed mt-1.5">{t("fresh_daily_desc")}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-150 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-3xl shrink-0">🥚</span>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base">{t("premium_ingredients")}</h4>
                <p className="text-stone-500 text-xs leading-relaxed mt-1.5">{t("premium_ingredients_desc")}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-150 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <span className="text-3xl shrink-0">👑</span>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base">{t("craftsmanship")}</h4>
                <p className="text-stone-500 text-xs leading-relaxed mt-1.5">{t("craftsmanship_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Reviews slider */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">{t("reviews_title")}</h2>
            <p className="text-xs text-stone-500 mt-1">{t("reviews_subtitle")}</p>
          </div>

          {reviews.length === 0 ? (
            <p className="text-xs text-stone-400 py-6">{t("loading")}</p>
          ) : (
            <div className="bg-amber-50/40 border border-amber-100 p-6 rounded-2xl space-y-4 relative">
              <Quote className="absolute top-4 right-4 w-10 h-10 text-amber-800/10" />
              <div className="flex text-amber-500 gap-0.5">
                {[...Array(reviews[activeReviewIdx].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-stone-700 text-xs leading-relaxed italic">
                "{language === "ar" ? reviews[activeReviewIdx].text_ar : reviews[activeReviewIdx].text_en}"
              </p>
              <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-xs">
                <div>
                  <p className="font-bold text-stone-900">{reviews[activeReviewIdx].userName}</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{reviews[activeReviewIdx].date}</p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length)}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 bg-white hover:text-amber-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveReviewIdx((prev) => (prev + 1) % reviews.length)}
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 bg-white hover:text-amber-800 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit review Form */}
        <div className="bg-white rounded-2xl border border-stone-150 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <MessageSquare className="w-4.5 h-4.5" />
            <span>{t("write_review")}</span>
          </h3>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Stars selector */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                {isRtl ? "تقييمك بالنجوم" : "Your Rating"}
              </label>
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNewRating(val)}
                    className="cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${val <= newRating ? "fill-amber-500" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Input message */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1.5">
                {isRtl ? "ملاحظاتك وتقييمك" : "Review Notes"}
              </label>
              <textarea
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={isRtl ? "شارك تجربتك بكل صدق..." : "Write your honest experience..."}
                className="w-full text-xs p-2.5 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white resize-none h-20 focus:outline-hidden"
              />
            </div>

            {reviewError && (
              <p className="text-[10px] text-red-600 font-bold">⚠️ {reviewError}</p>
            )}

            {reviewSuccess && (
              <p className="text-[10px] text-green-700 font-bold">🎉 {isRtl ? "شكراً لك! تم إضافة تقييمك بنجاح." : "Thank you! Your review was added."}</p>
            )}

            {!user ? (
              <div className="p-3 bg-amber-50/50 border border-amber-100 text-[10px] text-amber-800 rounded-lg text-center font-semibold">
                {isRtl ? "يرجى تسجيل الدخول لتتمكن من كتابة تقييم." : "Please login to write a review."}
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2.5 bg-amber-850 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {t("submit_review")}
              </button>
            )}
          </form>
        </div>
      </section>

      {/* QuickView Dialog */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
