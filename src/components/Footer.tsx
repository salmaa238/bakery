import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Clock, MapPin, Phone, Mail, Award, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const { t, isRtl } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t-4 border-amber-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About Column */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-serif font-bold text-white tracking-wide">
            {isRtl ? "🥖 الخباز الذهبي" : "Golden Crust 🥖"}
          </h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            {t("hero_subtitle")}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              {isRtl ? "مخبز حاصل على جوائز" : "Award-Winning Bakery"}
            </span>
          </div>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            {isRtl ? "روابط سريعة" : "Quick Links"}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/" className="hover:text-white transition-colors">{t("home")}</Link>
            <Link to="/about" className="hover:text-white transition-colors">{t("about")}</Link>
            <Link to="/menu" className="hover:text-white transition-colors">{t("menu")}</Link>
            <Link to="/custom-cake" className="hover:text-white transition-colors">{t("custom_cake")}</Link>
            <Link to="/booking" className="hover:text-white transition-colors">{t("booking")}</Link>
            <Link to="/delivery" className="hover:text-white transition-colors">{t("delivery")}</Link>
            <Link to="/contact" className="hover:text-white transition-colors">{t("contact")}</Link>
          </div>
        </div>

        {/* Hours Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            {t("opening_hours")}
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-stone-400">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-white">{isRtl ? "الأيام الاعتيادية" : "Weekdays"}</p>
                <p className="text-xs">{t("weekdays")}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-white">{isRtl ? "الجمعة" : "Friday"}</p>
                <p className="text-xs">{t("friday")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-3.5">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-500">
            {t("contact_info")}
          </h4>
          <div className="flex flex-col gap-2.5 text-sm text-stone-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span className="leading-tight">{t("contact_address")}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t("contact_phone_label")}: +966 50 123 4567</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t("contact_email_label")}: contact@goldencrust.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-850 text-center text-xs text-stone-500">
        <p className="flex items-center justify-center gap-1">
          <span>&copy; {new Date().getFullYear()} {t("app_name")}.</span>
          <span>{isRtl ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-stone-600">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
          <span>for bakery lovers worldwide.</span>
        </p>
      </div>
    </footer>
  );
};
