/**
 * Generic logger utilities for shared components
 * Allows consuming extensions to customize logging prefix
 */
interface LogContext {
    [key: string]: any;
}
/**
 * Create a scoped logger with custom prefix
 */
export declare function createScopedLogger(prefix?: string): {
    log: (message: string, context?: LogContext) => void;
    debug: (message: string, context?: LogContext) => void;
    error: (message: string, error?: Error | any, context?: LogContext) => void;
    warn: (message: string, context?: LogContext) => void;
    action: (message: string, context?: LogContext) => void;
    stateChange: (property: string, oldValue: any, newValue: any) => void;
    event: (eventName: string, context?: LogContext) => void;
    init: (componentName: string, context?: LogContext) => void;
    lifecycle: (componentName: string, lifecycle: string, context?: LogContext) => void;
    data: (operation: string, context?: LogContext) => void;
    performance: (operation: string, timeMs: number, context?: LogContext) => void;
};
/**
 * Default logger functions for backward compatibility
 */
export declare const logDebug: (message: string, context?: LogContext) => void;
export declare const logError: (message: string, error?: Error | any, context?: LogContext) => void;
export declare const logWarn: (message: string, context?: LogContext) => void;
export declare const logAction: (message: string, context?: LogContext) => void;
export declare const logStateChange: (property: string, oldValue: any, newValue: any) => void;
export declare const logEvent: (eventName: string, context?: LogContext) => void;
export declare const logInit: (componentName: string, context?: LogContext) => void;
export declare const logLifecycle: (componentName: string, lifecycle: string, context?: LogContext) => void;
export declare const logData: (operation: string, context?: LogContext) => void;
export declare const logPerformance: (operation: string, timeMs: number, context?: LogContext) => void;
export {};
