import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function InvitePage({ params }: Props) {
  const { slug } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("female_applications")
    .select("full_name, referral_slug, status")
    .eq("referral_slug", slug)
    .eq("status", "approved")
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const firstName = data.full_name.split(" ")[0];

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Linkora
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            You’ve been invited to Linkora
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {firstName} has invited you to join Linkora — a more thoughtful dating
            experience built around quality connections and intentional matching.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-medium text-slate-700">Invite code</div>
            <div className="mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900">
              {data.referral_slug}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Male early access registration will open soon.
          </div>

          <div className="mt-8">
            <a
              href="/"
              className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Return to Linkora
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}