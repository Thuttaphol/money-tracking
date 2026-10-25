import { AppError } from "@/lib/api/app-error";
import { getApiTransactionsTotalBalance } from "@/lib/api/generated";
import { zTotalBalanceResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function getBalance(signal: AbortSignal): Promise<string> {
  try {
    const { data, error } = await getApiTransactionsTotalBalance({
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zTotalBalanceResponse.safeParse(data);

    if (!result.success) {
      throw new AppError("Invalid API response.", {
        type: "INVALID_RESPONSE_ERROR",
        cause: result.error,
      });
    }

    //number formatting
    const formattedBalance = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(result.data?.totalBalance);

    return formattedBalance;
  } catch (error) {
    throw handleApiError(error);
  }
}
