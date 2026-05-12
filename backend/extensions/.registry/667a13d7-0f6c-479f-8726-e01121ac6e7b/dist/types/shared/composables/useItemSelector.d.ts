import type { TranslationInfo, FieldWithTranslation, LanguageOption } from '../../types';
import type { IDirectusApiClient } from '../../services/api-client.types';
import type { ItemSelectorConfig } from '../types/ItemSelectorConfig';
/**
 * Generic ItemSelector composable for reuse across extensions
 *
 * @param api Directus API instance
 * @param allowedCollections Optional array of allowed collections
 * @param config Configuration options for customizing behavior
 * @returns ItemSelector state and methods
 */
export declare function useItemSelector(api: any, allowedCollections?: string[], config?: ItemSelectorConfig): {
    config: {
        loggerPrefix: string;
        apiClient: IDirectusApiClient;
        allowLink: boolean;
        allowDuplicate: boolean;
        defaultItemsPerPage: number;
        defaultLanguage: string;
        fieldMappings: Record<string, string>;
        collectionIcons: Record<string, string>;
        debug: boolean;
    };
    isOpen: import("vue").Ref<boolean, boolean>;
    selectedCollection: import("vue").Ref<string, string>;
    selectedCollectionName: import("vue").Ref<string, string>;
    selectedCollectionIcon: import("vue").Ref<string, string>;
    searchQuery: import("vue").Ref<string, string>;
    availableItems: import("vue").Ref<any[], any[]>;
    loading: import("vue").Ref<boolean, boolean>;
    loadingDetails: import("vue").Ref<boolean, boolean>;
    availableFields: import("vue").Ref<{
        field: string;
        name?: string;
        display_name?: string;
        type: string;
        interface?: string;
        translatable?: boolean;
        translation_type?: "combined" | "table" | "none";
        display_priority?: number;
        required?: boolean;
        readonly?: boolean;
        hidden?: boolean;
        searchable?: boolean;
        weight?: number;
        display?: string;
        options?: any;
    }[], FieldWithTranslation[] | {
        field: string;
        name?: string;
        display_name?: string;
        type: string;
        interface?: string;
        translatable?: boolean;
        translation_type?: "combined" | "table" | "none";
        display_priority?: number;
        required?: boolean;
        readonly?: boolean;
        hidden?: boolean;
        searchable?: boolean;
        weight?: number;
        display?: string;
        options?: any;
    }[]>;
    itemRelations: import("vue").Ref<Record<string, any[]>, Record<string, any[]>>;
    loadingRelations: import("vue").Ref<boolean, boolean>;
    apiError: import("vue").Ref<string, string>;
    translationInfo: import("vue").Ref<{
        hasTranslations: boolean;
        translationType: "combined" | "table" | "none";
        translationTable?: string;
        translationsCollection?: string;
        linkField?: string;
        languageField?: string;
        translationFields: string[] | {
            field: string;
            type: string;
            name: string;
            translatable: boolean;
            translationMethod?: "combined" | "table";
            isContentField?: boolean;
            coversFields?: string[];
        }[];
        isCombinedTranslation?: boolean;
        message?: string;
        availableLanguages?: {
            code: string;
            name: string;
            icon?: string;
        }[];
    }, TranslationInfo | {
        hasTranslations: boolean;
        translationType: "combined" | "table" | "none";
        translationTable?: string;
        translationsCollection?: string;
        linkField?: string;
        languageField?: string;
        translationFields: string[] | {
            field: string;
            type: string;
            name: string;
            translatable: boolean;
            translationMethod?: "combined" | "table";
            isContentField?: boolean;
            coversFields?: string[];
        }[];
        isCombinedTranslation?: boolean;
        message?: string;
        availableLanguages?: {
            code: string;
            name: string;
            icon?: string;
        }[];
    }>;
    selectedLanguage: import("vue").Ref<string, string>;
    availableLanguages: import("vue").Ref<{
        code: string;
        name: string;
        icon?: string;
    }[], LanguageOption[] | {
        code: string;
        name: string;
        icon?: string;
    }[]>;
    currentPage: import("vue").Ref<number, number>;
    itemsPerPage: import("vue").Ref<number, number>;
    totalItems: import("vue").Ref<number, number>;
    sortField: import("vue").Ref<string, string>;
    sortDirection: import("vue").Ref<"desc" | "asc", "desc" | "asc">;
    open: (collection: string, userPrefs?: any) => Promise<void>;
    close: () => void;
    loadItems: () => Promise<void>;
    handleSearch: (query: string) => void;
    handlePageChange: (page: number) => void;
    getTranslatedFieldValue: (item: any, field: string, language?: string) => string;
    isFieldTranslatable: (field: string) => boolean;
    updateSort: (field: string | null, direction: "asc" | "desc") => void;
    updateItemsPerPage: (value: number) => void;
};
