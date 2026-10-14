import { AppError } from "@/lib/api/app-error";
import {
  CategoryResponse,
  putApiCategories,
  UpdateCategoryRequest,
} from "@/lib/api/generated";
import {
  zPutApiCategoriesResponse,
  zPutApiTransactionsResponse,
} from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function updateCategory(
  transaction: UpdateCategoryRequest,
  signal: AbortSignal,
): Promise<CategoryResponse> {
  try {
    const { data, error } = await putApiCategories({
      body: transaction,
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zPutApiCategoriesResponse.safeParse(data);

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
