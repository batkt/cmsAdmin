"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { getDesign, getContentAdminBlocks, updateContentAdminText, updateContentAdminImages } from "@/lib/api";
import { INPUT_CLASS } from "@/lib/styles";
import { Design, ComponentInstance } from "@/lib/types";

// ─── Text fields allowed by content-admin API ─────────────────────────────────
const TEXT_WHITELIST = new Set([
  "title", "subtitle", "description", "content", "copyright",
  "welcomeMessage", "placeholder", "sendButtonText", "launcherLabel",
  "openButtonText", "closeButtonText", "confirmButtonText",
  "submitButtonText", "cancelButtonText", "loadingText",
  "agentName", "offlineMessage",
]);

const FIELD_LABELS: Record<string, string> = {
  title: "Гарчиг",
  subtitle: "Дэд гарчиг",
  description: "Тайлбар",
  content: "Агуулга",
  copyright: "Зохиогчийн эрх",
  welcomeMessage: "Угтах мессеж",
  placeholder: "Оролтын текст",
  sendButtonText: "Илгээх товч",
  launcherLabel: "Нээх товч",
  openButtonText: "Нээх товч текст",
  closeButtonText: "Хаах товч текст",
  confirmButtonText: "Баталгаажуулах товч",
  submitButtonText: "Илгээх товч текст",
  cancelButtonText: "Цуцлах товч текст",
  loadingText: "Ачааллаж байна текст",
  agentName: "Агентын нэр",
  offlineMessage: "Оффлайн мессеж",
};

