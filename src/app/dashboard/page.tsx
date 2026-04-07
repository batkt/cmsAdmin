"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore, useWebsitesStore } from "@/lib/store";
import { getTemplates } from "@/lib/api";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { websites, fetchWebsites } = useWebsitesStore();
  const [templateCount, setTemplateCount] = useState<number | null>(null);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchWebsites(user.id).catch(() => {});
    getTemplates()
      .then((t) => { setTemplateCount(t.length); setServerOnline(true); })
      .catch(() => setServerOnline(false));
  }, [user?.id]);

  const published = websites.filter((w) => w.status === "published").length;
  const drafts = websites.filter((w) => w.status === "draft").length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">
          {user?.domain && <span className="text-indigo-400">{user.domain}</span>}
          {user?.domain && " · "}
          Here&apos;s an overview of your websites.
        </p>
      </div>

      {/* Server status */}
      {serverOnline === false && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>
            <strong>Super admin server is offline.</strong> Start the server at{" "}
            <code className="bg-red-500/20 px-1 rounded">localhost:3001</code> to use templates and save websites.
          </span>
        </div>
      )}
      {serverOnline === true && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-5 py-4 text-sm mb-6 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Connected to super admin server · {templateCount} template{templateCount !== 1 ? "s" : ""} available
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Websites" value={websites.length} color="indigo" />
        <StatCard label="Published" value={published} color="green" />
        <StatCard label="Drafts" value={drafts} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent websites */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Websites</h2>
            <Link href="/websites" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
              View all →
            </Link>
          </div>

          {websites.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
              <p className="text-slate-300 font-medium">No websites yet</p>
              <p className="text-slate-500 text-sm mt-1">Pick a template to get started</p>
              <Link href="/templates" className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Browse Templates
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {websites.slice(0, 5).map((site) => (
                <div key={site.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{site.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {site.domain ?? site.templateId}
                      {" · "}Updated {new Date(site.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={site.status} />
                    <Link href={`/websites/${site.id}/edit`} className="text-slate-400 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/templates" className="flex items-center gap-3 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">New Website</p>
                <p className="text-slate-500 text-xs">Choose a template</p>
              </div>
            </Link>

            <Link href="/websites" className="flex items-center gap-3 bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-4 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Manage Sites</p>
                <p className="text-slate-500 text-xs">View all websites</p>
              </div>
            </Link>

            {user?.domain && (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Your Domain</p>
                <p className="text-indigo-400 font-mono text-sm break-all">{user.domain}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "indigo" | "green" | "yellow" }) {
  const colors = { indigo: "text-indigo-400", green: "text-green-400", yellow: "text-yellow-400" };
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <p className="text-slate-400 text-sm mb-3">{label}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-500/10 text-green-400",
    draft: "bg-yellow-500/10 text-yellow-400",
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${map[status] ?? map.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
