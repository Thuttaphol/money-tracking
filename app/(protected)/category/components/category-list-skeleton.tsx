import { CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryListSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => (
        <CardHeader
          key={index}
          className="flex items-center py-2 pl-4 text-base"
          aria-hidden="true"
        >
          <div className="flex-1">
            <Skeleton className="h-5 w-32 max-w-full" />
          </div>
          <Skeleton className="size-6 shrink-0" />
        </CardHeader>
      ))}
    </>
  );
}
