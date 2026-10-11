import { Skeleton } from "@/components/ui/skeleton";

export function TransactionPieChartSkeleton() {
  return (
    <div
      role="status"
      className="flex min-h-50 w-full items-center justify-center gap-6 rounded-xl border p-4"
    >
      {/* Pie chart circle */}
      <Skeleton className="size-36 shrink-0 rounded-full sm:size-44" />

      {/* Chart legends */}
      <div className="flex flex-col gap-4" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-20 rounded-md sm:w-24" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading chart...</span>
    </div>
  );
}
