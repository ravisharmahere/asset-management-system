// helpers.ts
import { v4 as uuidv4 } from 'uuid';
import { IPaginationQuery, IPaginatedResponse } from '../interfaces/common.interface';

/**
 * Generate a UUID
 * @returns A new UUID v4 string
 */
export const generateUUID = (): string => {
  return uuidv4();
};

/**
 * Generate a unique asset code
 * @param prefix Optional prefix for the code
 * @returns A unique asset code
 */
export const generateAssetCode = (prefix: string = 'AST'): string => {
  // Generate a random string of 8 characters
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
  // Get current timestamp in milliseconds
  const timestamp = new Date().getTime().toString().slice(-6);
  // Combine to create the code
  return `${prefix}-${randomStr}-${timestamp}`;
};

/**
 * Parse pagination query parameters and return standardized pagination options
 * @param query The query parameters containing pagination info
 * @returns Standardized pagination options
 */
export const getPaginationOptions = (query: IPaginationQuery): Required<IPaginationQuery> => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const sort = query.sort || 'created_at';
  const order = query.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { page, limit, sort, order };
};

/**
 * Create a standardized paginated response
 * @param data The array of data items
 * @param total Total number of items
 * @param options Pagination options
 * @returns Standardized paginated response
 */
export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  options: Required<IPaginationQuery>
): IPaginatedResponse<T> => {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages,
  };
};

/**
 * Convert string IDs in query parameters to array
 * @param ids Comma-separated string of IDs or array of IDs
 * @returns Array of IDs
 */
export const parseIdArray = (ids: string | string[] | undefined): string[] => {
  if (!ids) return [];
  if (Array.isArray(ids)) return ids;
  return ids.split(',').filter(Boolean);
};

/**
 * Remove undefined values from an object
 * @param obj Object to clean
 * @returns Cleaned object without undefined values
 */
export const removeUndefinedValues = <T>(obj: T): Partial<T> => {
  return Object.entries(obj as Record<string, any>)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

/**
 * Get date range from start and end date strings
 * @param startDate Start date string
 * @param endDate End date string
 * @returns Object with start and end Date objects
 */
export const getDateRange = (
  startDate?: string | null,
  endDate?: string | null
): { startDate: Date | null; endDate: Date | null } => {
  let start: Date | null = null;
  let end: Date | null = null;

  if (startDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
  }

  if (endDate) {
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
  }

  return { startDate: start, endDate: end };
};
