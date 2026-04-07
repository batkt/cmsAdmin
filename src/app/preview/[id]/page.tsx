"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWebsitesStore } from "@/lib/store";
import { Website, TemplateComponent, ComponentStyles } from "@/lib/types";

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const getWebsite = useWebsitesStore((s) => s.getWebsite);
  const [website, setWebsite] = useState<Website | undefined>(undefined);

  useEffect(() => {
    setWebsite(getWebsite(id));
  }, [id]);

  if (!website) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">
        Website not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {website.components.map((comp) => (
        <ComponentRenderer key={comp.id} component={comp} />
      ))}
    </div>
  );
}

// ─── Dispatch each component type ─────────────────────────────────────────────

function ComponentRenderer({ component }: { component: TemplateComponent }) {
  const { type, content, styles } = component;

  const s = styles ?? {};
  const containerStyle: React.CSSProperties = {
    backgroundColor: s.backgroundColor,
    color: s.textColor,
    padding: s.padding,
    margin: s.margin,
    borderRadius: s.borderRadius,
  };

  switch (type) {
    case "header":  return <HeaderComp content={content} styles={s} />;
    case "home":    return <HomeComp content={content} styles={s} />;
    case "about":   return <AboutComp content={content} styles={s} />;
    case "service": return <ServiceComp content={content} styles={s} />;
    case "contact": return <ContactComp content={content} styles={s} />;
    case "footer":  return <FooterComp content={content} styles={s} />;
    case "card":    return <CardComp content={content} styles={s} />;
    case "text":    return (
      <section style={containerStyle} className="py-16 px-8 max-w-4xl mx-auto">
        {content.title && <h2 className="text-3xl font-bold mb-4" style={{ color: s.headingColor }}>{content.title}</h2>}
        {content.description && <p className="text-lg leading-relaxed">{content.description}</p>}
      </section>
    );
    case "image":   return (
      <section style={containerStyle} className="py-12 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(content.images ?? []).map((img) => (
            <img key={img.id} src={img.url} alt={img.alt} className="w-full h-52 object-cover rounded-xl" />
          ))}
        </div>
      </section>
    );
    case "grid":    return <GridComp content={content} styles={s} />;
    case "news":    return <PlaceholderComp label="News Section" color="#3b82f6" />;
    case "rental":  return <PlaceholderComp label="Rentals Section" color="#10b981" />;
    case "jobs":    return <PlaceholderComp label="Jobs Section" color="#f59e0b" />;
    case "contact-form": return <ContactFormComp styles={s} />;
    case "chatbot": return <PlaceholderComp label="Chatbot Widget" color="#8b5cf6" />;
    case "gif":     return (
      <section style={containerStyle} className="py-12 px-8 text-center">
        {(content.images ?? []).map((img) => (
          <img key={img.id} src={img.url} alt={img.alt} className="mx-auto max-h-64 rounded-xl" />
        ))}
      </section>
    );
    default: return null;
  }
}

// ─── Component renderers ──────────────────────────────────────────────────────

function HeaderComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  return (
    <header
      className="sticky top-0 z-50 px-8 py-4 flex items-center justify-between shadow-sm"
      style={{ backgroundColor: s.backgroundColor ?? "#ffffff", color: s.textColor ?? "#1f2937", borderBottom: `1px solid ${s.borderColor ?? "#e5e7eb"}` }}
    >
      <span className="font-bold text-lg" style={{ color: s.headingColor ?? s.textColor }}>
        {content.title ?? "Company"}
      </span>
      <nav className="flex gap-6 text-sm">
        {content.navLinks && Object.entries(content.navLinks).map(([key, href]) => (
          href ? (
            <a key={key} href={href} className="capitalize hover:opacity-70 transition-opacity" style={{ color: s.linkColor ?? s.textColor }}>
              {key}
            </a>
          ) : null
        ))}
      </nav>
    </header>
  );
}

function HomeComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  const bgImg = content.images?.[0]?.url;
  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-center px-8 py-24"
      style={{ backgroundColor: s.backgroundColor ?? "#1e3a5f" }}
    >
      {bgImg && (
        <>
          <img src={bgImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      <div className="relative max-w-3xl">
        {content.title && (
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: s.headingColor ?? "#ffffff" }}>
            {content.title}
          </h1>
        )}
        {content.subtitle && (
          <p className="text-xl mb-4 opacity-90" style={{ color: s.textColor ?? "#ffffff" }}>{content.subtitle}</p>
        )}
        {content.description && (
          <p className="text-lg mb-10 opacity-75 leading-relaxed" style={{ color: s.textColor ?? "#ffffff" }}>{content.description}</p>
        )}
        {content.buttonText && (
          <a
            href="#"
            className="inline-block font-bold px-8 py-4 rounded-full text-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: s.buttonBackgroundColor ?? "#ffffff", color: s.buttonTextColor ?? "#1e3a5f" }}
          >
            {content.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

function AboutComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  const img = content.images?.[0];
  return (
    <section className="py-24 px-8" style={{ backgroundColor: s.backgroundColor ?? "#ffffff" }}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          {content.title && (
            <h2 className="text-4xl font-bold mb-6" style={{ color: s.headingColor ?? "#111827" }}>{content.title}</h2>
          )}
          {content.description && (
            <p className="leading-relaxed text-lg whitespace-pre-line" style={{ color: s.textColor ?? "#4b5563" }}>{content.description}</p>
          )}
        </div>
        {img ? (
          <img src={img.url} alt={img.alt} className="w-full h-80 object-cover rounded-2xl shadow-lg" />
        ) : (
          <div className="w-full h-80 rounded-2xl flex items-center justify-center text-5xl" style={{ backgroundColor: (s.backgroundColor ?? "#f3f4f6") }}>🏢</div>
        )}
      </div>
    </section>
  );
}

function ServiceComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  return (
    <section className="py-24 px-8" style={{ backgroundColor: s.backgroundColor ?? "#f9fafb" }}>
      <div className="max-w-5xl mx-auto">
        {content.title && (
          <h2 className="text-4xl font-bold text-center mb-16" style={{ color: s.headingColor ?? "#111827" }}>{content.title}</h2>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {(content.services ?? []).map((svc, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border"
              style={{ backgroundColor: s.backgroundColor ?? "#ffffff", borderColor: s.borderColor ?? "#e5e7eb" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-bold text-white" style={{ backgroundColor: s.buttonBackgroundColor ?? "#6366f1" }}>
                {i + 1}
              </div>
              <h3 className="text-xl font-bold" style={{ color: s.headingColor ?? "#111827" }}>{svc}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  const ci = content.contactInfo;
  return (
    <section className="py-24 px-8" style={{ backgroundColor: s.backgroundColor ?? "#ffffff" }}>
      <div className="max-w-3xl mx-auto text-center">
        {content.title && (
          <h2 className="text-4xl font-bold mb-10" style={{ color: s.headingColor ?? "#111827" }}>{content.title}</h2>
        )}
        <div className="flex flex-col sm:flex-row gap-8 justify-center" style={{ color: s.textColor ?? "#4b5563" }}>
          {ci?.address && <div><span className="font-bold">📍</span> {ci.address}</div>}
          {ci?.phone   && <div><span className="font-bold">📞</span> {ci.phone}</div>}
          {ci?.email   && <div><span className="font-bold">✉️</span> {ci.email}</div>}
        </div>
      </div>
    </section>
  );
}

function FooterComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  return (
    <footer className="py-10 px-8" style={{ backgroundColor: s.backgroundColor ?? "#111827", color: s.textColor ?? "#9ca3af" }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p>{content.copyright ?? `© ${new Date().getFullYear()} All rights reserved.`}</p>
        {content.footerLinks && (
          <div className="flex gap-6">
            {Object.entries(content.footerLinks).map(([key, href]) =>
              href ? (
                <a key={key} href={href} className="capitalize hover:opacity-70 transition-opacity" style={{ color: s.linkColor ?? s.textColor }}>
                  {key}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

function CardComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  const img = content.images?.[0];
  return (
    <section className="py-16 px-8" style={{ backgroundColor: s.backgroundColor }}>
      <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border" style={{ borderColor: s.borderColor ?? "#e5e7eb" }}>
        {img && <img src={img.url} alt={img.alt} className="w-full h-56 object-cover" />}
        <div className="p-8">
          {content.title && <h3 className="text-2xl font-bold mb-2" style={{ color: s.headingColor }}>{content.title}</h3>}
          {content.subtitle && <p className="text-sm mb-3 opacity-70" style={{ color: s.textColor }}>{content.subtitle}</p>}
          {content.description && <p className="leading-relaxed" style={{ color: s.textColor }}>{content.description}</p>}
          {content.buttonText && (
            <a href="#" className="inline-block mt-6 font-semibold px-6 py-2.5 rounded-lg" style={{ backgroundColor: s.buttonBackgroundColor ?? "#6366f1", color: s.buttonTextColor ?? "#fff" }}>
              {content.buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function GridComp({ content, styles: s }: { content: TemplateComponent["content"]; styles: ComponentStyles }) {
  return (
    <section className="py-24 px-8" style={{ backgroundColor: s.backgroundColor ?? "#f9fafb" }}>
      <div className="max-w-5xl mx-auto">
        {content.title && (
          <h2 className="text-4xl font-bold mb-12" style={{ color: s.headingColor ?? "#111827" }}>{content.title}</h2>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(content.gridItems ?? []).map((item) => (
            <div key={item.id} className="rounded-xl p-6 border" style={{ borderColor: s.borderColor ?? "#e5e7eb", backgroundColor: "#ffffff" }}>
              {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-4" />}
              {item.title && <h3 className="font-bold text-lg mb-2" style={{ color: s.headingColor ?? "#111827" }}>{item.title}</h3>}
              {item.description && <p className="text-sm leading-relaxed" style={{ color: s.textColor ?? "#6b7280" }}>{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactFormComp({ styles: s }: { styles: ComponentStyles }) {
  return (
    <section className="py-24 px-8" style={{ backgroundColor: s.backgroundColor ?? "#f9fafb" }}>
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: s.headingColor ?? "#111827" }}>Send us a message</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2" style={{ borderColor: s.borderColor ?? "#e5e7eb" }} />
          <input type="email" placeholder="Email" className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2" style={{ borderColor: s.borderColor ?? "#e5e7eb" }} />
          <textarea placeholder="Message" rows={4} className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 resize-y" style={{ borderColor: s.borderColor ?? "#e5e7eb" }} />
          <button type="submit" className="w-full py-3 rounded-lg font-semibold" style={{ backgroundColor: s.buttonBackgroundColor ?? "#6366f1", color: s.buttonTextColor ?? "#fff" }}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

function PlaceholderComp({ label, color }: { label: string; color: string }) {
  return (
    <section className="py-16 px-8 text-center" style={{ backgroundColor: color + "10", borderTop: `2px dashed ${color}30` }}>
      <p className="font-semibold text-sm" style={{ color }}>{label}</p>
      <p className="text-xs text-gray-400 mt-1">Content managed via the super admin panel</p>
    </section>
  );
}
