// ─── Template types (from Super Admin) ───────────────────────────────────────

export type FieldType = "text" | "textarea" | "image" | "url" | "color" | "richtext";

export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "business" | "portfolio" | "restaurant" | "ecommerce" | "landing";
  sections: TemplateSection[];
  createdAt: string;
  isPremium?: boolean;
}

// ─── Website (Admin-created) ──────────────────────────────────────────────────

export type WebsiteStatus = "draft" | "published" | "archived";

export interface SectionContent {
  sectionId: string;
  values: Record<string, string>;
}

export interface Website {
  id: string;
  name: string;
  templateId: string;
  status: WebsiteStatus;
  domain?: string;
  content: SectionContent[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  companyName: string;
  companyLogo?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  companyName: string;
  avatar?: string;
}
