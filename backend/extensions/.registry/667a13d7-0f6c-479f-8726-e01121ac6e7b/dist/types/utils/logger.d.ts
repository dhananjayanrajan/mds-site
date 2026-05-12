/**
 * Logger utility for development debugging
 *
 * Logging is automatically enabled in development mode.
 * In production, you can manually enable it by:
 * - Setting window.EXPANDABLE_BLOCKS_DEBUG = true in the browser console
 * - Or setting localStorage.setItem('EXPANDABLE_BLOCKS_DEBUG', 'true')
 */
export declare const logger: {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    isEnabled: () => boolean;
    enable: () => void;
    disable: () => void;
};
