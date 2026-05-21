import type { Cluster, Namespace, Pod } from "@/lib/data";

export type Level = "cluster" | "namespace" | "pod";

export interface DrillState {
  level: Level;
  cluster?: Cluster;
  namespace?: Namespace;
}

export type Resource = "cpu" | "ram" | "storage" | "network" | "gpu";

export type AnyNode = Cluster | Namespace | Pod;
