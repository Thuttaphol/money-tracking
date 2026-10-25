import { AppError } from "@/lib/api/app-error";
import {
  CategoryResponse,
  getApiCategoriesByCategoryId,
} from "@/lib/api/generated";
import { zCategoryResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function getCategoryById(
  id: number,
  signal: AbortSignal,
): Promise<CategoryResponse> {
  try {
    const { data, error } = await getApiCategoriesByCategoryId({
      path: { categoryId: id },
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zCategoryResponse.safeParse(data);

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
