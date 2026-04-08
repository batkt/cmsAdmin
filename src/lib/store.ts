"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Website, AdminUser, SectionContent } from "./types";

// ─── Theme Store ──────────────────────────────────────────────────────────────

interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    { name: "cms-theme" }
  )
);

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const MOCK_ADMIN: AdminUser = {
  id: "admin-001",
  name: "Админ",
  email: "admin@company.mn",
  role: "admin",
  companyName: "Манай компани",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 600));
        if (email === "admin@company.mn" && password === "password123") {
          set({ user: MOCK_ADMIN });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    { name: "cms-auth" }
  )
);

// ─── Websites Store ───────────────────────────────────────────────────────────

interface WebsitesState {
  websites: Website[];
  createWebsite: (data: { name: string; templateId: string; companyName: string }) => Website;
  updateWebsite: (id: string, updates: Partial<Website>) => void;
  updateSectionContent: (websiteId: string, sectionId: string, values: Record<string, string>) => void;
  publishWebsite: (id: string) => void;
  archiveWebsite: (id: string) => void;
  deleteWebsite: (id: string) => void;
  getWebsite: (id: string) => Website | undefined;
}

export const useWebsitesStore = create<WebsitesState>()(
  persist(
    (set, get) => ({
      websites: [],

      createWebsite: (data) => {
        const website: Website = {
          id: `site-${Date.now()}`,
          name: data.name,
          templateId: data.templateId,
          companyName: data.companyName,
          status: "draft",
          content: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ websites: [website, ...s.websites] }));
        return website;
      },

      updateWebsite: (id, updates) => {
        set((s) => ({
          websites: s.websites.map((w) =>
            w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
          ),
        }));
      },

      updateSectionContent: (websiteId, sectionId, values) => {
        set((s) => ({
          websites: s.websites.map((w) => {
            if (w.id !== websiteId) return w;
            const existing = w.content.find((c) => c.sectionId === sectionId);
            let newContent: SectionContent[];
            if (existing) {
              newContent = w.content.map((c) =>
                c.sectionId === sectionId ? { ...c, values: { ...c.values, ...values } } : c
              );
            } else {
              newContent = [...w.content, { sectionId, values }];
            }
            return { ...w, content: newContent, updatedAt: new Date().toISOString() };
          }),
        }));
      },

      publishWebsite: (id) => {
        set((s) => ({
          websites: s.websites.map((w) =>
            w.id === id
              ? { ...w, status: "published", publishedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
              : w
          ),
        }));
      },

      archiveWebsite: (id) => {
        set((s) => ({
          websites: s.websites.map((w) =>
            w.id === id ? { ...w, status: "archived", updatedAt: new Date().toISOString() } : w
          ),
        }));
      },

      deleteWebsite: (id) => {
        set((s) => ({ websites: s.websites.filter((w) => w.id !== id) }));
      },

      getWebsite: (id) => get().websites.find((w) => w.id === id),
    }),
    { name: "cms-websites" }
  )
);
