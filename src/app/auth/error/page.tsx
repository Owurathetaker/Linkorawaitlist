type Props = {
  searchParams: Promise<{
    reason?: string;
  }>;
};
 
function getMessage(reason?: string) {
  switch (reason) {
    case "missing_code":
      return "The verification link is incomplete or invalid.";
    case "verification_failed":
      return "We could not verify your email from that link. Try opening the latest verification email again.";
    default:
      return "Something went wrong while verifying your email.";
  }
}
 
export default async function AuthErrorPage({ searchParams }: Props) {
  const params = await searchParams;
  const message = getMessage(params.reason);
 
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Linkora
          </p>
 
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Verification issue
          </h1>
 
          <p className="mt-4 text-slate-600">{message}</p>
 
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