export default function TemplatesPage() {
  const user = useAuthStore((s) => s.user);
  const [designs, setDesigns] = useState<(Design & { error?: boolean })[]>([]);
  const [loading, setLoading] = useState(false);
  // When set → show the content editor for that project
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);

  useEffect(() => {
    if (!user?.projects?.length) return;
    async function load() {
      setLoading(true);
      const results = await Promise.all(
        user!.projects.map((p) =>
          getDesign(p.projectName)
            .then((d) => ({ ...d }))
            .catch(() => ({
              projectName: p.projectName,
              domain: "",
              theme: { primaryColor: "#6366f1", secondaryColor: "#0f172a", fontFamily: "Inter", darkMode: false },
              pages: [],
              error: true,
            })),
        ),
      );
      setDesigns(results);
      setLoading(false);
    }
    load();
  }, [user]);

  if (editingProject && editingDesign) {
    return (
      <ContentEditor
        projectName={editingProject}
        design={editingDesign}
        onBack={() => { setEditingProject(null); setEditingDesign(null); }}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Дизайн тохиргоо</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Төслүүдийн дизайн болон агуулгын тохиргоо</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden animate-pulse border border-slate-200 dark:border-slate-700">
              <div className="h-32 bg-slate-200 dark:bg-slate-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : designs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-16 text-center">
          <p className="text-slate-900 dark:text-white font-semibold">Дизайн олдсонгүй</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Системийн администратортай холбогдоно уу</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {designs.map((design, i) => (
            <div key={design.projectName ?? i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <DesignCard
                design={design}
                onEditContent={() => {
                  setEditingProject(design.projectName);
                  setEditingDesign(design as Design);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Design Card ──────────────────────────────────────────────────────────────

function DesignCard({ design, onEditContent }: { design: Design & { error?: boolean }; onEditContent: () => void }) {
  const primary = design.theme?.primaryColor || "#6366f1";
  const secondary = design.theme?.secondaryColor || "#0f172a";

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-slate-900/50">
      <div className="h-28 relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${secondary}, ${primary})` }}>
        {design.error ? (
          <span className="text-white/60 text-xs">Дизайн байхгүй</span>
        ) : (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-white/30" style={{ backgroundColor: primary }} />
            <div className="w-8 h-8 rounded-full border-2 border-white/30" style={{ backgroundColor: secondary }} />
          </div>
        )}
        {design.theme?.darkMode && (
          <span className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-0.5 rounded-full">Харанхуй</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-slate-900 dark:text-white font-semibold truncate">{design.projectName}</h3>
          {!design.error && (
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full flex-shrink-0">
              {design.pages?.length ?? 0} хуудас
            </span>
          )}
        </div>

        {!design.error && (
          <p className="text-slate-500 text-xs mb-1">
            Фонт: <span className="font-medium">{design.theme?.fontFamily}</span>
          </p>
        )}
        {design.domain && <p className="text-slate-500 text-xs truncate mb-2">{design.domain}</p>}

        <div className="flex gap-2 mt-3">
          {/* Edit content → content-admin API */}
          <button
            onClick={onEditContent}
            disabled={!!design.error}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90 flex-shrink-0 disabled:opacity-40"
            style={{ backgroundColor: "var(--accent-600)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Агуулга
          </button>
          <Link
            href={`/websites/${design.projectName}/edit?tab=design`}
            className="flex-1 text-center text-slate-600 dark:text-slate-300 text-sm font-medium py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Дизайн
          </Link>
          <Link
            href={`/preview/${design.projectName}`}
            target="_blank"
            className="px-3 py-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Content Editor ───────────────────────────────────────────────────────────

function ContentEditor({ projectName, design, onBack }: {
  projectName: string;
  design: Design;
  onBack: () => void;
}) {
  const [activePage, setActivePage] = useState(design.pages[0]?.route ?? "/");
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBlocks = useCallback(async (route: string) => {
    setLoading(true);
    try {
      const data = await getContentAdminBlocks(projectName, route);
      setComponents(data.sort((a, b) => a.order - b.order));
    } catch {
      setComponents([]);
    } finally {
      setLoading(false);
    }
  }, [projectName]);

  useEffect(() => { loadBlocks(activePage); }, [activePage, loadBlocks]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Буцах
        </button>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
        <div>
          <p className="text-slate-900 dark:text-white font-semibold text-sm">{projectName}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs">Агуулга засварлах</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Page sidebar */}
        <div className="md:w-48 flex-shrink-0 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Хуудас</p>
          </div>
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-0.5 p-2">
            {design.pages.map((page) => (
              <button
                key={page.route}
                onClick={() => setActivePage(page.route)}
                className={`flex-shrink-0 text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap md:w-full ${
                  activePage === page.route
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                style={activePage === page.route ? { backgroundColor: "var(--accent-600)" } : {}}
              >
                <span className="font-mono text-xs block">{page.route}</span>
                <span className="text-xs opacity-75 hidden md:block">{page.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Block list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 dark:text-white font-semibold">
              {design.pages.find((p) => p.route === activePage)?.title ?? activePage}
            </h2>
            <button onClick={() => loadBlocks(activePage)} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              Шинэчлэх
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : components.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center">
              <p className="text-slate-500 text-sm">Энэ хуудсанд компонент байхгүй байна.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {components.map((comp) => (
                <BlockEditor
                  key={comp.instanceId}
                  component={comp}
                  projectName={projectName}
                  onSaved={() => loadBlocks(activePage)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Block Editor (text + images per component) ───────────────────────────────

function BlockEditor({ component, projectName, onSaved }: {
  component: ComponentInstance;
  projectName: string;
  onSaved: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const initialText = useMemo<Record<string, string>>(() => {
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(component.props)) {
      if (TEXT_WHITELIST.has(k) && typeof v === "string") result[k] = v;
    }
    return result;
  }, [component.props]);

  const initialImages = useMemo<{ url: string; alt?: string }[]>(
    () => Array.isArray(component.props.images) ? [...(component.props.images as { url: string; alt?: string }[])] : [],
    [component.props],
  );

  const [textFields, setTextFields] = useState<Record<string, string>>(initialText);
  const [images, setImages] = useState<{ url: string; alt?: string }[]>(initialImages);
  const [savingText, setSavingText] = useState(false);
  const [savingImages, setSavingImages] = useState(false);
  const [savedText, setSavedText] = useState(false);
  const [savedImages, setSavedImages] = useState(false);

  const textDirty = JSON.stringify(textFields) !== JSON.stringify(initialText);
  const imagesDirty = JSON.stringify(images) !== JSON.stringify(initialImages);

  const hasText = Object.keys(initialText).length > 0;

  async function saveText() {
    if (!textDirty) return;
    setSavingText(true);
    try {
      await updateContentAdminText(component.instanceId, projectName, textFields);
      setSavedText(true);
      setTimeout(() => setSavedText(false), 2000);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа");
    } finally {
      setSavingText(false);
    }
  }

  async function saveImages() {
    if (!imagesDirty) return;
    setSavingImages(true);
    try {
      await updateContentAdminImages(component.instanceId, projectName, images, "replace");
      setSavedImages(true);
      setTimeout(() => setSavedImages(false), 2000);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа");
    } finally {
      setSavingImages(false);
    }
  }


  // Always expandable — every block can have images added
  const hasEditableContent = true;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {/* Row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 ${hasEditableContent ? "cursor-pointer" : ""}`}
        onClick={() => hasEditableContent && setExpanded((v) => !v)}
      >
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "var(--accent-faint)", color: "var(--accent-500)" }}>
          {component.componentType}
        </span>
        {component.parentId && (
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">slot: {component.slot}</span>
        )}
        <span className="text-slate-400 dark:text-slate-500 text-xs flex-1 truncate">
          {textFields.title || textFields.subtitle || textFields.description
            ? (textFields.title || textFields.subtitle || textFields.description)?.slice(0, 50)
            : `#${component.order} · ${component.instanceId.slice(0, 8)}…`}
        </span>
        {(textDirty || imagesDirty) && (
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" title="Хадгалаагүй өөрчлөлт" />
        )}
        {hasEditableContent && (
          <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-6">

          {/* Text fields */}
          {hasText && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Текст</p>
              <div className="space-y-3">
                {Object.keys(textFields).map((key) => {
                  const isLong = key === "description" || key === "content" || key === "welcomeMessage" || key === "offlineMessage";
                  return (
                    <div key={key}>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        {FIELD_LABELS[key] ?? key}
                      </label>
                      {isLong ? (
                        <textarea
                          value={textFields[key]}
                          onChange={(e) => setTextFields((f) => ({ ...f, [key]: e.target.value }))}
                          rows={3}
                          className={INPUT_CLASS + " resize-y"}
                        />
                      ) : (
                        <input
                          type="text"
                          value={textFields[key]}
                          onChange={(e) => setTextFields((f) => ({ ...f, [key]: e.target.value }))}
                          className={INPUT_CLASS}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={saveText}
                  disabled={savingText || !textDirty}
                  className="text-white text-sm font-medium px-4 py-1.5 rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--accent-600)" }}
                >
                  {savingText ? "Хадгалж байна..." : savedText ? "Хадгалагдлаа!" : "Текст хадгалах"}
                </button>
                {textDirty && (
                  <button onClick={() => setTextFields(initialText)} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Цуцлах
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Images */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Зурагнууд</p>
            <div className="space-y-3">
              {images.map((img, i) => (
                <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                  {img.url && (
                    <img
                      src={img.url}
                      alt={img.alt ?? ""}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-slate-600 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="flex-1 space-y-2 min-w-0">
                    <input
                      type="url"
                      placeholder="Зургийн URL (https://...)"
                      value={img.url}
                      onChange={(e) => {
                        const next = [...images];
                        next[i] = { ...next[i], url: e.target.value };
                        setImages(next);
                      }}
                      className={INPUT_CLASS}
                    />
                    <input
                      type="text"
                      placeholder="Alt текст (заавал биш)"
                      value={img.alt ?? ""}
                      onChange={(e) => {
                        const next = [...images];
                        next[i] = { ...next[i], alt: e.target.value };
                        setImages(next);
                      }}
                      className={INPUT_CLASS}
                    />
                  </div>
                  <button
                    onClick={() => setImages(images.filter((_, j) => j !== i))}
                    className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => setImages([...images, { url: "", alt: "" }])}
                className="text-xs font-medium transition-colors"
                style={{ color: "var(--accent-500)" }}
              >
                + Зураг нэмэх
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={saveImages}
                disabled={savingImages || !imagesDirty}
                className="text-white text-sm font-medium px-4 py-1.5 rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--accent-600)" }}
              >
                {savingImages ? "Хадгалж байна..." : savedImages ? "Хадгалагдлаа!" : "Зураг хадгалах"}
              </button>
              {imagesDirty && (
                <button onClick={() => setImages(initialImages)} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  Цуцлах
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
