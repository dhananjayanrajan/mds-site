/**
 * Notification utilities for the expandable blocks extension
 *
 * This module provides a centralized notification system that integrates
 * with Directus notifications store when available.
 */
export type NotificationType = 'success' | 'warning' | 'error' | 'info';
export interface NotificationOptions {
    title: string;
    text?: string;
    type?: NotificationType;
    persist?: boolean;
    closeable?: boolean;
}
export interface NotificationsStore {
    add: (notification: NotificationOptions) => void;
}
/**
 * Send a notification to the user
 * @param notification - The notification to display
 * @param notificationsStore - The Directus notifications store instance
 */
export declare function notify(notification: NotificationOptions, notificationsStore: NotificationsStore | null): void;
/**
 * Send a success notification
 */
export declare function notifySuccess(title: string, text?: string, notificationsStore?: NotificationsStore | null): void;
/**
 * Send an error notification
 */
export declare function notifyError(title: string, text?: string, notificationsStore?: NotificationsStore | null): void;
/**
 * Send a warning notification
 */
export declare function notifyWarning(title: string, text?: string, notificationsStore?: NotificationsStore | null): void;
/**
 * Send an info notification
 */
export declare function notifyInfo(title: string, text?: string, notificationsStore?: NotificationsStore | null): void;
/**
 * Create notification helpers bound to a specific notifications store
 * This is useful for composables that have access to the notifications store
 */
export declare function createNotificationHelpers(notificationsStore: NotificationsStore | null): {
    notify: (notification: NotificationOptions) => void;
    notifySuccess: (title: string, text?: string) => void;
    notifyError: (title: string, text?: string) => void;
    notifyWarning: (title: string, text?: string) => void;
    notifyInfo: (title: string, text?: string) => void;
};
