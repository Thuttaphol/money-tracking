import { CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionsListSkeleton() {
  return (
    <div className="mb-2">
      <Skeleton className="h-fit rounded-lg">
        <CardHeader className="px-4 py-2 text-lg">{"\u00A0"}</CardHeader>
        <CardContent className="px-5 pb-2 text-base">{"\u00A0"}</CardContent>
      </Skeleton>
    </div>
  );
}
