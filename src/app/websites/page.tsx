"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWebsitesStore } from "@/lib/store";
import { fetchTemplates } from "@/lib/mock-data";
import { Template, Website } from "@/lib/types";

export default function WebsitesPage() {
  const { websites, deleteWebsite, publishWebsite, archiveWebsite } = useWebsitesStore();
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  function getTemplate(id: string) {
    return templates.find((t) => t.id === id);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Миний вебсайтууд</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">Нийт {websites.length} вебсайт</p>
        </div>
        <Link
          href="/templates"
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Шинэ вебсайт</span>
          <span className="sm:hidden">Шинэ</span>
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 sm:p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
            </svg>
          </div>
          <p className="text-slate-900 dark:text-white font-semibold text-lg">Одоогоор вебсайт байхгүй</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-6">Цомгоос загвар сонгон эхлэнэ үү.</p>
          <Link href="/templates" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            Загвар харах
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
              onArchive={() => archiveWebsite(site.id)}
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
  onArchive,
}: {
  site: Website;
  template?: Template;
  onDelete: () => void;
  onPublish: () => void;
  onArchive: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        {/* Thumbnail */}
        <div className="w-14 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
          {template?.thumbnail && (
            <img src={template.thumbnail} alt="" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-slate-900 dark:text-white font-semibold truncate">{site.name}</p>
            <StatusBadge status={site.status} />
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            {template?.name ?? "Тодорхойгүй загвар"} · {new Date(site.updatedAt).toLocaleDateString("mn-MN")}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {site.status === "published" && (
            <Link
              href={`/preview/${site.id}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Шууд харах
            </Link>
          )}
          <Link
            href={`/websites/${site.id}/edit`}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="hidden sm:inline">Засварлах</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 w-44">
                  {site.status === "published" && (
                    <Link href={`/preview/${site.id}`} target="_blank" className="sm:hidden flex items-center gap-2 px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={() => setMenuOpen(false)}>
                      Шууд харах
                    </Link>
                  )}
                  {site.status !== "published" && (
                    <button onClick={() => { onPublish(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      Нийтлэх
                    </button>
                  )}
                  {site.status === "published" && (
                    <button onClick={() => { onArchive(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      Архивлах
                    </button>
                  )}
                  <Link href={`/preview/${site.id}`} target="_blank" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" onClick={() => setMenuOpen(false)}>
                    Урьдчилан харах
                  </Link>
                  <button
                    onClick={() => { if (confirm("Энэ вебсайтыг устгах уу?")) { onDelete(); setMenuOpen(false); } }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Устгах
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-500/10 text-green-600 dark:text-green-400",
    draft: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    archived: "bg-slate-200 dark:bg-slate-600/50 text-slate-500 dark:text-slate-400",
  };
  const labels: Record<string, string> = {
    published: "Нийтлэгдсэн",
    draft: "Ноорог",
    archived: "Архивласан",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${map[status] ?? map.draft}`}>
      {labels[status] ?? status}
    </span>
  );
}
