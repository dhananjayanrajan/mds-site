/**
 * Error helper utilities for consistent error handling and user-friendly messages
 */
import type { NotificationsStore } from './notifications';
/**
 * Error types that we handle differently
 */
export declare enum ErrorType {
    PERMISSION = "permission",
    NOT_FOUND = "not_found",
    SERVER = "server",
    NETWORK = "network",
    VALIDATION = "validation",
    UNKNOWN = "unknown"
}
/**
 * Determine the type of error based on response
 */
export declare function getErrorType(error: any): ErrorType;
/**
 * Get a user-friendly error message based on error type
 */
export declare function getUserFriendlyErrorMessage(error: any, context?: 'load' | 'save' | 'delete' | 'search'): string;
/**
 * Handle an error with logging and optional notification
 */
export declare function handleApiError(error: any, context?: 'load' | 'save' | 'delete' | 'search', options?: {
    notificationsStore?: NotificationsStore | null;
    showNotification?: boolean;
    logContext?: Record<string, any>;
}): string;
/**
 * Create a retry-able request with exponential backoff
 */
export declare function retryWithBackoff<T>(request: () => Promise<T>, options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: any) => boolean;
}): Promise<T>;
