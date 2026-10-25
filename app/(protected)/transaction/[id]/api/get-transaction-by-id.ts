import { AppError } from "@/lib/api/app-error";
import {
  getApiTransactionsByTransactionId,
  TransactionResponse,
} from "@/lib/api/generated";
import { zTransactionResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function getTransactionById(
  id: string,
  signal: AbortSignal,
): Promise<TransactionResponse> {
  try {
    const transactionId = Number(id);

    if (Number.isNaN(transactionId)) {
      throw new AppError("Invalid transaction id.", {
        type: "INVALID_REQUEST_ERROR",
      });
    }

    const { data, error } = await getApiTransactionsByTransactionId({
      path: { transactionId: transactionId },
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zTransactionResponse.safeParse(data);

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
