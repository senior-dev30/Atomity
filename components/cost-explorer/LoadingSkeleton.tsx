export const LoadingSkeleton = () => {
  const barHeights = [75, 55, 40, 25];

  return (
    <div aria-busy="true" aria-label="Loading cost data">
      <div className="skeleton mb-3 h-12 rounded-xl" />

      <div className="overflow-hidden rounded-2xl bg-[var(--color-bg-primary)] shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <div className="flex gap-3">
            <div className="skeleton h-8 w-28 rounded-lg" />
            <div className="skeleton h-8 w-20 rounded-lg" />
          </div>
          <div className="flex gap-6">
            <div className="skeleton h-8 w-20 rounded-lg" />
            <div className="skeleton h-8 w-24 rounded-lg" />
          </div>
        </div>

        <div className="px-6 pt-6 pb-4">
          <div className="skeleton mb-5 h-4 w-64 rounded" />
          <div className="flex items-end gap-3" style={{ height: 240 }}>
            {barHeights.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="skeleton h-5 w-10 rounded-full" />
                <div className="skeleton w-full rounded-t-xl" style={{ height: `${h}%` }} />
                <div className="skeleton h-3 w-14 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* table rows */}
        <div className="space-y-3 px-6 pb-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-10 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};
