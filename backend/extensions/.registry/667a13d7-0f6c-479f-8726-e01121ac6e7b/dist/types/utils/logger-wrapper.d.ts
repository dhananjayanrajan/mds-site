import { logger } from './logger';
/**
 * Logger wrapper functions to reduce code duplication and standardize logging patterns
 */
export { logger };
/**
 * Log an action with automatic formatting and timestamp
 */
export declare function logAction(action: string, data?: Record<string, any>): void;
/**
 * Log a debug message with context
 */
export declare function logDebug(message: string, context?: Record<string, any>): void;
/**
 * Log a warning with context
 */
export declare function logWarn(message: string, context?: Record<string, any>): void;
/**
 * Log an error with context
 */
export declare function logError(message: string, error?: Error | any, context?: Record<string, any>): void;
/**
 * Log a state change
 */
export declare function logStateChange(stateName: string, oldValue: any, newValue: any, context?: Record<string, any>): void;
/**
 * Log an event
 */
export declare function logEvent(eventName: string, eventData?: Record<string, any>): void;
/**
 * Log initialization
 */
export declare function logInit(componentName: string, config?: Record<string, any>): void;
/**
 * Log a lifecycle event
 */
export declare function logLifecycle(componentName: string, event: string, data?: Record<string, any>): void;
/**
 * Log API or data operations
 */
export declare function logData(operation: string, details: Record<string, any>): void;
/**
 * Log performance metrics
 */
export declare function logPerformance(operation: string, duration: number, details?: Record<string, any>): void;
/**
 * Create a scoped logger for a specific component
 */
export declare function createScopedLogger(scope: string): {
    log: (message: string, data?: any) => void;
    debug: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, error?: any, data?: any) => void;
    event: (event: string, data?: any) => void;
    stateChange: (state: string, old: any, value: any, data?: any) => void;
};
