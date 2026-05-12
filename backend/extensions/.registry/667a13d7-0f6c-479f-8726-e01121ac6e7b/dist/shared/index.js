/**
 * Shared ItemSelector components for other extensions
 * 
 * @example
 * import { useItemSelector, ItemSelectorDrawer } from 'directus-extension-expandable-blocks/shared';
 */

// Export composables
export { useItemSelector } from '../index.js';

// Export components
export { 
  ItemSelectorDrawer,
  ItemSearchPanel,
  FieldDisplay,
  UsagePopover,
  FieldSettingsMenu,
  ItemEditDrawer,
  ItemSelectorTable
} from '../index.js';

// Export types
export { 
  DEFAULT_ITEM_SELECTOR_CONFIG
} from '../index.js';

// Export version info
export const SHARED_VERSION = '1.3.2';