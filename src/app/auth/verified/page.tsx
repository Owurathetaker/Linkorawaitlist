export default function VerifiedPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Linkora
          </p>
 
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Email verified successfully
          </h1>
 
          <p className="mt-4 text-slate-600">
            Your account has been confirmed. Return to Linkora and sign in to
            continue your application.
          </p>
 
          <a
            href="/"
            className="mt-8 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white"
          >
            Return to Linkora
          </a>
        </div>
      </div>
    </main>
  );
}