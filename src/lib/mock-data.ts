import { Template } from "./types";

export const MOCK_TEMPLATES: Template[] = [
  {
    id: "tpl-business-01",
    name: "Corporate Pro",
    description:
      "Clean and professional layout for corporate businesses. Includes hero, services, about, team, and contact sections.",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    category: "business",
    createdAt: "2024-01-10",
    sections: [
      {
        id: "hero",
        name: "Дэд хэсэг",
        description: "The main banner at the top of the page",
        fields: [
          {
            id: "headline",
            label: "Гарчиг",
            type: "text",
            placeholder: "Бид ирээдүйг бүтээнэ",
            required: true,
          },
          {
            id: "subheadline",
            label: "Дэд гарчиг",
            type: "textarea",
            placeholder: "Бизнесийн өсөлт болон инновацийн найдвартай түнш.",
          },
          {
            id: "cta_text",
            label: "Товчлуурын текст",
            type: "text",
            placeholder: "Эхлэх",
            defaultValue: "Эхлэх",
          },
          { id: "background_image", label: "Арын зураг", type: "image" },
          {
            id: "background_color",
            label: "Арын өнгө",
            type: "color",
            defaultValue: "#1e3a5f",
          },
        ],
      },
      {
        id: "about",
        name: "Бидний тухай",
        description: "Компанийнхаа тухай ярина уу",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Манай компанийн тухай",
            required: true,
          },
          {
            id: "description",
            label: "Компанийн тайлбар",
            type: "richtext",
            placeholder: "Бид туршлагатай мэргэжилтнүүдийн баг...",
            required: true,
          },
          { id: "image", label: "Зураг", type: "image" },
          {
            id: "founded_year",
            label: "Үүсгэн байгуулсан он",
            type: "text",
            placeholder: "2010",
          },
          {
            id: "employee_count",
            label: "Ажилтны тоо",
            type: "text",
            placeholder: "50+",
          },
        ],
      },
      {
        id: "services",
        name: "Үйлчилгээ",
        description: "Санал болгож буй үйлчилгээгээ харуулна уу",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Манай үйлчилгээ",
            required: true,
          },
          {
            id: "service1_name",
            label: "Үйлчилгээ 1 нэр",
            type: "text",
            placeholder: "Зөвлөгөө",
          },
          {
            id: "service1_desc",
            label: "Үйлчилгээ 1 тайлбар",
            type: "textarea",
            placeholder: "Бизнесийг өсгөх мэргэжлийн зөвлөгөө.",
          },
          {
            id: "service2_name",
            label: "Үйлчилгээ 2 нэр",
            type: "text",
            placeholder: "Хөгжүүлэлт",
          },
          {
            id: "service2_desc",
            label: "Үйлчилгээ 2 тайлбар",
            type: "textarea",
            placeholder: "Хэрэгцээнд тохирсон шийдлүүд.",
          },
          {
            id: "service3_name",
            label: "Үйлчилгээ 3 нэр",
            type: "text",
            placeholder: "Дэмжлэг",
          },
          {
            id: "service3_desc",
            label: "Үйлчилгээ 3 тайлбар",
            type: "textarea",
            placeholder: "Тасралтгүй дэмжлэг үйлчилгээ.",
          },
        ],
      },
      {
        id: "contact",
        name: "Холбоо барих",
        description: "Зочдод тантай холбогдох боломж олго",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Холбоо барих",
            required: true,
          },
          {
            id: "address",
            label: "Хаяг",
            type: "text",
            placeholder: "Улаанбаатар, Монгол",
          },
          {
            id: "phone",
            label: "Утас",
            type: "text",
            placeholder: "+976 9900-0000",
          },
          {
            id: "email",
            label: "Имэйл",
            type: "text",
            placeholder: "info@company.mn",
          },
          { id: "map_url", label: "Google Maps холбоос", type: "url" },
        ],
      },
    ],
  },
  {
    id: "tpl-restaurant-01",
    name: "Бистро",
    description:
      "Ресторан, кафе болон хоолны бизнест зориулсан дулаахан загвар.",
    thumbnail:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    category: "restaurant",
    createdAt: "2024-02-05",
    sections: [
      {
        id: "hero",
        name: "Hero хэсэг",
        description: "Ресторантай холбоотой гол баннер",
        fields: [
          {
            id: "restaurant_name",
            label: "Рестораны нэр",
            type: "text",
            placeholder: "Алтан Гэрэл",
            required: true,
          },
          {
            id: "tagline",
            label: "Уриа үг",
            type: "text",
            placeholder: "Амттай хоол, гайхамшигт дурсамж.",
          },
          { id: "hero_image", label: "Hero зураг", type: "image" },
          { id: "reservation_url", label: "Захиалгын холбоос", type: "url" },
        ],
      },
      {
        id: "menu",
        name: "Цэсний онцлох хоолнууд",
        description: "Онцгой хоолнуудаа харуулна уу",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Манай цэс",
            required: true,
          },
          {
            id: "dish1_name",
            label: "Хоол 1 нэр",
            type: "text",
            placeholder: "Шарсан загас",
          },
          {
            id: "dish1_price",
            label: "Хоол 1 үнэ",
            type: "text",
            placeholder: "25,000₮",
          },
          { id: "dish1_image", label: "Хоол 1 зураг", type: "image" },
          {
            id: "dish2_name",
            label: "Хоол 2 нэр",
            type: "text",
            placeholder: "Трюфель паста",
          },
          {
            id: "dish2_price",
            label: "Хоол 2 үнэ",
            type: "text",
            placeholder: "22,000₮",
          },
          { id: "dish2_image", label: "Хоол 2 зураг", type: "image" },
          {
            id: "dish3_name",
            label: "Хоол 3 нэр",
            type: "text",
            placeholder: "Үхрийн мах",
          },
          {
            id: "dish3_price",
            label: "Хоол 3 үнэ",
            type: "text",
            placeholder: "42,000₮",
          },
          { id: "dish3_image", label: "Хоол 3 зураг", type: "image" },
        ],
      },
      {
        id: "about",
        name: "Манай түүх",
        description: "Рестораны түүхийг хуваалцана уу",
        fields: [
          {
            id: "title",
            label: "Гарчиг",
            type: "text",
            placeholder: "Манай түүх",
            required: true,
          },
          {
            id: "story",
            label: "Түүх",
            type: "richtext",
            placeholder:
              "2005 онд үүссэн манай ресторан хоолны хайраас төрсөн...",
          },
          {
            id: "chef_name",
            label: "Ерөнхий тогооч",
            type: "text",
            placeholder: "Тогооч Болд",
          },
          { id: "chef_image", label: "Тогоочийн зураг", type: "image" },
        ],
      },
      {
        id: "contact",
        name: "Бидэнд зочлоорой",
        description: "Байршил болон цагийн хуваарь",
        fields: [
          {
            id: "address",
            label: "Хаяг",
            type: "text",
            placeholder: "Улаанбаатар, Сүхбаатар дүүрэг",
          },
          {
            id: "hours",
            label: "Ажлын цаг",
            type: "textarea",
            placeholder: "Даваа-Баасан: 11:00-22:00\nБямба-Ням: 10:00-23:00",
          },
          {
            id: "phone",
            label: "Утас",
            type: "text",
            placeholder: "+976 9911-2233",
          },
          {
            id: "email",
            label: "Захиалгын имэйл",
            type: "text",
            placeholder: "info@bistro.mn",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-portfolio-01",
    name: "Шоукэйс",
    description:
      "Бүтээлч хүмүүс, дизайнерууд болон агентлагуудад зориулсан цэвэрхэн портфолио загвар.",
    thumbnail:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&q=80",
    category: "portfolio",
    isPremium: true,
    createdAt: "2024-03-12",
    sections: [
      {
        id: "hero",
        name: "Танилцуулга",
        description: "Хувийн эсвэл агентлагийн танилцуулга",
        fields: [
          {
            id: "name",
            label: "Нэр / Студийн нэр",
            type: "text",
            placeholder: "Бат Студио",
            required: true,
          },
          {
            id: "role",
            label: "Мэргэжил",
            type: "text",
            placeholder: "UI/UX Дизайнер & Брэнд стратегич",
          },
          {
            id: "bio",
            label: "Товч танилцуулга",
            type: "textarea",
            placeholder:
              "Би гоо үзэмжтэй бөгөөд функциональ дижитал туршлага бүтээдэг.",
          },
          { id: "profile_image", label: "Профайл зураг", type: "image" },
          {
            id: "accent_color",
            label: "Өнгөний аялал",
            type: "color",
            defaultValue: "#6366f1",
          },
        ],
      },
      {
        id: "work",
        name: "Портфолио бүтээлүүд",
        description: "Таны төслүүд болон кейс стадиуд",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Сонгосон бүтээлүүд",
            required: true,
          },
          {
            id: "project1_name",
            label: "Төсөл 1 нэр",
            type: "text",
            placeholder: "Брэнд таних тэмдэг — TechCo",
          },
          {
            id: "project1_desc",
            label: "Төсөл 1 тайлбар",
            type: "textarea",
            placeholder:
              "Лого, өнгө, хэвлэл зэргийг агуулсан брэндийн шинэчлэл.",
          },
          { id: "project1_image", label: "Төсөл 1 зураг", type: "image" },
          { id: "project1_url", label: "Төсөл 1 холбоос", type: "url" },
          {
            id: "project2_name",
            label: "Төсөл 2 нэр",
            type: "text",
            placeholder: "Мобайл апп — HealthTrack",
          },
          {
            id: "project2_desc",
            label: "Төсөл 2 тайлбар",
            type: "textarea",
            placeholder: "Эрүүл мэндийн апп-д зориулсан UX дизайн.",
          },
          { id: "project2_image", label: "Төсөл 2 зураг", type: "image" },
          { id: "project2_url", label: "Төсөл 2 холбоос", type: "url" },
        ],
      },
      {
        id: "skills",
        name: "Ур чадвар & Үйлчилгээ",
        description: "Таны санал болгож буй зүйлс",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Би юу хийдэг вэ",
          },
          {
            id: "skill1",
            label: "Ур чадвар 1",
            type: "text",
            placeholder: "Брэнд таних тэмдэг",
          },
          {
            id: "skill2",
            label: "Ур чадвар 2",
            type: "text",
            placeholder: "Вэб дизайн",
          },
          {
            id: "skill3",
            label: "Ур чадвар 3",
            type: "text",
            placeholder: "Хөдөлгөөнт график",
          },
          {
            id: "skill4",
            label: "Ур чадвар 4",
            type: "text",
            placeholder: "UX Судалгаа",
          },
        ],
      },
      {
        id: "contact",
        name: "Холбоо барих",
        description: "Тантай хэрхэн холбогдох вэ",
        fields: [
          {
            id: "email",
            label: "Имэйл",
            type: "text",
            placeholder: "hello@studio.mn",
            required: true,
          },
          { id: "instagram", label: "Instagram холбоос", type: "url" },
          { id: "linkedin", label: "LinkedIn холбоос", type: "url" },
          {
            id: "availability",
            label: "Боломжит хугацаа",
            type: "text",
            placeholder: "2024 оны 6-р сараас чөлөөт ажлын захиалга авч байна",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-landing-01",
    name: "LaunchPad",
    description:
      "Бүтээгдэхүүн, стартап болон SaaS-д зориулсан өндөр хөрвүүлэлттэй нүүр хуудас.",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    category: "landing",
    createdAt: "2024-04-01",
    sections: [
      {
        id: "hero",
        name: "Hero хэсэг",
        description: "Гол үнэ цэнийн санал",
        fields: [
          {
            id: "headline",
            label: "Гол гарчиг",
            type: "text",
            placeholder: "Хурдан бүтээ. Ухаалгаар өсгө.",
            required: true,
          },
          {
            id: "subtext",
            label: "Дэмжих текст",
            type: "textarea",
            placeholder:
              "Багуудад бүтээгдэхүүнээ 10 дахин хурдан бүтээж нийтлэхэд туслах бүх нэгдсэн платформ.",
          },
          {
            id: "cta_primary",
            label: "Үндсэн товчлуур",
            type: "text",
            placeholder: "Үнэгүй туршаад үз",
            defaultValue: "Үнэгүй туршаад үз",
          },
          {
            id: "cta_secondary",
            label: "Дэд товчлуур",
            type: "text",
            placeholder: "Демо үзэх",
          },
          { id: "hero_image", label: "Бүтээгдэхүүний зураг", type: "image" },
          {
            id: "primary_color",
            label: "Үндсэн өнгө",
            type: "color",
            defaultValue: "#7c3aed",
          },
        ],
      },
      {
        id: "features",
        name: "Онцлог шинжүүд",
        description: "Бүтээгдэхүүний гол давуу талууд",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Хэрэгтэй бүх зүйл",
            required: true,
          },
          {
            id: "feature1_title",
            label: "Онцлог 1 гарчиг",
            type: "text",
            placeholder: "Аянгын хурдтай",
          },
          {
            id: "feature1_desc",
            label: "Онцлог 1 тайлбар",
            type: "textarea",
            placeholder: "Секундын дотор байршуул.",
          },
          {
            id: "feature2_title",
            label: "Онцлог 2 гарчиг",
            type: "text",
            placeholder: "Аюулгүй байдал",
          },
          {
            id: "feature2_desc",
            label: "Онцлог 2 тайлбар",
            type: "textarea",
            placeholder: "Корпорацийн түвшний аюулгүй байдал.",
          },
          {
            id: "feature3_title",
            label: "Онцлог 3 гарчиг",
            type: "text",
            placeholder: "Багийн хамтын ажиллагаа",
          },
          {
            id: "feature3_desc",
            label: "Онцлог 3 тайлбар",
            type: "textarea",
            placeholder: "Бодит цаг дээр хамтран ажиллана уу.",
          },
        ],
      },
      {
        id: "pricing",
        name: "Үнийн мэдээлэл",
        description: "Таны үнийн төлөвлөгөөнүүд",
        fields: [
          {
            id: "title",
            label: "Хэсгийн гарчиг",
            type: "text",
            placeholder: "Энгийн үнэ",
          },
          {
            id: "plan1_name",
            label: "Төлөвлөгөө 1 нэр",
            type: "text",
            placeholder: "Эхлэгч",
          },
          {
            id: "plan1_price",
            label: "Төлөвлөгөө 1 үнэ",
            type: "text",
            placeholder: "9,000₮/сар",
          },
          {
            id: "plan1_features",
            label: "Төлөвлөгөө 1 онцлогууд",
            type: "textarea",
            placeholder: "5 төсөл\n10GB хадгалалт\nИмэйл дэмжлэг",
          },
          {
            id: "plan2_name",
            label: "Төлөвлөгөө 2 нэр",
            type: "text",
            placeholder: "Про",
          },
          {
            id: "plan2_price",
            label: "Төлөвлөгөө 2 үнэ",
            type: "text",
            placeholder: "29,000₮/сар",
          },
          {
            id: "plan2_features",
            label: "Төлөвлөгөө 2 онцлогууд",
            type: "textarea",
            placeholder: "Хязгааргүй төсөл\n100GB хадгалалт\nТэргүүлэх дэмжлэг",
          },
        ],
      },
      {
        id: "cta",
        name: "Дуудлага хэсэг",
        description: "Хамгийн доод хөрвүүлэх хэсэг",
        fields: [
          {
            id: "headline",
            label: "CTA гарчиг",
            type: "text",
            placeholder: "Эхлэхэд бэлэн үү?",
            required: true,
          },
          {
            id: "subtext",
            label: "CTA дэд текст",
            type: "text",
            placeholder:
              "Аль хэдийн манай платформ ашигладаг 10,000+ багтай нэгдээрэй.",
          },
          {
            id: "button_text",
            label: "Товчлуурын текст",
            type: "text",
            placeholder: "Үнэгүй эхлэх",
            defaultValue: "Үнэгүй эхлэх",
          },
        ],
      },
    ],
  },
];

export async function fetchTemplates(): Promise<Template[]> {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_TEMPLATES;
}

export async function fetchTemplateById(id: string): Promise<Template | null> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_TEMPLATES.find((t) => t.id === id) ?? null;
}
