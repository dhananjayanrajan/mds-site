/**
 * State management utility functions
 *
 * This module provides common state management utilities used throughout the expandable-blocks extension.
 * It centralizes state tracking, cloning, comparison, and dirty state management patterns.
 */
import type { Ref } from 'vue';
/**
 * Deep equality check for objects
 * Compares two values for deep equality, handling nested objects and arrays
 */
export declare function deepEqual(a: unknown, b: unknown): boolean;
/**
 * Deep clone an object
 * Creates a deep copy of an object, handling nested structures, arrays, and dates
 */
export declare function deepClone<T>(obj: T): T;
/**
 * State tracking manager for managing original states and dirty flags
 */
export declare class StateTracker<T = unknown> {
    private debugName?;
    private originalStates;
    private dirtyFlags;
    constructor(debugName?: string);
    /**
     * Store the original state for an item
     */
    storeOriginalState(id: string, state: T): void;
    /**
     * Get the original state for an item
     */
    getOriginalState(id: string): T | undefined;
    /**
     * Check if an item has an original state stored
     */
    hasOriginalState(id: string): boolean;
    /**
     * Mark an item as dirty or clean
     */
    setDirtyFlag(id: string, isDirty: boolean): void;
    /**
     * Check if an item is marked as dirty
     */
    isDirty(id: string): boolean;
    /**
     * Check if an item has changed from its original state
     */
    hasChanged(id: string, currentState: T): boolean;
    /**
     * Reset an item to its original state
     */
    resetToOriginal(id: string): T | undefined;
    /**
     * Remove all tracking for an item
     */
    removeTracking(id: string): void;
    /**
     * Clear all tracking
     */
    clearAll(): void;
    /**
     * Get all tracked IDs
     */
    getTrackedIds(): string[];
    /**
     * Get all dirty IDs
     */
    getDirtyIds(): string[];
    /**
     * Get debug info
     */
    getDebugInfo(): Record<string, unknown>;
}
/**
 * Create a snapshot of the current state
 * Useful for creating restore points
 */
export declare function createStateSnapshot<T>(state: T): T;
/**
 * Compare two arrays for equality (order-sensitive)
 */
export declare function arraysEqual<T>(a: T[], b: T[]): boolean;
/**
 * Compare two arrays for equality (order-insensitive)
 */
export declare function arraysEqualUnordered<T>(a: T[], b: T[]): boolean;
/**
 * Track changes to an order/sequence of items
 */
export declare class OrderTracker {
    private debugName?;
    private originalOrder;
    constructor(debugName?: string);
    /**
     * Store the original order
     */
    storeOriginalOrder(order: (string | number)[]): void;
    /**
     * Check if the order has changed
     */
    hasOrderChanged(currentOrder: (string | number)[]): boolean;
    /**
     * Get the original order
     */
    getOriginalOrder(): (string | number)[];
    /**
     * Clear the stored order
     */
    clear(): void;
}
/**
 * Batch state update helper
 * Useful for updating multiple states while maintaining consistency
 */
export declare class BatchStateUpdater<T> {
    private updates;
    /**
     * Queue an update
     */
    queueUpdate(id: string, state: T): void;
    /**
     * Apply all queued updates to a state tracker
     */
    applyTo(tracker: StateTracker<T>): void;
    /**
     * Get pending updates count
     */
    getPendingCount(): number;
    /**
     * Clear all pending updates
     */
    clear(): void;
}
/**
 * Create a reactive state diff helper
 * Returns a function that computes the diff between original and current state
 */
export declare function createStateDiff<T>(getOriginal: () => T, getCurrent: () => T): () => {
    hasChanges: boolean;
    changes: string[];
};
/**
 * Safe JSON stringify for debugging
 * Handles circular references and functions
 */
export declare function safeStringify(obj: unknown, space?: number): string;
/**
 * Set loading state for a specific key
 * @param loading - The loading state ref object
 * @param key - The key to set loading state for
 */
export declare function setLoadingState(loading: Ref<Record<string | number, boolean>>, key: string | number): void;
/**
 * Clear loading state for a specific key
 * @param loading - The loading state ref object
 * @param key - The key to clear loading state for
 */
export declare function clearLoadingState(loading: Ref<Record<string | number, boolean>>, key: string | number): void;
/**
 * Update dirty state for a block based on comparison with original data
 * @param blockId - The block ID to update
 * @param currentData - The current data to compare
 * @param originalStates - Map of original states
 * @param dirtyStates - Map of dirty states
 * @param deepEqual - Function to compare data deeply
 */
export declare function updateBlockDirtyState(blockId: string, currentData: unknown, originalStates: Map<string, unknown>, dirtyStates: Map<string, boolean>, deepEqual: (a: unknown, b: unknown) => boolean): void;
