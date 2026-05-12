/**
 * Configuration options for the expandable-blocks extension
 */
export interface ExpandableBlocksOptions {
    enableSorting?: boolean;
    startExpanded?: boolean;
    accordionMode?: boolean;
    showFieldsFilter?: string[];
    compactMode?: boolean;
    showItemId?: boolean;
    showCollectionName?: boolean;
    allowedCollections?: string[];
    includeCollections?: string[];
    allowedCollectionsForExisting?: string[];
    isAllowedDelete?: boolean;
    isAllowedDuplicate?: boolean;
    maxBlocks?: number | null;
    allowLinkExisting?: boolean;
    allowDuplicateExisting?: boolean;
    rolesCanChangeStatus?: string[];
    rolesCanSort?: string[];
    rolesCanAddBlocks?: string[];
    rolesCanDelete?: string[];
    rolesCanDuplicate?: string[];
    enableAI?: boolean;
    aiProvider?: 'openai' | 'claude' | 'custom';
    aiApiKey?: string;
    aiModel?: string;
    aiTemperature?: number;
    aiMaxTokens?: number;
    aiCustomUrl?: string;
}
