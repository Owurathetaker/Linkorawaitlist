import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nextAvailableSlug, slugifyName } from "@/lib/slug";
 
type AppRow = {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  city: string;
  intent: string;
  partner_value: string;
  app_frustration: string;
  activity_level: string;
  selfie_path: string;
  status: "pending" | "approved" | "rejected";
  referral_slug: string | null;
  created_at: string;
};
 
function isAdminEmail(email: string | null | undefined) {
  if (!email) return false;
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
 
async function getPendingWithSignedUrls() {
  const admin = createAdminClient();
 
  const { data, error } = await admin
    .from("female_applications")
    .select(
      "id,user_id,full_name,age,city,intent,partner_value,app_frustration,activity_level,selfie_path,status,referral_slug,created_at"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });
 
  if (error) throw error;
 
  const rows = (data ?? []) as AppRow[];
 
  // Generate signed URLs for each selfie so you can click and view it
  const withUrls = await Promise.all(
    rows.map(async (r) => {
      const { data: signed, error: signedErr } = await admin.storage
        .from("verification-selfies")
        .createSignedUrl(r.selfie_path, 60 * 10); // 10 minutes
 
      if (signedErr) {
        // If signed url fails, still return row without url
        return { ...r, selfie_url: null as string | null };
      }
 
      return { ...r, selfie_url: signed.signedUrl as string };
    })
  );
 
  return withUrls;
}
 
async function ensureAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const email = data?.user?.email;
 
  if (!isAdminEmail(email)) redirect("/");
}
 
/** Server Action: approve */
async function approveAction(formData: FormData) {
  "use server";
 
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
 
  const admin = createAdminClient();
 
  // Fetch the row we are approving
  const { data: row, error: rowErr } = await admin
    .from("female_applications")
    .select("id,full_name,status")
    .eq("id", id)
    .single();
 
  if (rowErr) throw rowErr;
 
  if (row.status !== "pending") return;
 
  // Base slug from full name
  const base = slugifyName(row.full_name);
 
  // Find existing slugs that match base prefix (base, base1, base2...)
  const { data: existingRows, error: existErr } = await admin
    .from("female_applications")
    .select("referral_slug")
    .ilike("referral_slug", `${base}%`);
 
  if (existErr) throw existErr;
 
  const existing = (existingRows ?? [])
    .map((r: any) => r.referral_slug)
    .filter(Boolean) as string[];
 
  const slug = nextAvailableSlug(base, existing);
 
  const { error: updErr } = await admin
    .from("female_applications")
    .update({ status: "approved", referral_slug: slug })
    .eq("id", id);
 
  if (updErr) throw updErr;
 
  // Return nothing; page refresh will reflect state
}
 
/** Server Action: reject */
async function rejectAction(formData: FormData) {
  "use server";
 
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Missing id");
 
  const admin = createAdminClient();
 
  const { error } = await admin
    .from("female_applications")
    .update({ status: "rejected" })
    .eq("id", id);
 
  if (error) throw error;
}
 
export default async function AdminPage() {
  await ensureAdmin();
  const pending = await getPendingWithSignedUrls();
 
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Admin – Applications</h1>
          <a className="text-sm underline underline-offset-4 text-slate-600" href="/">
            Back to home
          </a>
        </div>
 
        <div className="mt-6 rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 text-sm text-slate-700">
            Pending: {pending.length}
          </div>
 
          {pending.length === 0 ? (
            <div className="p-6 text-slate-600">No pending applications.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pending.map((p: any) => (
                <div key={p.id} className="p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="font-semibold">
                        {p.full_name} <span className="text-slate-500 font-normal">({p.age})</span>
                      </div>
                      <div className="text-sm text-slate-600">{p.city}</div>
 
                      <div className="mt-3 grid gap-2 text-sm text-slate-700">
                        <div><span className="text-slate-500">Intent:</span> {p.intent}</div>
                        <div className="break-words">
                          <span className="text-slate-500">Partner value:</span> {p.partner_value}
                        </div>
                        <div className="break-words">
                          <span className="text-slate-500">App frustration:</span> {p.app_frustration}
                        </div>
                        <div><span className="text-slate-500">Activity:</span> {p.activity_level}</div>
                      </div>
 
                      <div className="mt-3 text-sm">
                        {p.selfie_url ? (
                          <a
                            className="underline underline-offset-4"
                            href={p.selfie_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View selfie
                          </a>
                        ) : (
                          <span className="text-slate-500">Selfie link unavailable</span>
                        )}
                      </div>
                    </div>
 
                    <div className="flex gap-2">
                      <form action={approveAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">
                          Approve
                        </button>
                      </form>
 
                      <form action={rejectAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="rounded-lg border border-slate-200 px-4 py-2">
                          Reject
                        </button>
                      </form>
                    </div>
                  </div>
 
                  <div className="mt-3 text-xs text-slate-500">
                    Submitted: {new Date(p.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}