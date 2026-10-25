import { AppError } from "@/lib/api/app-error";
import {
  getApiTransactionsAll,
  TransactionResponse,
} from "@/lib/api/generated";
import { zGetApiTransactionsAllResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function getAllTransaction(
  signal: AbortSignal,
): Promise<TransactionResponse[]> {
  try {
    const { data, error } = await getApiTransactionsAll({ signal: signal });

    if (error) {
      throw error;
    }

    const result = zGetApiTransactionsAllResponse.safeParse(data);

    if (!result.success) {
      throw new AppError("Invalid API response.", {
        type: "INVALID_RESPONSE_ERROR",
        cause: result.error,
      });
    }

    return result.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
