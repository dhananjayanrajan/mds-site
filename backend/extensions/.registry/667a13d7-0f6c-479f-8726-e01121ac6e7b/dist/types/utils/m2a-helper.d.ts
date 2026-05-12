import type { M2AFieldInfo } from '../types';
export type { M2AFieldInfo };
export declare class M2AHelper {
    private api;
    private apiClient;
    private fieldsStore;
    private relationsStore;
    constructor(api: any, stores: any);
    /**
     * Analyze a collection to find all M2A fields and their nested structures
     */
    analyzeM2AStructure(collection: string, field: string): Promise<M2AFieldInfo>;
    /**
     * Load data for M2A field with all nested structures
     */
    loadM2AData(parentId: string | number, fieldInfo: M2AFieldInfo, depth?: number, maxDepth?: number): Promise<any[]>;
    /**
     * Create default data for a collection, initializing all M2A fields
     */
    getDefaultDataForCollection(collection: string): any;
}
