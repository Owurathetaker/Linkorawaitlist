"use client";
 
type AppRow = {
  id: string;
  status: "pending" | "approved" | "rejected";
  referral_slug: string | null;
  full_name: string;
  created_at: string;
};
 
export default function Dashboard({
  appRow,
  onRefresh,
}: {
  appRow: AppRow;
  onRefresh: () => void;
}) {
  const inviteUrl =
    appRow.referral_slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/invite/${appRow.referral_slug}` : null;
 
  return (
    <section className="rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your application</h2>
        <button className="text-sm underline underline-offset-4 text-slate-600" onClick={onRefresh}>
          Refresh
        </button>
      </div>
 
      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="text-sm text-slate-600">Status</div>
        <div className="mt-1 text-xl font-semibold">
          {appRow.status === "pending"
            ? "Under review"
            : appRow.status === "approved"
            ? "Approved"
            : "Not approved"}
        </div>
 
        {appRow.status === "approved" && inviteUrl ? (
          <div className="mt-5">
            <div className="text-sm text-slate-600">Your invite link</div>
            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center">
              <input
                readOnly
                value={inviteUrl}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800"
              />
              <button
                className="rounded-lg bg-slate-900 px-4 py-2 text-white"
                onClick={async () => {
                  await navigator.clipboard.writeText(inviteUrl);
                }}
              >
                Copy
              </button>
            </div>
 
            <p className="mt-3 text-sm text-slate-600">
              Invite quality members into Gildra. Earnings activate at launch.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}