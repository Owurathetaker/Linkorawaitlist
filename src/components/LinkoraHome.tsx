"use client";
 
import ApplicationForm from "@/components/ApplicationForm";
 
export default function LinkoraHome() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <header className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Linkora
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Founding Women Circle
              </div>
            </div>
          </div>
 
          <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div>
              <div className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600">
                Verified early access for women in Ghana
              </div>
 
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Intentional connections with a more refined start.
              </h1>
 
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Linkora is building a cleaner, more thoughtful dating experience
                for young professionals and ambitious individuals who value
                quality over noise.
              </p>
 
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-medium">Verified profiles</div>
                  <p className="mt-1 text-sm text-slate-500">
                    Applications are reviewed before approval.
                  </p>
                </div>
 
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-medium">Balanced access</div>
                  <p className="mt-1 text-sm text-slate-500">
                    Growth is controlled to protect quality.
                  </p>
                </div>
 
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-medium">Founding perks</div>
                  <p className="mt-1 text-sm text-slate-500">
                    Approved members receive invite access before launch.
                  </p>
                </div>
              </div>
            </div>
 
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-900">
                Founding access is limited
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Apply once, get reviewed, and if approved you’ll be added as a
                founding member and receive your invite link later.
              </p>
 
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <div>• One-time application</div>
                <div>• Selfie verification and review</div>
                <div>• No account setup required</div>
                <div>• Invite link sent after approval</div>
              </div>
            </div>
          </div>
        </header>
 
        <ApplicationForm />

<footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-500">
  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
    <p>Linkora — Early Access Program</p>
    <p>Accra • Ghana</p>
  </div>
</footer>

</div>
</main>
  );
}