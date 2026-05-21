"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { total, type ResourceMetrics } from "@/lib/data";
import { effToken, fmt, RES, RESOURCES } from "@/utils/constants";
import type { AnyNode, Resource } from "./types";

interface Props {
  items: AnyNode[];
  isLeaf: boolean;
  hovered: string | null;
  hovRes: Resource | null;
  stateKey: string;
  onHover: (id: string | null) => void;
  onSelect: (item: AnyNode) => void;
}

export const DataTable = ({ items, isLeaf, hovered, hovRes, stateKey, onHover, onSelect }: Props) => {
  const reduced = useReducedMotion();

  return (
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
              style={{ color: "var(--color-text-primary)" }}
            >
              Total
            </th>
          </tr>
        </thead>

        <AnimatePresence mode="wait">
          <motion.tbody
            key={stateKey + "-tbody"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.1, ease: "easeIn" } }}
            transition={{ duration: reduced ? 0 : 0.15 }}
          >
            {items.map((item, idx) => {
              const tot = total(item);
              const isHov = hovered === item.id;
              const color = effToken(item.efficiency);

              return (
                <motion.tr
                  key={item.id}
                  className={!isLeaf ? "cursor-pointer" : ""}
                  style={{ background: isHov ? "var(--color-bg-secondary)" : undefined }}
                  initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduced ? 0 : Math.min(idx, 7) * 0.045,
                    duration: 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => onHover(item.id)}
                  onMouseLeave={() => onHover(null)}
                  onClick={() => !isLeaf && onSelect(item)}
                  onKeyDown={(e) =>
                    !isLeaf && (e.key === "Enter" || e.key === " ") && onSelect(item)
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
                          color: hovRes === res ? RES[res].color : "var(--color-text-secondary)",
                          fontWeight: hovRes === res ? 600 : 400,
                          opacity: hovRes && hovRes !== res ? 0.25 : 1,
                        }}
                      >
                        {fmt(v)}
                      </td>
                    );
                  })}

                  <td className="py-3 pr-4 text-right font-semibold tabular-nums" style={{ color }}>
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
  );
}
