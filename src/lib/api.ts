import { Template, Website, SuperAdminUser, TemplateComponent } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Templates (read-only — managed by Super Admin) ───────────────────────────

export function getTemplates(): Promise<Template[]> {
  return request<Template[]>("/templates");
}

export function getTemplate(id: string): Promise<Template> {
  return request<Template>(`/templates/${id}`);
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function getUsers(): Promise<SuperAdminUser[]> {
  return request<SuperAdminUser[]>("/users");
}

export function getUserByEmail(email: string): Promise<SuperAdminUser | null> {
  return getUsers().then((users) => users.find((u) => u.email === email) ?? null);
}

// ─── Websites ─────────────────────────────────────────────────────────────────

export function getWebsites(userId?: string): Promise<Website[]> {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return request<Website[]>(`/websites${qs}`);
}

export function getWebsite(id: string): Promise<Website> {
  return request<Website>(`/websites/${id}`);
}

export function createWebsite(data: {
  name: string;
  templateId: string;
  userId: string;
  components: TemplateComponent[];
}): Promise<Website> {
  return request<Website>("/websites", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateWebsite(
  id: string,
  data: { name?: string; components?: TemplateComponent[] }
): Promise<Website> {
  return request<Website>(`/websites/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function publishWebsite(id: string): Promise<void> {
  return request<void>(`/websites/${id}/publish`, { method: "POST" });
}

export function deleteWebsite(id: string): Promise<void> {
  return request<void>(`/websites/${id}`, { method: "DELETE" });
}
