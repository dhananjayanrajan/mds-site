/**
 * Directus API Client Service
 *
 * A service that provides a unified interface for interacting with the native Directus API.
 * This replaces the custom API extension with direct Directus API calls.
 */
import type { FeatureSet } from './api-availability-checker';
import type { IDirectusApiClient, ApiClientConfig, SearchOptions, SearchResult, CollectionMetadata, FieldInfo, RelationInfo, PermissionResult, ItemUsageResult, DirectusApiInstance } from './api-client.types';
/**
 * Main Directus API Client implementation
 */
export declare class DirectusApiClient implements IDirectusApiClient {
    private api;
    private config;
    private availabilityChecker;
    constructor(api: DirectusApiInstance, config?: ApiClientConfig);
    /**
     * Search items in a collection using external API when available, fallback to native
     */
    searchItems<T = any>(collection: string, options?: SearchOptions): Promise<SearchResult<T>>;
    /**
     * Load multiple items with their relations and usage information
     */
    loadItemsWithRelations<T = any>(collection: string, ids: (string | number)[], fields?: string[]): Promise<T[]>;
    /**
     * Load a single item with its relations
     */
    loadItemWithRelations<T = any>(collection: string, id: string | number, fields?: string[]): Promise<T>;
    /**
     * Get collection metadata including fields and relations
     */
    getCollectionMetadata(collection: string): Promise<CollectionMetadata>;
    /**
     * Get fields information for a collection
     */
    getFieldsInfo(collection: string): Promise<FieldInfo[]>;
    /**
     * Get relations information for a collection
     */
    getRelationsInfo(collection: string): Promise<RelationInfo[]>;
    /**
     * Check permissions for a collection and action
     */
    checkPermissions(collection: string, action: 'create' | 'read' | 'update' | 'delete'): Promise<PermissionResult>;
    /**
     * Get usage information for an item (requires external API)
     */
    getItemUsage(collection: string, id: string | number): Promise<ItemUsageResult | null>;
    /**
     * Get the raw API instance for direct calls
     */
    getApi(): DirectusApiInstance;
    /**
     * Get available features based on API availability
     */
    getAvailableFeatures(): Promise<FeatureSet>;
    /**
     * Check if a specific feature is available
     */
    isFeatureAvailable(feature: keyof FeatureSet): Promise<boolean>;
    /**
     * Create a new item in a collection
     */
    createItem<T = any>(collection: string, data: Partial<T>): Promise<T>;
    /**
     * Update an existing item in a collection
     */
    updateItem<T = any>(collection: string, id: string | number, data: Partial<T>): Promise<T>;
    /**
     * Delete an item from a collection
     */
    deleteItem(collection: string, id: string | number): Promise<void>;
    /**
     * Get current user information
     */
    getCurrentUser<T = any>(): Promise<T>;
    /**
     * Get user presets
     */
    getPresets(filter?: Record<string, any>): Promise<any[]>;
    /**
     * Create a new preset
     */
    createPreset(data: any): Promise<any>;
    /**
     * Update an existing preset
     */
    updatePreset(id: string | number, data: any): Promise<any>;
    /**
     * Private helper methods
     */
    private getCollectionInfo;
    private getTranslationInfo;
    private retryRequest;
    private defaultRetryCondition;
    private handleError;
}
/**
 * Factory function to create API client instance
 */
export declare function createApiClient(api: DirectusApiInstance, config?: ApiClientConfig): IDirectusApiClient;
