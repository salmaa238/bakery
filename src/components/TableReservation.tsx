import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Calendar, Users, Clock, Phone, FileText, CheckCircle2 } from "lucide-react";

export const TableReservation: React.FC = () => {
  const { t, language, isRtl } = useLanguage();
  const { user, token } = useAuth();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState("2");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const timeSlots = [
    "08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM",
    "03:00 PM", "05:00 PM", "07:00 PM", "09:00 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg(isRtl ? "يجب تسجيل الدخول أولاً لتتمكن من حجز طاولة." : "Please login first to book a table.");
      return;
    }
    if (!date || !time || !phone) {
      setErrorMsg(isRtl ? "الرجاء تعبئة جميع الحقول المطلوبة." : "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          date,
          time,
          guests,
          contactPhone: phone,
          specialRequests
        })
      });

      if (response.ok) {
        setSuccess(true);
        setDate("");
        setTime("");
        setGuests("2");
        setPhone("");
        setSpecialRequests("");
      } else {
        const data = await response.json();
        setErrorMsg(data.error || "Booking request failed");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-8 text-center max-w-lg mx-auto shadow-sm">
        <CheckCircle2 className="w-16 h-16 text-amber-800 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-bold text-stone-900">
          {t("booking_success")}
        </h3>
        <p className="text-sm text-stone-600 mt-2.5 leading-relaxed">
          {isRtl
            ? "لقد استلمنا طلب حجز الطاولة الخاص بك بنجاح. سيقوم فريق الاستقبال بمراجعة مواعيد الصالة وتأكيد حجزك فوراً وإرسال بريد أو الاتصال بك هاتفياً لتأكيد طاولة ممتازة لك!"
            : "We have received your reservation request. Our salon hostess will inspect the lounge slots and call you or email to confirm your table placement shortly!"}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-2.5 bg-amber-850 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          {isRtl ? "حجز طاولة جديدة" : "Book Another Table"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-100 p-6 sm:p-8 shadow-xs">
      <div className="text-center mb-8">
        <h3 className="text-xl font-serif font-bold text-stone-900">{t("booking_title")}</h3>
        <p className="text-xs text-stone-500 mt-1.5">{t("booking_subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Guest Count */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase">
              <Users className="w-4 h-4 text-stone-500" />
              <span>{t("num_guests")} *</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            >
              <option value="1">1 {isRtl ? "شخص" : "Guest"}</option>
              <option value="2">2 {isRtl ? "شخصين" : "Guests"}</option>
              <option value="3">3 {isRtl ? "أشخاص" : "Guests"}</option>
              <option value="4">4 {isRtl ? "أشخاص" : "Guests"}</option>
              <option value="6">6 {isRtl ? "أشخاص (طاولة عائلية)" : "Guests (Family Table)"}</option>
              <option value="8">8+ {isRtl ? "مجموعة كبرى" : "Large Group"}</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase">
              <Calendar className="w-4 h-4 text-stone-500" />
              <span>{t("select_date")} *</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Time slots picker */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5 uppercase">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>{t("select_time")} *</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {timeSlots.map((slot) => {
              const selected = time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold text-center border cursor-pointer transition-colors ${
                    selected
                      ? "border-amber-700 bg-amber-50 text-amber-800 font-bold"
                      : "border-stone-200 text-stone-600 bg-white hover:bg-stone-50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Phone coordinates */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase">
            <Phone className="w-4 h-4 text-stone-500" />
            <span>{t("phone")} *</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+966 50 000 0000"
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5 uppercase">
            <FileText className="w-4 h-4 text-stone-500" />
            <span>{t("special_requests")}</span>
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder={isRtl ? "مثال: نحتفل بذكرى زواجنا السنوية، نفضل طاولة بجانب النافذة..." : "e.g. Celebrating wedding anniversary, prefer window table..."}
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 resize-none h-20 transition-colors"
          />
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {!user ? (
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-xs text-amber-800 text-center">
            {isRtl
              ? "الرجاء تسجيل الدخول أولاً لتتمكن من حجز طاولة وحفظ تفاصيل الحجز تحت ملفك الشخصي."
              : "Please login first to submit table reservations and preserve your booking details."}
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-850 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all text-center text-sm cursor-pointer"
          >
            {loading ? t("loading") : t("submit_booking")}
          </button>
        )}
      </form>
    </div>
  );
};
