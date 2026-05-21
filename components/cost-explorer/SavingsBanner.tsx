"use client";

import { motion, AnimatePresence } from "framer-motion";
import { tokens } from "@/lib/tokens";
import { fmt } from "@/utils/constants";

interface Props {
  savings: number;
  stateKey: string;
}

export const SavingsBanner = ({ savings, stateKey }: Props) => {
  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={stateKey}
        role="note"
        aria-label="Optimization opportunity"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between rounded-xl border px-5 py-3"
        style={{
          background: `color-mix(in srgb, ${tokens.colors.accentWarning} 8%, ${tokens.colors.bgPrimary})`,
          borderColor: `color-mix(in srgb, ${tokens.colors.accentWarning} 30%, transparent)`,
        }}
      >
        <span className="text-sm font-medium" style={{ color: tokens.colors.accentWarning }}>
          ⚡ Optimization opportunity detected
        </span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: tokens.colors.textPrimary }}
        >
          Save {fmt(savings)}/mo by improving efficiency
        </span>
      </motion.aside>
    </AnimatePresence>
  );
};
