/**
 * Validation utilities for the expandable blocks extension
 *
 * This module provides common validation functions to reduce code duplication
 * across composables and ensure consistent validation logic.
 */
/**
 * Check if a primary key is valid for operations
 * @param primaryKey - The primary key to validate
 * @returns true if the key is valid, false if it's new/temporary
 */
export declare function isValidPrimaryKey(primaryKey: string | number | undefined): boolean;
/**
 * Check if an item is an object (not just an ID)
 * @param item - The item to check
 * @returns true if item is an object, false if it's null or a primitive
 */
export declare function isItemObject(item: any): item is Record<string, any>;
/**
 * Check if a value is not null and not undefined
 * @param value - The value to check
 * @returns true if value is neither null nor undefined
 */
export declare function isNotNullish<T>(value: T | null | undefined): value is T;
/**
 * Check if an ID represents a new/temporary item
 * @param id - The ID to check
 * @returns true if the ID represents a new item
 */
export declare function isTemporaryId(id: string | number | undefined): boolean;
/**
 * Validate that a collection name is provided
 * @param collection - The collection name to validate
 * @returns true if collection name is valid
 */
export declare function isValidCollection(collection: string | undefined): collection is string;
/**
 * Check if a field configuration is valid for M2A relationships
 * @param field - The field configuration to validate
 * @returns true if field has required M2A properties
 */
export declare function isValidM2AField(field: any): boolean;
