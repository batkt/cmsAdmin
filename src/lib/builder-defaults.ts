// Shared builder defaults — used by both the builder editor and the preview page
// so the mock-landing preview works on any machine even without localStorage data.

export type SectionType =
  | "navbar"
  | "slider"
  | "hero"
  | "features"
  | "cta"
  | "footer";
export type AnimStyle = "none" | "fade-up" | "slide-left" | "zoom-in";

export interface GlobalTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headingSize: number;
  bodySize: number;
  animation: AnimStyle;
}

export interface Section {
  id: string;
  type: SectionType;
  props: Record<string, string | number | boolean>;
}

export interface PageDef {
  slug: string;
  title: string;
  title_en: string;
}

export const DEFAULT_THEME: GlobalTheme = {
  primaryColor: "#16a34a",
  secondaryColor: "#052e16",
  fontFamily: "Inter",
  headingSize: 48,
  bodySize: 16,
  animation: "fade-up",
};

export const DEFAULT_PROPS: Record<
  SectionType,
  Record<string, string | number | boolean>
> = {
  navbar: {
    logo: "HomePick",
    navlinks:
      "Нүүр|Home|/home\nБидний тухай|About Us|/about\nҮйл ажиллагаа|Services|/services\nХамтран ажиллах|Partnership|/partnership\nМэдээ мэдээлэл|News|/news\nХолбоо барих|Contact|/contact",
    buttons: "Үнэгүй бүртгүүлэх|Register Free|/register|primary",
    bgColor: "#ffffff",
    textColor: "#1e293b",
    showLangSwitch: "true",
  },
  slider: {
    slides: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400|Мөрөөдлийн гэрээ ол|10,000+ объектоос хайж олоорой|Одоо хайх",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400|Тав тухтай амьдрал|Таны хэрэгцээнд нийцсэн байшин|Дэлгэрэнгүй",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400|Найдвартай хөрөнгө оруулалт|Шилдэг байршилд орон сууц|Холбоо барих",
    ].join("\n"),
    slides_en: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400|Find Your Dream Home|Search from 10,000+ properties|Search Now",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400|Comfortable Living|The perfect home for your needs|Learn More",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400|Smart Investment|Premium properties in prime locations|Contact Us",
    ].join("\n"),
    height: "560",
    overlayColor: "#00000060",
    textColor: "#ffffff",
    autoPlay: "true",
    interval: "4000",
  },
  hero: {
    heading: "Мөрөөдлийн гэрээ олоорой",
    heading_en: "Find Your Dream Home",
    subheading: "Монголын шилдэг үл хөдлөхийн платформ",
    subheading_en: "Mongolia's Leading Real Estate Platform",
    body: "10,000+ объектоос хамгийн тохиромжтойг нь олоорой. Худалдаа, түрээс, хөрөнгө оруулалт.",
    body_en:
      "Browse 10,000+ properties to find the perfect one for you. Buy, rent or invest with confidence.",
    buttons:
      "Одоо хайх|Search Now|/search|primary\nДэлгэрэнгүй|Learn More|/about|outline",
    bgImage: "",
    bgOverlay: "#14532d99",
    bgColor: "#166534",
    textColor: "#ffffff",
    align: "center",
  },
  features: {
    title: "Яагаад HomePick вэ?",
    title_en: "Why Choose HomePick?",
    subtitle: "Таны хэрэгцээнд нийцсэн бүх боломж нэг дороос",
    subtitle_en: "Everything you need in one place",
    bgColor: "#f8fafc",
    bgImage: "",
    bgOverlay: "#f8fafc99",
    titleColor: "#0f172a",
    textColor: "#64748b",
    items:
      "🔍 Ухаалаг хайлт|Байршил, үнэ, хэмжээгээр нарийвчлан хайх\n📸 Виртуал аялал|Гэрийг биечлэн очилгүйгээр харах\n🤝 Итгэмжлэгдсэн агентууд|Баталгаажсан мэргэжилтнүүд\n📊 Зах зээлийн шинжилгээ|Бодит цагийн үнийн мэдээлэл\n🔔 Шуурхай мэдэгдэл|Шинэ объект гарахад тэр дор мэдэгдэнэ\n💰 Зээлийн тооцоолуур|Ипотекийн зээлээ урьдчилан тооцоол",
    items_en:
      "🔍 Smart Search|Filter by location, price, size and more\n📸 Virtual Tours|View properties without visiting in person\n🤝 Trusted Agents|Verified, experienced professionals\n📊 Market Analytics|Real-time price data and market trends\n🔔 Instant Alerts|Get notified when new matches appear\n💰 Loan Calculator|Estimate your monthly mortgage payments",
  },
  cta: {
    heading: "Өнөөдөр эхлэцгээе!",
    heading_en: "Get Started Today!",
    subheading:
      "Монголын хамгийн том үл хөдлөхийн платформд нэгдэж, мөрөөдлийн гэрээ олоорой.",
    subheading_en:
      "Join Mongolia's largest real estate platform and find your dream property.",
    buttons:
      "Үнэгүй бүртгүүлэх|Register Free|/register|primary\nОбъектууд харах|Browse Properties|/properties|outline",
    bgImage: "",
    bgOverlay: "#052e16cc",
    bgColor: "#052e16",
    textColor: "#ffffff",
  },
  footer: {
    brand: "HomePick",
    links: "Нууцлал,Нөхцөл,Холбоо барих,Бидний тухай",
    links_en: "Privacy,Terms,Contact,About Us",
    copyright: "© 2024 HomePick. Бүх эрх хуулиар хамгаалагдсан.",
    copyright_en: "© 2024 HomePick. All rights reserved.",
    bgColor: "#052e16",
    textColor: "#86efac",
  },
};

