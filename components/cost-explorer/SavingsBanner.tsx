"use client";

import { motion, AnimatePresence, useReducedMotion, useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { fmt } from "@/utils/constants";
import { tokens } from "@/lib/tokens";

interface Props {
  savings: number;
  stateKey: string;
}

export const SavingsBanner = ({ savings, stateKey }: Props) => {
  const reduced = useReducedMotion();
  const springNum = useSpring(0, { stiffness: 65, damping: 16, restDelta: 0.5 });
  const [counted, setCounted] = useState(0);

  useEffect(() => {
    if (reduced) setCounted(savings);
    else springNum.set(savings);
  }, [savings, springNum, reduced]);

  useMotionValueEvent(springNum, "change", setCounted);

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={stateKey}
        role="note"
        aria-label="Optimization opportunity"
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" as const } }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="flex items-center justify-between rounded-xl border px-5 py-3"
        style={{
          background: `color-mix(in srgb, ${tokens.colors.accentSuccess} 8%, ${tokens.colors.bgPrimary})`,
          borderColor: `color-mix(in srgb, ${tokens.colors.accentSuccess} 25%, transparent)`,
        }}
      >
        <span className="text-sm font-medium" style={{ color: tokens.colors.accentSuccess }}>
          ✦ Optimization opportunity detected
        </span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: tokens.colors.textPrimary }}
        >
          Save {fmt(Math.round(counted))}/mo by improving efficiency
        </span>
      </motion.aside>
    </AnimatePresence>
  );
}
