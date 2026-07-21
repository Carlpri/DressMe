import { createContext, useContext, ReactNode } from "react";
import { usePublicSiteSettings, type SiteSettings } from "../hooks/useSiteSettings";

interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: Error | null;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data: settings, isLoading, error } = usePublicSiteSettings();

  return (
    <SiteSettingsContext.Provider value={{ settings: settings ?? null, isLoading, error }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettingsContext() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettingsContext must be used within a SiteSettingsProvider");
  }
  return context;
}
