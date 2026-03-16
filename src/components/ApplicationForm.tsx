"use client";
 
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
 
export default function ApplicationForm() {
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number>(18);
  const [city, setCity] = useState("");
 
  const [intent, setIntent] = useState<"serious" | "long_term" | "open" | "unsure">("open");
  const [partnerValue, setPartnerValue] = useState("");
  const [appFrustration, setAppFrustration] = useState("");
  const [activityLevel, setActivityLevel] = useState<"daily" | "few_times_week" | "occasionally">(
    "few_times_week"
  );
 
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
 
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="border-b border-slate-200 pb-6">
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
          Application Form
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">
          Founding member application
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Complete this short form to apply for early access. No account setup is
          required at this stage.
        </p>
      </div>
 
      <form
        className="mt-8 space-y-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMsg(null);
 
          try {
            if (!selfieFile) throw new Error("Please upload a clear selfie.");
 
            const safeName = selfieFile.name.replace(/\s+/g, "_");
            const path = `selfies/public/${Date.now()}_${safeName}`;
 
            const { error: uploadErr } = await supabase.storage
              .from("verification-selfies")
              .upload(path, selfieFile, {
                cacheControl: "3600",
                upsert: false,
              });
 
            if (uploadErr) throw uploadErr;
 
            const { error: insertErr } = await supabase.from("female_applications").insert({
              full_name: fullName.trim(),
              email: email.trim().toLowerCase(),
              age,
              city: city.trim(),
              selfie_path: path,
              intent,
              partner_value: partnerValue.trim(),
              app_frustration: appFrustration.trim(),
              activity_level: activityLevel,
              status: "pending",
              user_id: null,
            });
 
            if (insertErr) throw insertErr;
 
            await fetch("/api/notify-application", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                age,
                city: city.trim(),
                intent,
                activityLevel,
                createdAt: new Date().toLocaleString(),
              }),
            });
 
            setMsg(
              "Application received.\n\nWe review every submission carefully to mantain quality.\n\nIf approved, you'll receive your founding member invite."
            );
 
            setFullName("");
            setEmail("");
            setAge(18);
            setCity("");
            setIntent("open");
            setPartnerValue("");
            setAppFrustration("");
            setActivityLevel("few_times_week");
            setSelfieFile(null);
          } catch (err: any) {
  console.error(err);
 
  const message =
    err?.message?.toLowerCase?.().includes("duplicate") ||
    err?.message?.toLowerCase?.().includes("unique")
      ? "An application with this email already exists."
      : err?.message ?? "Something went wrong. Please try again.";
 
  setMsg(message);
} finally {
            setBusy(false);
          }
        }}
      >
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">Basic details</h3>
            <p className="mt-1 text-sm text-slate-500">
              Tell us a little about yourself.
            </p>
          </div>
 
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
 
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
 
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Age
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
                type="number"
                min={18}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                required
              />
            </div>
 
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                City
              </label>
              <input
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Accra"
                required
              />
            </div>
          </div>
        </div>
 
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">Intent and preferences</h3>
            <p className="mt-1 text-sm text-slate-500">
              These responses help us understand fit and future matching quality.
            </p>
          </div>
 
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                What are you looking for?
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
                value={intent}
                onChange={(e) => setIntent(e.target.value as any)}
              >
                <option value="serious">Serious relationship</option>
                <option value="long_term">Long-term dating</option>
                <option value="open">Open but intentional</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>
 
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Weekly activity level
              </label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
              >
                <option value="daily">Daily</option>
                <option value="few_times_week">A few times a week</option>
                <option value="occasionally">Occasionally</option>
              </select>
            </div>
          </div>
 
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              What matters most to you in a partner?
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
              maxLength={150}
              value={partnerValue}
              onChange={(e) => setPartnerValue(e.target.value)}
              placeholder="Short answer"
              required
            />
          </div>
 
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              What frustrates you most about dating apps?
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
              maxLength={200}
              value={appFrustration}
              onChange={(e) => setAppFrustration(e.target.value)}
              placeholder="Short answer"
              required
            />
          </div>
        </div>
 
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold">Verification</h3>
            <p className="mt-1 text-sm text-slate-500">
              Upload a clear selfie for review. This is used only for verification.
            </p>
          </div>
 
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Selfie upload
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:text-white hover:file:opacity-90"
              type="file"
              accept="image/*"
              onChange={(e) => setSelfieFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>
        </div>
 
        <div className="border-t border-slate-200 pt-6">
          <button
            className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Submitting application..." : "Submit application"}
          </button>
 
          {msg ? (
  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-line text-slate-700">
    {msg}
  </div>
) : null}
        </div>
      </form>
    </section>
  );
}