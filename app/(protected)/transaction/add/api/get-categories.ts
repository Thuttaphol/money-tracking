import { AppError } from "@/lib/api/app-error";
import { CategoryResponse, getApiCategories } from "@/lib/api/generated";
import { zGetApiCategoriesResponse } from "@/lib/api/generated/zod.gen";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function getCategories(
  signal: AbortSignal,
): Promise<CategoryResponse[]> {
  try {
    const { data, error } = await getApiCategories({ signal: signal });

    if (error) {
      throw error;
    }

    const result = zGetApiCategoriesResponse.safeParse(data);

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
