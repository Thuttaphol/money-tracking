import { AppError } from "@/lib/api/app-error";
import {
  CreateTransactionRequest,
  postApiTransactions,
  TransactionResponse,
} from "@/lib/api/generated";
import { zPostApiTransactionsResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function createTransaction(
  transaction: CreateTransactionRequest,
  signal?: AbortSignal,
): Promise<TransactionResponse> {
  try {
    const { data, error } = await postApiTransactions({
      body: transaction,
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zPostApiTransactionsResponse.safeParse(data);

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
