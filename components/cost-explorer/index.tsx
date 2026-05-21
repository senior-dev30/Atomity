"use client";

import { useCallback, useState } from "react";
import { Cluster, Namespace, ResourceMetrics, clusters as staticClusters, total } from "@/lib/data";
import { DrillState, Resource } from "./types";
import { tokens } from "@/lib/tokens";
import { DataTable } from "./DataTable";
import { BarChart } from "./BarChart";

const getItems = (s: DrillState, clusterList: any[]): any[] => {
  if (s.level === "cluster") return clusterList;
  if (s.level === "namespace") return s.cluster!.namespaces;
  return s.namespace!.pods;
};

const stateKey = (s: DrillState) => s.level + (s.cluster?.id ?? "") + (s.namespace?.id ?? "");

const CostExplorer = () => {
  const clusters = staticClusters;

  const [drill, setDrill] = useState<DrillState>({ level: "cluster" });
  const [hovered, setHovered] = useState<string | null>(null);
  const [hovRes, setHovRes] = useState<Resource | null>(null);

  const items = getItems(drill, clusters);
  const key = stateKey(drill);
  const isLeaf = drill.level === "pod";

  const drillDown = useCallback(
    (item: any) => {
      if (drill.level === "cluster") setDrill({ level: "namespace", cluster: item as Cluster });
      else if (drill.level === "namespace")
        setDrill({ level: "pod", cluster: drill.cluster, namespace: item as Namespace });
    },
    [drill]
  );

  return (
    <main className="dashboard-wrap min-h-screen" style={{ background: tokens.colors.bgSecondary }}>
      <div className="mx-auto w-full max-w-4xl space-y-3">
        <section
          aria-label="Cost explorer"
          className="rounded-2xl shadow-lg"
          style={{ background: tokens.colors.bgPrimary }}
        >
          <header
            className="flex flex-wrap items-start justify-between gap-4 px-6 py-4"
            style={{ borderBottom: `1px solid ${tokens.colors.border}` }}
          >
            <div className="flex flex-wrap items-start gap-3">
              <div
                className="rounded-lg px-4 py-1.5 text-sm font-medium"
                style={{
                  border: `1px solid ${tokens.colors.border}`,
                  color: tokens.colors.textSecondary,
                }}
              >
                Last 30 Days
              </div>
            </div>
          </header>
          <section aria-label="Cost chart" className="px-6 pt-4 pb-2">
            <BarChart />
          </section>
          <section aria-label="Cost breakdown table" className="px-6 pb-6">
            <DataTable
              items={items}
              isLeaf={isLeaf}
              hovered={hovered}
              hovRes={hovRes}
              stateKey={key}
              onHover={setHovered}
              onSelect={drillDown}
            />
          </section>
        </section>
        <p className="text-center text-xs" style={{ color: "#6e6e73" }}>
          bottom description
        </p>
      </div>
    </main>
  );
};

export default CostExplorer;
