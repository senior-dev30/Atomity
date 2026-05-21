import { tokens } from "@/lib/tokens";

export type Resource = "cpu" | "ram" | "storage" | "network" | "gpu";

export const RESOURCES: Resource[] = ["cpu", "ram", "storage", "network", "gpu"];

export const RES: Record<Resource, { label: string; color: string }> = {
  cpu: { label: "CPU", color: "#3b82f6" },
  ram: { label: "RAM", color: "#06b6d4" },
  storage: { label: "Storage", color: "#f59e0b" },
  network: { label: "Network", color: "#8b5cf6" },
  gpu: { label: "GPU", color: "#10b981" },
};

export const fmt = (n: number) => "$" + n.toLocaleString();

export const effToken = (e: number): string => {
  if (e < 20) return tokens.colors.accentError;
  if (e < 40) return tokens.colors.accentWarning;
  if (e < 60) return tokens.colors.accentLime;
  return tokens.colors.accentSuccess;
};

export const BAR_MAX_H = 200; // px
