export type Resource = "cpu" | "ram" | "storage" | "network" | "gpu";

export const RESOURCES: Resource[] = ["cpu", "ram", "storage", "network", "gpu"];

export const RES: Record<Resource, { label: string; color: string }> = {
  cpu: { label: "CPU", color: "#3b82f6" },
  ram: { label: "RAM", color: "#06b6d4" },
  storage: { label: "Storage", color: "#f59e0b" },
  network: { label: "Network", color: "#8b5cf6" },
  gpu: { label: "GPU", color: "#10b981" },
};
