import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2 } from "lucide-react";

export const Contact: React.FC = () => {
  const { t, isRtl } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending support request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Title block */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold text-stone-900">{t("contact_title")}</h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">{t("contact_subtitle")}</p>
        <div className="w-12 h-1 bg-amber-800 mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column (Contact Cards / Schedule details) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 space-y-6">
            <h4 className="text-base font-serif font-bold text-stone-900">{t("contact_info")}</h4>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-800">{isRtl ? "الموقع الجغرافي الرئيسي" : "Our Address"}</p>
                  <p className="text-stone-500 mt-1 leading-relaxed">{t("contact_address")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-800">{t("contact_phone_label")}</p>
                  <p className="text-stone-500 mt-1">+966 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-800">{t("contact_email_label")}</p>
                  <p className="text-stone-500 mt-1">support@goldencrust.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening hours list */}
          <div className="bg-stone-50 border border-stone-150 rounded-2xl p-6 space-y-5">
            <h4 className="text-base font-serif font-bold text-stone-900 flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-amber-700" />
              <span>{t("opening_hours")}</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="font-bold text-stone-800">{isRtl ? "السبت - الخميس" : "Saturday - Thursday"}</span>
                <span className="text-stone-600 font-medium">06:00 AM - 11:30 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-800">{isRtl ? "الجمعة" : "Friday"}</span>
                <span className="text-stone-600 font-medium">01:00 PM - 12:00 AM (Midnight)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column (Support Input Form) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-100 p-6 sm:p-8">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-amber-800 mx-auto" />
              <h4 className="text-lg font-serif font-bold text-stone-900">{t("message_success")}</h4>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-2 bg-amber-850 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isRtl ? "أرسل رسالة أخرى" : "Send Another Message"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h4 className="text-base font-serif font-bold text-stone-900 mb-2">{t("contact_form_title")}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 mb-1.5 uppercase">{t("contact_name")} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRtl ? "مثال: عبد الله بن سليمان" : "e.g. John Doe"}
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 mb-1.5 uppercase">{t("contact_email")} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 mb-1.5 uppercase">{t("contact_subject")} *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={isRtl ? "مثال: طلب رعاية حفل زفاف خاص" : "e.g. Catering Request"}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-700 mb-1.5 uppercase">{t("contact_message")} *</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRtl ? "اكتب هنا تفاصيل استفسارك أو رسالتك..." : "Type the details of your inquiry here..."}
                  className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-none h-24 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-850 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? t("loading") : t("submit_message")}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Simulated Premium Location Map Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200/60 h-80 bg-stone-100 flex items-center justify-center">
        {/* We mock a beautiful Google map utilizing rich visual layouts */}
        <div className="absolute inset-0 bg-stone-50 opacity-90 p-8 flex flex-col justify-end z-10 select-none pointer-events-none">
          <div className="max-w-xs bg-white border border-stone-200 rounded-xl p-4 shadow-md space-y-1">
            <h5 className="font-serif font-black text-stone-900 text-sm">{isRtl ? "مخبز الخباز الذهبي" : "Golden Crust Salon"}</h5>
            <p className="text-[10px] text-stone-500 leading-tight">{t("contact_address")}</p>
            <p className="text-[9px] text-amber-800 font-bold mt-1">⭐ 4.9 Rating (520 reviews)</p>
          </div>
        </div>
        {/* Animated radar dot indicating branch */}
        <div className="relative z-20 flex flex-col items-center gap-1.5">
          <span className="text-3xl animate-bounce">📍</span>
          <div className="w-3 h-3 bg-amber-800 rounded-full animate-ping absolute top-6" />
        </div>
      </div>
    </div>
  );
};
