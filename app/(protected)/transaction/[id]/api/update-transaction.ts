import { AppError } from "@/lib/api/app-error";
import {
  putApiTransactions,
  TransactionResponse,
  UpdateTransactionRequest,
} from "@/lib/api/generated";
import { zPutApiTransactionsResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function updateTransaction(
  transaction: UpdateTransactionRequest,
  signal?: AbortSignal,
): Promise<TransactionResponse> {
  try {
    const { data, error } = await putApiTransactions({
      body: transaction,
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zPutApiTransactionsResponse.safeParse(data);

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
