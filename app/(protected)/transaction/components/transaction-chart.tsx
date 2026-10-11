import { AppError } from "@/lib/api/app-error";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import { CategoryResponse, TransactionResponse } from "@/lib/api/generated";
import { getAllTransaction } from "../api/get-all-transactions";
import { getCategories } from "../add/api/get-categories";
import { TransactionPieChartSkeleton } from "./chart-skeleton";

export function TransactionPieChart() {
  const [error, setError] = useState<AppError>();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadChartData() {
      try {
        const [transactions, categories] = await Promise.all([
          getAllTransaction(abortController.signal),
          getCategories(abortController.signal),
        ]);

        if (abortController.signal.aborted) return;

        setTransactions(transactions);
        setCategories(categories);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        if (error instanceof AppError) {
          setError(error);
          return;
        }

        setError(
          new AppError("Something went wrong.", {
            type: "UNKNOWN_ERROR",
            cause: error,
          }),
        );
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadChartData();
  }, []);

  type ChartData = { data: { value: number; label: string }[] }[];

  function chartData(
    categories: CategoryResponse[],
    transactions: TransactionResponse[],
  ): ChartData {
    return [
      {
        data: categories.map((category) => ({
          label: category.name,
          value: transactions.reduce((total, transaction) => {
            if (transaction.categoryId === category.id) {
              return total + transaction.amount;
            }
            return total;
          }, 0),
        })),
      },
    ];
  }

  if (loading) {
    return <TransactionPieChartSkeleton />;
  }

  return (
    <PieChart
      series={chartData(categories, transactions)}
      height={150}
      width={200}
      className="rounded-xl border py-2"
      slotProps={{
        legend: {
          sx: {
            color: "inherit",
          },
        },
      }}
    />
  );
}
