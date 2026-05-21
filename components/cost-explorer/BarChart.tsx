import { BAR_MAX_H } from "@/utils/constants";

export const BarChart = () => {
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
    </div>
  );
};
