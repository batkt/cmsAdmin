"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SuperAdminUser, Website, TemplateComponent } from "./types";
import * as api from "./api";

// ─── Auth Store ───────────────────────────────────────────────────────────────
// Admin logs in by matching their email against super admin's user list.
// No password is stored in the super admin system — email is the identity.

interface AuthState {
  user: SuperAdminUser | null;
  authError: string;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      authError: "",
      login: async (email) => {
        set({ authError: "" });
        try {
          const user = await api.getUserByEmail(email);
          if (user && user.status === "active") {
            set({ user });
            return true;
          }
          set({ authError: user ? "Your account is inactive." : "No account found with that email." });
          return false;
        } catch {
          set({ authError: "Cannot reach server. Check that the super admin server is running." });
          return false;
        }
      },
      logout: () => set({ user: null }),
    }),
    { name: "cms-auth" }
  )
);

// ─── Websites Store ───────────────────────────────────────────────────────────

interface WebsitesState {
  websites: Website[];
  loading: boolean;
  fetchWebsites: (userId: string) => Promise<void>;
  createWebsite: (data: { name: string; templateId: string; userId: string; components: TemplateComponent[] }) => Promise<Website>;
  updateComponents: (id: string, components: TemplateComponent[]) => Promise<void>;
  publishWebsite: (id: string) => Promise<void>;
  deleteWebsite: (id: string) => Promise<void>;
  getWebsite: (id: string) => Website | undefined;
}

export const useWebsitesStore = create<WebsitesState>()(
  persist(
    (set, get) => ({
      websites: [],
      loading: false,

      fetchWebsites: async (userId) => {
        set({ loading: true });
        try {
          const websites = await api.getWebsites(userId);
          set({ websites, loading: false });
        } catch {
          set({ loading: false });
        }
      },

      createWebsite: async (data) => {
        const website = await api.createWebsite(data);
        set((s) => ({ websites: [website, ...s.websites] }));
        return website;
      },

      updateComponents: async (id, components) => {
        const updated = await api.updateWebsite(id, { components });
        set((s) => ({
          websites: s.websites.map((w) => (w.id === id ? updated : w)),
        }));
      },

      publishWebsite: async (id) => {
        await api.publishWebsite(id);
        set((s) => ({
          websites: s.websites.map((w) =>
            w.id === id
              ? { ...w, status: "published" as const, publishedAt: new Date().toISOString() }
              : w
          ),
        }));
      },

      deleteWebsite: async (id) => {
        await api.deleteWebsite(id);
        set((s) => ({ websites: s.websites.filter((w) => w.id !== id) }));
      },

      getWebsite: (id) => get().websites.find((w) => w.id === id),
    }),
    { name: "cms-websites" }
  )
);
