"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore, useWebsitesStore } from "@/lib/store";
import { fetchTemplates } from "@/lib/mock-data";
import { Template } from "@/lib/types";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const websites = useWebsitesStore((s) => s.websites);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetchTemplates().then(setTemplates);
  }, []);

  const published = websites.filter((w) => w.status === "published").length;
  const drafts = websites.filter((w) => w.status === "draft").length;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Тавтай морилно уу, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Таны вебсайтуудын тойм энд харагдана.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard label="Нийт вебсайт" value={websites.length} color="indigo" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        } />
        <StatCard label="Нийтлэгдсэн" value={published} color="green" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        } />
        <StatCard label="Ноорог" value={drafts} color="yellow" icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        } />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Сүүлийн вебсайтууд</h2>
            <Link href="/websites" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 text-sm transition-colors">
              Бүгдийг харах →
            </Link>
          </div>

          {websites.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 sm:p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3" />
                </svg>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">Одоогоор вебсайт байхгүй</p>
              <p className="text-slate-500 text-sm mt-1">Эхлэхийн тулд загвар сонгоно уу</p>
              <Link href="/templates" className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Загвар харах
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {websites.slice(0, 5).map((site) => {
                const tpl = templates.find((t) => t.id === site.templateId);
                return (
                  <div key={site.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-slate-900 dark:text-white font-medium truncate">{site.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5 truncate">
                        {tpl?.name ?? "Тодорхойгүй"} · {new Date(site.updatedAt).toLocaleDateString("mn-MN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={site.status} />
                      <Link href={`/websites/${site.id}/edit`} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-4">Хурдан үйлдлүүд</h2>
          <div className="space-y-3">
            <Link href="/templates" className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-medium">Шинэ вебсайт</p>
                <p className="text-slate-500 text-xs">Загвар сонгоно уу</p>
              </div>
            </Link>

            <Link href="/websites" className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl p-4 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-medium">Вебсайт удирдах</p>
                <p className="text-slate-500 text-xs">Бүх вебсайт харах</p>
              </div>
            </Link>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Боломжит загварууд</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{templates.length}</p>
              <p className="text-slate-500 text-xs mt-1">Супер Админаас</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: "indigo" | "green" | "yellow"; icon: React.ReactNode }) {
  const colors = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  };
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 flex sm:block items-center gap-4">
      <div className={`w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 sm:mb-3 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
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
    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${map[status] ?? map.draft}`}>
      {labels[status] ?? status}
    </span>
  );
}
