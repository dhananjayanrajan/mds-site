/**
 * API Availability Checker Service
 *
 * Detects which APIs are available and determines feature availability
 * for graceful degradation when custom API is not available.
 */
import type { DirectusApiInstance } from './api-client.types';
/**
 * Available features based on API availability
 */
export interface FeatureSet {
    basicCRUD: boolean;
    search: boolean;
    filtering: boolean;
    sorting: boolean;
    pagination: boolean;
    relationChecking: boolean;
    usageTracking: boolean;
    deleteProtection: boolean;
    cascadeDelete: boolean;
    usageSummary: boolean;
    hasCustomApi: boolean;
    hasNativeApi: boolean;
}
export declare class ApiAvailabilityChecker {
    private api;
    private endpoints;
    private customApiAvailable;
    private nativeApiAvailable;
    private hasChecked;
    constructor(api: DirectusApiInstance);
    /**
     * Check if custom API is available
     */
    checkCustomApiAvailable(): Promise<boolean>;
    /**
     * Check if native Directus API is available
     */
    checkNativeApiAvailable(): Promise<boolean>;
    /**
     * Get available features based on API availability
     */
    getAvailableFeatures(): Promise<FeatureSet>;
    /**
     * Get a human-readable status message
     */
    getStatusMessage(): Promise<string>;
    /**
     * Check if a specific feature is available
     */
    isFeatureAvailable(feature: keyof FeatureSet): Promise<boolean>;
}
/**
 * Factory function to create availability checker
 */
export declare function createApiAvailabilityChecker(api: DirectusApiInstance): ApiAvailabilityChecker;
