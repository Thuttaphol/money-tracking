import { AppError } from "@/lib/api/app-error";
import {
  deleteApiCategoriesByCategoryId,
  DeleteApiCategoriesByCategoryIdResponse,
  deleteApiTransactionsByTransactionId,
} from "@/lib/api/generated";
import {
  zDeleteApiCategoriesByCategoryIdResponse,
  zDeleteApiTransactionsByTransactionIdResponse,
} from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function deleteCategory(
  id: number,
  signal: AbortSignal,
): Promise<DeleteApiCategoriesByCategoryIdResponse> {
  try {
    const { data, error } = await deleteApiCategoriesByCategoryId({
      path: { categoryId: id },
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zDeleteApiCategoriesByCategoryIdResponse.safeParse(data);

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
