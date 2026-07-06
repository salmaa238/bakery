import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, User, Sparkles, KeyRound } from "lucide-react";
import { motion } from "motion/react";

export const AuthPage: React.FC = () => {
  const { user, login, register, error, clearError, loading } = useAuth();
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const redirectPath = searchParams.get("redirect") || "/";

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      navigate(redirectPath);
    }
  }, [user, navigate, redirectPath]);

  // Clean error state on tab switch
  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setName("");
    setEmail("");
    setPassword("");
    clearError();
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginMode && !name)) {
      return;
    }

    let success = false;
    if (isLoginMode) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
      if (success) {
        setSuccessMsg(isRtl ? "تم تسجيل الحساب الجديد بنجاح!" : "Account created successfully!");
      }
    }

    if (success) {
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm flex flex-col">
      {/* Header Accent */}
      <div className="bg-amber-800 text-white p-8 text-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-700 rounded-full opacity-30 translate-x-12 -translate-y-12" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-900 rounded-full opacity-40 -translate-x-6 translate-y-12" />
        <Sparkles className="w-8 h-8 text-amber-300 mx-auto mb-3" />
        <h3 className="text-xl font-serif font-bold relative z-10">{t("auth_title")}</h3>
        <p className="text-xs text-amber-200 mt-1.5 relative z-10 leading-relaxed">{t("auth_subtitle")}</p>
      </div>

      {/* Main Form container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
        {/* Register - Name input */}
        {!isLoginMode && (
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>{t("name")} *</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRtl ? "مثال: أحمد عبد الله" : "e.g. John Doe"}
              className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-stone-500" />
            <span>{t("email")} *</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isRtl ? "user@example.com" : "user@example.com"}
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-stone-500" />
            <span>{t("password")} *</span>
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs p-3 border border-stone-200 rounded-xl bg-stone-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 transition-colors"
            minLength={6}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold leading-tight">
            ⚠️ {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-green-50 text-green-700 border border-green-250 rounded-xl text-xs font-semibold leading-tight">
            🎉 {successMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all text-center text-sm cursor-pointer"
        >
          {loading ? t("loading") : isLoginMode ? t("login") : t("register")}
        </button>

        {/* Toggle Mode Link */}
        <div className="pt-4 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer"
          >
            {isLoginMode ? t("no_account") : t("have_account")}
          </button>
        </div>
      </form>
    </div>
  );
};
