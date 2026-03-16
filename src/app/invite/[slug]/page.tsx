export default function InvitePage({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="text-xl font-semibold">Linkora</div>
 
        <h1 className="mt-10 text-3xl font-semibold tracking-tight">
          You’ve been invited to Linkora
        </h1>
 
        <p className="mt-3 text-slate-600">
          Early access is currently opening in phases. Your invite code is:
        </p>
 
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono">
          {params.slug}
        </div>
 
        <p className="mt-6 text-slate-600">
          Male early access registration will open soon.
        </p>
      </div>
    </main>
  );
}