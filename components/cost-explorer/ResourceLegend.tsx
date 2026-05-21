"use client";

import { RES, RESOURCES } from "@/utils/constants";
import type { Resource } from "./types";

interface Props {
  hovRes: Resource | null;
  onHovRes: (r: Resource | null) => void;
}

export const ResourceLegend = ({ hovRes, onHovRes }: Props) => {
  return (
    <div
      className="res-legend flex items-center gap-5 pb-8"
      role="group"
      aria-label="Resource filter"
    >
      {RESOURCES.map((r) => (
        <button
          key={r}
          onMouseEnter={() => onHovRes(r)}
          onMouseLeave={() => onHovRes(null)}
          onFocus={() => onHovRes(r)}
          onBlur={() => onHovRes(null)}
          aria-pressed={hovRes === r}
          className="flex items-center gap-1.5 text-xs transition-opacity"
          style={{ opacity: hovRes && hovRes !== r ? 0.25 : 1 }}
        >
          <span
            className="h-2 w-2 flex-shrink-0 rounded-sm"
            style={{ backgroundColor: RES[r].color }}
            aria-hidden="true"
          />
          <span style={{ color: "var(--color-text-muted)" }}>{RES[r].label}</span>
        </button>
      ))}
    </div>
  );
};
