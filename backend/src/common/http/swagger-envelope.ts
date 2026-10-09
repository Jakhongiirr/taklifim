import type { OpenAPIObject } from '@nestjs/swagger';
import type {
  ReferenceObject,
  ResponseObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

const ERROR_SCHEMA = 'ApiError';

const errorSchema: SchemaObject = {
  type: 'object',
  required: ['success', 'error', 'path', 'timestamp'],
  properties: {
    success: { type: 'boolean', enum: [false] },
    error: {
      type: 'object',
      required: ['statusCode', 'code', 'message'],
      properties: {
        statusCode: { type: 'integer', example: 400 },
        code: {
          type: 'string',
          example: 'VALIDATION_FAILED',
          description:
            'HTTP status name (BAD_REQUEST, NOT_FOUND, ...) or VALIDATION_FAILED',
        },
        message: { type: 'string', example: 'Validation failed' },
        details: {
          description:
            'Validation messages, or extra fields such as `retryAfter`',
          example: ['phone must be a valid phone number'],
        },
      },
    },
    path: { type: 'string', example: '/auth/otp/request' },
    timestamp: { type: 'string', format: 'date-time' },
  },
};

const json = (schema: SchemaObject | ReferenceObject) => ({
  'application/json': { schema },
});

/**
 * Rewrites the generated document to match the runtime envelope
 * (ResponseInterceptor / AllExceptionsFilter): 2xx bodies become
 * `{ success: true, data }`, errors use the shared `ApiError` schema.
 */
export function applyResponseEnvelope(document: OpenAPIObject) {
  document.components ??= {};
  document.components.schemas ??= {};
  document.components.schemas[ERROR_SCHEMA] = errorSchema;
  const errorRef = { $ref: `#/components/schemas/${ERROR_SCHEMA}` };

  for (const path of Object.values(document.paths)) {
    for (const method of ['get', 'post', 'put', 'patch', 'delete'] as const) {
      const operation = path[method];
      if (!operation) continue;

      for (const [status, res] of Object.entries(operation.responses)) {
        const response = res as ResponseObject;
        const code = Number(status);
        if (code >= 400) {
          response.content = json(errorRef);
        } else if (code >= 200 && code < 300 && code !== 204) {
          const data = response.content?.['application/json']?.schema ?? {
            nullable: true,
            example: null,
          };
          response.content = json({
            type: 'object',
            required: ['success', 'data'],
            properties: { success: { type: 'boolean', enum: [true] }, data },
          });
        }
      }
      operation.responses.default ??= {
        description: 'Error',
        content: json(errorRef),
      };
    }
  }
  return document;
}
