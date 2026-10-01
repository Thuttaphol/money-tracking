import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionPageSkeleton() {
  return (
    <Card className="m-4 flex h-svh p-2">
      <Skeleton className="flex flex-1"></Skeleton>
    </Card>
  );
}
