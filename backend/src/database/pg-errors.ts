import { QueryFailedError } from 'typeorm';

export const PG_UNIQUE_VIOLATION = '23505';
export const PG_FOREIGN_KEY_VIOLATION = '23503';

export function isPgError(err: unknown, code: string) {
  return (
    err instanceof QueryFailedError &&
    (err.driverError as { code?: string }).code === code
  );
}
