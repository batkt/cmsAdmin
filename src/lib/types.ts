// ─── Matches Super Admin data model exactly ───────────────────────────────────

export interface ComponentImage {
  id: string;
  url: string;
  alt: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface GridItem {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  colSpan?: number;
}

export interface NavLinks {
  home: string;
  about: string;
  services: string;
  contact: string;
}

export interface FooterLinks {
  privacy: string;
  terms: string;
  contact: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface ComponentContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  images?: ComponentImage[];
  navLinks?: NavLinks;
  footerLinks?: FooterLinks;
  copyright?: string;
  contactInfo?: ContactInfo;
  services?: string[];
  gridItems?: GridItem[];
}

export interface ComponentStyles {
  backgroundColor?: string;
  textColor?: string;
  headingColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  linkColor?: string;
  borderColor?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
}

export type ComponentType =
  | "home"
  | "about"
  | "service"
  | "contact"
  | "header"
  | "footer"
  | "card"
  | "text"
  | "gif"
  | "grid"
  | "image"
  | "news"
  | "rental"
  | "jobs"
  | "contact-form"
  | "chatbot";

export interface TemplateComponent {
  id: string;
  type: ComponentType;
  content: ComponentContent;
  styles: ComponentStyles;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  rating: number;
  downloads: number;
  thumbnail?: string;
  components: TemplateComponent[];
}

// ─── Website (created by admin, stored in super admin backend) ────────────────

export type WebsiteStatus = "draft" | "published";

export interface Website {
  id: string;
  name: string;
  templateId: string;
  userId: string;
  domain?: string;
  status: WebsiteStatus;
  components: TemplateComponent[]; // customized copy of template components
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ─── Super Admin User (the admin account in super admin's system) ─────────────

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  domain: string;
  status: "active" | "inactive";
  createdAt: string;
}
