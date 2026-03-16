"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function AuthCard() {
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <section className="rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === "signup" ? "Apply for Early Access" : "Sign in"}
        </h2>

        <button
          className="text-sm underline underline-offset-4 text-slate-600"
          onClick={() => {
            setStatus(null);
            setMode(mode === "signup" ? "signin" : "signup");
          }}
        >
          {mode === "signup" ? "Already applied? Sign in" : "New? Create account"}
        </button>
      </div>

      <p className="mt-2 text-slate-600">
        {mode === "signup"
          ? "Create your account first. We’ll send a verification link to your email."
          : "Sign in to continue your application."}
      </p>

      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setStatus(null);

          try {
            if (mode === "signup") {
              const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
              });

              if (error) throw error;

              setStatus(
  "Account created successfully. Check your email and open the verification link. You’ll see a confirmation page, then return here and sign in to continue your application."
);

              setEmail("");
              setPassword("");
            } else {
              const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (error) throw error;

              setStatus("Signed in successfully.");
            }
          } catch (err: any) {
            console.error("AUTH ERROR:", err);

            setStatus(
              err?.message ||
                err?.error_description ||
                "Something went wrong. Please try again."
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <button
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-white disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>

        {status && (
          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 border border-slate-200">
            {status}
          </div>
        )}
      </form>
    </section>
  );
}