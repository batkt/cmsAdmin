"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWebsitesStore, useAuthStore } from "@/lib/store";
import { getTemplates } from "@/lib/api";
import { Template, Website } from "@/lib/types";

export default function WebsitesPage() {
  const user = useAuthStore((s) => s.user);
  const { websites, fetchWebsites, deleteWebsite, publishWebsite } = useWebsitesStore();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetchWebsites(user.id),
      getTemplates().then(setTemplates).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [user?.id]);

  function getTemplate(id: string) {
    return templates.find((t) => t.id === id);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Websites</h1>
          <p className="text-slate-400 mt-1">{websites.length} website{websites.length !== 1 ? "s" : ""} total</p>
        </div>
        <Link
          href="/templates"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Website
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 animate-pulse flex gap-4">
              <div className="w-16 h-12 bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-1/3" />
                <div className="h-3 bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : websites.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
            </svg>
          </div>
          <p className="text-white font-semibold text-lg">No websites yet</p>
          <p className="text-slate-400 text-sm mt-1 mb-6">Start by choosing a template from the gallery.</p>
          <Link href="/templates" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            Browse Templates
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {websites.map((site) => (
            <WebsiteRow
              key={site.id}
              site={site}
              template={getTemplate(site.templateId)}
              onDelete={() => deleteWebsite(site.id)}
              onPublish={() => publishWebsite(site.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WebsiteRow({
  site,
  template,
  onDelete,
  onPublish,
}: {
  site: Website;
  template?: Template;
  onDelete: () => void;
  onPublish: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center gap-4">
      <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700 flex items-center justify-center">
        {template?.thumbnail ? (
          <img src={template.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-slate-500 text-xs">{template?.name?.charAt(0) ?? "?"}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-white font-semibold truncate">{site.name}</p>
          <StatusBadge status={site.status} />
        </div>
        <p className="text-slate-500 text-xs mt-0.5">
          {template?.name ?? "Unknown template"}
          {site.domain && ` · ${site.domain}`}
          {" · "}Updated {new Date(site.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {site.status === "published" && (
          <Link
            href={`/preview/${site.id}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-medium text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Live
          </Link>
        )}
        <Link
          href={`/websites/${site.id}/edit`}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          Edit
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-10 z-20 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 w-40">
                {site.status !== "published" && (
                  <button onClick={() => { onPublish(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-slate-700 transition-colors">
                    Publish
                  </button>
                )}
                <Link href={`/preview/${site.id}`} target="_blank" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors" onClick={() => setMenuOpen(false)}>
                  Preview
                </Link>
                <button
                  onClick={() => { if (confirm("Delete this website?")) { onDelete(); setMenuOpen(false); } }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-500/10 text-green-400",
    draft: "bg-yellow-500/10 text-yellow-400",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${map[status] ?? map.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
