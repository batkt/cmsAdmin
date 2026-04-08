"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useWebsitesStore } from "@/lib/store";
import { fetchTemplateById } from "@/lib/mock-data";
import { Template, TemplateSection, TemplateField, Website } from "@/lib/types";

export default function EditWebsitePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { getWebsite, updateSectionContent, publishWebsite } = useWebsitesStore();
  const [website, setWebsite] = useState<Website | undefined>(undefined);
  const [template, setTemplate] = useState<Template | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const site = getWebsite(id);
    if (!site) { router.push("/websites"); return; }
    setWebsite(site);
    fetchTemplateById(site.templateId).then((tpl) => {
      setTemplate(tpl);
      if (tpl?.sections[0]) setActiveSection(tpl.sections[0].id);
    });
  }, [id]);

  const liveWebsite = getWebsite(id) ?? website;

  function getSectionValues(sectionId: string): Record<string, string> {
    return liveWebsite?.content.find((c) => c.sectionId === sectionId)?.values ?? {};
  }

  async function handleSave(sectionId: string, values: Record<string, string>) {
    setSaving(true);
    setSaved(false);
    updateSectionContent(id, sectionId, values);
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handlePublish() {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 600));
    publishWebsite(id);
    setPublishing(false);
  }

  if (!liveWebsite || !template) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Засварлагч ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  const activeTemplateSection = template.sections.find((s) => s.id === activeSection);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">

      {/* ── Desktop sidebar / Mobile top strip ── */}
      <div className="md:w-56 flex-shrink-0 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col">

        {/* Back + title — always visible */}
        <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Link href="/websites" className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden md:inline">Буцах</span>
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">{liveWebsite.name}</p>
            <p className="text-slate-500 text-xs truncate hidden md:block">{template.name}</p>
          </div>
          {/* Publish button — mobile inline */}
          <div className="flex items-center gap-2 md:hidden">
            <StatusBadge status={liveWebsite.status} />
            {liveWebsite.status !== "published" ? (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                {publishing ? "..." : "Нийтлэх"}
              </button>
            ) : (
              <Link href={`/preview/${id}`} target="_blank" className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                Харах
              </Link>
            )}
          </div>
        </div>

        {/* Sections — horizontal scroll on mobile, vertical on desktop */}
        <div className="md:flex-1 md:overflow-y-auto">
          <div className="md:p-2">
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-2 hidden md:block">Хэсгүүд</p>

            {/* Mobile: horizontal scrolling tabs */}
            <div className="flex md:hidden overflow-x-auto gap-1 px-3 py-2 scrollbar-none">
              {template.sections.map((sec, i) => {
                const vals = liveWebsite.content.find((c) => c.sectionId === sec.id)?.values ?? {};
                const filled = Object.values(vals).some((v) => v.trim() !== "");
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      activeSection === sec.id
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {filled && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
                    {sec.name}
                  </button>
                );
              })}
            </div>

            {/* Desktop: vertical list */}
            <div className="hidden md:block space-y-0.5">
              {template.sections.map((sec, i) => {
                const vals = liveWebsite.content.find((c) => c.sectionId === sec.id)?.values ?? {};
                const filled = Object.values(vals).some((v) => v.trim() !== "");
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSection === sec.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      filled ? "bg-green-500 text-white" : activeSection === sec.id ? "bg-indigo-400" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    }`}>
                      {filled ? "✓" : i + 1}
                    </span>
                    <span className="truncate">{sec.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Publish — desktop only */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 hidden md:block">
          <div className="mb-2 flex items-center justify-center">
            <StatusBadge status={liveWebsite.status} />
          </div>
          {liveWebsite.status !== "published" ? (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              {publishing ? "Нийтэлж байна..." : "Вебсайт нийтлэх"}
            </button>
          ) : (
            <Link href={`/preview/${id}`} target="_blank" className="block w-full text-center bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
              Шууд сайт харах
            </Link>
          )}
        </div>
      </div>

      {/* ── Main editor ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base">{activeTemplateSection?.name}</h1>
            <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">{activeTemplateSection?.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="text-green-600 dark:text-green-400 text-xs font-medium">Хадгалагдлаа!</span>}
            {saving && <span className="text-slate-400 text-xs">Хадгалж байна...</span>}
            <Link
              href={`/preview/${id}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">Урьдчилан харах</span>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-8 max-w-2xl">
          {activeTemplateSection && (
            <SectionEditor
              key={activeSection}
              section={activeTemplateSection}
              initialValues={getSectionValues(activeSection)}
              onSave={(values) => handleSave(activeSection, values)}
              saving={saving}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  initialValues,
  onSave,
  saving,
}: {
  section: TemplateSection;
  initialValues: Record<string, string>;
  onSave: (values: Record<string, string>) => Promise<void>;
  saving: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  function setValue(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  return (
    <div>
      <div className="space-y-6">
        {section.fields.map((field) => (
          <FieldEditor
            key={field.id}
            field={field}
            value={values[field.id] ?? field.defaultValue ?? ""}
            onChange={(v) => setValue(field.id, v)}
          />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => onSave(values)}
          disabled={saving || !dirty}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {saving ? "Хадгалж байна..." : dirty ? "Өөрчлөлт хадгалах" : "Хадгалагдсан"}
        </button>
      </div>
    </div>
  );
}

function FieldEditor({ field, value, onChange }: { field: TemplateField; value: string; onChange: (v: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  const inputClass = "w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-2.5 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.type === "text" || field.type === "url" ? (
        <input
          type={field.type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      ) : field.type === "textarea" || field.type === "richtext" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={inputClass + " resize-y"}
        />
      ) : field.type === "color" ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || "#ffffff"}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className={inputClass + " max-w-36"}
          />
        </div>
      ) : field.type === "image" ? (
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {value ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 group">
              <img src={value} alt="Оруулсан зураг" className="w-full max-h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => fileInputRef.current?.click()} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                  Солих
                </button>
                <button onClick={() => onChange("")} className="bg-red-500/70 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                  Устгах
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs">Зураг оруулах</span>
            </button>
          )}
        </div>
      ) : null}
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
