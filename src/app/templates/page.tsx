"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTemplates } from "@/lib/api";
import { Template } from "@/lib/types";
import { useWebsitesStore, useAuthStore } from "@/lib/store";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState<Template | null>(null);
  const [siteName, setSiteName] = useState("");
  const [creating, setCreating] = useState(false);
  const createWebsite = useWebsitesStore((s) => s.createWebsite);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch(() => setError("Could not load templates. Is the super admin server running?"))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))];
  const filtered = filter === "all" ? templates : templates.filter((t) => t.category === filter);

  async function handleCreate() {
    if (!showModal || !siteName.trim() || !user) return;
    setCreating(true);
    try {
      const site = await createWebsite({
        name: siteName.trim(),
        templateId: showModal.id,
        userId: user.id,
        components: showModal.components,
      });
      router.push(`/websites/${site.id}/edit`);
    } catch {
      setCreating(false);
      alert("Failed to create website. Check server connection.");
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Template Gallery</h1>
        <p className="text-slate-400 mt-1">Choose a template built by the Super Admin to start your website.</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === cat ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-5 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 rounded-xl overflow-hidden animate-pulse">
              <div className="h-44 bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No templates found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onUse={() => { setShowModal(tpl); setSiteName(""); }}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">Use &ldquo;{showModal.name}&rdquo;</h2>
            <p className="text-slate-400 text-sm mb-5">
              This template has {showModal.components.length} component{showModal.components.length !== 1 ? "s" : ""}.
              You can edit each one after creation.
            </p>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Website Name *</label>
              <input
                autoFocus
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. My Company Website"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowModal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!siteName.trim() || creating}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {creating ? "Creating..." : "Create & Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template, onUse }: { template: Template; onUse: () => void }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors group">
      {/* Thumbnail or placeholder */}
      <div className="h-44 bg-slate-700 relative overflow-hidden">
        {template.thumbnail ? (
          <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-500 text-xs uppercase tracking-widest mb-1">{template.category}</div>
              <div className="text-slate-400 font-bold text-lg">{template.name}</div>
              <div className="text-slate-600 text-xs mt-1">{template.components.length} components</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-white font-semibold">{template.name}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 flex-shrink-0 capitalize">
            {template.category}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
          <span>⭐ {template.rating?.toFixed(1) ?? "—"}</span>
          <span>↓ {template.downloads ?? 0}</span>
          <span>{template.components.length} components</span>
        </div>

        {/* Component type chips */}
        <div className="flex flex-wrap gap-1 mb-4">
          {template.components.slice(0, 4).map((c) => (
            <span key={c.id} className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded">
              {c.type}
            </span>
          ))}
          {template.components.length > 4 && (
            <span className="text-xs text-slate-500">+{template.components.length - 4} more</span>
          )}
        </div>

        <button
          onClick={onUse}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          Use Template
        </button>
      </div>
    </div>
  );
}
