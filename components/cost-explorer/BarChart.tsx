import { BAR_MAX_H, effToken, RES, RESOURCES } from "@/utils/constants";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnyNode, Resource } from "./types";
import { ResourceMetrics, total } from "@/lib/data";

interface Props {
  items: AnyNode[];
  stateKey: string;
  hovRes: Resource | null;
  hovered: string | null;
  isLeaf: boolean;
  maxTotal: number;
  onHover: (id: string | null) => void;
  onSelect: (item: AnyNode) => void;
}

export const BarChart = ({
  stateKey,
  items,
  hovRes,
  hovered,
  isLeaf,
  maxTotal,
  onHover,
  onSelect,
}: Props) => {
  const reduced = useReducedMotion();

  const wrapVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: reduced
        ? { duration: 0 }
        : { staggerChildren: 0.055, delayChildren: 0.04 },
    },
    exit: { opacity: 0, transition: { duration: reduced ? 0 : 0.12, ease: "easeIn" as const } },
  };

  const barVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: reduced
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 300, damping: 22, restDelta: 0.001 },
    },
    exit: {
      opacity: 0,
      scaleY: 0.85,
      transition: { duration: reduced ? 0 : 0.1, ease: "easeIn" as const },
    },
  };

  return (
    <div className="chart-container relative" style={{ height: BAR_MAX_H + 64 }}>
      {[1, 0.75, 0.5, 0.25].map((f) => (
        <div
          key={f}
          aria-hidden="true"
          className="absolute right-0 left-0 border-t border-dashed border-[var(--color-border)]"
          style={{ bottom: f * BAR_MAX_H + 36 }}
        />
      ))}
      <AnimatePresence mode="wait">
        <motion.ol
          key={stateKey}
          aria-label="Cost by resource"
          className="absolute right-0 bottom-9 left-0 m-0 flex list-none items-end gap-3 p-0"
          variants={wrapVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          {items.map((item) => {
            const color = effToken(item.efficiency);
            const tot = total(item);
            const isHov = hovered === item.id;
            const bh = Math.max((tot / maxTotal) * BAR_MAX_H, 6);

            return (
              <motion.li
                key={item.id}
                className="flex flex-1 flex-col items-center"
                style={{ originY: "bottom" }}
                variants={barVariants}
              >
                <div
                  className="eff-badge mb-1.5"
                  style={{ "--eff-color": color } as React.CSSProperties}
                  aria-label={`${item.efficiency}% efficiency`}
                >
                  {item.efficiency}%
                </div>
                <motion.div
                  role={isLeaf ? undefined : "button"}
                  tabIndex={isLeaf ? -1 : 0}
                  aria-label={isLeaf ? undefined : `Drill into ${item.name}`}
                  className={`relative flex w-full flex-col-reverse overflow-hidden rounded-t-xl ${
                    !isLeaf
                      ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-primary)]"
                      : ""
                  }`}
                  style={{ height: bh }}
                  animate={{
                    scale: isHov && !isLeaf ? 1.035 : 1,
                    filter:
                      isHov && !isLeaf
                        ? "brightness(1.08) drop-shadow(0 8px 24px rgba(0,0,0,0.22))"
                        : "brightness(1) drop-shadow(0 0px 0px rgba(0,0,0,0))",
                  }}
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 30 }
                  }
                  onClick={() => !isLeaf && onSelect(item)}
                  onKeyDown={(e) =>
                    !isLeaf && (e.key === "Enter" || e.key === " ") && onSelect(item)
                  }
                  onMouseEnter={() => onHover(item.id)}
                  onMouseLeave={() => onHover(null)}
                >
                  {RESOURCES.map((res) => {
                    const v = (item as unknown as ResourceMetrics)[res];
                    if (v === 0) return null;
                    return (
                      <motion.div
                        key={res}
                        style={{
                          height: `${(v / tot) * 100}%`,
                          backgroundColor: RES[res].color,
                          flexShrink: 0,
                        }}
                        animate={{ opacity: hovRes && hovRes !== res ? 0.07 : 1 }}
                        transition={
                          reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }
                        }
                      />
                    );
                  })}
                  <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-white"
                    animate={{ opacity: isHov && !isLeaf ? 0.08 : 0 }}
                    transition={
                      reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }
                    }
                  />
                  {item.efficiency < 25 && !reduced && (
                    <motion.div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-1"
                      style={{ backgroundColor: color }}
                      animate={{ opacity: [0.15, 0.9, 0.15] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.div>

                <div
                  className="bar-label mt-2 text-center text-xs leading-tight font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {item.name}
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </AnimatePresence>
    </div>
  );
};
