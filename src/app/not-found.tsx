export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Linkora
          </div>
 
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Page not found
          </h1>
 
          <p className="mt-4 text-slate-600">
            This invite link may be invalid, expired, or not yet active.
          </p>
 
          <a
            href="/"
            className="mt-8 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Return to Linkora
          </a>
        </div>
      </div>
    </main>
  );
}