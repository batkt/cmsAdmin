"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useWebsitesStore } from "@/lib/store";
import {
  Website,
  TemplateComponent,
  ComponentContent,
  ComponentStyles,
  ComponentType,
} from "@/lib/types";

// ─── Component type metadata ──────────────────────────────────────────────────

const COMPONENT_LABELS: Record<ComponentType, string> = {
  header: "Header / Nav",
  home: "Hero / Home",
  about: "About",
  service: "Services",
  contact: "Contact",
  footer: "Footer",
  card: "Card",
  text: "Text Block",
  gif: "GIF / Media",
  grid: "Grid",
  image: "Image",
  news: "News",
  rental: "Rentals",
  jobs: "Jobs",
  "contact-form": "Contact Form",
  chatbot: "Chatbot",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditWebsitePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { getWebsite, updateComponents, publishWebsite } = useWebsitesStore();
  const [website, setWebsite] = useState<Website | undefined>(undefined);
  const [activeIdx, setActiveIdx] = useState(0);
  const [components, setComponents] = useState<TemplateComponent[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const site = getWebsite(id);
    if (!site) { router.push("/websites"); return; }
    setWebsite(site);
    setComponents(site.components);
  }, [id]);

  function updateComponent(idx: number, updated: TemplateComponent) {
    setComponents((prev) => prev.map((c, i) => (i === idx ? updated : c)));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateComponents(id, components);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert("Save failed. Check server connection.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      await publishWebsite(id);
    } catch {
      alert("Publish failed. Check server connection.");
    } finally {
      setPublishing(false);
    }
  }

  const liveWebsite = getWebsite(id) ?? website;
  if (!liveWebsite || components.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  const activeComponent = components[activeIdx];

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* ── Left: component nav ── */}
      <div className="w-56 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-slate-800">
          <Link href="/websites" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <p className="text-white font-semibold text-sm truncate">{liveWebsite.name}</p>
          <p className="text-slate-500 text-xs mt-0.5">{components.length} components</p>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 mb-2">Components</p>
          {components.map((comp, i) => {
            const hasContent = Object.values(comp.content).some((v) =>
              typeof v === "string" ? v.trim() !== "" : v !== undefined && v !== null
            );
            return (
              <button
                key={comp.id}
                onClick={() => setActiveIdx(i)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                  activeIdx === i ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  hasContent ? "bg-green-500 text-white" : activeIdx === i ? "bg-indigo-400" : "bg-slate-700 text-slate-500"
                }`}>
                  {hasContent ? "✓" : i + 1}
                </span>
                <span className="truncate">{COMPONENT_LABELS[comp.type] ?? comp.type}</span>
              </button>
            );
          })}
        </nav>

        {/* Publish */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-center">
            <StatusBadge status={liveWebsite.status} />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {liveWebsite.status !== "published" ? (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              {publishing ? "Publishing..." : "Publish Website"}
            </button>
          ) : (
            <Link
              href={`/preview/${id}`}
              target="_blank"
              className="block w-full text-center bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
            >
              View Live Site
            </Link>
          )}
        </div>
      </div>

      {/* ── Main editor ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-white font-semibold">{COMPONENT_LABELS[activeComponent.type] ?? activeComponent.type}</h1>
            <p className="text-slate-500 text-xs mt-0.5 capitalize">Type: {activeComponent.type}</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-400 text-xs font-medium">Saved!</span>}
            <Link
              href={`/preview/${id}`}
              target="_blank"
              className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Link>
          </div>
        </div>

        <div className="p-8 max-w-2xl">
          <ComponentEditor
            key={`${activeComponent.id}-${activeIdx}`}
            component={activeComponent}
            onChange={(updated) => updateComponent(activeIdx, updated)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Component Editor ─────────────────────────────────────────────────────────

function ComponentEditor({
  component,
  onChange,
}: {
  component: TemplateComponent;
  onChange: (c: TemplateComponent) => void;
}) {
  function setContent(patch: Partial<ComponentContent>) {
    onChange({ ...component, content: { ...component.content, ...patch } });
  }
  function setStyle(patch: Partial<ComponentStyles>) {
    onChange({ ...component, styles: { ...component.styles, ...patch } });
  }

  const content = component.content;
  const styles = component.styles;

  return (
    <div className="space-y-8">
      {/* ── Content Fields ── */}
      <Section title="Content">
        {/* Title */}
        {["home", "about", "service", "text", "card", "grid", "news", "rental", "jobs"].includes(component.type) && (
          <Field label="Title">
            <TextInput value={content.title ?? ""} onChange={(v) => setContent({ title: v })} placeholder="Section title" />
          </Field>
        )}

        {/* Subtitle */}
        {["home", "card"].includes(component.type) && (
          <Field label="Subtitle">
            <TextInput value={content.subtitle ?? ""} onChange={(v) => setContent({ subtitle: v })} placeholder="Subtitle text" />
          </Field>
        )}

        {/* Description */}
        {["home", "about", "text", "card"].includes(component.type) && (
          <Field label="Description">
            <TextareaInput value={content.description ?? ""} onChange={(v) => setContent({ description: v })} placeholder="Describe this section..." />
          </Field>
        )}

        {/* Button Text */}
        {["home", "card"].includes(component.type) && (
          <Field label="Button Text">
            <TextInput value={content.buttonText ?? ""} onChange={(v) => setContent({ buttonText: v })} placeholder="e.g. Learn More" />
          </Field>
        )}

        {/* Copyright */}
        {component.type === "footer" && (
          <Field label="Copyright Text">
            <TextInput value={content.copyright ?? ""} onChange={(v) => setContent({ copyright: v })} placeholder={`© ${new Date().getFullYear()} Your Company`} />
          </Field>
        )}

        {/* Nav Links (header) */}
        {component.type === "header" && (
          <Field label="Navigation Links">
            <div className="space-y-2">
              {(["home", "about", "services", "contact"] as const).map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs w-16 capitalize">{key}</span>
                  <TextInput
                    value={content.navLinks?.[key] ?? ""}
                    onChange={(v) => setContent({ navLinks: { home: "", about: "", services: "", contact: "", ...content.navLinks, [key]: v } })}
                    placeholder={`/${key}`}
                  />
                </div>
              ))}
            </div>
          </Field>
        )}

        {/* Footer Links */}
        {component.type === "footer" && (
          <Field label="Footer Links">
            <div className="space-y-2">
              {(["privacy", "terms", "contact"] as const).map((key) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs w-16 capitalize">{key}</span>
                  <TextInput
                    value={content.footerLinks?.[key] ?? ""}
                    onChange={(v) => setContent({ footerLinks: { privacy: "", terms: "", contact: "", ...content.footerLinks, [key]: v } })}
                    placeholder={`/${key}`}
                  />
                </div>
              ))}
            </div>
          </Field>
        )}

        {/* Contact Info */}
        {component.type === "contact" && (
          <Field label="Contact Information">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Email</label>
                <TextInput value={content.contactInfo?.email ?? ""} onChange={(v) => setContent({ contactInfo: { email: v, phone: content.contactInfo?.phone ?? "", address: content.contactInfo?.address ?? "" } })} placeholder="hello@company.com" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Phone</label>
                <TextInput value={content.contactInfo?.phone ?? ""} onChange={(v) => setContent({ contactInfo: { phone: v, email: content.contactInfo?.email ?? "", address: content.contactInfo?.address ?? "" } })} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Address</label>
                <TextInput value={content.contactInfo?.address ?? ""} onChange={(v) => setContent({ contactInfo: { address: v, email: content.contactInfo?.email ?? "", phone: content.contactInfo?.phone ?? "" } })} placeholder="123 Main St, City" />
              </div>
            </div>
          </Field>
        )}

        {/* Services list */}
        {component.type === "service" && (
          <Field label="Services">
            <ServicesEditor
              services={content.services ?? []}
              onChange={(services) => setContent({ services })}
            />
          </Field>
        )}

        {/* Grid items */}
        {component.type === "grid" && (
          <Field label="Grid Items">
            <GridItemsEditor
              items={content.gridItems ?? []}
              onChange={(gridItems) => setContent({ gridItems })}
            />
          </Field>
        )}

        {/* Images */}
        {["home", "about", "image", "card", "header"].includes(component.type) && (
          <Field label="Images">
            <ImagesEditor
              images={content.images ?? []}
              onChange={(images) => setContent({ images })}
            />
          </Field>
        )}
      </Section>

      {/* ── Style Fields ── */}
      <Section title="Styles">
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Background" value={styles.backgroundColor ?? "#ffffff"} onChange={(v) => setStyle({ backgroundColor: v })} />
          <ColorField label="Text Color" value={styles.textColor ?? "#000000"} onChange={(v) => setStyle({ textColor: v })} />
          <ColorField label="Heading Color" value={styles.headingColor ?? "#000000"} onChange={(v) => setStyle({ headingColor: v })} />
          <ColorField label="Button Background" value={styles.buttonBackgroundColor ?? "#3b82f6"} onChange={(v) => setStyle({ buttonBackgroundColor: v })} />
          <ColorField label="Button Text" value={styles.buttonTextColor ?? "#ffffff"} onChange={(v) => setStyle({ buttonTextColor: v })} />
          <ColorField label="Link Color" value={styles.linkColor ?? "#3b82f6"} onChange={(v) => setStyle({ linkColor: v })} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Field label="Padding">
            <TextInput value={styles.padding ?? ""} onChange={(v) => setStyle({ padding: v })} placeholder="e.g. 2rem" />
          </Field>
          <Field label="Margin">
            <TextInput value={styles.margin ?? ""} onChange={(v) => setStyle({ margin: v })} placeholder="e.g. 0" />
          </Field>
          <Field label="Border Radius">
            <TextInput value={styles.borderRadius ?? ""} onChange={(v) => setStyle({ borderRadius: v })} placeholder="e.g. 8px" />
          </Field>
        </div>
      </Section>
    </div>
  );
}

// ─── Sub-editors ──────────────────────────────────────────────────────────────

function ServicesEditor({ services, onChange }: { services: string[]; onChange: (s: string[]) => void }) {
  return (
    <div className="space-y-2">
      {services.map((svc, i) => (
        <div key={i} className="flex gap-2">
          <TextInput value={svc} onChange={(v) => { const n = [...services]; n[i] = v; onChange(n); }} placeholder={`Service ${i + 1}`} />
          <button onClick={() => onChange(services.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 px-2 transition-colors">✕</button>
        </div>
      ))}
      <button
        onClick={() => onChange([...services, ""])}
        className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
      >
        + Add Service
      </button>
    </div>
  );
}

type GridItemEntry = { id: string; title?: string; description?: string; image?: string; colSpan?: number };
function GridItemsEditor({ items, onChange }: { items: GridItemEntry[]; onChange: (items: GridItemEntry[]) => void }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="bg-slate-750 border border-slate-700 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Item {i + 1}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 text-xs transition-colors">Remove</button>
          </div>
          <TextInput value={item.title ?? ""} onChange={(v) => { const n = [...items]; n[i] = { ...item, title: v }; onChange(n); }} placeholder="Title" />
          <TextareaInput value={item.description ?? ""} onChange={(v) => { const n = [...items]; n[i] = { ...item, description: v }; onChange(n); }} placeholder="Description" />
        </div>
      ))}
      <button onClick={() => onChange([...items, { id: `grid-${Date.now()}` }])} className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
        + Add Grid Item
      </button>
    </div>
  );
}

function ImagesEditor({ images, onChange }: { images: Array<{ id: string; url: string; alt: string; x?: number; y?: number; width?: number; height?: number }>; onChange: (imgs: typeof images) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange([...images, { id: `img-${Date.now()}`, url: reader.result as string, alt: file.name }]);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="grid grid-cols-2 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-700">
            <img src={img.url} alt={img.alt} className="w-full h-28 object-cover" />
            <button
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >✕</button>
            <div className="p-1.5">
              <input
                type="text"
                value={img.alt}
                onChange={(e) => { const n = [...images]; n[i] = { ...img, alt: e.target.value }; onChange(n); }}
                placeholder="Alt text"
                className="w-full bg-transparent text-slate-400 text-xs outline-none"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg px-4 py-2.5 w-full justify-center transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Upload Image
      </button>
    </div>
  );
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{title}</h2>
      <div className="space-y-5 bg-slate-800 border border-slate-700 rounded-xl p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
    />
  );
}

function TextareaInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-y"
    />
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded border border-slate-600 cursor-pointer bg-slate-700" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-slate-700 border border-slate-600 text-white rounded px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" />
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
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${map[status] ?? map.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
