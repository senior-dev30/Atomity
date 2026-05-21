"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { DrillState, Level } from "./types";

interface Props {
  drill: DrillState;
  onDrillTo: (level: Level) => void;
}

const AGGREGATION_LABEL: Record<Level, string> = {
  cluster: "Cluster",
  namespace: "Namespace",
  pod: "Pod",
};

/** Active pill + "Aggregated by" card stacked as one column unit */
const ActivePill = ({ label, level }: { label: string; level: Level }) => {
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="breadcrumb-segment breadcrumb-segment--active">{label}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={level}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="hidden sm:block rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-sm"
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
          }}
          aria-hidden="true"
        >
          <span className="block" style={{ color: "var(--color-text-muted)" }}>
            Aggregated by:
          </span>
          <span className="block font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {AGGREGATION_LABEL[level]}
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export const Breadcrumb = ({ drill, onDrillTo }: Props) => {
  return (
    <nav aria-label="Drill-down path" className="flex flex-wrap items-start gap-1.5">
      {drill.level === "cluster" ? (
        <ActivePill label="Cluster" level="cluster" />
      ) : (
        <button
          className="breadcrumb-segment breadcrumb-segment--link"
          onClick={() => onDrillTo("cluster")}
          onKeyDown={(e) => e.key === "Enter" && onDrillTo("cluster")}
        >
          Cluster
        </button>
      )}

      <AnimatePresence>
        {drill.cluster && (
          <motion.span
            key="cluster-crumb"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="flex items-start gap-1.5"
          >
            <span
              className="breadcrumb-segment breadcrumb-segment--link cursor-default select-none"
              style={{ paddingInline: "0.25rem" }}
            >
              ›
            </span>
            {drill.level === "namespace" ? (
              <ActivePill label={drill.cluster.name} level="namespace" />
            ) : (
              <button
                className="breadcrumb-segment breadcrumb-segment--link"
                onClick={() => onDrillTo("namespace")}
                onKeyDown={(e) => e.key === "Enter" && onDrillTo("namespace")}
              >
                {drill.cluster.name}
              </button>
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {drill.namespace && (
          <motion.span
            key="namespace-crumb"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            className="flex items-start gap-1.5"
          >
            <span
              className="breadcrumb-segment breadcrumb-segment--link cursor-default select-none"
              style={{ paddingInline: "0.25rem" }}
            >
              ›
            </span>
            <ActivePill label={drill.namespace.name} level="pod" />
          </motion.span>
        )}
      </AnimatePresence>
    </nav>
  );
}
