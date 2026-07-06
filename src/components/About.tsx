import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Award, Clock, Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";

export const About: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const standards = [
    { text: t("standard_1") },
    { text: t("standard_2") },
    { text: t("standard_3") },
  ];

  const chefs = [
    {
      name_en: "Chef Marc Pierre",
      name_ar: "الشيف مارك بيير",
      title: t("chef_1_title"),
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
      description_en: "Over 20 years of crafting traditional French baguettes and golden brioches.",
      description_ar: "خبرة تفوق 20 عاماً في صناعة الرغيف الفرنسي التقليدي والبريوش الذهبي الكلاسيكي."
    },
    {
      name_en: "Chef Layla Fahad",
      name_ar: "الشيف ليلى فهد",
      title: t("chef_2_title"),
      image: "https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?w=400&auto=format&fit=crop&q=80",
      description_en: "Award-winning pastry artist specializing in modern custom cake aesthetics and ganache tiers.",
      description_ar: "فنانة كعك ومعجنات حاصلة على جوائز، متخصصة في جماليات الكعك الحديث وتزيين الشوكولاتة."
    },
    {
      name_en: "Chef Alessandro Rossi",
      name_ar: "الشيف أليساندرو روسي",
      title: t("chef_3_title"),
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80",
      description_en: "The fermentation mastermind behind our signature 36-hour country sourdough breads.",
      description_ar: "العقل المدبر وراء تخمير الخبز الطبيعي لدينا لمدة 36 ساعة كاملة للحصول على قوام وقشرة مثالية."
    },
  ];

  return (
    <div className="space-y-20 pb-16 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Narrative Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-850 rounded-lg text-xs font-extrabold uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>{isRtl ? "شغف ومهارة" : "Passion & Mastery"}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight">
            {t("about_story_title")}
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            {t("about_story_p1")}
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            {t("about_story_p2")}
          </p>
        </div>

        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative aspect-4/3 w-full bg-stone-100 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80"
              alt="Artisanal Bakery Story"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Quality Standards Section */}
      <section className="bg-amber-50/40 rounded-3xl border border-amber-100 p-8 md:p-12 space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <h3 className="text-2xl font-serif font-bold text-stone-900">{t("standards_title")}</h3>
          <p className="text-xs text-stone-500 mt-1.5">
            {isRtl ? "نحن لا نتهاون في جودة ونقاء مأكولاتنا" : "We never compromise on culinary purity"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {standards.map((st, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-150 flex gap-3.5 items-start">
              <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-stone-700 text-xs font-semibold leading-relaxed">
                {st.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chefs Section */}
      <section className="space-y-10">
        <div className="text-center">
          <h3 className="text-2xl font-serif font-bold text-stone-900">{t("meet_chefs")}</h3>
          <div className="w-12 h-1 bg-amber-800 mx-auto mt-2.5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefs.map((chef, idx) => (
            <div key={idx} className="bg-white border border-stone-150 rounded-2xl overflow-hidden flex flex-col justify-between p-5 group">
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
                  <img
                    src={chef.image}
                    alt={chef.name_en}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-lg">
                    {isRtl ? chef.name_ar : chef.name_en}
                  </h4>
                  <p className="text-xs text-amber-800 font-extrabold mt-0.5 uppercase tracking-wide">
                    {chef.title}
                  </p>
                  <p className="text-stone-500 text-xs mt-3 leading-relaxed">
                    {isRtl ? chef.description_ar : chef.description_en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
