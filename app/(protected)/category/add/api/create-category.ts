import { AppError } from "@/lib/api/app-error";
import {
  CategoryResponse,
  CreateCategoryRequest,
  postApiCategories,
} from "@/lib/api/generated";
import { zPostApiCategoriesResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function createCategory(
  category: CreateCategoryRequest,
  signal: AbortSignal,
): Promise<CategoryResponse> {
  try {
    const { data, error } = await postApiCategories({
      body: category,
      signal: signal,
    });

    if (error) {
      throw error;
    }

    const result = zPostApiCategoriesResponse.safeParse(data);

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
