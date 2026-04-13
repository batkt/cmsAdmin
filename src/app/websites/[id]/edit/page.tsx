"use client";
import { useEffect, useState, useCallback } from "react";
import { INPUT_CLASS } from "@/lib/styles";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getDesign, patchDesign, getComponents, updateComponent, deleteComponent, buildProject,
} from "@/lib/api";
import { Design, ComponentInstance, DesignPage } from "@/lib/types";

type Tab = "design" | "components";

export default function EditProjectPage() {
  const params = useParams();
  const projectName = params.id as string;

  const [tab, setTab] = useState<Tab>("design");
  const [design, setDesign] = useState<Design | null>(null);
  const [loadingDesign, setLoadingDesign] = useState(true);
  const [designError, setDesignError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [building, setBuilding] = useState(false);

  const [activePage, setActivePage] = useState<string>("/");
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(false);

  const loadDesign = useCallback(async () => {
    setLoadingDesign(true);
    setDesignError(null);
    try {
      const d = await getDesign(projectName);
      setDesign(d);
      if (d.pages[0]) setActivePage(d.pages[0].route);
    } catch (err) {
      setDesignError(err instanceof Error ? err.message : "Дизайн ачааллахад алдаа гарлаа");
    } finally {
      setLoadingDesign(false);
    }
  }, [projectName]);

  const loadComponents = useCallback(async (route: string) => {
    setLoadingComponents(true);
    try {
      const data = await getComponents(projectName, route);
      setComponents(data.sort((a, b) => a.order - b.order));
    } catch {
      setComponents([]);
    } finally {
      setLoadingComponents(false);
    }
  }, [projectName]);

  useEffect(() => { loadDesign(); }, [loadDesign]);
  useEffect(() => {
    if (tab === "components" && activePage) loadComponents(activePage);
  }, [tab, activePage, loadComponents]);

  async function handleSaveTheme(theme: Design["theme"]) {
    if (!design) return;
    setSaving(true); setSaved(false);
    try {
      const updated = await patchDesign(projectName, { theme }, projectName);
      setDesign(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Хадгалахад алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleBuild() {
    setBuilding(true);
    try {
      await buildProject(projectName);
      alert("Нийтлэх хүсэлт амжилттай илгээгдлээ.");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setBuilding(false);
    }
  }

  if (loadingDesign) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "var(--accent-500)", borderTopColor: "transparent" }} />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (designError) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-900 dark:text-white font-semibold mb-2">Алдаа гарлаа</p>
          <p className="text-slate-500 text-sm mb-4">{designError}</p>
          <Link href="/websites" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">← Буцах</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "design", label: "Дизайн" },
    { id: "components", label: "Агуулга" },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <Link href="/websites" className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Буцах</span>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base truncate">{projectName}</p>
          {design?.domain && <p className="text-slate-500 text-xs truncate">{design.domain}</p>}
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-green-600 dark:text-green-400 text-xs font-medium hidden sm:inline">Хадгалагдлаа!</span>}
          {saving && <span className="text-slate-400 text-xs hidden sm:inline">Хадгалж байна...</span>}
          <button
            onClick={handleBuild}
            disabled={building}
            className="flex items-center gap-1.5 text-white text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg disabled:opacity-60 transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: "var(--accent-600)" }}
          >
            {building ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
            <span className="hidden sm:inline">{building ? "Нийтэлж байна..." : "Нийтлэх"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex gap-1 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-[var(--accent-500)] text-[var(--accent-600)] dark:text-[var(--accent-400)]"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "design" && design && (
          <DesignTab design={design} onSaveTheme={handleSaveTheme} saving={saving} />
        )}
        {tab === "components" && design && (
          <ComponentsTab
            projectName={projectName}
            pages={design.pages}
            activePage={activePage}
            onPageChange={(route) => setActivePage(route)}
            components={components}
            loading={loadingComponents}
            onRefresh={() => loadComponents(activePage)}
          />
        )}
      </div>
    </div>
  );
}

// ─── Design Tab ───────────────────────────────────────────────────────────────

function DesignTab({ design, onSaveTheme, saving }: {
  design: Design;
  onSaveTheme: (theme: Design["theme"]) => Promise<void>;
  saving: boolean;
}) {
  const [theme, setTheme] = useState({ ...design.theme });
  const dirty = JSON.stringify(theme) !== JSON.stringify(design.theme);


  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
        <h2 className="text-slate-900 dark:text-white font-semibold mb-5">Өнгөний тохиргоо</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Үндсэн өнгө</label>
            <div className="flex items-center gap-2">
              <input type="color" value={theme.primaryColor} onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer" />
              <input type="text" value={theme.primaryColor} onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))} className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Хоёрдогч өнгө</label>
            <div className="flex items-center gap-2">
              <input type="color" value={theme.secondaryColor} onChange={(e) => setTheme((t) => ({ ...t, secondaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600 cursor-pointer" />
              <input type="text" value={theme.secondaryColor} onChange={(e) => setTheme((t) => ({ ...t, secondaryColor: e.target.value }))} className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Фонт</label>
            <select value={theme.fontFamily} onChange={(e) => setTheme((t) => ({ ...t, fontFamily: e.target.value }))} className={INPUT_CLASS}>
              {["Inter", "Roboto", "Poppins", "Montserrat", "Open Sans", "Lato", "Nunito"].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400">Харанхуй горим</label>
            <button
              onClick={() => setTheme((t) => ({ ...t, darkMode: !t.darkMode }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${theme.darkMode ? "bg-[var(--accent-600)]" : "bg-slate-300 dark:bg-slate-600"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${theme.darkMode ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <button
            onClick={() => onSaveTheme(theme)}
            disabled={saving || !dirty}
            className="text-white text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent-600)" }}
          >
            {saving ? "Хадгалж байна..." : dirty ? "Хадгалах" : "Хадгалагдсан"}
          </button>
          {dirty && (
            <button onClick={() => setTheme({ ...design.theme })} className="text-slate-500 text-sm hover:text-slate-900 dark:hover:text-white transition-colors">
              Цуцлах
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
        <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Хуудсууд</h2>
        <div className="space-y-2">
          {design.pages.map((page) => (
            <div key={page.route} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
              <code className="text-xs font-mono text-[var(--accent-500)] bg-[var(--accent-faint)] px-2 py-0.5 rounded flex-shrink-0">{page.route}</code>
              <div className="min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{page.title}</p>
                {page.description && <p className="text-slate-500 text-xs truncate">{page.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-6">
        <h2 className="text-slate-900 dark:text-white font-semibold mb-2">Домэйн</h2>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">{design.domain || "—"}</p>
      </div>
    </div>
  );
}

// ─── Components Tab ───────────────────────────────────────────────────────────

function ComponentsTab({
  projectName, pages, activePage, onPageChange, components, loading, onRefresh,
}: {
  projectName: string;
  pages: DesignPage[];
  activePage: string;
  onPageChange: (route: string) => void;
  components: ComponentInstance[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Page selector */}
      <div className="md:w-48 flex-shrink-0 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Хуудас</p>
        </div>
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-0.5 p-2">
          {pages.map((page) => (
            <button
              key={page.route}
              onClick={() => onPageChange(page.route)}
              className={`flex-shrink-0 text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap md:w-full ${
                activePage === page.route ? "text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              style={activePage === page.route ? { backgroundColor: "var(--accent-600)" } : {}}
            >
              <span className="font-mono text-xs block">{page.route}</span>
              <span className="text-xs opacity-75 hidden md:block">{page.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Component list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900 dark:text-white font-semibold">
            {pages.find((p) => p.route === activePage)?.title ?? activePage}
          </h2>
          <button onClick={onRefresh} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            Шинэчлэх
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
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
              <ComponentCard key={comp.instanceId} component={comp} projectName={projectName} onSaved={onRefresh} onDeleted={onRefresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Prop schema per component type ──────────────────────────────────────────

type FieldType = "text" | "textarea" | "boolean" | "theme" | "align" | "spacing" | "images" | "buttons" | "links" | "json";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
}

const THEME_OPTIONS = ["light", "dark", "primary", "secondary"];
const ALIGN_OPTIONS = ["left", "center", "right"];
const SPACING_OPTIONS = ["none", "sm", "md", "lg", "xl"];

const TYPE_FIELDS: Record<string, FieldDef[]> = {
  header: [
    { key: "title", label: "Лого / Гарчиг", type: "text", required: true },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "sticky", label: "Тогтмол (sticky)", type: "boolean" },
    { key: "links", label: "Навигацийн холбоосууд", type: "links" },
    { key: "button", label: "Товч", type: "json" },
  ],
  hero: [
    { key: "title", label: "Гарчиг", type: "text", required: true },
    { key: "subtitle", label: "Дэд гарчиг", type: "text" },
    { key: "align", label: "Тэгшлэх", type: "align" },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "spacing", label: "Зай", type: "spacing" },
    { key: "buttons", label: "Товчнууд", type: "buttons" },
    { key: "images", label: "Зурагнууд", type: "images" },
  ],
  about: [
    { key: "title", label: "Гарчиг", type: "text" },
    { key: "description", label: "Тайлбар", type: "textarea", required: true },
    { key: "align", label: "Тэгшлэх", type: "align" },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "images", label: "Зурагнууд", type: "images" },
    { key: "button", label: "Товч", type: "json" },
  ],
  footer: [
    { key: "title", label: "Брэнд нэр", type: "text", required: true },
    { key: "copyright", label: "Зохиогчийн эрх", type: "text", required: true },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "footerLinks", label: "Холбоосууд (JSON объект)", type: "json" },
  ],
  pagination: [
    { key: "theme", label: "Загвар", type: "theme" },
  ],
  button: [
    { key: "text", label: "Товчны текст", type: "text", required: true },
    { key: "href", label: "Холбоос (href)", type: "text" },
    { key: "variant", label: "Хэлбэр (JSON)", type: "json" },
    { key: "fullWidth", label: "Бүтэн өргөн", type: "boolean" },
    { key: "centered", label: "Голлох", type: "boolean" },
    { key: "disabled", label: "Идэвхгүй", type: "boolean" },
  ],
  modal: [
    { key: "title", label: "Гарчиг", type: "text" },
    { key: "content", label: "Агуулга", type: "textarea" },
    { key: "openButtonText", label: "Нээх товч текст", type: "text" },
    { key: "closeButtonText", label: "Хаах товч текст", type: "text" },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "defaultOpen", label: "Анхны нээлттэй", type: "boolean" },
    { key: "showTrigger", label: "Товч харуулах", type: "boolean" },
    { key: "fields", label: "Маягтын талбарууд", type: "json" },
    { key: "api", label: "API тохиргоо", type: "json" },
  ],
  chatbot: [
    { key: "title", label: "Гарчиг", type: "text" },
    { key: "welcomeMessage", label: "Угтах мессеж", type: "textarea" },
    { key: "placeholder", label: "Оролтын текст", type: "text" },
    { key: "launcherLabel", label: "Нээх товч текст", type: "text" },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "defaultOpen", label: "Анхны нээлттэй", type: "boolean" },
    { key: "position", label: "Байршил (JSON)", type: "json" },
    { key: "quickReplies", label: "Хурдан хариултууд (JSON)", type: "json" },
    { key: "botReplies", label: "Бот хариултууд (JSON)", type: "json" },
  ],
  livechat: [
    { key: "title", label: "Гарчиг", type: "text" },
    { key: "subtitle", label: "Дэд гарчиг", type: "text" },
    { key: "agentName", label: "Агентын нэр", type: "text" },
    { key: "agentAvatarUrl", label: "Агентын зураг (URL)", type: "text" },
    { key: "welcomeMessage", label: "Угтах мессеж", type: "textarea" },
    { key: "offlineMessage", label: "Оффлайн мессеж", type: "textarea" },
    { key: "placeholder", label: "Оролтын текст", type: "text" },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "defaultOpen", label: "Анхны нээлттэй", type: "boolean" },
  ],
  twocolumn: [
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "ratio", label: "Харьцаа (JSON)", type: "json" },
    { key: "gap", label: "Зай (JSON)", type: "json" },
    { key: "verticalAlign", label: "Босоо тэгшлэх (JSON)", type: "json" },
  ],
  grid: [
    { key: "columns", label: "Баганын тоо", type: "json" },
    { key: "gap", label: "Зай (JSON)", type: "json" },
    { key: "theme", label: "Загвар", type: "theme" },
  ],
  card: [
    { key: "title", label: "Гарчиг", type: "text" },
    { key: "subtitle", label: "Дэд гарчиг", type: "text" },
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "border", label: "Хүрээ", type: "boolean" },
    { key: "shadow", label: "Сүүдэр (JSON)", type: "json" },
    { key: "padding", label: "Дотор зай (JSON)", type: "json" },
  ],
  container: [
    { key: "theme", label: "Загвар", type: "theme" },
    { key: "maxWidth", label: "Хамгийн их өргөн (JSON)", type: "json" },
    { key: "padding", label: "Дотор зай (JSON)", type: "json" },
  ],
};

// ─── Component Card ───────────────────────────────────────────────────────────

function ComponentCard({ component, projectName, onSaved, onDeleted }: {
  component: ComponentInstance;
  projectName: string;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [props, setProps] = useState<Record<string, unknown>>({ ...component.props });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dirty = JSON.stringify(props) !== JSON.stringify(component.props);

  const type = component.componentType.toLowerCase();
  const fieldDefs = TYPE_FIELDS[type];

  function setProp(key: string, value: unknown) {
    setProps((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Send full merged props (server replaces entire props object)
      await updateComponent(component.instanceId, props, projectName);
      onSaved();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Хадгалахад алдаа");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`"${component.componentType}" компонентыг устгах уу?`)) return;
    setDeleting(true);
    try {
      await deleteComponent(component.instanceId, projectName);
      onDeleted();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Устгахад алдаа");
    } finally {
      setDeleting(false);
    }
  }

  const LAYOUT_TYPES = ["twocolumn", "grid", "card", "container"];
  const isLayout = LAYOUT_TYPES.includes(type);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded((v) => !v)}>
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ backgroundColor: "var(--accent-faint)", color: "var(--accent-500)" }}>
          {component.componentType}
        </span>
        {isLayout && (
          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded flex-shrink-0">layout</span>
        )}
        {component.parentId && (
          <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">slot: {component.slot}</span>
        )}
        <span className="text-slate-400 dark:text-slate-500 text-xs flex-1 truncate">#{component.order} · {component.instanceId.slice(0, 8)}…</span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="space-y-4">
            {fieldDefs ? (
              // Known type: render structured fields
              fieldDefs.map((fd) => (
                <StructuredField
                  key={fd.key}
                  def={fd}
                  value={props[fd.key]}
                  onChange={(v) => setProp(fd.key, v)}
                />
              ))
            ) : (
              // Unknown type: render all props as generic fields
              Object.entries(props).map(([key, val]) => (
                <GenericField key={key} propKey={key} value={val} onChange={(v) => setProp(key, v)} />
              ))
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="text-white text-sm font-medium px-4 py-1.5 rounded-lg disabled:opacity-50 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--accent-600)" }}
            >
              {saving ? "Хадгалж байна..." : dirty ? "Хадгалах" : "Хадгалагдсан"}
            </button>
            {dirty && (
              <button onClick={() => setProps({ ...component.props })} className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Цуцлах
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? "Устгаж байна..." : "Устгах"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Structured field renderer ────────────────────────────────────────────────

function StructuredField({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  if (def.type === "boolean") {
    return (
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{def.label}</span>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-[var(--accent-600)]" : "bg-slate-300 dark:bg-slate-600"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
        </button>
      </div>
    );
  }

  const label = (
    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {def.label}{def.required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );

  if (def.type === "theme") {
    return (
      <div>
        {label}
        <div className="flex gap-2 flex-wrap">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                value === opt
                  ? "border-[var(--accent-500)] text-[var(--accent-600)] dark:text-[var(--accent-400)] bg-[var(--accent-faint)]"
                  : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (def.type === "align") {
    return (
      <div>
        {label}
        <div className="flex gap-2">
          {ALIGN_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                value === opt
                  ? "border-[var(--accent-500)] text-[var(--accent-600)] dark:text-[var(--accent-400)] bg-[var(--accent-faint)]"
                  : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              {opt === "left" ? "← Зүүн" : opt === "center" ? "↔ Голлох" : "Баруун →"}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (def.type === "spacing") {
    return (
      <div>
        {label}
        <div className="flex gap-2 flex-wrap">
          {SPACING_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                value === opt
                  ? "border-[var(--accent-500)] text-[var(--accent-600)] dark:text-[var(--accent-400)] bg-[var(--accent-faint)]"
                  : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (def.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={INPUT_CLASS + " resize-y"}
        />
      </div>
    );
  }

  if (def.type === "text") {
    return (
      <div>
        {label}
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>
    );
  }

  if (def.type === "images") {
    const images: { url: string; alt?: string }[] = Array.isArray(value) ? (value as { url: string; alt?: string }[]) : [];
    return (
      <div>
        {label}
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input
                  type="url"
                  placeholder="Зургийн URL"
                  value={img.url}
                  onChange={(e) => {
                    const next = [...images];
                    next[i] = { ...next[i], url: e.target.value };
                    onChange(next);
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
                    onChange(next);
                  }}
                  className={INPUT_CLASS}
                />
              </div>
              {img.url && (
                <img src={img.url} alt={img.alt ?? ""} className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-600 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              <button onClick={() => onChange(images.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs mt-2 flex-shrink-0">✕</button>
            </div>
          ))}
          <button
            onClick={() => onChange([...images, { url: "", alt: "" }])}
            className="text-xs text-[var(--accent-500)] hover:text-[var(--accent-600)] font-medium"
          >
            + Зураг нэмэх
          </button>
        </div>
      </div>
    );
  }

  if (def.type === "buttons") {
    const buttons: { text: string; href?: string; variant?: string; size?: string }[] =
      Array.isArray(value) ? (value as { text: string; href?: string; variant?: string; size?: string }[]) : [];
    const variantOpts = ["primary", "secondary", "outline", "ghost"];
    return (
      <div>
        {label}
        <div className="space-y-3">
          {buttons.map((btn, i) => (
            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Текст"
                  value={btn.text}
                  onChange={(e) => {
                    const next = [...buttons];
                    next[i] = { ...next[i], text: e.target.value };
                    onChange(next);
                  }}
                  className={INPUT_CLASS + " flex-1"}
                />
                <button onClick={() => onChange(buttons.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">✕</button>
              </div>
              <input
                type="text"
                placeholder="Холбоос (href)"
                value={btn.href ?? ""}
                onChange={(e) => {
                  const next = [...buttons];
                  next[i] = { ...next[i], href: e.target.value };
                  onChange(next);
                }}
                className={INPUT_CLASS}
              />
              <div className="flex gap-1 flex-wrap">
                {variantOpts.map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      const next = [...buttons];
                      next[i] = { ...next[i], variant: v };
                      onChange(next);
                    }}
                    className={`px-2 py-1 rounded text-xs border transition-all ${
                      (btn.variant ?? "primary") === v
                        ? "border-[var(--accent-500)] text-[var(--accent-600)] bg-[var(--accent-faint)]"
                        : "border-slate-200 dark:border-slate-600 text-slate-500"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={() => onChange([...buttons, { text: "Товч", href: "#", variant: "primary", size: "md" }])}
            className="text-xs text-[var(--accent-500)] hover:text-[var(--accent-600)] font-medium"
          >
            + Товч нэмэх
          </button>
        </div>
      </div>
    );
  }

  if (def.type === "links") {
    const links: { href: string; label: string; isExternal?: boolean }[] =
      Array.isArray(value) ? (value as { href: string; label: string; isExternal?: boolean }[]) : [];
    return (
      <div>
        {label}
        <div className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Гарчиг"
                value={link.label}
                onChange={(e) => {
                  const next = [...links];
                  next[i] = { ...next[i], label: e.target.value };
                  onChange(next);
                }}
                className={INPUT_CLASS}
              />
              <input
                type="text"
                placeholder="/холбоос"
                value={link.href}
                onChange={(e) => {
                  const next = [...links];
                  next[i] = { ...next[i], href: e.target.value };
                  onChange(next);
                }}
                className={INPUT_CLASS}
              />
              <button onClick={() => onChange(links.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs flex-shrink-0">✕</button>
            </div>
          ))}
          <button
            onClick={() => onChange([...links, { href: "/", label: "Холбоос" }])}
            className="text-xs text-[var(--accent-500)] hover:text-[var(--accent-600)] font-medium"
          >
            + Холбоос нэмэх
          </button>
        </div>
      </div>
    );
  }

  // JSON fallback
  return (
    <div>
      {label}
      <textarea
        value={value !== undefined ? JSON.stringify(value, null, 2) : ""}
        onChange={(e) => {
          try { onChange(JSON.parse(e.target.value)); } catch {}
        }}
        rows={4}
        className={INPUT_CLASS + " resize-y font-mono text-xs"}
      />
    </div>
  );
}

// ─── Generic field (unknown component types) ──────────────────────────────────

function GenericField({ propKey, value, onChange }: { propKey: string; value: unknown; onChange: (v: unknown) => void }) {

  if (typeof value === "boolean") {
    return (
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{propKey}</label>
        <button
          onClick={() => onChange(!value)}
          className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-[var(--accent-600)]" : "bg-slate-300 dark:bg-slate-600"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
        </button>
      </div>
    );
  }

  if (typeof value === "string") {
    const isLong = value.length > 60 || value.includes("\n");
    return (
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{propKey}</label>
        {isLong
          ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={INPUT_CLASS + " resize-y"} />
          : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={INPUT_CLASS} />
        }
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{propKey}</label>
        <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className={INPUT_CLASS} />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
        {propKey} <span className="text-slate-400 dark:text-slate-500 font-normal">(JSON)</span>
      </label>
      <textarea
        value={JSON.stringify(value, null, 2)}
        onChange={(e) => { try { onChange(JSON.parse(e.target.value)); } catch {} }}
        rows={4}
        className={INPUT_CLASS + " resize-y font-mono text-xs"}
      />
    </div>
  );
}
