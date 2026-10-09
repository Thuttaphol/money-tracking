import { AppError } from "@/lib/api/app-error";
import {
  deleteApiTransactionsByTransactionId,
  DeleteApiTransactionsByTransactionIdResponse,
} from "@/lib/api/generated";
import { zDeleteApiTransactionsByTransactionIdResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function deleteTransaction(
  id: number,
  signal?: AbortSignal,
): Promise<DeleteApiTransactionsByTransactionIdResponse> {
  try {
    const { data, error } = await deleteApiTransactionsByTransactionId({
      path: { transactionId: id },
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result =
      zDeleteApiTransactionsByTransactionIdResponse.safeParse(data);

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
