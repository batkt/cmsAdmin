"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useWebsitesStore } from "@/lib/store";
import { fetchTemplateById } from "@/lib/mock-data";
import { Template, Website } from "@/lib/types";

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const getWebsite = useWebsitesStore((s) => s.getWebsite);
  const [website, setWebsite] = useState<Website | undefined>(undefined);
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const site = getWebsite(id);
    setWebsite(site);
    if (site) {
      fetchTemplateById(site.templateId).then((tpl) => {
        setTemplate(tpl);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  function getVal(sectionId: string, fieldId: string): string {
    return website?.content.find((c) => c.sectionId === sectionId)?.values?.[fieldId] ?? "";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!website || !template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Вебсайт олдсонгүй.
      </div>
    );
  }

  if (template.category === "business") return <BusinessPreview website={website} template={template} getVal={getVal} />;
  if (template.category === "restaurant") return <RestaurantPreview website={website} template={template} getVal={getVal} />;
  if (template.category === "portfolio") return <PortfolioPreview website={website} template={template} getVal={getVal} />;
  if (template.category === "landing") return <LandingPreview website={website} template={template} getVal={getVal} />;
  return <GenericPreview website={website} template={template} getVal={getVal} />;
}

type PreviewProps = {
  website: Website;
  template: Template;
  getVal: (sectionId: string, fieldId: string) => string;
};

// ─── Бизнес загвар ────────────────────────────────────────────────────────────

function BusinessPreview({ website, getVal }: PreviewProps) {
  const bgColor = getVal("hero", "background_color") || "#1e3a5f";
  const bgImg = getVal("hero", "background_image");

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-gray-900 text-lg">{website.companyName}</span>
        <div className="flex gap-6 text-sm text-gray-600">
          <a href="#about" className="hover:text-gray-900">Бидний тухай</a>
          <a href="#services" className="hover:text-gray-900">Үйлчилгээ</a>
          <a href="#contact" className="hover:text-gray-900">Холбоо барих</a>
        </div>
      </nav>

      <section
        className="min-h-screen flex items-center justify-center text-white text-center px-8 pt-20 relative"
        style={{ background: bgImg ? `url(${bgImg}) center/cover` : bgColor }}
      >
        {bgImg && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative max-w-3xl">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            {getVal("hero", "headline") || website.companyName}
          </h1>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            {getVal("hero", "subheadline") || "Манай вебсайтад тавтай морилно уу."}
          </p>
          <a href="#contact" className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg">
            {getVal("hero", "cta_text") || "Эхлэх"}
          </a>
        </div>
      </section>

      <section id="about" className="py-24 px-8 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{getVal("about", "title") || "Бидний тухай"}</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {getVal("about", "description") || "Компанийнхаа тухай энд бичнэ үү."}
            </p>
            <div className="flex gap-8 mt-8">
              {getVal("about", "founded_year") && (
                <div>
                  <p className="text-3xl font-bold text-gray-900">{getVal("about", "founded_year")}</p>
                  <p className="text-gray-500 text-sm">Үүссэн он</p>
                </div>
              )}
              {getVal("about", "employee_count") && (
                <div>
                  <p className="text-3xl font-bold text-gray-900">{getVal("about", "employee_count")}</p>
                  <p className="text-gray-500 text-sm">Ажилтан</p>
                </div>
              )}
            </div>
          </div>
          {getVal("about", "image") ? (
            <img src={getVal("about", "image")} alt="Бидний тухай" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">Компанийн зураг</div>
          )}
        </div>
      </section>

      <section id="services" className="py-24 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">{getVal("services", "title") || "Манай үйлчилгээ"}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => {
              const name = getVal("services", `service${i}_name`);
              const desc = getVal("services", `service${i}_desc`);
              if (!name && !desc) return null;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-lg">0{i}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{name}</h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{getVal("contact", "title") || "Холбоо барих"}</h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center text-gray-600">
            {getVal("contact", "address") && <div className="flex items-center gap-2"><span>📍</span><span>{getVal("contact", "address")}</span></div>}
            {getVal("contact", "phone") && <div className="flex items-center gap-2"><span>📞</span><span>{getVal("contact", "phone")}</span></div>}
            {getVal("contact", "email") && <div className="flex items-center gap-2"><span>✉️</span><span>{getVal("contact", "email")}</span></div>}
          </div>
        </div>
      </section>

      <Footer name={website.companyName} />
    </div>
  );
}

// ─── Ресторан загвар ──────────────────────────────────────────────────────────

function RestaurantPreview({ website, getVal }: PreviewProps) {
  const heroImg = getVal("hero", "hero_image");
  return (
    <div className="min-h-screen bg-stone-50 font-serif">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-900/90 backdrop-blur px-8 py-4 flex items-center justify-between">
        <span className="font-bold text-amber-400 text-xl">{getVal("hero", "restaurant_name") || website.companyName}</span>
        <div className="flex gap-6 text-sm text-stone-300">
          <a href="#menu" className="hover:text-white">Цэс</a>
          <a href="#story" className="hover:text-white">Манай түүх</a>
          <a href="#visit" className="hover:text-white">Хаяг</a>
          {getVal("hero", "reservation_url") && (
            <a href={getVal("hero", "reservation_url")} className="bg-amber-500 text-stone-900 px-4 py-1 rounded-full font-sans font-semibold hover:bg-amber-400 transition-colors">Захиалах</a>
          )}
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center text-white text-center pt-20 relative"
        style={{ background: heroImg ? `url(${heroImg}) center/cover` : "#1c1c1c" }}>
        {heroImg && <div className="absolute inset-0 bg-black/50" />}
        <div className="relative">
          <p className="text-amber-400 tracking-widest text-sm uppercase mb-4 font-sans">Тавтай морилно уу</p>
          <h1 className="text-7xl font-bold mb-6">{getVal("hero", "restaurant_name") || website.companyName}</h1>
          <p className="text-2xl text-white/70 italic">{getVal("hero", "tagline") || "Гайхамшигт хоол, гайхамшигт туршлага"}</p>
        </div>
      </section>

      <section id="menu" className="py-24 px-8 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4">{getVal("menu", "title") || "Манай цэс"}</h2>
          <p className="text-stone-400 text-center mb-16 font-sans">Хайр сэтгэлээр бэлтгэсэн</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => {
              const name = getVal("menu", `dish${i}_name`);
              const price = getVal("menu", `dish${i}_price`);
              const img = getVal("menu", `dish${i}_image`);
              if (!name) return null;
              return (
                <div key={i} className="bg-stone-800 rounded-2xl overflow-hidden">
                  {img ? <img src={img} alt={name} className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-stone-700 flex items-center justify-center text-4xl">🍽️</div>}
                  <div className="p-5">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{name}</h3>
                      {price && <span className="text-amber-400 font-bold font-sans">{price}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="story" className="py-24 px-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-stone-900 mb-6">{getVal("about", "title") || "Манай түүх"}</h2>
            <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-line">{getVal("about", "story") || "Рестораны түүх..."}</p>
            {getVal("about", "chef_name") && <p className="mt-6 font-bold text-stone-800">— {getVal("about", "chef_name")}</p>}
          </div>
          {getVal("about", "chef_image") ? (
            <img src={getVal("about", "chef_image")} alt="Тогооч" className="w-full h-80 object-cover rounded-2xl" />
          ) : (
            <div className="w-full h-80 bg-stone-100 rounded-2xl flex items-center justify-center text-6xl">👨‍🍳</div>
          )}
        </div>
      </section>

      <section id="visit" className="py-16 px-8 bg-amber-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-stone-900 mb-10">Бидэнд зочлоорой</h2>
          <div className="space-y-4 text-stone-700">
            {getVal("contact", "address") && <p className="text-xl">📍 {getVal("contact", "address")}</p>}
            {getVal("contact", "hours") && <p className="text-base whitespace-pre-line font-sans">{getVal("contact", "hours")}</p>}
            {getVal("contact", "phone") && <p className="text-xl">📞 {getVal("contact", "phone")}</p>}
          </div>
        </div>
      </section>

      <Footer name={getVal("hero", "restaurant_name") || website.companyName} dark />
    </div>
  );
}

// ─── Портфолио загвар ─────────────────────────────────────────────────────────

function PortfolioPreview({ website, getVal }: PreviewProps) {
  const accent = getVal("hero", "accent_color") || "#6366f1";
  const profileImg = getVal("hero", "profile_image");

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <span className="font-bold text-gray-900">{getVal("hero", "name") || website.companyName}</span>
        <div className="flex gap-6 text-sm text-gray-500">
          <a href="#work" className="hover:text-gray-900">Бүтээлүүд</a>
          <a href="#skills" className="hover:text-gray-900">Ур чадвар</a>
          <a href="#contact" style={{ color: accent }}>Холбоо барих</a>
        </div>
      </nav>

      <section className="min-h-screen flex items-center px-8 max-w-5xl mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: accent }}>{getVal("hero", "role") || "Бүтээлч мэргэжилтэн"}</p>
            <h1 className="text-6xl font-black text-gray-900 leading-tight mb-6">{getVal("hero", "name") || website.companyName}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{getVal("hero", "bio") || "Портфолиодоо тавтай морилно уу."}</p>
            <a href="#work" className="inline-block mt-8 text-white px-8 py-4 rounded-full font-semibold" style={{ backgroundColor: accent }}>
              Бүтээлүүдийг харах
            </a>
          </div>
          {profileImg ? (
            <img src={profileImg} alt="Профайл" className="w-80 h-80 object-cover rounded-3xl shadow-2xl mx-auto" />
          ) : (
            <div className="w-80 h-80 rounded-3xl mx-auto flex items-center justify-center text-7xl" style={{ backgroundColor: accent + "15" }}>👤</div>
          )}
        </div>
      </section>

      <section id="work" className="py-20 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 mb-12">{getVal("work", "title") || "Сонгосон бүтээлүүд"}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => {
              const name = getVal("work", `project${i}_name`);
              const desc = getVal("work", `project${i}_desc`);
              const img = getVal("work", `project${i}_image`);
              const url = getVal("work", `project${i}_url`);
              if (!name) return null;
              return (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                  {img ? <img src={img} alt={name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-52 flex items-center justify-center text-5xl" style={{ backgroundColor: accent + "15" }}>🎨</div>}
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{name}</h3>
                    <p className="text-gray-500 text-sm">{desc}</p>
                    {url && <a href={url} target="_blank" className="inline-block mt-3 text-sm font-medium" style={{ color: accent }}>Төсөл харах →</a>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 px-8 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-gray-900 mb-10">{getVal("skills", "title") || "Би юу хийдэг вэ"}</h2>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => {
            const skill = getVal("skills", `skill${i}`);
            if (!skill) return null;
            return <span key={i} className="px-6 py-3 rounded-full text-white font-semibold" style={{ backgroundColor: accent }}>{skill}</span>;
          })}
        </div>
      </section>

      <section id="contact" className="py-20 px-8" style={{ backgroundColor: accent }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-black mb-4">Хамтран ажиллацгаая</h2>
          {getVal("contact", "availability") && <p className="text-white/80 mb-8">{getVal("contact", "availability")}</p>}
          {getVal("contact", "email") && (
            <a href={`mailto:${getVal("contact", "email")}`} className="text-2xl font-bold hover:underline">{getVal("contact", "email")}</a>
          )}
          <div className="flex justify-center gap-6 mt-8">
            {getVal("contact", "instagram") && <a href={getVal("contact", "instagram")} target="_blank" className="text-white/80 hover:text-white">Instagram</a>}
            {getVal("contact", "linkedin") && <a href={getVal("contact", "linkedin")} target="_blank" className="text-white/80 hover:text-white">LinkedIn</a>}
          </div>
        </div>
      </section>

      <Footer name={getVal("hero", "name") || website.companyName} />
    </div>
  );
}

// ─── Landing загвар ───────────────────────────────────────────────────────────

function LandingPreview({ website, getVal }: PreviewProps) {
  const primary = getVal("hero", "primary_color") || "#7c3aed";
  const heroImg = getVal("hero", "hero_image");

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="px-8 py-5 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <span className="font-bold text-gray-900 text-lg">{website.companyName}</span>
        <div className="flex gap-6 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900">Онцлогууд</a>
          <a href="#pricing" className="hover:text-gray-900">Үнэ</a>
          <a href="#cta" className="text-white px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: primary }}>Эхлэх</a>
        </div>
      </nav>

      <section className="py-32 px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-black text-gray-900 leading-tight mb-6">{getVal("hero", "headline") || "Бүтээгдэхүүний гарчиг"}</h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">{getVal("hero", "subtext") || "Бүтээгдэхүүнийхээ тайлбарыг энд бичнэ үү."}</p>
        <div className="flex gap-4 justify-center">
          <a href="#cta" className="text-white px-8 py-4 rounded-xl font-bold text-lg" style={{ backgroundColor: primary }}>
            {getVal("hero", "cta_primary") || "Үнэгүй туршаад үз"}
          </a>
          {getVal("hero", "cta_secondary") && (
            <a href="#features" className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300">
              {getVal("hero", "cta_secondary")}
            </a>
          )}
        </div>
        {heroImg && <img src={heroImg} alt="Бүтээгдэхүүн" className="mt-16 w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border border-gray-100" />}
      </section>

      <section id="features" className="py-24 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-16">{getVal("features", "title") || "Онцлогууд"}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => {
              const title = getVal("features", `feature${i}_title`);
              const desc = getVal("features", `feature${i}_desc`);
              if (!title) return null;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-xl" style={{ backgroundColor: primary + "15" }}>⚡</div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-16">{getVal("pricing", "title") || "Үнийн мэдээлэл"}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => {
              const name = getVal("pricing", `plan${i}_name`);
              const price = getVal("pricing", `plan${i}_price`);
              const features = getVal("pricing", `plan${i}_features`);
              if (!name) return null;
              return (
                <div key={i} className={`rounded-2xl p-8 border-2 ${i === 2 ? "border-current" : "border-gray-200"}`} style={i === 2 ? { borderColor: primary } : {}}>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">{name}</h3>
                  {price && <p className="text-4xl font-black mb-4" style={{ color: primary }}>{price}</p>}
                  {features && (
                    <ul className="space-y-2">
                      {features.split("\n").map((f, j) => f.trim() && (
                        <li key={j} className="flex items-center gap-2 text-gray-600 text-sm">
                          <span style={{ color: primary }}>✓</span> {f.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                  <a href="#cta" className={`block mt-6 py-3 rounded-xl text-center font-bold ${i === 2 ? "text-white" : "border-2 border-gray-200 text-gray-700"}`} style={i === 2 ? { backgroundColor: primary } : {}}>
                    {name} сонгох
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cta" className="py-24 px-8 text-white" style={{ backgroundColor: primary }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-4">{getVal("cta", "headline") || "Эхлэхэд бэлэн үү?"}</h2>
          <p className="text-white/80 text-xl mb-10">{getVal("cta", "subtext")}</p>
          <a href="#" className="inline-block bg-white font-black px-10 py-5 rounded-xl text-lg" style={{ color: primary }}>
            {getVal("cta", "button_text") || "Үнэгүй эхлэх"}
          </a>
        </div>
      </section>

      <Footer name={website.companyName} />
    </div>
  );
}

// ─── Ерөнхий загвар ───────────────────────────────────────────────────────────

function GenericPreview({ website, template, getVal }: PreviewProps) {
  return (
    <div className="min-h-screen bg-white font-sans p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{website.companyName}</h1>
      {template.sections.map((sec) => (
        <section key={sec.id} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{sec.name}</h2>
          {sec.fields.map((field) => {
            const val = getVal(sec.id, field.id);
            if (!val) return null;
            return (
              <div key={field.id} className="mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{field.label}</p>
                {field.type === "image" ? (
                  <img src={val} alt={field.label} className="max-h-48 rounded-lg" />
                ) : (
                  <p className="text-gray-700">{val}</p>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

function Footer({ name, dark }: { name: string; dark?: boolean }) {
  return (
    <footer className={`py-8 px-8 text-center text-sm ${dark ? "bg-stone-900 text-stone-500" : "bg-gray-50 text-gray-400 border-t border-gray-100"}`}>
      © {new Date().getFullYear()} {name}. Бүх эрх хуулиар хамгаалагдсан.
    </footer>
  );
}