export const DEFAULT_PAGE_LIST: PageDef[] = [
  { slug: "home", title: "Нүүр", title_en: "Home" },
  { slug: "about", title: "Бидний тухай", title_en: "About Us" },
  { slug: "services", title: "Үйл ажиллагаа", title_en: "Services" },
  { slug: "partnership", title: "Хамтран ажиллах", title_en: "Partnership" },
  { slug: "news", title: "Мэдээ мэдээлэл", title_en: "News" },
  { slug: "contact", title: "Холбоо барих", title_en: "Contact" },
];

export function defaultSectionsForPage(
  slug: string,
  customTitle?: string,
): Section[] {
  const pageTitle =
    customTitle ??
    DEFAULT_PAGE_LIST.find((p) => p.slug === slug)?.title ??
    slug;

  const nav: Section = {
    id: `nav-${slug}`,
    type: "navbar",
    props: { ...DEFAULT_PROPS.navbar },
  };
  const footer: Section = {
    id: `footer-${slug}`,
    type: "footer",
    props: { ...DEFAULT_PROPS.footer },
  };

  if (slug === "home") {
    return [
      nav,
      {
        id: `slider-${slug}`,
        type: "slider",
        props: { ...DEFAULT_PROPS.slider },
      },
      {
        id: `feat-${slug}`,
        type: "features",
        props: { ...DEFAULT_PROPS.features },
      },
      { id: `cta-${slug}`, type: "cta", props: { ...DEFAULT_PROPS.cta } },
      footer,
    ];
  }
  return [
    nav,
    {
      id: `hero-${slug}`,
      type: "hero",
      props: { ...DEFAULT_PROPS.hero, heading: pageTitle },
    },
    footer,
  ];
}

/** Build the full default allPages map for the mock-landing project */
export function buildDefaultAllPages(): Record<string, Section[]> {
  const result: Record<string, Section[]> = {};
  for (const page of DEFAULT_PAGE_LIST) {
    result[page.slug] = defaultSectionsForPage(page.slug);
  }
  return result;
}
