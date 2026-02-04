/**
 * Database error codes
 */
export enum DatabaseErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  INVALID_INPUT_VALUE = '22P02',
}

/**
 * Typed database error
 */
export interface DatabaseError extends Error {
  code?: string;
  detail?: string;
}
