import { AppError } from "./app-error";
import type { ApiErrorResponse, ApiValidationErrorResponse } from "./generated";

function isApiErrorFromBackend(
  error: unknown,
): error is ApiErrorResponse | ApiValidationErrorResponse {
  if (typeof error !== "object" || error === null || error === undefined) {
    return false;
  }

  return (
    "title" in error ||
    "status" in error ||
    "detail" in error ||
    "traceId" in error ||
    "errors" in error
  );
}

function isValidErrors(value: unknown): value is Record<string, string[]> {
  if (
    value !== "object" ||
    value === null ||
    value === undefined ||
    Array.isArray(value)
  ) {
    return false;
  }

  return Object.values(value).every(
    (item) =>
      Array.isArray(item) &&
      item.every((element) => typeof element === "string"),
  );
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isApiErrorFromBackend(error)) {
    if ("traceId" in error && typeof error.traceId === "string") {
      return new AppError(error.title, {
        type: "API_ERROR",
        title: error.title,
        status: error.status,
        detail: error.detail,
        traceId: error.traceId,
        cause: error,
      });
    }

    if ("errors" in error && isValidErrors(error)) {
      return new AppError(error.title, {
        type: "INVALID_REQUEST_ERROR",
        title: error.title,
        status: error.status,
        detail: error.detail,
        errors: error.errors,
        cause: error,
      });
    }
  }

  if (error instanceof TypeError) {
    return new AppError("Unable to connect to the server.", {
      type: "NETWORK_ERROR",
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      type: "UNKNOWN_ERROR",
      cause: error,
    });
  }

  return new AppError("An unexpected error occured.", {
    type: "UNKNOWN_ERROR",
    cause: error,
  });
}
