import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2, User, Ruler, Weight, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const GENDERS = [
  { value: "male", label: "Erkak" },
  { value: "female", label: "Ayol" },
];

export default function Register() {
  const [step, setStep] = useState("register"); // register | otp | profile
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Profile fields
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [gender, setGender] = useState("male");

  // Step 1: Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Parollar mos kelmaydi");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setStep("otp");
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP
  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      setStep("profile");
    } catch (err) {
      setError(err.message || "Noto'g'ri tasdiqlash kodi");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Kod yuborildi", description: "Emailingizni tekshiring." });
    } catch (err) {
      setError(err.message || "Kod yuborishda xatolik");
    }
  };

  // Step 3: Profile
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!displayName.trim()) {
      setError("Ismingizni kiriting");
      return;
    }
    setLoading(true);
    try {
      // Create UserProfile record
      await base44.entities.UserProfile.create({
        display_name: displayName.trim(),
        height_cm: heightCm ? Number(heightCm) : undefined,
        weight_kg: weightKg ? Number(weightKg) : undefined,
        total_coins: 0,
        total_distance_km: 0,
        total_calories: 0,
        total_time_minutes: 0,
        level: 1,
        streak_days: 0,
      });
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Profil saqlashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  // Step 2: OTP view
  if (step === "otp") {
    return (
      <AuthLayout
        icon={Mail}
        title="Emailni tasdiqlang"
        subtitle={`${email} ga kod yuborildi`}
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full h-12 font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Tekshirilmoqda...</> : "Tasdiqlash"}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Kod kelmadimi?{" "}
          <button onClick={handleResend} className="text-primary font-medium hover:underline">Qayta yuborish</button>
        </p>
      </AuthLayout>
    );
  }

  // Step 3: Profile info
  if (step === "profile") {
    return (
      <AuthLayout
        icon={User}
        title="Profilingizni to'ldiring"
        subtitle="Sizga mos trening rejasi tuzish uchun"
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
        )}

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["register", "otp", "profile"].map((s, i) => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === "profile" ? "w-8 bg-primary" : "w-4 bg-primary/30"}`} />
          ))}
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          {/* Full name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Ismingiz *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="displayName"
                placeholder="Ism Familiya"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="pl-10 h-12"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Yoshingiz</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="age"
                type="number"
                min="10"
                max="100"
                placeholder="25"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="height">Bo'yi (sm)</Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="175"
                  value={heightCm}
                  onChange={e => setHeightCm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Vazni (kg)</Label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="weight"
                  type="number"
                  min="30"
                  max="300"
                  placeholder="70"
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Jins</Label>
            <div className="grid grid-cols-2 gap-3">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGender(g.value)}
                  className={`h-12 rounded-xl border-2 text-sm font-medium transition-all ${
                    gender === g.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full h-12 font-medium mt-2" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saqlanmoqda...</> : "Boshlash →"}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // Step 1: Register form
  return (
    <AuthLayout
      icon={UserPlus}
      title="Hisob yarating"
      subtitle="Ro'yxatdan o'ting"
      footer={
        <>
          Hisobingiz bormi?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Kirish</Link>
        </>
      }
    >
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {["register", "otp", "profile"].map((s) => (
          <div key={s} className={`h-2 rounded-full transition-all ${s === "register" ? "w-8 bg-primary" : "w-4 bg-primary/30"}`} />
        ))}
      </div>

      <Button variant="outline" className="w-full h-12 text-sm font-medium mb-6" onClick={handleGoogle}>
        <GoogleIcon className="w-5 h-5 mr-2" />
        Google orqali kirish
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">yoki</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Elektron pochta</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email" type="email" autoComplete="email" autoFocus
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="pl-10 h-12" required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Parol</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password" type="password" autoComplete="new-password"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              className="pl-10 h-12" required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Parolni tasdiqlang</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirm" type="password" autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="pl-10 h-12" required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Yaratilmoqda...</> : "Davom etish →"}
        </Button>
      </form>
    </AuthLayout>
  );
}