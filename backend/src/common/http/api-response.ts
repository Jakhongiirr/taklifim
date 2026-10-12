/** Body of every successful response (except 204). */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Body of every error response. */
export interface ApiError {
  success: false;
  error: {
    statusCode: number;
    /** Machine-readable: the HTTP status name, or VALIDATION_FAILED. */
    code: string;
    message: string;
    /** Validation messages, or extra fields such as `retryAfter`. */
    details?: unknown;
  };
  path: string;
  timestamp: string;
  /** Matches the server's logs: worth quoting when reporting a problem. */
  requestId?: string;
}
