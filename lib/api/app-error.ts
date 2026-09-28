type AppErrorType =
  | "API_ERROR"
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE_ERROR"
  | "INVALID_REQUEST_ERROR"
  | "UNKNOWN_ERROR";

type AppErrorOptions = {
  type: AppErrorType;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
  traceId?: string;
  cause?: unknown;
};

export class AppError extends Error {
  readonly type: AppErrorType;
  readonly title?: string;
  readonly status?: number;
  readonly detail?: string;
  readonly errors?: Record<string, string[]>;
  readonly traceId?: string;

  constructor(message: string, options: AppErrorOptions) {
    super(message, { cause: options.cause });

    this.type = options.type;
    this.title = options.title;
    this.status = options.status;
    this.detail = options.detail;
    this.errors = options.errors;
    this.traceId = options.traceId;
  }
}
