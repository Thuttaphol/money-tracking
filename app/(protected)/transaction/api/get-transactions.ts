import { AppError } from "@/lib/api/app-error";
import {
  getApiTransactions,
  TransactionsPageKeysetResponseOfTransactionResponse,
} from "@/lib/api/generated";
import { zTransactionsPageKeysetResponseOfTransactionResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function getTransactions(
  reference: number,
  pageSize: number,
  signal: AbortSignal,
): Promise<TransactionsPageKeysetResponseOfTransactionResponse> {
  try {
    const { data, error } = await getApiTransactions({
      query: {
        Reference: reference,
        PageSize: pageSize,
      },
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result =
      zTransactionsPageKeysetResponseOfTransactionResponse.safeParse(data);

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
