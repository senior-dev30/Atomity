"use client";

import { useState } from "react";
import { clusters as staticClusters } from "@/lib/data";
import { DrillState, Resource } from "./types";
import { RES, RESOURCES } from "@/utils/constants";
import { tokens } from "@/lib/tokens";

const getItems = (s: DrillState, clusterList: any[]): any[] => {
  if (s.level === "cluster") return clusterList;
  if (s.level === "namespace") return s.cluster!.namespaces;
  return s.namespace!.pods;
};

const CostExplorer = () => {
  const clusters = staticClusters;

  const [drill, setDrill] = useState<DrillState>({ level: "cluster" });
  const [hovered, setHovered] = useState<string | null>(null);
  const [hovRes, setHovRes] = useState<Resource | null>(null);

  const items = getItems(drill, clusters);

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
          <section aria-label="Cost breakdown table" className="px-6 pb-6">
            <div className="overflow-x-auto">
              <table className="cost-table" aria-label="Resource cost breakdown">
                <thead>
                  <tr>
                    <th scope="col" className="w-32 py-3 pr-4 text-left" />
                    {RESOURCES.map((r) => (
                      <th
                        key={r}
                        scope="col"
                        className="py-3 pr-4 text-right transition-colors duration-150"
                        style={{ color: hovRes === r ? RES[r].color : undefined }}
                      >
                        {RES[r].label}
                      </th>
                    ))}
                    <th scope="col" className="py-3 pr-4 text-right">
                      Efficiency
                    </th>
                    <th
                      scope="col"
                      className="py-3 text-right font-bold"
                      style={{ color: tokens.colors.textPrimary }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
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
