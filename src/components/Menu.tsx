import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { ProductQuickView } from "./ProductQuickView";
import { Search, SlidersHorizontal, Grid, Utensils, Sparkles } from "lucide-react";

export const Menu: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get("category") || "all";
  });
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "rating">("default");

  // Selected product for quick view popup modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Sync state with URL search params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products list from API", err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  // Filter & Sort logic
  const filteredProducts = products
    .filter((prod) => {
      const name = language === "ar" ? prod.name_ar : prod.name_en;
      const desc = language === "ar" ? prod.description_ar : prod.description_en;
      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || prod.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="relative rounded-3xl bg-amber-900/10 border border-amber-900/15 p-8 sm:p-12 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-800/5 rounded-full blur-2xl" />
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-amber-950">
          {t("menu")}
        </h2>
        <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto leading-relaxed">
          {isRtl
            ? "استكشف تشكيلتنا الحرفية الرائعة من المخبوزات والخبز الطبيعي العضوي والكعك المصنوع يدوياً بكل مهارة."
            : "Explore our magnificent selection of handmade organic sourdoughs, flaky croissants, and bespoke cream cakes."}
        </p>
      </div>

      {/* Search & Filter Accessories panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-stone-100 pb-6">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: "all", name: isRtl ? "الكل" : "All" },
            { id: "cakes", name: t("cakes") },
            { id: "bread", name: t("bread") },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4.5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-amber-850 text-white shadow-xs"
                  : "bg-stone-50 text-stone-600 border border-stone-200/60 hover:border-stone-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar & Sorting */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? "ابحث عن معجنات أو كعك..." : "Search pastries or cakes..."}
              className="w-full text-xs pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Sorting selector */}
          <div className="relative w-full sm:w-auto shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto text-xs pl-3 pr-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden text-stone-600 font-medium appearance-none cursor-pointer"
            >
              <option value="default">{isRtl ? "الترتيب الافتراضي" : "Sort: Default"}</option>
              <option value="price-low">{isRtl ? "السعر: من الأقل للأعلى" : "Sort: Price (Low to High)"}</option>
              <option value="price-high">{isRtl ? "السعر: من الأعلى للأقل" : "Sort: Price (High to Low)"}</option>
              <option value="rating">{isRtl ? "التقييم: الأعلى تقييماً" : "Sort: Highest Rated"}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Products list space */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-sm font-semibold animate-pulse">{t("loading")}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-stone-700 font-bold text-base">{isRtl ? "لم نعثر على أي منتجات تطابق بحثك" : "No products found matches your criteria"}</p>
          <p className="text-xs text-stone-400">{isRtl ? "جرب استخدام كلمات بحث أخرى أو تغيير الفلاتر." : "Try adjusting your search filters or terms."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={(prod) => setSelectedProduct(prod)}
            />
          ))}
        </div>
      )}

      {/* Quick view dialog */}
      {selectedProduct && (
        <ProductQuickView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
