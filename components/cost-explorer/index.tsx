"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cluster, Namespace, ResourceMetrics, clusters as staticClusters, total } from "@/lib/data";
import { DrillState, Resource } from "./types";
import { effToken, fmt, RES, RESOURCES } from "@/utils/constants";
import { tokens } from "@/lib/tokens";

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
                <AnimatePresence mode="wait">
                  <motion.tbody
                    key={key + "-tbody"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {items.map((item, idx) => {
                      const tot = total(item);
                      const isHov = hovered === item.id;
                      const color = effToken(item.efficiency);

                      return (
                        <motion.tr
                          key={item.id}
                          className="cursor-pointer"
                          style={{ background: isHov ? "var(--color-bg-secondary)" : undefined }}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          onMouseEnter={() => setHovered(item.id)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => !isLeaf && drillDown(item)}
                          onKeyDown={(e) =>
                            !isLeaf && (e.key === "Enter" || e.key === " ") && drillDown(item)
                          }
                          tabIndex={isLeaf ? -1 : 0}
                          aria-label={isLeaf ? undefined : `Drill into ${item.name}`}
                        >
                          <td
                            className="py-3 pr-4 font-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {item.name}
                          </td>

                          {RESOURCES.map((res) => {
                            const v = (item as unknown as ResourceMetrics)[res];
                            return (
                              <td
                                key={res}
                                className="py-3 pr-4 text-right tabular-nums"
                                style={{
                                  color:
                                    hovRes === res ? RES[res].color : "var(--color-text-secondary)",
                                  fontWeight: hovRes === res ? 600 : 400,
                                  opacity: hovRes && hovRes !== res ? 0.25 : 1,
                                }}
                              >
                                {fmt(v)}
                              </td>
                            );
                          })}

                          <td
                            className="py-3 pr-4 text-right font-semibold tabular-nums"
                            style={{ color }}
                          >
                            {item.efficiency}%
                          </td>

                          <td
                            className="py-3 text-right font-bold tabular-nums"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {fmt(tot)}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </motion.tbody>
                </AnimatePresence>
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
