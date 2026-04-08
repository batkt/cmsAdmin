"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTemplates } from "@/lib/mock-data";
import { Template } from "@/lib/types";
import { useWebsitesStore, useAuthStore } from "@/lib/store";

const CATEGORIES = [
  "all",
  "business",
  "restaurant",
  "portfolio",
  "landing",
  "ecommerce",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  all: "Бүгд",
  business: "Бизнес",
  restaurant: "Ресторан",
  portfolio: "Портфолио",
  landing: "Нүүр хуудас",
  ecommerce: "Дэлгүүр",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [creating, setCreating] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<Template | null>(null);
  const [siteName, setSiteName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const createWebsite = useWebsitesStore((s) => s.createWebsite);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates().then((t) => {
      setTemplates(t);
      setLoading(false);
    });
  }, []);

  const filtered =
    filter === "all"
      ? templates
      : templates.filter((t) => t.category === filter);

  async function handleUseTemplate() {
    if (!showModal || !siteName.trim()) return;
    setCreating(showModal.id);
    const site = createWebsite({
      name: siteName.trim(),
      templateId: showModal.id,
      companyName: companyName.trim() || user?.companyName || "Манай компани",
    });
    setCreating(null);
    setShowModal(null);
    router.push(`/websites/${site.id}/edit`);
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Загварын цомог
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Вебсайтаа бүтээхийн тулд загвар сонгоно уу.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onUse={() => {
                setShowModal(tpl);
                setSiteName("");
                setCompanyName("");
              }}
            />
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              &ldquo;{showModal.name}&rdquo; загвар ашиглах
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
              Шинэ вебсайтдаа нэр өгнө үү.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Вебсайтын нэр *
                </label>
                <input
                  autoFocus
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="жнь: Манай компанийн вебсайт"
                  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Компанийн нэр
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={user?.companyName ?? "Манай компани"}
                  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Болих
              </button>
              <button
                onClick={handleUseTemplate}
                disabled={!siteName.trim() || creating === showModal.id}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {creating === showModal.id
                  ? "Үүсгэж байна..."
                  : "Үүсгэж засварлах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: Template;
  onUse: () => void;
}) {
  const categoryColors: Record<string, string> = {
    business: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    restaurant: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    portfolio: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    landing: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    ecommerce: "bg-green-500/10 text-green-600 dark:text-green-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-colors group">
      <div className="relative overflow-hidden h-44">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-slate-900 dark:text-white font-semibold">
            {template.name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColors[template.category] ?? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
          >
            {CATEGORY_LABELS[template.category] ?? template.category}
          </span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
          {template.description}
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">
          {template.sections.length} хэсэг
        </p>

        <button
          onClick={onUse}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Загвар ашиглах
        </button>
      </div>
    </div>
  );
}
