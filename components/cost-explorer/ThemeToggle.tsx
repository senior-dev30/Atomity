"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { tokens } from "@/lib/tokens";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setIsDark(!isDark);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors"
      style={{
        background: tokens.colors.bgMuted,
        color: tokens.colors.textSecondary,
      }}
    >
      {isDark ? "☀" : "◑"}
    </motion.button>
  );
}
