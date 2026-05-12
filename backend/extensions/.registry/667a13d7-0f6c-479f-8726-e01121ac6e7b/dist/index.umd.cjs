(function(global2, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory(require("@directus/extensions-sdk"), require("vue")) : typeof define === "function" && define.amd ? define(["@directus/extensions-sdk", "vue"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.ExpandableBlocks = factory(global2.DirectusExtensionsSDK, global2.Vue));
})(this, function(extensionsSdk, require$$0) {
  "use strict";
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var Symbol$1 = root.Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }
  var symbolTag = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index2 = string.length;
    while (index2-- && reWhitespace.test(string.charAt(index2))) {
    }
    return index2;
  }
  var reTrimStart = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var now = function() {
    return root.Date.now();
  };
  var FUNC_ERROR_TEXT = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  const logger = {
    log: (...args) => {
      console.log("[ExpandableBlocks]", ...args);
    },
    warn: (...args) => {
      console.warn("[ExpandableBlocks]", ...args);
    },
    error: (...args) => {
      console.error("[ExpandableBlocks]", ...args);
    },
    debug: (...args) => {
      console.log("[ExpandableBlocks:Debug]", ...args);
    }
  };
  function isValidPrimaryKey(primaryKey) {
    return !(!primaryKey || primaryKey === "+" || primaryKey === "new");
  }
  function isItemObject(item) {
    return typeof item === "object" && item !== null;
  }
  function isNotNullish(value) {
    return value !== null && value !== void 0;
  }
  function isTemporaryId(id) {
    if (!id) return true;
    const idStr = String(id);
    return idStr.startsWith("temp_") || idStr.startsWith("idx_") || idStr.startsWith("new_") || idStr.startsWith("dup_") || idStr.startsWith("existing_");
  }
  function isValidCollection(collection) {
    return typeof collection === "string" && collection.length > 0;
  }
  class M2AHelper {
    constructor(api, stores) {
      this.api = api;
      this.fieldsStore = stores.useFieldsStore();
      this.relationsStore = stores.useRelationsStore();
    }
    /**
     * Analyze a collection to find all M2A fields and their nested structures
     */
    async analyzeM2AStructure(collection, field) {
      const relations = this.relationsStore.getRelationsForField(collection, field);
      const relation = relations?.[0];
      if (!relation) {
        throw new Error(`No relation found for ${collection}.${field}`);
      }
      let junctionCollection = relation.collection;
      if (!junctionCollection || junctionCollection === collection) {
        junctionCollection = `${collection}_${field}`;
      }
      const foreignKeyField = relation.meta?.many_field || `${collection}_id`;
      let allowedCollections = [];
      if (relation.meta?.one_allowed_collections) {
        allowedCollections = relation.meta.one_allowed_collections;
      }
      if (allowedCollections.length === 0) {
        try {
          const fields = this.fieldsStore.getFieldsForCollection(collection);
          const fieldConfig = fields.find((f) => f.field === field);
          if (fieldConfig?.meta?.options?.allowedCollections) {
            allowedCollections = fieldConfig.meta.options.allowedCollections;
          }
        } catch (e) {
          logger.debug("Could not get field options:", e);
        }
      }
      const fieldInfo = {
        field,
        collection,
        junctionCollection,
        junctionField: field,
        // The field name is the junction field
        foreignKeyField,
        allowedCollections,
        nestedM2AFields: {}
      };
      for (const allowedCollection of allowedCollections) {
        try {
          const fields = this.fieldsStore.getFieldsForCollection(allowedCollection);
          const m2aFields = fields.filter(
            (f) => f.meta?.interface === "m2a" || f.meta?.special?.includes("m2a")
          );
          if (m2aFields.length > 0) {
            fieldInfo.hasNestedM2A = true;
            for (const nestedField of m2aFields) {
              const nestedInfo = await this.analyzeM2AStructure(
                allowedCollection,
                nestedField.field
              );
              fieldInfo.nestedM2AFields[allowedCollection] = nestedInfo;
            }
          }
        } catch (error) {
          logger.warn(`Could not analyze ${allowedCollection}:`, error);
        }
      }
      return fieldInfo;
    }
    /**
     * Load data for M2A field with all nested structures
     */
    async loadM2AData(parentId, fieldInfo, depth = 0, maxDepth = 3) {
      if (depth >= maxDepth) {
        logger.warn("Max nesting depth reached");
        return [];
      }
      try {
        let fieldsParam = "*";
        if (fieldInfo.allowedCollections.length > 0) {
          const itemFields = fieldInfo.allowedCollections.map((col) => `item:${col}.*`).join(",");
          fieldsParam = `*,${itemFields}`;
        } else {
          fieldsParam = "*,item.*";
        }
        const response = await this.api.get(`/items/${fieldInfo.junctionCollection}`, {
          params: {
            filter: {
              [fieldInfo.foreignKeyField]: {
                _eq: parentId
              }
            },
            fields: fieldsParam,
            limit: -1,
            sort: "id"
          }
        });
        const records = response.data.data || [];
        if (fieldInfo.hasNestedM2A && depth < maxDepth) {
          for (const record of records) {
            if (record.item && typeof record.item === "object") {
              const itemCollection = record.collection;
              const nestedFieldInfo = fieldInfo.nestedM2AFields?.[itemCollection];
              if (nestedFieldInfo) {
                const itemFields = this.fieldsStore.getFieldsForCollection(itemCollection);
                const m2aFields = itemFields.filter(
                  (f) => f.meta?.special?.includes("m2a")
                );
                for (const m2aField of m2aFields) {
                  const nestedData = await this.loadM2AData(
                    record.item.id,
                    nestedFieldInfo,
                    depth + 1,
                    maxDepth
                  );
                  record.item[m2aField.field] = nestedData;
                }
              }
            }
          }
        }
        return records;
      } catch (error) {
        logger.error(`Error loading M2A data for ${fieldInfo.collection}.${fieldInfo.field}:`, error);
        throw error;
      }
    }
    /**
     * Create default data for a collection, initializing all M2A fields
     */
    getDefaultDataForCollection(collection) {
      const defaultData = {};
      try {
        const fields = this.fieldsStore.getFieldsForCollection(collection);
        fields.forEach((field) => {
          if (["id", "user_created", "user_updated", "date_created", "date_updated"].includes(field.field)) {
            return;
          }
          if (field.meta?.hidden) {
            return;
          }
          if (isNotNullish(field.schema?.default_value)) {
            defaultData[field.field] = field.schema.default_value;
            return;
          }
          switch (field.type) {
            case "string":
            case "text":
              defaultData[field.field] = "";
              break;
            case "integer":
            case "bigInteger":
            case "float":
            case "decimal":
              if (field.schema?.foreign_key_table) {
                defaultData[field.field] = null;
                logger.debug(`Setting FK field ${field.field} to null (references ${field.schema.foreign_key_table})`);
              } else {
                defaultData[field.field] = 0;
              }
              break;
            case "boolean":
              defaultData[field.field] = false;
              break;
            case "json":
            case "csv":
              defaultData[field.field] = null;
              break;
            case "uuid":
            case "hash":
              defaultData[field.field] = null;
              break;
            case "date":
            case "dateTime":
            case "time":
            case "timestamp":
              defaultData[field.field] = null;
              break;
            default:
              if (field.type !== "alias") {
                defaultData[field.field] = null;
              }
          }
        });
      } catch (error) {
        logger.warn(`Could not get fields for ${collection}:`, error);
      }
      logger.debug(`Generated default data for ${collection}:`, defaultData);
      return defaultData;
    }
  }
  function deepEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== "object") return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  function setLoadingState(loading, key) {
    loading.value[key] = true;
  }
  function clearLoadingState(loading, key) {
    delete loading.value[key];
  }
  function updateBlockDirtyState(blockId, currentData, originalStates, dirtyStates, deepEqual2) {
    const originalData = originalStates.get(blockId);
    if (originalData) {
      const isDirty = !deepEqual2(currentData, originalData);
      dirtyStates.set(blockId, isDirty);
      logger.debug(`Set dirty state for ${blockId} to ${isDirty}`);
    } else {
      dirtyStates.set(blockId, true);
      logger.debug("Block marked as dirty (no original state)", { blockId });
    }
  }
  const TITLE_FIELDS = ["title", "name", "headline", "label", "heading"];
  const METADATA_FIELDS = ["id", "user_created", "user_updated", "date_created", "date_updated"];
  function extractItemTitle(item) {
    if (!item || typeof item !== "object") {
      return "Untitled Block";
    }
    const itemData = "item" in item && typeof item.item === "object" ? item.item : item;
    if (!itemData || typeof itemData !== "object") {
      return "Untitled Block";
    }
    for (const field of TITLE_FIELDS) {
      const value = itemData[field];
      if (value && typeof value === "string") {
        return value;
      }
    }
    return "Untitled Block";
  }
  function getActualItemId(item) {
    if (item.item && typeof item.item === "object") {
      return item.item.id;
    }
    return item.id;
  }
  function getActualItem(item) {
    return item.item || item;
  }
  function getItemCollection(item) {
    const actualItem = getActualItem(item);
    if ("collection" in item && item.collection) {
      return item.collection;
    }
    if (actualItem && typeof actualItem === "object" && "collection" in actualItem) {
      return actualItem.collection;
    }
    return void 0;
  }
  function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (obj === void 0) {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => deepClone(item));
    }
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  function addJunctionMetadata(item, foreignKeyField, foreignKeyValue, sortField, sortValue) {
    if (foreignKeyField && foreignKeyValue !== void 0) {
      item[foreignKeyField] = foreignKeyValue;
    }
    if (sortField && sortValue !== void 0) {
      item[sortField] = sortValue;
    }
  }
  function logAction(action, data) {
    logger.log(`🔄 ${action}:`, {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...data
    });
  }
  function logDebug(message, context) {
    logger.debug(message, context || {});
  }
  function logWarn(message, context) {
    logger.warn(message, context || {});
  }
  function logError(message, error, context) {
    logger.error(message, {
      error: error?.message || error,
      stack: error?.stack,
      ...context
    });
  }
  function logStateChange(stateName, oldValue, newValue, context) {
    logger.log(`📝 STATE CHANGE - ${stateName}:`, {
      oldValue,
      newValue,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...context
    });
  }
  function logEvent(eventName, eventData) {
    logger.log(`🎯 EVENT - ${eventName}:`, {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...eventData
    });
  }
  function createScopedLogger(scope) {
    return {
      log: (message, data) => logAction(`[${scope}] ${message}`, data),
      debug: (message, data) => logDebug(`[${scope}] ${message}`, data),
      warn: (message, data) => logWarn(`[${scope}] ${message}`, data),
      error: (message, error, data) => logError(`[${scope}] ${message}`, error, data),
      event: (event, data) => logEvent(`[${scope}] ${event}`, data),
      stateChange: (state, old, value, data) => logStateChange(`[${scope}] ${state}`, old, value, data)
    };
  }
  function useBlockState(relationInfo) {
    const items = require$$0.ref([]);
    const expandedItems = require$$0.ref([]);
    const loading = require$$0.ref({});
    const blockOriginalStates = require$$0.ref(/* @__PURE__ */ new Map());
    const blockDirtyStates = require$$0.ref(/* @__PURE__ */ new Map());
    const originalItemOrder = require$$0.ref([]);
    const isInitialLoad = require$$0.ref(true);
    const isInternalUpdate = require$$0.ref(false);
    const isFullyInitialized = require$$0.ref(false);
    function getItemId(item) {
      if (!item.id) {
        const index2 = items.value.indexOf(item);
        return `idx_${index2}`;
      }
      return String(item.id);
    }
    function isNewItem(item) {
      return isTemporaryId(item.id);
    }
    function isBlockDirty(blockId, currentItemData) {
      const originalData = blockOriginalStates.value.get(blockId);
      if (!originalData) {
        logger.debug(`isBlockDirty: No original data for ${blockId}, marking as dirty`);
        return true;
      }
      const contentChanged = !deepEqual(currentItemData, originalData);
      if (contentChanged) {
        logger.debug(`isBlockDirty: Content changed for ${blockId}`, {
          originalKeys: Object.keys(originalData),
          currentKeys: currentItemData ? Object.keys(currentItemData) : [],
          sampleOriginal: JSON.stringify(originalData).substring(0, 100),
          sampleCurrent: JSON.stringify(currentItemData).substring(0, 100)
        });
      }
      const currentIndex = items.value.findIndex((item) => getItemId(item) === blockId);
      const originalIndex = originalItemOrder.value.findIndex((id) => String(id) === blockId);
      const positionChanged = currentIndex !== -1 && originalIndex !== -1 && currentIndex !== originalIndex;
      if (positionChanged) {
        logger.debug(`isBlockDirty: Position changed for ${blockId}`, {
          currentIndex,
          originalIndex
        });
      }
      const isDirty = contentChanged || positionChanged;
      logger.debug(`isBlockDirty result for ${blockId}: ${isDirty}`);
      return isDirty;
    }
    function prepareItemsForEmit(itemsArray, sortField) {
      const debugInfo = {
        itemsCount: itemsArray.length,
        dirtyStatesCount: blockDirtyStates.value.size,
        originalStatesCount: blockOriginalStates.value.size,
        originalOrderLength: originalItemOrder.value.length,
        originalOrder: originalItemOrder.value,
        items: []
      };
      const result = itemsArray.map((item, index2) => {
        const blockId = getItemId(item);
        const isNew = isNewItem(item);
        if (!isNew && blockId) {
          let isDirty = blockDirtyStates.value.get(blockId) || false;
          if (!isDirty && !blockId) {
            isDirty = blockDirtyStates.value.get(`idx_${index2}`) || false;
          }
          if (!isDirty) {
            isDirty = isBlockDirty(blockId, item.item);
          }
          debugInfo.items.push({
            index: index2,
            blockId,
            isDirty,
            hasOriginalState: blockOriginalStates.value.has(blockId),
            manuallyMarkedDirty: blockDirtyStates.value.get(blockId) || false,
            itemKeys: item.item ? Object.keys(item.item) : []
          });
          if (isDirty) {
            logger.debug(`Emitting full object for dirty block ${blockId}`);
            if (sortField) {
              const itemToEmit = { ...item };
              itemToEmit[sortField] = index2;
              return itemToEmit;
            }
            return item;
          } else {
            logger.debug(`Emitting ID only for clean block ${blockId}`);
            return item.id;
          }
        }
        logger.debug(`Emitting full object for new block at index ${index2}`);
        debugInfo.items.push({
          index: index2,
          blockId: "NEW",
          isDirty: true,
          isNew: true
        });
        const { id, ...itemWithoutId } = item;
        if (sortField) {
          itemWithoutId[sortField] = index2;
        }
        return itemWithoutId;
      });
      const currentOrder = itemsArray.map((item) => getItemId(item)).filter((id) => id);
      const orderChanged = JSON.stringify(currentOrder) !== JSON.stringify(originalItemOrder.value);
      logger.debug("prepareItemsForEmit complete:", {
        ...debugInfo,
        orderChanged,
        currentOrder,
        resultTypes: result.map((r, idx) => ({
          index: idx,
          type: typeof r === "string" ? "ID" : "OBJECT",
          value: typeof r === "string" ? r : "fullObject"
        }))
      });
      const dirtyStates = Array.from(blockDirtyStates.value.entries());
      if (dirtyStates.length > 0) {
        logger.debug("Current dirty states:", dirtyStates);
      }
      logger.debug("prepareItemsForEmit result:", {
        totalItems: result.length,
        cleanBlocks: result.filter((r) => typeof r === "string").length,
        dirtyBlocks: result.filter((r) => typeof r === "object").length,
        hasOriginalOrder: originalItemOrder.value.length > 0
      });
      return result;
    }
    function resetBlockState(blockId) {
      const originalData = blockOriginalStates.value.get(blockId);
      if (originalData) {
        const itemIndex = items.value.findIndex((item) => getItemId(item) === blockId);
        if (itemIndex !== -1 && items.value[itemIndex].item) {
          items.value[itemIndex].item = deepClone(originalData);
          blockDirtyStates.value.set(blockId, false);
          logger.debug(`Reset block ${blockId} to original state`);
        }
      }
    }
    function markBlockDirty(blockId, isDirty) {
      blockDirtyStates.value.set(blockId, isDirty);
      logger.debug(`Marked block ${blockId} as ${isDirty ? "dirty" : "clean"}`);
    }
    function clearStateTracking() {
      blockOriginalStates.value.clear();
      blockDirtyStates.value.clear();
      originalItemOrder.value = [];
      logger.debug("Cleared all state tracking");
    }
    function updateOriginalState(blockId, state) {
      blockOriginalStates.value.set(blockId, deepClone(state));
      logger.debug(`Updated original state for block ${blockId}`);
    }
    function updateOriginalItemOrder(order) {
      originalItemOrder.value = [...order];
      logger.debug("Updated original item order:", order);
    }
    function removeBlockState(blockId) {
      blockOriginalStates.value.delete(blockId);
      blockDirtyStates.value.delete(blockId);
      originalItemOrder.value = originalItemOrder.value.filter((id) => String(id) !== blockId);
      logger.debug(`Removed state tracking for block ${blockId}`);
    }
    return {
      // State
      items,
      expandedItems,
      loading,
      blockOriginalStates,
      blockDirtyStates,
      originalItemOrder,
      isInitialLoad,
      isInternalUpdate,
      isFullyInitialized,
      // Core functions
      isBlockDirty,
      prepareItemsForEmit,
      resetBlockState,
      markBlockDirty,
      clearStateTracking,
      updateOriginalState,
      updateOriginalItemOrder,
      removeBlockState,
      // Utility functions
      getItemId,
      isNewItem
    };
  }
  function emitChanges(options) {
    const {
      items,
      emit,
      prepareItemsForEmit,
      isInternalUpdate,
      source,
      sortField,
      debugData = {}
    } = options;
    isInternalUpdate.value = true;
    const emitValue = prepareItemsForEmit(items, sortField);
    logger.log(`🔄 EMIT - ${source}:`, {
      itemCount: items.length,
      emitValue,
      hasSort: !!sortField,
      ...debugData
    });
    emit("input", emitValue);
    require$$0.nextTick(() => {
      isInternalUpdate.value = false;
    });
  }
  function notify(notification, notificationsStore) {
    const { title, text = "", type = "info" } = notification;
    if (notificationsStore && typeof notificationsStore.add === "function") {
      notificationsStore.add(notification);
    } else {
      logWarn("Notifications store not available", { title, text, type });
    }
  }
  function notifySuccess(title, text, notificationsStore = null) {
    notify({ title, text, type: "success" }, notificationsStore);
  }
  function notifyError(title, text, notificationsStore = null) {
    notify({ title, text, type: "error" }, notificationsStore);
  }
  function notifyWarning(title, text, notificationsStore = null) {
    notify({ title, text, type: "warning" }, notificationsStore);
  }
  function notifyInfo(title, text, notificationsStore = null) {
    notify({ title, text, type: "info" }, notificationsStore);
  }
  function createNotificationHelpers(notificationsStore) {
    return {
      notify: (notification) => notify(notification, notificationsStore),
      notifySuccess: (title, text) => notifySuccess(title, text, notificationsStore),
      notifyError: (title, text) => notifyError(title, text, notificationsStore),
      notifyWarning: (title, text) => notifyWarning(title, text, notificationsStore),
      notifyInfo: (title, text) => notifyInfo(title, text, notificationsStore)
    };
  }
  function useBlockActions(ctx) {
    const { items, expandedItems, loading, blockOriginalStates, blockDirtyStates, originalItemOrder, isInternalUpdate } = ctx.state;
    const { getItemId, isNewItem, prepareItemsForEmit, updateOriginalState, markBlockDirty, removeBlockState } = ctx.stateFns;
    const { emit, api, props, stores: { notificationsStore }, helpers: { m2aHelper, deepEqual: deepEqual2 } } = ctx.deps;
    const { deleteDialog, itemToDelete, mergedOptions, canAddMoreBlocks } = ctx.ui;
    const { relationInfo, allowedCollections, m2aStructure } = ctx.data;
    function getSortField() {
      return relationInfo.value?.meta?.sort_field;
    }
    function getPrimaryKeyValue() {
      if (typeof props.primaryKey === "string" && !isNaN(Number(props.primaryKey))) {
        return Number(props.primaryKey);
      }
      return props.primaryKey;
    }
    function getForeignKeyField() {
      return m2aStructure.value?.foreignKeyField || relationInfo.value?.foreignKeyField || `${props.collection}_id`;
    }
    function cleanItemMetadata(item) {
      const cleaned = { ...item };
      for (const field of METADATA_FIELDS) {
        delete cleaned[field];
      }
      return cleaned;
    }
    function addCopySuffix(item) {
      for (const field of TITLE_FIELDS) {
        if (item[field] && typeof item[field] === "string") {
          item[field] += " (Copy)";
          break;
        }
      }
    }
    const { notifySuccess: notifySuccess2, notifyError: notifyError2, notifyWarning: notifyWarning2, notifyInfo: notifyInfo2 } = createNotificationHelpers(notificationsStore);
    function buildDebugData(functionName, extraData = {}) {
      return {
        function: functionName,
        collection: props.collection,
        field: props.field,
        primaryKey: props.primaryKey,
        itemsCount: items.value.length,
        ...extraData
      };
    }
    function updateSortValues(itemsArray) {
      const sortField = relationInfo.value?.meta?.sort_field;
      if (!sortField) return;
      itemsArray.forEach((item, idx) => {
        if (item[sortField] !== idx) {
          item[sortField] = idx;
        }
      });
    }
    function getJunctionCollection() {
      return relationInfo.value?.junctionCollection || `${props.collection}_${props.field}`;
    }
    function emitChanges$1(itemsArray, source, extraDebugData) {
      emitChanges({
        items: itemsArray,
        emit,
        prepareItemsForEmit,
        isInternalUpdate,
        source,
        sortField: getSortField(),
        debugData: { itemCount: itemsArray.length, ...extraDebugData }
      });
    }
    function toggleExpand(itemId) {
      if (props.disabled) return;
      const index2 = expandedItems.value.indexOf(itemId);
      if (mergedOptions.value?.accordionMode) {
        if (index2 > -1) {
          expandedItems.value = [];
        } else {
          expandedItems.value = [itemId];
        }
      } else {
        if (index2 > -1) {
          expandedItems.value.splice(index2, 1);
        } else {
          expandedItems.value.push(itemId);
        }
      }
    }
    function updateItem(index2, newData) {
      if (props.disabled) return;
      const currentItem = items.value[index2];
      if (!currentItem) {
        logWarn("updateItem: Invalid index", { index: index2 });
        return;
      }
      const itemId = getItemId(currentItem);
      logDebug(`updateItem called for ${itemId}`, {
        index: index2,
        hasNewData: !!newData,
        newDataKeys: newData ? Object.keys(newData) : []
      });
      const updatedItems = [...items.value];
      updatedItems[index2] = {
        ...currentItem,
        item: { ...currentItem.item, ...newData }
      };
      items.value = updatedItems;
      updateBlockDirtyState(
        String(itemId),
        updatedItems[index2].item,
        blockOriginalStates.value,
        blockDirtyStates.value,
        deepEqual2
      );
      emitChanges({
        items: items.value,
        emit,
        prepareItemsForEmit,
        isInternalUpdate,
        source: "updateItem",
        sortField: getSortField()
      });
    }
    function addNewItem(collection) {
      if (props.disabled) return;
      if (!isValidPrimaryKey(props.primaryKey)) {
        notifyWarning2("Save Required", "Please save the item first before adding blocks.");
        return;
      }
      const defaultData = m2aHelper.getDefaultDataForCollection(collection);
      const newItem = {
        id: "new_" + Date.now(),
        // Temporary ID for new items
        collection,
        item: defaultData
        // Just the default data, no ID
      };
      addJunctionMetadata(
        newItem,
        getForeignKeyField(),
        props.primaryKey ? getPrimaryKeyValue() : void 0,
        relationInfo.value?.meta?.sort_field,
        items.value.length
      );
      items.value = [...items.value, newItem];
      expandedItems.value.push(getItemId(newItem));
      emitChanges({
        items: items.value,
        emit,
        prepareItemsForEmit,
        isInternalUpdate,
        source: "NEW ITEM - addNewItem (no API calls)",
        sortField: getSortField(),
        debugData: {
          function: "addNewItem",
          collection,
          newItemStructure: {
            hasId: !!newItem.id,
            collection: newItem.collection,
            itemType: typeof newItem.item,
            foreignKey: newItem[getForeignKeyField()],
            defaultData
          },
          totalItemsCount: items.value.length
        }
      });
      notifyInfo2("Block Added", "New block added. Save to persist changes.");
    }
    function showDeleteDialog(item, index2) {
      itemToDelete.value = { item, index: index2 };
      deleteDialog.value = true;
      logDebug("Delete dialog shown for item", { itemId: getItemId(item) });
    }
    function unlinkItem(item, index2) {
      const itemId = getItemId(item);
      expandedItems.value = expandedItems.value.filter((id) => id !== itemId);
      removeBlockState(String(itemId));
      const updatedItems = [...items.value];
      updatedItems.splice(index2, 1);
      updateSortValues(updatedItems);
      items.value = updatedItems;
      emitChanges({
        items: updatedItems,
        emit,
        prepareItemsForEmit,
        isInternalUpdate,
        source: "unlinkItem",
        sortField: getSortField(),
        debugData: {
          function: "unlinkItem",
          unlinkedItem: {
            id: item.id,
            collection: item.collection,
            itemId
          },
          remainingItemsCount: updatedItems.length
        }
      });
      logDebug("Item unlinked", { itemId, remainingItems: updatedItems.length });
      notifySuccess2("Unlinked", "Block unlinked successfully");
    }
    async function confirmDeleteItem() {
      if (!itemToDelete.value) return;
      const { item, index: index2 } = itemToDelete.value;
      deleteDialog.value = false;
      try {
        const itemId = getItemId(item);
        setLoadingState(loading, itemId);
        if (item.id && !isNewItem(item)) {
          const junctionCollection = getJunctionCollection();
          await api.delete(`/items/${junctionCollection}/${item.id}`);
          if (item.item && typeof item.item === "object" && item.collection) {
            try {
              await api.delete(`/items/${item.collection}/${item.item.id}`);
            } catch (error) {
              logWarn("Failed to delete content item", { error });
            }
          }
        }
        expandedItems.value = expandedItems.value.filter((id) => id !== itemId);
        blockOriginalStates.value.delete(itemId);
        originalItemOrder.value = originalItemOrder.value.filter((id) => String(id) !== String(item.id));
        logDebug("Updated originalItemOrder after deletion", { order: originalItemOrder.value });
        const updatedItems = [...items.value];
        updatedItems.splice(index2, 1);
        updateSortValues(updatedItems);
        items.value = updatedItems;
        emitChanges({
          items: updatedItems,
          emit,
          prepareItemsForEmit,
          isInternalUpdate,
          source: "SAVE STATE - confirmDeleteItem",
          sortField: getSortField(),
          debugData: {
            function: "confirmDeleteItem",
            collection: props.collection,
            field: props.field,
            primaryKey: props.primaryKey,
            deletedItem: {
              id: item.id,
              collection: item.collection,
              itemType: typeof item.item,
              foreignKey: item[relationInfo.value?.foreignKeyField || "unknown"]
            },
            remainingItemsCount: updatedItems.length,
            junctionInfo: {
              junctionCollection: relationInfo.value?.junctionCollection,
              foreignKeyField: relationInfo.value?.foreignKeyField
            }
          }
        });
        itemToDelete.value = null;
        notifySuccess2("Deleted", "Block deleted successfully");
      } catch (error) {
        logEvent("Error deleting block", { error });
        notifyError2("Error", "Failed to delete block");
      } finally {
        clearLoadingState(loading, getItemId(item));
      }
    }
    function duplicateItem(item, index2) {
      if (props.disabled) return;
      if (!canAddMoreBlocks.value) {
        notifyWarning2("Maximum Reached", `Maximum number of blocks (${mergedOptions.value?.maxBlocks}) reached`);
        return;
      }
      const dupKey = `dup_${Date.now()}`;
      const actualItem = getActualItem(item);
      const collection = getItemCollection(item);
      if (!isValidCollection(collection)) {
        logEvent("Cannot duplicate: no collection found", {});
        return;
      }
      setLoadingState(loading, dupKey);
      try {
        const itemCopy = cleanItemMetadata(actualItem);
        addCopySuffix(itemCopy);
        const newItem = {
          id: dupKey,
          // Temporary ID for tracking
          collection,
          item: itemCopy
          // Copied data without ID
        };
        addJunctionMetadata(
          newItem,
          relationInfo.value?.foreignKeyField,
          props.primaryKey ? getPrimaryKeyValue() : void 0,
          relationInfo.value?.meta?.sort_field,
          index2 + 1
        );
        if (relationInfo.value?.foreignKeyField && props.primaryKey) {
          logDebug("Foreign key assignment (duplicate)", {
            foreignKey: relationInfo.value.foreignKeyField,
            primaryKey: props.primaryKey,
            value: newItem[relationInfo.value.foreignKeyField]
          });
        }
        const updatedItems = [...items.value];
        updatedItems.splice(index2 + 1, 0, newItem);
        items.value = updatedItems;
        expandedItems.value.push(dupKey);
        emitChanges({
          items: updatedItems,
          emit,
          prepareItemsForEmit,
          isInternalUpdate,
          source: "DUPLICATE - duplicateItem (no API calls)",
          sortField: getSortField(),
          debugData: buildDebugData("duplicateItem", {
            originalItem: {
              id: item.id,
              collection: item.collection
            },
            duplicatedItem: {
              tempId: dupKey,
              collection
            }
          })
        });
        notifySuccess2("Duplicated", "Block duplicated. Save to persist changes.");
      } catch (error) {
        logEvent("Error duplicating block", { error });
        notifyError2("Error", "Failed to duplicate block");
      } finally {
        clearLoadingState(loading, dupKey);
      }
    }
    async function updateItemStatus(item, index2, newStatus) {
      if (props.disabled) return;
      try {
        const actualItem = getActualItem(item);
        const itemId = actualItem.id;
        const collection = getItemCollection(item);
        if (!itemId || !isValidCollection(collection)) {
          logEvent("Cannot update status: missing item ID or collection", {});
          return;
        }
        const updatedItems = [...items.value];
        if (item.item) {
          updatedItems[index2] = {
            ...item,
            item: {
              ...item.item,
              status: newStatus
            }
          };
        } else {
          updatedItems[index2] = {
            ...item,
            status: newStatus
          };
        }
        items.value = updatedItems;
        const blockId = getItemId(item);
        if (blockId) {
          const newItemData = updatedItems[index2].item || updatedItems[index2];
          updateBlockDirtyState(
            String(blockId),
            newItemData,
            blockOriginalStates.value,
            blockDirtyStates.value,
            deepEqual2
          );
        }
        emitChanges({
          items: items.value,
          emit,
          prepareItemsForEmit,
          isInternalUpdate,
          source: "SAVE STATE - updateItemStatus",
          sortField: getSortField(),
          debugData: buildDebugData("updateItemStatus", {
            itemId,
            targetCollection: collection,
            newStatus,
            item: {
              id: item.id,
              collection: item.collection,
              itemType: typeof item.item
            }
          })
        });
      } catch (error) {
        logEvent("Error updating status", { error });
        notifyError2("Error", "Failed to update status");
      }
    }
    function discardChanges(item, index2) {
      if (props.disabled) return;
      const blockId = item.id?.toString();
      if (!blockId) return;
      const originalData = blockOriginalStates.value.get(blockId);
      if (!originalData) {
        logWarn("No original data found for block", { blockId });
        return;
      }
      logDebug(`discardChanges called for ${blockId}`, {
        hasOriginalData: !!originalData,
        currentDirtyState: blockDirtyStates.value.get(blockId)
      });
      const updatedItems = [...items.value];
      updatedItems[index2] = {
        ...item,
        item: deepClone(originalData)
      };
      items.value = updatedItems;
      blockDirtyStates.value.set(blockId, false);
      logDebug(`Cleared dirty state for block ${blockId}`);
      const restoredData = updatedItems[index2].item;
      const isRestored = deepEqual2(restoredData, originalData);
      logDebug(`Discard verification for ${blockId}: isRestored=${isRestored}`);
      emitChanges({
        items: items.value,
        emit,
        prepareItemsForEmit,
        isInternalUpdate,
        source: "SAVE STATE - discardBlockChanges",
        sortField: getSortField(),
        debugData: buildDebugData("discardBlockChanges", {
          blockId,
          index: index2,
          isRestored
        })
      });
      notifySuccess2("Changes Discarded", "Block reverted to last saved state");
    }
    function createJunctionEntries(collection, selectedItems, options) {
      return selectedItems.map((selectedItem, index2) => {
        const itemToAdd = options.processItem ? options.processItem(selectedItem) : selectedItem;
        const newItem = {
          id: `${options.idPrefix}${Date.now()}_${index2}`,
          collection,
          item: itemToAdd
        };
        addJunctionMetadata(
          newItem,
          getForeignKeyField(),
          props.primaryKey ? getPrimaryKeyValue() : void 0,
          relationInfo.value?.meta?.sort_field,
          items.value.length + index2
        );
        return newItem;
      });
    }
    function addItemsToList(junctionEntries, source, debugData) {
      items.value = [...items.value, ...junctionEntries];
      if (junctionEntries.length > 0) {
        expandedItems.value.push(getItemId(junctionEntries[0]));
      }
      emitChanges({
        items: items.value,
        emit,
        prepareItemsForEmit,
        isInternalUpdate,
        source,
        sortField: getSortField(),
        debugData: {
          ...debugData,
          totalItemsCount: items.value.length
        }
      });
    }
    function onSort() {
      if (props.disabled) return;
      updateSortValues(items.value);
      emitChanges$1(items.value, "SAVE STATE - onSort", buildDebugData("onSort", {
        sortField: relationInfo.value?.meta?.sort_field
      }));
    }
    function addExistingItems(collection, selectedItems) {
      if (props.disabled) return;
      if (!isValidPrimaryKey(props.primaryKey)) {
        notifyWarning2("Save Required", "Please save the item first before adding blocks.");
        return;
      }
      if (!selectedItems || selectedItems.length === 0) {
        return;
      }
      logAction("addExistingItems", {
        collection,
        itemCount: selectedItems.length,
        itemIds: selectedItems.map((item) => item.id)
      });
      const newJunctionEntries = createJunctionEntries(collection, selectedItems, {
        idPrefix: "existing_"
      });
      addItemsToList(newJunctionEntries, "ADD EXISTING - addExistingItems", {
        function: "addExistingItems",
        collection,
        addedCount: selectedItems.length
      });
      logDebug("Added existing items", {
        collection,
        count: selectedItems.length,
        totalItems: items.value.length
      });
    }
    function addAsNewItems(collection, selectedItems) {
      if (props.disabled) return;
      if (!isValidPrimaryKey(props.primaryKey)) {
        notifyWarning2("Save Required", "Please save the item first before adding blocks.");
        return;
      }
      if (!selectedItems || selectedItems.length === 0) {
        return;
      }
      logAction("addAsNewItems", {
        collection,
        itemCount: selectedItems.length,
        itemIds: selectedItems.map((item) => item.id)
      });
      const newJunctionEntries = createJunctionEntries(collection, selectedItems, {
        idPrefix: "new_",
        processItem: (item) => {
          const itemCopy = cleanItemMetadata(item);
          addCopySuffix(itemCopy);
          return itemCopy;
        }
      });
      addItemsToList(newJunctionEntries, "ADD AS NEW - addAsNewItems", {
        function: "addAsNewItems",
        collection,
        copiedCount: selectedItems.length
      });
      logDebug("Added items as copies", {
        collection,
        count: selectedItems.length,
        totalItems: items.value.length
      });
      notifyInfo2("Items Copied", `${selectedItems.length} item(s) added as copies. Save to persist changes.`);
    }
    return {
      // UI Actions
      toggleExpand,
      showDeleteDialog,
      // CRUD Operations
      addNewItem,
      addExistingItems,
      addAsNewItems,
      updateItem,
      unlinkItem,
      confirmDeleteItem,
      duplicateItem,
      discardChanges,
      // Status & State
      updateItemStatus,
      onSort,
      // Helper
      getSortField
    };
  }
  function useM2AData(ctx, updateOriginalItemOrder, clearStateTracking) {
    const { items, expandedItems, loading, blockOriginalStates, blockDirtyStates, originalItemOrder, isInternalUpdate, isInitialLoad, isFullyInitialized } = ctx.state;
    const { getItemId, isNewItem, updateOriginalState, markBlockDirty } = ctx.stateFns;
    const { api, props, stores: { relationsStore, fieldsStore }, helpers: { m2aHelper, deepEqual: deepEqual2 } } = ctx.deps;
    const { mergedOptions } = ctx.ui;
    const { relationInfo, allowedCollections, m2aStructure } = ctx.data;
    const allowedCollectionsMap = require$$0.computed(() => {
      const map = {};
      allowedCollections.value.forEach((col) => {
        if (typeof col === "string") {
          map[col] = { collection: col };
        } else if (col && col.collection) {
          map[col.collection] = col;
        }
      });
      return map;
    });
    async function loadAllowedCollections() {
      const fieldOptions = mergedOptions.value || {};
      const relations = relationsStore.getRelationsForField(props.collection, props.field);
      const junctionRelations = relations?.find((r) => r.meta?.junction_field === props.field);
      const m2aRelatedCollection = junctionRelations?.related_collection;
      logger.debug("Looking for allowed collections:", {
        fieldOptions,
        hasIncludeCollections: !!fieldOptions.includeCollections,
        includeCollections: fieldOptions.includeCollections,
        hasAllowedCollections: !!fieldOptions.allowedCollections,
        allowedCollections: fieldOptions.allowedCollections,
        m2aRelatedCollection,
        junctionField: junctionRelations?.meta?.junction_field,
        currentField: props.field
      });
      let collections = [];
      if (fieldOptions.includeCollections && Array.isArray(fieldOptions.includeCollections) && fieldOptions.includeCollections.length > 0) {
        collections = fieldOptions.includeCollections;
        logger.debug("Using includeCollections from options:", collections);
      } else if (fieldOptions.allowedCollections && Array.isArray(fieldOptions.allowedCollections) && fieldOptions.allowedCollections.length > 0) {
        collections = fieldOptions.allowedCollections;
        logger.debug("Using allowedCollections from options:", collections);
      } else if (m2aRelatedCollection) {
        const field = fieldsStore.getField(props.collection, props.field);
        const meta = field?.meta;
        logger.debug("M2A Field meta:", {
          field: props.field,
          meta,
          specialOptions: meta?.special,
          optionsString: meta?.options
        });
        const relatedRelations = relationsStore.getRelations();
        const m2aConfig = relatedRelations.find(
          (r) => r.collection === junctionRelations?.collection && r.field === "collection" && r.schema?.table === junctionRelations?.collection
        );
        if (m2aConfig?.meta?.one_allowed_collections) {
          collections = m2aConfig.meta.one_allowed_collections;
          logger.debug("Found collections from M2A config:", collections);
        } else {
          if (meta?.options && typeof meta.options === "object") {
            const interfaceOptions = meta.options;
            if (interfaceOptions.allowedCollections) {
              collections = interfaceOptions.allowedCollections;
              logger.debug("Found collections from interface options:", collections);
            }
          }
        }
      }
      if (collections.length === 0) {
        const field = fieldsStore.getField(props.collection, props.field);
        if (field?.meta?.special && Array.isArray(field.meta.special)) {
          const m2aSpecial = field.meta.special.find((s) => s.startsWith("m2a"));
          if (m2aSpecial) {
            logger.debug("Found m2a special type:", m2aSpecial);
          }
        }
      }
      if (collections.length > 0) {
        try {
          const mappedCollections = await Promise.all(
            collections.map(async (col) => {
              try {
                const response = await api.get(`/collections/${col}`);
                const collectionData = response.data.data;
                return {
                  collection: col,
                  name: collectionData.meta?.display_name || collectionData.name || col,
                  icon: collectionData.meta?.icon || "box",
                  singleton: collectionData.meta?.singleton || false
                };
              } catch (error) {
                logger.warn(`Failed to load collection details for ${col}:`, error);
                return {
                  collection: col,
                  name: col,
                  icon: "box",
                  singleton: false
                };
              }
            })
          );
          allowedCollections.value = mappedCollections;
          logger.debug("Loaded allowed collections:", mappedCollections);
        } catch (error) {
          logger.error("Error loading collection details:", error);
          allowedCollections.value = collections.map((col) => ({
            collection: col,
            name: col,
            icon: "box",
            singleton: false
          }));
        }
      } else {
        logger.warn("No allowed collections found for field:", props.field);
        allowedCollections.value = [];
      }
    }
    async function loadRelationInfo() {
      if (!relationInfo.value) {
        const relations = relationsStore.getRelationsForField(props.collection, props.field);
        if (relations && relations.length > 0) {
          relationInfo.value = relations[0];
        }
      }
      if (relationInfo.value?.junctionCollection) {
        try {
          const junctionFields = await api.get(`/fields/${relationInfo.value.junctionCollection}`);
          logger.debug("Junction fields loaded:", junctionFields.data.data);
        } catch (error) {
          logger.warn("Failed to load junction fields:", error);
        }
      }
    }
    async function analyzeM2AStructure() {
      try {
        m2aStructure.value = await m2aHelper.analyzeM2AStructure(
          props.collection,
          props.field
        );
        logger.debug("M2A structure analyzed:", m2aStructure.value);
      } catch (error) {
        logger.warn("Failed to analyze M2A structure:", error);
        m2aStructure.value = null;
      }
    }
    async function loadFullItemData(isAfterSave = false) {
      try {
        if (!isValidPrimaryKey(props.primaryKey)) {
          items.value = [];
          return;
        }
        if (items.value.length === 0 && !isFullyInitialized.value) {
          isInitialLoad.value = true;
          clearStateTracking();
        }
        const fields = ["*"];
        fields.push("item.*");
        const query = {
          fields,
          limit: -1,
          sort: relationInfo.value?.meta?.sort_field || void 0,
          filter: {
            [relationInfo.value?.foreignKeyField || `${props.collection}_id`]: {
              _eq: props.primaryKey
            }
          }
        };
        const junctionCollection = relationInfo.value?.junctionCollection || `${props.collection}_${props.field}`;
        const response = await api.get(`/items/${junctionCollection}`, { params: query });
        if (response.data.data) {
          const records = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          logger.log("📥 LOAD FULL ITEM DATA:", {
            recordsCount: records.length,
            junctionCollection,
            query,
            sampleRecord: records[0]
          });
          const transformedRecords = records.map((record) => {
            let itemData = record.item;
            if (typeof itemData === "number" || typeof itemData === "string") {
              logger.warn("Item is just an ID, full data may not be loaded:", itemData);
              itemData = { id: itemData };
            }
            return {
              ...record,
              id: record.id,
              collection: record.collection,
              item: itemData
            };
          });
          processLoadedRecords(transformedRecords, void 0, isAfterSave);
        }
        isFullyInitialized.value = true;
      } catch (error) {
        logger.error("Error loading data:", error);
        isFullyInitialized.value = true;
      } finally {
        isInitialLoad.value = false;
      }
    }
    async function processPasteData(pastedData) {
      logger.log("📋 PROCESS PASTE DATA - Start:", {
        totalItems: pastedData.length,
        currentItemsCount: items.value.length
      });
      const pastedIds = /* @__PURE__ */ new Set();
      const currentDirtyStates = new Map(blockDirtyStates.value);
      await loadFullItemData();
      const newItems = [];
      for (const pastedItem of pastedData) {
        logger.debug("Processing pasted item:", {
          type: typeof pastedItem,
          isObject: typeof pastedItem === "object",
          hasId: pastedItem?.id !== void 0,
          hasItem: pastedItem?.item !== void 0,
          structure: pastedItem
        });
        if (isItemObject(pastedItem)) {
          if (pastedItem.id && pastedItem.collection) {
            pastedIds.add(pastedItem.id);
            if (typeof pastedItem.item === "number" || typeof pastedItem.item === "string") {
              try {
                const itemResponse = await api.get(`/items/${pastedItem.collection}/${pastedItem.item}`);
                pastedItem.item = itemResponse.data.data;
              } catch (error) {
                logger.warn(`Failed to load item data for ${pastedItem.collection}/${pastedItem.item}:`, error);
              }
            }
            newItems.push(pastedItem);
          } else if (pastedItem.collection && pastedItem.item) {
            const junctionData = {
              collection: pastedItem.collection,
              item: typeof pastedItem.item === "object" ? pastedItem.item.id : pastedItem.item
            };
            Object.keys(pastedItem).forEach((key) => {
              if (key !== "collection" && key !== "item" && key !== "id") {
                junctionData[key] = pastedItem[key];
              }
            });
            if (relationInfo.value?.foreignKeyField && props.primaryKey && !junctionData[relationInfo.value.foreignKeyField]) {
              const primaryKeyValue = typeof props.primaryKey === "string" && !isNaN(Number(props.primaryKey)) ? Number(props.primaryKey) : props.primaryKey;
              junctionData[relationInfo.value.foreignKeyField] = primaryKeyValue;
            }
            if (relationInfo.value?.meta?.sort_field) {
              junctionData[relationInfo.value.meta.sort_field] = items.value.length + newItems.length;
            }
            try {
              const junctionCollection = relationInfo.value?.junctionCollection || `${props.collection}_${props.field}`;
              const response = await api.post(`/items/${junctionCollection}`, junctionData);
              const createdJunction = response.data.data;
              createdJunction.item = pastedItem.item;
              pastedIds.add(createdJunction.id);
              newItems.push(createdJunction);
              logger.debug("Created junction for pasted item:", createdJunction);
            } catch (error) {
              logger.error("Failed to create junction for pasted item:", error);
            }
          }
        } else if (typeof pastedItem === "number" || typeof pastedItem === "string") {
          pastedIds.add(pastedItem);
          const existingItem = items.value.find((item) => item.id === pastedItem);
          if (existingItem) {
            logger.debug("Found existing item for pasted ID:", existingItem);
          } else {
            logger.warn("Pasted ID not found in current items:", pastedItem);
          }
        }
      }
      currentDirtyStates.forEach((isDirty, blockId) => {
        if (isDirty) {
          markBlockDirty(blockId, true);
        }
      });
      if (newItems.length > 0) {
        logger.log("📋 Created new junction records, reloading data...");
        const dirtyStatesBeforeReload = new Map(blockDirtyStates.value);
        await loadFullItemData();
        dirtyStatesBeforeReload.forEach((isDirty, blockId) => {
          if (isDirty) {
            markBlockDirty(blockId, true);
          }
        });
      }
      pastedIds.forEach((id) => {
        const item = items.value.find((i) => i.id === id);
        if (item) {
          const itemId = getItemId(item);
          if (itemId) {
            markBlockDirty(itemId, true);
            logger.debug(`📋 Marked pasted item ${itemId} as dirty`);
          }
        }
      });
      logger.log("📋 PROCESS PASTE DATA - Complete:", {
        pastedCount: pastedIds.size,
        totalItems: items.value.length
      });
    }
    function processLoadedRecords(fullRecords, pastedIds, isAfterSave = false) {
      logger.log("📥 PROCESS LOADED RECORDS - Start:", {
        recordsCount: fullRecords.length,
        isInitialLoad: isInitialLoad.value,
        isInternalUpdate: isInternalUpdate.value,
        currentItemsCount: items.value.length,
        hasPastedIds: !!pastedIds,
        pastedIdsCount: pastedIds?.size || 0
      });
      if (pastedIds && pastedIds.size > 0) {
        logger.log("📋 PASTE EVENT - Updating dirty states for pasted items");
        fullRecords.forEach((record) => {
          const itemId = getItemId(record);
          if (itemId && pastedIds.has(record.id)) {
            markBlockDirty(itemId, true);
            const itemData = record.item || record;
            if (itemData && typeof itemData === "object") {
              updateOriginalState(itemId, { ...itemData });
            }
            logger.debug(`📋 Marked pasted item ${itemId} as dirty`);
          }
        });
      }
      items.value = fullRecords;
      fullRecords.forEach((record) => {
        const itemId = getItemId(record);
        if (!itemId) return;
        if (isInitialLoad.value) {
          const itemData = record.item || record;
          if (itemData && typeof itemData === "object" && !blockOriginalStates.value.has(itemId)) {
            updateOriginalState(itemId, { ...itemData });
            if (!pastedIds?.has(record.id)) {
              markBlockDirty(itemId, false);
            }
          }
        } else if (!isInternalUpdate.value) {
          const itemData = record.item || record;
          if (itemData && typeof itemData === "object") {
            if (isAfterSave || !blockOriginalStates.value.has(itemId)) {
              updateOriginalState(itemId, { ...itemData });
            }
            if (isAfterSave) {
              markBlockDirty(itemId, false);
            } else if (!blockDirtyStates.value.has(itemId)) {
              markBlockDirty(itemId, false);
            }
          }
        }
      });
      if (!isAfterSave) {
        const currentOrder = fullRecords.map((record) => record.id).filter((id) => id !== void 0);
        updateOriginalItemOrder(currentOrder);
      }
      logger.log("📥 PROCESS LOADED RECORDS - Complete:", {
        itemsCount: items.value.length,
        dirtyStatesCount: blockDirtyStates.value.size,
        originalStatesCount: blockOriginalStates.value.size,
        originalOrder: originalItemOrder.value
      });
    }
    async function initialize() {
      try {
        await analyzeM2AStructure();
        await loadAllowedCollections();
        await loadRelationInfo();
        await loadFullItemData();
      } catch (error) {
        logger.error("Error initializing M2A data:", error);
        isFullyInitialized.value = true;
      }
    }
    return {
      // Data
      allowedCollectionsMap,
      // Data Loading
      loadFullItemData,
      processLoadedRecords,
      processPasteData,
      // M2A Structure
      analyzeM2AStructure,
      loadAllowedCollections,
      loadRelationInfo,
      // Initialize
      initialize
    };
  }
  function useBlockWatchers(ctx, updateOriginalItemOrder, clearStateTracking, loadFullItemData, processPasteData) {
    const { items, expandedItems, loading, blockOriginalStates, blockDirtyStates, originalItemOrder, isInitialLoad, isInternalUpdate, isFullyInitialized } = ctx.state;
    const { emit, props, helpers: { deepEqual: deepEqual2 } } = ctx.deps;
    const { values, initialValues } = ctx.data;
    function watchValueChanges() {
      return require$$0.watch(() => props.value, async (newVal, oldVal) => {
        if (isInternalUpdate.value) {
          return;
        }
        if (originalItemOrder.value.length === 0 && Array.isArray(newVal) && newVal.length > 0) {
          logger.debug("Setting originalItemOrder from value watcher:", newVal);
          originalItemOrder.value = newVal.map(
            (item) => isItemObject(item) ? item.id : item
          );
          if (isValidPrimaryKey(props.primaryKey)) {
            await loadFullItemData();
          }
          isFullyInitialized.value = true;
          return;
        }
        if (Array.isArray(newVal) && newVal.length > 0 && originalItemOrder.value.length > 0) {
          const allAreIds = newVal.every((item) => typeof item !== "object" || item === null);
          if (allAreIds) {
            const newOrder = newVal.map(
              (item) => isItemObject(item) ? item.id : item
            );
            if (JSON.stringify(newOrder) !== JSON.stringify(originalItemOrder.value)) {
              logger.debug("Save detected - all blocks are clean IDs, updating originalItemOrder:", {
                previousOriginal: originalItemOrder.value,
                newOrder
              });
              originalItemOrder.value = newOrder;
              blockDirtyStates.value.clear();
              logger.debug("Cleared all dirty states after save");
              items.value.forEach((item) => {
                const itemId = String(item.id);
                if (item.item && itemId) {
                  blockOriginalStates.value.set(itemId, deepClone(item.item));
                  logger.debug(`Updated original state for block ${itemId} after save`);
                }
              });
              if (isValidPrimaryKey(props.primaryKey)) {
                await loadFullItemData(true);
              }
              return;
            } else if (JSON.stringify(newOrder) === JSON.stringify(originalItemOrder.value)) {
              logger.debug("Save detected - all blocks are clean IDs, order unchanged");
              blockDirtyStates.value.clear();
              logger.debug("Cleared all dirty states after save");
              items.value.forEach((item) => {
                const itemId = String(item.id);
                if (item.item && itemId) {
                  blockOriginalStates.value.set(itemId, deepClone(item.item));
                  logger.debug(`Updated original state for block ${itemId} after save`);
                }
              });
              if (isValidPrimaryKey(props.primaryKey)) {
                await loadFullItemData(true);
              }
              return;
            }
          }
        }
        if (isInitialLoad.value) {
          return;
        }
        if (Array.isArray(newVal) && newVal.length > 0) {
          let hasJustIds = false;
          let hasObjectsWithId = false;
          let hasObjectsWithoutId = false;
          let hasMixedData = false;
          newVal.forEach((item) => {
            if (typeof item === "number" || typeof item === "string") {
              hasJustIds = true;
            } else if (isItemObject(item)) {
              if ("collection" in item && "item" in item) {
                if (item.id) {
                  hasObjectsWithId = true;
                } else {
                  hasObjectsWithoutId = true;
                }
              }
            }
          });
          hasMixedData = hasJustIds && (hasObjectsWithId || hasObjectsWithoutId) || hasObjectsWithId && hasObjectsWithoutId;
          const isPasteEvent = hasMixedData || hasObjectsWithoutId || hasObjectsWithId && newVal.some(
            (item) => typeof item === "object" && item !== null && "item" in item && typeof item.item === "object"
          );
          if (isPasteEvent) {
            logger.log("📋 PASTE EVENT DETECTED:", {
              hasJustIds,
              hasObjectsWithId,
              hasObjectsWithoutId,
              hasMixedData,
              totalItems: newVal.length,
              currentItemsCount: items.value.length
            });
            await processPasteData(newVal);
            return;
          }
        }
        const oldIds = items.value.map((item) => item.id).sort();
        const newIds = (newVal || []).map((item) => {
          return typeof item === "object" ? item.id : item;
        }).filter((id) => id != null).sort();
        if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
          loadFullItemData();
        }
      }, { deep: true });
    }
    function watchGlobalReset() {
      return require$$0.watch(() => values.value?.[props.field], (newVal, oldVal) => {
        if (!isFullyInitialized.value || isInternalUpdate.value) {
          return;
        }
        if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
          return;
        }
        const initialVal = initialValues.value?.[props.field];
        if (!initialVal) {
          return;
        }
        const isResetToInitial = JSON.stringify(newVal) === JSON.stringify(initialVal);
        if (isResetToInitial) {
          logger.debug("Global discard detected - resetting blocks");
          if (Array.isArray(initialVal)) {
            originalItemOrder.value = initialVal.map(
              (item) => isItemObject(item) ? item.id : item
            );
            logger.debug("Reset originalItemOrder to:", originalItemOrder.value);
          }
          items.value = items.value.map((item) => {
            const blockId = item.id?.toString();
            if (!blockId) return item;
            const originalData = blockOriginalStates.value.get(blockId);
            if (!originalData) {
              logger.warn("No original data for block:", blockId);
              return item;
            }
            return {
              ...item,
              item: deepClone(originalData)
            };
          });
          if (originalItemOrder.value.length > 0) {
            const itemMap = new Map(items.value.map((item) => [item.id, item]));
            const reorderedItems = originalItemOrder.value.map((id) => itemMap.get(id)).filter((item) => item !== void 0);
            if (reorderedItems.length > 0) {
              items.value = reorderedItems;
            }
          }
          blockDirtyStates.value.clear();
          logger.debug("Cleared all dirty states on global discard");
          isInternalUpdate.value = true;
          emit("input", newVal);
          require$$0.nextTick(() => {
            isInternalUpdate.value = false;
          });
        }
      }, { deep: true });
    }
    function watchSaveEvents() {
      return require$$0.watch(() => initialValues.value?.[props.field], async (newVal, oldVal) => {
        if (!isFullyInitialized.value) {
          return;
        }
        if (!oldVal && newVal) {
          return;
        }
        if (!newVal || !items.value.length) return;
        logger.debug("Save detected - reloading data to reset dirty state");
        isInternalUpdate.value = true;
        originalItemOrder.value = items.value.map((item) => item.id);
        logger.debug("Updated originalItemOrder after save:", originalItemOrder.value);
        await loadFullItemData(true);
        logger.debug("✅ Data reload complete after save");
        await require$$0.nextTick();
        isInternalUpdate.value = false;
      }, { deep: true });
    }
    function watchPrimaryKey() {
      return require$$0.watch(() => props.primaryKey, async (newKey, oldKey) => {
        logger.debug("Primary key changed:", { oldKey, newKey });
        if (newKey && newKey !== "+" && newKey !== "new" && newKey !== oldKey) {
          logger.debug("Valid primary key received, loading data...");
          await loadFullItemData();
        }
      }, { immediate: false });
    }
    function setupWatchers() {
      watchValueChanges();
      watchGlobalReset();
      watchSaveEvents();
      watchPrimaryKey();
      logger.debug("All watchers setup complete");
    }
    return {
      setupWatchers,
      // Individual watchers if needed
      watchValueChanges,
      watchGlobalReset,
      watchSaveEvents,
      watchPrimaryKey
    };
  }
  function useUIHelpers(ctx) {
    const { stores: { fieldsStore, collectionsStore } } = ctx.deps;
    const { mergedOptions, availableStatuses } = ctx.ui;
    const { m2aStructure } = ctx.data;
    function getActualItemId$1(item) {
      return getActualItemId(item);
    }
    function getItemTitle(item) {
      return extractItemTitle(item);
    }
    function getCollectionName(item) {
      const collection = getItemCollection(item);
      if (!collection) return "Unknown";
      const collectionInfo = collectionsStore.getCollection(collection);
      return collectionInfo?.name || collection;
    }
    function getCollectionIcon(item) {
      const collection = getItemCollection(item);
      if (!collection) return null;
      const collectionInfo = collectionsStore.getCollection(collection);
      return collectionInfo?.meta?.icon || null;
    }
    function getFieldsForItem(item) {
      const actualItem = item.item || item;
      const collection = actualItem.collection || item.collection;
      if (!isValidCollection(collection)) {
        logger.warn("No collection found for item:", item);
        return [];
      }
      return fieldsStore.getFieldsForCollection(collection).filter((field) => {
        if (field.meta?.hidden || field.meta?.readonly) return false;
        if (["id", "user_created", "date_created", "user_updated", "date_updated"].includes(field.field)) return false;
        if (!field.meta?.interface) return false;
        if (mergedOptions.value?.showFieldsFilter && mergedOptions.value?.showFieldsFilter.length > 0) {
          return mergedOptions.value?.showFieldsFilter.includes(field.field);
        }
        return true;
      });
    }
    function hasStatusField(item) {
      const actualItem = item.item || item;
      const collection = item.collection || actualItem.collection;
      if (!isValidCollection(collection)) return false;
      const fields = fieldsStore.getFieldsForCollection(collection);
      return fields.some((field) => field.field === "status");
    }
    function getItemStatus(item) {
      const actualItem = getActualItem(item);
      return actualItem.status || "draft";
    }
    function getStatusLabel(status) {
      const statusConfig = availableStatuses.find((s) => s.value === status);
      return statusConfig?.label || status;
    }
    function hasNestedM2A(item) {
      if (!item.item || typeof item.item !== "object") return false;
      if (!m2aStructure.value?.nestedM2AFields) return false;
      const collection = item.collection;
      return !!m2aStructure.value?.nestedM2AFields?.[collection];
    }
    function getM2AFields(item) {
      if (!item.item || typeof item.item !== "object") return {};
      const m2aFields = {};
      for (const [key, value] of Object.entries(item.item)) {
        if (Array.isArray(value) && value.length > 0 && value[0]?.collection && value[0]?.item) {
          m2aFields[key] = value;
        }
      }
      return m2aFields;
    }
    function formatFieldName(name) {
      return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return {
      // Item helpers
      getActualItemId: getActualItemId$1,
      getItemTitle,
      // Collection helpers
      getCollectionName,
      getCollectionIcon,
      getFieldsForItem,
      // Status helpers
      hasStatusField,
      getItemStatus,
      getStatusLabel,
      // Nested M2A helpers
      hasNestedM2A,
      getM2AFields,
      // Formatting
      formatFieldName
    };
  }
  function useExpandableBlocks(props, emit, values, initialValues) {
    const api = extensionsSdk.useApi();
    const stores = extensionsSdk.useStores();
    const { useFieldsStore, useRelationsStore, useCollectionsStore, useNotificationsStore } = stores;
    const fieldsStore = useFieldsStore();
    const relationsStore = useRelationsStore();
    const collectionsStore = useCollectionsStore();
    const notificationsStore = useNotificationsStore();
    const m2aHelper = new M2AHelper(api, stores);
    const relationInfo = require$$0.ref(null);
    const m2aStructure = require$$0.ref(null);
    const allowedCollections = require$$0.ref([]);
    const deleteDialog = require$$0.ref(false);
    const itemToDelete = require$$0.ref(null);
    const mergedOptions = require$$0.ref({});
    const availableStatuses = [
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" },
      { value: "archived", label: "Archived" }
    ];
    const blockUsageData = require$$0.ref({});
    const sortable = require$$0.computed(() => mergedOptions.value?.enableSorting !== false);
    const saveButtonWouldBeActive = require$$0.computed(() => {
      if (!values.value || !initialValues.value || !props.field) return false;
      const currentValue = values.value[props.field];
      const initialValue = initialValues.value[props.field];
      return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
    });
    const shouldShowItemId = require$$0.computed(() => {
      const value = mergedOptions.value?.showItemId;
      if (value === false) return false;
      if (value === void 0) return true;
      return value;
    });
    const canAddMoreBlocks = require$$0.computed(() => {
      const maxBlocks = mergedOptions.value?.maxBlocks;
      if (!maxBlocks || maxBlocks <= 0) return true;
      return items.value.length < maxBlocks;
    });
    const blockState = useBlockState();
    const {
      items,
      expandedItems,
      loading,
      blockOriginalStates,
      blockDirtyStates,
      originalItemOrder,
      isInitialLoad,
      isInternalUpdate,
      isFullyInitialized,
      isBlockDirty,
      prepareItemsForEmit,
      resetBlockState,
      markBlockDirty,
      clearStateTracking,
      updateOriginalState,
      updateOriginalItemOrder,
      removeBlockState,
      getItemId,
      isNewItem
    } = blockState;
    const ctx = {
      state: {
        items,
        expandedItems,
        loading,
        blockOriginalStates,
        blockDirtyStates,
        originalItemOrder,
        isInternalUpdate,
        isInitialLoad,
        isFullyInitialized
      },
      stateFns: {
        getItemId,
        isNewItem,
        prepareItemsForEmit,
        updateOriginalState,
        markBlockDirty,
        removeBlockState,
        isBlockDirty,
        resetBlockState
      },
      deps: {
        api,
        emit,
        props,
        stores: {
          notificationsStore,
          fieldsStore,
          relationsStore,
          collectionsStore
        },
        helpers: {
          m2aHelper,
          deepEqual
        }
      },
      ui: {
        deleteDialog,
        itemToDelete,
        mergedOptions: require$$0.computed(() => mergedOptions.value),
        canAddMoreBlocks,
        availableStatuses
      },
      data: {
        relationInfo,
        allowedCollections,
        m2aStructure,
        values,
        initialValues
      }
    };
    const blockActions = useBlockActions(ctx);
    const m2aData = useM2AData(ctx, updateOriginalItemOrder, clearStateTracking);
    const watchers = useBlockWatchers(ctx, updateOriginalItemOrder, clearStateTracking, m2aData.loadFullItemData, m2aData.processPasteData);
    const uiHelpers = useUIHelpers(ctx);
    async function loadFieldOptions() {
      let fieldOptions = { ...props.options };
      try {
        const fields = fieldsStore.getFieldsForCollection(props.collection);
        const fieldConfig = fields.find((f) => f.field === props.field);
        if (fieldConfig?.meta?.options) {
          fieldOptions = { ...fieldOptions, ...fieldConfig.meta.options };
          logDebug("Loaded field options from store", { options: fieldConfig.meta.options });
        }
      } catch (error) {
        logDebug("Failed to get field options from store", { error });
      }
      mergedOptions.value = fieldOptions;
      logDebug("Final merged options", { options: mergedOptions.value });
    }
    async function initialize() {
      logDebug("Component mounted", {
        field: props.field,
        primaryKey: props.primaryKey,
        props
      });
      if (Array.isArray(props.value)) {
        originalItemOrder.value = props.value.map((item) => {
          return isItemObject(item) ? item.id : item;
        });
      }
      try {
        await loadFieldOptions();
        if (initialValues.value && values.value && props.field) {
          if (!initialValues.value[props.field] && values.value[props.field]) {
            initialValues.value[props.field] = deepClone(values.value[props.field]);
          }
        }
        await m2aData.initialize();
        if (mergedOptions.value?.startExpanded && items.value.length > 0) {
          expandedItems.value = items.value.map((item) => getItemId(item));
        }
        watchers.setupWatchers();
        await require$$0.nextTick();
        setTimeout(() => {
          isFullyInitialized.value = true;
        }, 100);
      } catch (error) {
        logError("Error initializing expandable blocks", error);
        notificationsStore.add({
          title: "Initialization Error",
          text: "Failed to initialize expandable blocks. Please refresh the page.",
          type: "error"
        });
      }
    }
    async function loadBlockUsageData() {
      try {
        const itemsByCollection = /* @__PURE__ */ new Map();
        items.value.forEach((item) => {
          if (!isNewItem(item)) {
            const collection = item.collection;
            const itemId = getActualItemId(item);
            if (collection && itemId) {
              if (!itemsByCollection.has(collection)) {
                itemsByCollection.set(collection, []);
              }
              itemsByCollection.get(collection).push(itemId);
            }
          }
        });
        const usagePromises = Array.from(itemsByCollection.entries()).map(async ([collection, ids]) => {
          try {
            const response = await api.post(
              `/expandable-blocks-api/${collection}/detail`,
              { ids, fields: "*" }
            );
            const currentParentId = props.primaryKey;
            response.data.data.forEach((item) => {
              if (item.usage_summary?.total_count > 0) {
                const locationsByParent = /* @__PURE__ */ new Map();
                item.usage_locations.forEach((location) => {
                  const parentKey = `${location.collection}:${location.id}`;
                  if (!locationsByParent.has(parentKey)) {
                    locationsByParent.set(parentKey, {
                      collection: location.collection,
                      id: location.id,
                      count: 0,
                      locations: []
                    });
                  }
                  const parent = locationsByParent.get(parentKey);
                  parent.count++;
                  parent.locations.push(location);
                });
                let externalCount = 0;
                let internalCount = 0;
                const externalLocations = [];
                locationsByParent.forEach((parent) => {
                  if (parent.id === currentParentId) {
                    internalCount = Math.max(0, parent.count - 1);
                  } else {
                    externalCount += parent.count;
                    externalLocations.push(...parent.locations);
                  }
                });
                const totalCount = externalCount + internalCount;
                if (totalCount > 0) {
                  blockUsageData.value[`${collection}:${item.id}`] = {
                    usageCount: totalCount,
                    externalCount,
                    internalCount,
                    externalLocations,
                    usageSummary: {
                      ...item.usage_summary,
                      total_count: totalCount
                    }
                  };
                }
              }
            });
          } catch (error) {
            logError(`Error loading usage data for ${collection}`, error);
          }
        });
        await Promise.all(usagePromises);
        logDebug("Loaded block usage data", {
          totalBlocksWithUsage: Object.keys(blockUsageData.value).length,
          data: blockUsageData.value
        });
      } catch (error) {
        logError("Error loading block usage data", error);
      }
    }
    function getBlockUsageData(item) {
      const collection = item.collection;
      const itemId = getActualItemId(item);
      if (!collection || !itemId || isNewItem(item)) {
        return null;
      }
      return blockUsageData.value[`${collection}:${itemId}`] || null;
    }
    return {
      // State
      items,
      expandedItems,
      loading,
      relationInfo,
      m2aStructure,
      allowedCollections,
      deleteDialog,
      itemToDelete,
      isInitialLoad,
      mergedOptions,
      blockOriginalStates,
      originalItemOrder,
      availableStatuses,
      blockUsageData,
      // Computed
      sortable,
      saveButtonWouldBeActive,
      shouldShowItemId,
      canAddMoreBlocks,
      allowedCollectionsMap: m2aData.allowedCollectionsMap,
      // Core methods
      initialize,
      getItemId,
      isNewItem,
      isBlockDirty,
      loadBlockUsageData,
      getBlockUsageData,
      // Actions from blockActions
      toggleExpand: blockActions.toggleExpand,
      showDeleteDialog: blockActions.showDeleteDialog,
      addNewItem: blockActions.addNewItem,
      addExistingItems: blockActions.addExistingItems,
      addAsNewItems: blockActions.addAsNewItems,
      updateItem: blockActions.updateItem,
      unlinkItem: blockActions.unlinkItem,
      confirmDeleteItem: blockActions.confirmDeleteItem,
      duplicateItem: blockActions.duplicateItem,
      discardChanges: blockActions.discardChanges,
      updateItemStatus: blockActions.updateItemStatus,
      onSort: blockActions.onSort,
      // UI helpers
      ...uiHelpers,
      // From useM2AData (for interface.vue if needed)
      loadFullItemData: m2aData.loadFullItemData,
      processLoadedRecords: m2aData.processLoadedRecords,
      processPasteData: m2aData.processPasteData
    };
  }
  function useItemSelector(api) {
    const { useCollectionsStore } = extensionsSdk.useStores();
    const collectionsStore = useCollectionsStore();
    const itemRelations = require$$0.ref({});
    const isOpen = require$$0.ref(false);
    const selectedCollection = require$$0.ref(null);
    const selectedCollectionName = require$$0.ref(null);
    const selectedCollectionIcon = require$$0.ref(null);
    const searchQuery = require$$0.ref("");
    const availableItems = require$$0.ref([]);
    const loading = require$$0.ref(false);
    const availableFields = require$$0.ref([]);
    const loadingRelations = require$$0.ref(false);
    const apiError = require$$0.ref(null);
    const detailsAbortController = require$$0.ref(null);
    const currentRequestId = require$$0.ref(0);
    const loadingDetails = require$$0.ref(false);
    const translationInfo = require$$0.ref(null);
    const selectedLanguage = require$$0.ref("en-US");
    const availableLanguages = require$$0.ref([]);
    const currentPage = require$$0.ref(1);
    const itemsPerPage = require$$0.ref(10);
    const totalItems = require$$0.ref(0);
    async function loadCollectionMetadata() {
      if (!selectedCollection.value) return;
      try {
        apiError.value = null;
        const response = await api.get(`/expandable-blocks-api/${selectedCollection.value}/metadata`);
        const metadata = response.data;
        if (metadata?.searchableFields) {
          availableFields.value = metadata.searchableFields.map((field) => ({
            field: field.field,
            type: field.type,
            name: field.name || field.field,
            interface: field.interface,
            display: field.display,
            options: field.options,
            display_name: field.display_name || field.field,
            searchable: field.searchable,
            weight: field.weight,
            translatable: field.translatable || false,
            translation_type: field.translation_type || "none"
          }));
        }
        if (metadata?.translationInfo) {
          translationInfo.value = metadata.translationInfo;
          if (metadata.translationInfo.availableLanguages) {
            availableLanguages.value = metadata.translationInfo.availableLanguages;
          }
          if (metadata.translationInfo.hasTranslations && metadata.translationInfo.translationType === "combined" && metadata.translationInfo.translationFields) {
            metadata.translationInfo.translationFields.forEach((tf) => {
              if (!availableFields.value.find((f) => f.field === tf.field)) {
                availableFields.value.push({
                  field: tf.field,
                  type: tf.type,
                  name: tf.name || tf.field,
                  display_name: tf.name || tf.field,
                  searchable: false,
                  weight: 0,
                  translatable: true,
                  translation_type: "combined"
                });
              }
            });
          }
        }
      } catch (error) {
        logError("Error loading collection metadata", error);
        apiError.value = "Fehler beim Laden der Metadaten. Bitte versuchen Sie es später erneut.";
        availableFields.value = [];
      }
    }
    function parseMultipleQueries(query) {
      const operators = {
        "=%": "_contains",
        "!~": "_ncontains",
        "=": "_eq",
        "~": "_contains",
        "!=": "_neq",
        ">": "_gt",
        "<": "_lt",
        ">=": "_gte",
        "<=": "_lte",
        "^": "_starts_with",
        "$": "_ends_with",
        "empty": "_empty",
        "!empty": "_nempty",
        "null": "_null",
        "!null": "_nnull"
      };
      const parts = query.split(/\s+(AND|OR)\s+/i);
      if (parts.length === 1) {
        const results = [];
        const operatorPattern = Object.keys(operators).map((op) => op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        const regex = new RegExp(`([\\w\\.]+)(${operatorPattern})(?:"([^"]+)"|([^\\s]+))`, "g");
        let match;
        while ((match = regex.exec(query)) !== null) {
          const [, field, operator, quotedValue, unquotedValue] = match;
          const value = quotedValue || unquotedValue;
          results.push({
            field,
            operator: operators[operator] || "_eq",
            value
          });
        }
        return results;
      }
      const filters = [];
      let currentLogicalOp = "AND";
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (part === "AND" || part === "OR") {
          currentLogicalOp = part;
          continue;
        }
        const operatorPattern = Object.keys(operators).map((op) => op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        const regex = new RegExp(`^([\\w\\.]+)(${operatorPattern})(?:"([^"]+)"|(.+))$`);
        const match = part.match(regex);
        if (match) {
          const [, field, operator, quotedValue, unquotedValue] = match;
          const value = (quotedValue || unquotedValue || "").trim();
          filters.push({
            field,
            operator: operators[operator] || "_eq",
            value,
            logicalOp: i > 0 ? currentLogicalOp : null
          });
        }
      }
      return filters;
    }
    function isFieldTranslatable(field) {
      if (!translationInfo.value?.translationFields) return false;
      return translationInfo.value.translationFields.some((tf) => tf.field === field);
    }
    function transformFieldForTranslation(field, operator, value) {
      const languageCode = selectedLanguage.value || "en-US";
      if (field.startsWith("translations.")) {
        const actualField = field.replace("translations.", "");
        return {
          filter: {
            _and: [
              { translations: { languages_code: { _eq: languageCode } } },
              { translations: { [actualField]: { [operator]: value } } }
            ]
          },
          isTranslationSearch: true,
          needsAnd: false
        };
      }
      if (isFieldTranslatable(field)) {
        return {
          filter: {
            _and: [
              { translations: { languages_code: { _eq: languageCode } } },
              { translations: { [field]: { [operator]: value } } }
            ]
          },
          isTranslationSearch: true,
          needsAnd: false
        };
      }
      return {
        filter: { [field]: { [operator]: value } },
        isTranslationSearch: false,
        needsAnd: false
      };
    }
    async function loadItems() {
      if (!selectedCollection.value) return;
      loading.value = true;
      try {
        const offset = (currentPage.value - 1) * itemsPerPage.value;
        const params = {
          limit: itemsPerPage.value,
          offset,
          fields: ["*"],
          meta: "*"
        };
        if (translationInfo.value?.hasTranslations) {
          params.fields.push("translations.*");
          const languageCode = selectedLanguage.value || "en-US";
          params.deep = {
            translations: {
              _filter: {
                languages_code: { _eq: languageCode }
              }
            }
          };
        }
        if (searchQuery.value) {
          const queries = parseMultipleQueries(searchQuery.value);
          if (queries.length > 0) {
            let currentGroup = [];
            const orGroups = [];
            let hasOr = false;
            queries.forEach((q, index2) => {
              const transformed = transformFieldForTranslation(
                q.field,
                q.operator,
                q.value
              );
              const filterToAdd = transformed.needsAnd ? { _and: [transformed.filter] } : transformed.filter;
              if (q.logicalOp === "OR" || index2 > 0 && queries[index2 - 1].logicalOp === "OR") {
                hasOr = true;
                if (currentGroup.length > 0) {
                  orGroups.push(currentGroup.length === 1 ? currentGroup[0] : { _and: currentGroup });
                  currentGroup = [];
                }
              }
              currentGroup.push(filterToAdd);
            });
            if (currentGroup.length > 0) {
              orGroups.push(currentGroup.length === 1 ? currentGroup[0] : { _and: currentGroup });
            }
            if (hasOr) {
              params.filter = { _or: orGroups };
            } else {
              const filters = queries.map((q) => {
                const transformed = transformFieldForTranslation(q.field, q.operator, q.value);
                return transformed.filter;
              });
              params.filter = filters.length === 1 ? filters[0] : { _and: filters };
            }
          } else {
            if (translationInfo.value?.hasTranslations && translationInfo.value.translationFields?.length > 0) {
              const searchConditions = [];
              const languageCode = selectedLanguage.value || "en-US";
              const translationConditions = [];
              translationInfo.value.translationFields.forEach((field) => {
                if (["string", "text"].includes(field.type)) {
                  translationConditions.push({
                    [field.field]: { _contains: searchQuery.value }
                  });
                }
              });
              if (translationConditions.length > 0) {
                translationConditions.forEach((condition) => {
                  searchConditions.push({
                    _and: [
                      { translations: { languages_code: { _eq: languageCode } } },
                      { translations: condition }
                    ]
                  });
                });
              }
              if (availableFields.value?.length > 0) {
                availableFields.value.forEach((field) => {
                  if (["string", "text"].includes(field.type) && !isFieldTranslatable(field.field)) {
                    searchConditions.push({
                      [field.field]: { _contains: searchQuery.value }
                    });
                  }
                });
              }
              if (searchConditions.length > 0) {
                params.filter = { _or: searchConditions };
              } else {
                params.search = searchQuery.value;
              }
            } else {
              params.search = searchQuery.value;
            }
          }
        }
        if (params.filter) {
          params.filter = JSON.stringify(params.filter);
        }
        if (params.deep) {
          params.deep = JSON.stringify(params.deep);
        }
        const response = await api.get(`/expandable-blocks-api/${selectedCollection.value}/search`, { params });
        availableItems.value = response.data.data || [];
        totalItems.value = response.data.meta?.filter_count || 0;
        apiError.value = null;
        if (availableItems.value.length > 0) {
          const itemIds = availableItems.value.map((item) => item.id);
          loadItemDetails(itemIds);
        }
      } catch (error) {
        logError("Error loading items", error);
        availableItems.value = [];
        totalItems.value = 0;
        apiError.value = "Die API ist nicht erreichbar. Bitte versuchen Sie es später erneut.";
      } finally {
        loading.value = false;
      }
    }
    async function loadItemDetails(itemIds) {
      if (!selectedCollection.value || itemIds.length === 0) return;
      if (detailsAbortController.value) {
        detailsAbortController.value.abort();
      }
      const requestId = ++currentRequestId.value;
      detailsAbortController.value = new AbortController();
      loadingDetails.value = true;
      try {
        const response = await api.post(
          `/expandable-blocks-api/${selectedCollection.value}/detail`,
          { ids: itemIds, fields: "*" },
          { signal: detailsAbortController.value.signal }
        );
        if (requestId !== currentRequestId.value) {
          return;
        }
        const transformedRelations = {};
        response.data.data.forEach((item) => {
          if (item.usage_summary?.total_count > 0) {
            const byCollection = /* @__PURE__ */ new Map();
            item.usage_locations.forEach((location) => {
              const collectionKey = location.collection;
              if (!byCollection.has(collectionKey)) {
                byCollection.set(collectionKey, {
                  collection: collectionKey,
                  field: location.field || "unknown",
                  count: 0,
                  items: []
                });
              }
              const group = byCollection.get(collectionKey);
              group.count++;
              group.items.push({
                id: location.id,
                title: location.path || location.title || `ID: ${location.id}`,
                ...location
                // Keep all other fields for potential future use
              });
            });
            transformedRelations[item.id] = Array.from(byCollection.values());
          }
        });
        itemRelations.value = transformedRelations;
      } catch (error) {
        if (error.name !== "AbortError") {
          logError("Error loading item details", error);
        }
      } finally {
        if (requestId === currentRequestId.value) {
          loadingDetails.value = false;
        }
      }
    }
    const debouncedLoadItems = debounce(loadItems, 300);
    async function open(collection) {
      selectedCollection.value = collection;
      const storeCollectionInfo = collectionsStore.getCollection(collection);
      selectedCollectionName.value = storeCollectionInfo?.name || collection;
      selectedCollectionIcon.value = storeCollectionInfo?.meta?.icon || "box";
      await loadCollectionMetadata();
      searchQuery.value = "";
      currentPage.value = 1;
      availableItems.value = [];
      totalItems.value = 0;
      isOpen.value = true;
      await loadItems();
    }
    function handleSearch(query) {
      searchQuery.value = query;
      currentPage.value = 1;
      debouncedLoadItems();
    }
    function handlePageChange(page) {
      currentPage.value = page;
      loadItems();
    }
    function close() {
      isOpen.value = false;
      if (detailsAbortController.value) {
        detailsAbortController.value.abort();
        detailsAbortController.value = null;
      }
      currentRequestId.value = 0;
      itemRelations.value = {};
    }
    function getTranslatedFieldValue(item, field, language) {
      const lang = language || selectedLanguage.value;
      if (!translationInfo.value?.hasTranslations) {
        return item[field] || "";
      }
      const translatableField = translationInfo.value.translationFields?.find(
        (tf) => tf.field === field || tf.coversFields?.includes(field)
      );
      if (!translatableField) {
        return item[field] || "";
      }
      if (item.translations && Array.isArray(item.translations)) {
        const translation = item.translations.find((t) => {
          return t.languages_code === lang || t.languages_id === lang || t.language_code === lang || t.language === lang;
        });
        if (translation) {
          if (translationInfo.value.translationType === "combined" && translatableField.coversFields?.includes(field)) {
            return translation[field] || item[field] || "";
          }
          return translation[field] || item[field] || "";
        }
      }
      return item[field] || "";
    }
    return {
      // State
      isOpen,
      selectedCollection,
      selectedCollectionName,
      selectedCollectionIcon,
      searchQuery,
      availableItems,
      loading,
      loadingDetails,
      availableFields,
      itemRelations,
      loadingRelations,
      apiError,
      // Translation state
      translationInfo,
      selectedLanguage,
      availableLanguages,
      // Pagination
      currentPage,
      itemsPerPage,
      totalItems,
      // Methods
      open,
      close,
      loadItems,
      handleSearch,
      handlePageChange,
      getTranslatedFieldValue,
      isFieldTranslatable
    };
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n) {
    if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        var isInstance = false;
        try {
          isInstance = this instanceof a2;
        } catch {
        }
        if (isInstance) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var vuedraggable_umd$1 = { exports: {} };
  /**!
   * Sortable 1.14.0
   * @author	RubaXa   <trash@rubaxa.org>
   * @author	owenm    <owen23355@gmail.com>
   * @license MIT
   */
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _extends() {
    _extends = Object.assign || function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var version = "1.14.0";
  function userAgent(pattern) {
    if (typeof window !== "undefined" && window.navigator) {
      return !!/* @__PURE__ */ navigator.userAgent.match(pattern);
    }
  }
  var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
  var Edge = userAgent(/Edge/i);
  var FireFox = userAgent(/firefox/i);
  var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
  var IOS = userAgent(/iP(ad|od|hone)/i);
  var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
  var captureMode = {
    capture: false,
    passive: false
  };
  function on(el, event, fn) {
    el.addEventListener(event, fn, !IE11OrLess && captureMode);
  }
  function off(el, event, fn) {
    el.removeEventListener(event, fn, !IE11OrLess && captureMode);
  }
  function matches(el, selector) {
    if (!selector) return;
    selector[0] === ">" && (selector = selector.substring(1));
    if (el) {
      try {
        if (el.matches) {
          return el.matches(selector);
        } else if (el.msMatchesSelector) {
          return el.msMatchesSelector(selector);
        } else if (el.webkitMatchesSelector) {
          return el.webkitMatchesSelector(selector);
        }
      } catch (_) {
        return false;
      }
    }
    return false;
  }
  function getParentOrHost(el) {
    return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
  }
  function closest(el, selector, ctx, includeCTX) {
    if (el) {
      ctx = ctx || document;
      do {
        if (selector != null && (selector[0] === ">" ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
          return el;
        }
        if (el === ctx) break;
      } while (el = getParentOrHost(el));
    }
    return null;
  }
  var R_SPACE = /\s+/g;
  function toggleClass(el, name, state) {
    if (el && name) {
      if (el.classList) {
        el.classList[state ? "add" : "remove"](name);
      } else {
        var className = (" " + el.className + " ").replace(R_SPACE, " ").replace(" " + name + " ", " ");
        el.className = (className + (state ? " " + name : "")).replace(R_SPACE, " ");
      }
    }
  }
  function css(el, prop, val) {
    var style = el && el.style;
    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, "");
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }
        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style) && prop.indexOf("webkit") === -1) {
          prop = "-webkit-" + prop;
        }
        style[prop] = val + (typeof val === "string" ? "" : "px");
      }
    }
  }
  function matrix(el, selfOnly) {
    var appliedTransforms = "";
    if (typeof el === "string") {
      appliedTransforms = el;
    } else {
      do {
        var transform = css(el, "transform");
        if (transform && transform !== "none") {
          appliedTransforms = transform + " " + appliedTransforms;
        }
      } while (!selfOnly && (el = el.parentNode));
    }
    var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
    return matrixFn && new matrixFn(appliedTransforms);
  }
  function find(ctx, tagName, iterator) {
    if (ctx) {
      var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
      if (iterator) {
        for (; i < n; i++) {
          iterator(list[i], i);
        }
      }
      return list;
    }
    return [];
  }
  function getWindowScrollingElement() {
    var scrollingElement = document.scrollingElement;
    if (scrollingElement) {
      return scrollingElement;
    } else {
      return document.documentElement;
    }
  }
  function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
    if (!el.getBoundingClientRect && el !== window) return;
    var elRect, top, left, bottom, right, height, width;
    if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
      elRect = el.getBoundingClientRect();
      top = elRect.top;
      left = elRect.left;
      bottom = elRect.bottom;
      right = elRect.right;
      height = elRect.height;
      width = elRect.width;
    } else {
      top = 0;
      left = 0;
      bottom = window.innerHeight;
      right = window.innerWidth;
      height = window.innerHeight;
      width = window.innerWidth;
    }
    if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
      container = container || el.parentNode;
      if (!IE11OrLess) {
        do {
          if (container && container.getBoundingClientRect && (css(container, "transform") !== "none" || relativeToNonStaticParent && css(container, "position") !== "static")) {
            var containerRect = container.getBoundingClientRect();
            top -= containerRect.top + parseInt(css(container, "border-top-width"));
            left -= containerRect.left + parseInt(css(container, "border-left-width"));
            bottom = top + elRect.height;
            right = left + elRect.width;
            break;
          }
        } while (container = container.parentNode);
      }
    }
    if (undoScale && el !== window) {
      var elMatrix = matrix(container || el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d;
      if (elMatrix) {
        top /= scaleY;
        left /= scaleX;
        width /= scaleX;
        height /= scaleY;
        bottom = top + height;
        right = left + width;
      }
    }
    return {
      top,
      left,
      bottom,
      right,
      width,
      height
    };
  }
  function isScrolledPast(el, elSide, parentSide) {
    var parent = getParentAutoScrollElement(el, true), elSideVal = getRect(el)[elSide];
    while (parent) {
      var parentSideVal = getRect(parent)[parentSide], visible = void 0;
      {
        visible = elSideVal >= parentSideVal;
      }
      if (!visible) return parent;
      if (parent === getWindowScrollingElement()) break;
      parent = getParentAutoScrollElement(parent, false);
    }
    return false;
  }
  function getChild(el, childNum, options, includeDragEl) {
    var currentChild = 0, i = 0, children = el.children;
    while (i < children.length) {
      if (children[i].style.display !== "none" && children[i] !== Sortable.ghost && (includeDragEl || children[i] !== Sortable.dragged) && closest(children[i], options.draggable, el, false)) {
        if (currentChild === childNum) {
          return children[i];
        }
        currentChild++;
      }
      i++;
    }
    return null;
  }
  function lastChild(el, selector) {
    var last = el.lastElementChild;
    while (last && (last === Sortable.ghost || css(last, "display") === "none" || selector && !matches(last, selector))) {
      last = last.previousElementSibling;
    }
    return last || null;
  }
  function index$1(el, selector) {
    var index2 = 0;
    if (!el || !el.parentNode) {
      return -1;
    }
    while (el = el.previousElementSibling) {
      if (el.nodeName.toUpperCase() !== "TEMPLATE" && el !== Sortable.clone && (!selector || matches(el, selector))) {
        index2++;
      }
    }
    return index2;
  }
  function getRelativeScrollOffset(el) {
    var offsetLeft = 0, offsetTop = 0, winScroller = getWindowScrollingElement();
    if (el) {
      do {
        var elMatrix = matrix(el), scaleX = elMatrix.a, scaleY = elMatrix.d;
        offsetLeft += el.scrollLeft * scaleX;
        offsetTop += el.scrollTop * scaleY;
      } while (el !== winScroller && (el = el.parentNode));
    }
    return [offsetLeft, offsetTop];
  }
  function indexOfObject(arr, obj) {
    for (var i in arr) {
      if (!arr.hasOwnProperty(i)) continue;
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
      }
    }
    return -1;
  }
  function getParentAutoScrollElement(el, includeSelf) {
    if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
    var elem = el;
    var gotSelf = false;
    do {
      if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
        var elemCSS = css(elem);
        if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == "auto" || elemCSS.overflowX == "scroll") || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == "auto" || elemCSS.overflowY == "scroll")) {
          if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
          if (gotSelf || includeSelf) return elem;
          gotSelf = true;
        }
      }
    } while (elem = elem.parentNode);
    return getWindowScrollingElement();
  }
  function extend(dst, src) {
    if (dst && src) {
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          dst[key] = src[key];
        }
      }
    }
    return dst;
  }
  function isRectEqual(rect1, rect2) {
    return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
  }
  var _throttleTimeout;
  function throttle(callback, ms) {
    return function() {
      if (!_throttleTimeout) {
        var args = arguments, _this = this;
        if (args.length === 1) {
          callback.call(_this, args[0]);
        } else {
          callback.apply(_this, args);
        }
        _throttleTimeout = setTimeout(function() {
          _throttleTimeout = void 0;
        }, ms);
      }
    };
  }
  function cancelThrottle() {
    clearTimeout(_throttleTimeout);
    _throttleTimeout = void 0;
  }
  function scrollBy(el, x, y) {
    el.scrollLeft += x;
    el.scrollTop += y;
  }
  function clone(el) {
    var Polymer = window.Polymer;
    var $ = window.jQuery || window.Zepto;
    if (Polymer && Polymer.dom) {
      return Polymer.dom(el).cloneNode(true);
    } else if ($) {
      return $(el).clone(true)[0];
    } else {
      return el.cloneNode(true);
    }
  }
  function setRect(el, rect) {
    css(el, "position", "absolute");
    css(el, "top", rect.top);
    css(el, "left", rect.left);
    css(el, "width", rect.width);
    css(el, "height", rect.height);
  }
  function unsetRect(el) {
    css(el, "position", "");
    css(el, "top", "");
    css(el, "left", "");
    css(el, "width", "");
    css(el, "height", "");
  }
  var expando = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
  function AnimationStateManager() {
    var animationStates = [], animationCallbackId;
    return {
      captureAnimationState: function captureAnimationState() {
        animationStates = [];
        if (!this.options.animation) return;
        var children = [].slice.call(this.el.children);
        children.forEach(function(child) {
          if (css(child, "display") === "none" || child === Sortable.ghost) return;
          animationStates.push({
            target: child,
            rect: getRect(child)
          });
          var fromRect = _objectSpread2({}, animationStates[animationStates.length - 1].rect);
          if (child.thisAnimationDuration) {
            var childMatrix = matrix(child, true);
            if (childMatrix) {
              fromRect.top -= childMatrix.f;
              fromRect.left -= childMatrix.e;
            }
          }
          child.fromRect = fromRect;
        });
      },
      addAnimationState: function addAnimationState(state) {
        animationStates.push(state);
      },
      removeAnimationState: function removeAnimationState(target) {
        animationStates.splice(indexOfObject(animationStates, {
          target
        }), 1);
      },
      animateAll: function animateAll(callback) {
        var _this = this;
        if (!this.options.animation) {
          clearTimeout(animationCallbackId);
          if (typeof callback === "function") callback();
          return;
        }
        var animating = false, animationTime = 0;
        animationStates.forEach(function(state) {
          var time = 0, target = state.target, fromRect = target.fromRect, toRect = getRect(target), prevFromRect = target.prevFromRect, prevToRect = target.prevToRect, animatingRect = state.rect, targetMatrix = matrix(target, true);
          if (targetMatrix) {
            toRect.top -= targetMatrix.f;
            toRect.left -= targetMatrix.e;
          }
          target.toRect = toRect;
          if (target.thisAnimationDuration) {
            if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
            (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
              time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
            }
          }
          if (!isRectEqual(toRect, fromRect)) {
            target.prevFromRect = fromRect;
            target.prevToRect = toRect;
            if (!time) {
              time = _this.options.animation;
            }
            _this.animate(target, animatingRect, toRect, time);
          }
          if (time) {
            animating = true;
            animationTime = Math.max(animationTime, time);
            clearTimeout(target.animationResetTimer);
            target.animationResetTimer = setTimeout(function() {
              target.animationTime = 0;
              target.prevFromRect = null;
              target.fromRect = null;
              target.prevToRect = null;
              target.thisAnimationDuration = null;
            }, time);
            target.thisAnimationDuration = time;
          }
        });
        clearTimeout(animationCallbackId);
        if (!animating) {
          if (typeof callback === "function") callback();
        } else {
          animationCallbackId = setTimeout(function() {
            if (typeof callback === "function") callback();
          }, animationTime);
        }
        animationStates = [];
      },
      animate: function animate(target, currentRect, toRect, duration) {
        if (duration) {
          css(target, "transition", "");
          css(target, "transform", "");
          var elMatrix = matrix(this.el), scaleX = elMatrix && elMatrix.a, scaleY = elMatrix && elMatrix.d, translateX = (currentRect.left - toRect.left) / (scaleX || 1), translateY = (currentRect.top - toRect.top) / (scaleY || 1);
          target.animatingX = !!translateX;
          target.animatingY = !!translateY;
          css(target, "transform", "translate3d(" + translateX + "px," + translateY + "px,0)");
          this.forRepaintDummy = repaint(target);
          css(target, "transition", "transform " + duration + "ms" + (this.options.easing ? " " + this.options.easing : ""));
          css(target, "transform", "translate3d(0,0,0)");
          typeof target.animated === "number" && clearTimeout(target.animated);
          target.animated = setTimeout(function() {
            css(target, "transition", "");
            css(target, "transform", "");
            target.animated = false;
            target.animatingX = false;
            target.animatingY = false;
          }, duration);
        }
      }
    };
  }
  function repaint(target) {
    return target.offsetWidth;
  }
  function calculateRealTime(animatingRect, fromRect, toRect, options) {
    return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
  }
  var plugins = [];
  var defaults = {
    initializeByDefault: true
  };
  var PluginManager = {
    mount: function mount(plugin) {
      for (var option in defaults) {
        if (defaults.hasOwnProperty(option) && !(option in plugin)) {
          plugin[option] = defaults[option];
        }
      }
      plugins.forEach(function(p) {
        if (p.pluginName === plugin.pluginName) {
          throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
        }
      });
      plugins.push(plugin);
    },
    pluginEvent: function pluginEvent2(eventName, sortable, evt) {
      var _this = this;
      this.eventCanceled = false;
      evt.cancel = function() {
        _this.eventCanceled = true;
      };
      var eventNameGlobal = eventName + "Global";
      plugins.forEach(function(plugin) {
        if (!sortable[plugin.pluginName]) return;
        if (sortable[plugin.pluginName][eventNameGlobal]) {
          sortable[plugin.pluginName][eventNameGlobal](_objectSpread2({
            sortable
          }, evt));
        }
        if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
          sortable[plugin.pluginName][eventName](_objectSpread2({
            sortable
          }, evt));
        }
      });
    },
    initializePlugins: function initializePlugins(sortable, el, defaults2, options) {
      plugins.forEach(function(plugin) {
        var pluginName = plugin.pluginName;
        if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
        var initialized = new plugin(sortable, el, sortable.options);
        initialized.sortable = sortable;
        initialized.options = sortable.options;
        sortable[pluginName] = initialized;
        _extends(defaults2, initialized.defaults);
      });
      for (var option in sortable.options) {
        if (!sortable.options.hasOwnProperty(option)) continue;
        var modified = this.modifyOption(sortable, option, sortable.options[option]);
        if (typeof modified !== "undefined") {
          sortable.options[option] = modified;
        }
      }
    },
    getEventProperties: function getEventProperties(name, sortable) {
      var eventProperties = {};
      plugins.forEach(function(plugin) {
        if (typeof plugin.eventProperties !== "function") return;
        _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
      });
      return eventProperties;
    },
    modifyOption: function modifyOption(sortable, name, value) {
      var modifiedValue;
      plugins.forEach(function(plugin) {
        if (!sortable[plugin.pluginName]) return;
        if (plugin.optionListeners && typeof plugin.optionListeners[name] === "function") {
          modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
        }
      });
      return modifiedValue;
    }
  };
  function dispatchEvent(_ref) {
    var sortable = _ref.sortable, rootEl2 = _ref.rootEl, name = _ref.name, targetEl = _ref.targetEl, cloneEl2 = _ref.cloneEl, toEl = _ref.toEl, fromEl = _ref.fromEl, oldIndex2 = _ref.oldIndex, newIndex2 = _ref.newIndex, oldDraggableIndex2 = _ref.oldDraggableIndex, newDraggableIndex2 = _ref.newDraggableIndex, originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, extraEventProperties = _ref.extraEventProperties;
    sortable = sortable || rootEl2 && rootEl2[expando];
    if (!sortable) return;
    var evt, options = sortable.options, onName = "on" + name.charAt(0).toUpperCase() + name.substr(1);
    if (window.CustomEvent && !IE11OrLess && !Edge) {
      evt = new CustomEvent(name, {
        bubbles: true,
        cancelable: true
      });
    } else {
      evt = document.createEvent("Event");
      evt.initEvent(name, true, true);
    }
    evt.to = toEl || rootEl2;
    evt.from = fromEl || rootEl2;
    evt.item = targetEl || rootEl2;
    evt.clone = cloneEl2;
    evt.oldIndex = oldIndex2;
    evt.newIndex = newIndex2;
    evt.oldDraggableIndex = oldDraggableIndex2;
    evt.newDraggableIndex = newDraggableIndex2;
    evt.originalEvent = originalEvent;
    evt.pullMode = putSortable2 ? putSortable2.lastPutMode : void 0;
    var allEventProperties = _objectSpread2(_objectSpread2({}, extraEventProperties), PluginManager.getEventProperties(name, sortable));
    for (var option in allEventProperties) {
      evt[option] = allEventProperties[option];
    }
    if (rootEl2) {
      rootEl2.dispatchEvent(evt);
    }
    if (options[onName]) {
      options[onName].call(sortable, evt);
    }
  }
  var _excluded = ["evt"];
  var pluginEvent = function pluginEvent2(eventName, sortable) {
    var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, originalEvent = _ref.evt, data = _objectWithoutProperties(_ref, _excluded);
    PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread2({
      dragEl,
      parentEl,
      ghostEl,
      rootEl,
      nextEl,
      lastDownEl,
      cloneEl,
      cloneHidden,
      dragStarted: moved,
      putSortable,
      activeSortable: Sortable.active,
      originalEvent,
      oldIndex,
      oldDraggableIndex,
      newIndex,
      newDraggableIndex,
      hideGhostForTarget: _hideGhostForTarget,
      unhideGhostForTarget: _unhideGhostForTarget,
      cloneNowHidden: function cloneNowHidden() {
        cloneHidden = true;
      },
      cloneNowShown: function cloneNowShown() {
        cloneHidden = false;
      },
      dispatchSortableEvent: function dispatchSortableEvent(name) {
        _dispatchEvent({
          sortable,
          name,
          originalEvent
        });
      }
    }, data));
  };
  function _dispatchEvent(info) {
    dispatchEvent(_objectSpread2({
      putSortable,
      cloneEl,
      targetEl: dragEl,
      rootEl,
      oldIndex,
      oldDraggableIndex,
      newIndex,
      newDraggableIndex
    }, info));
  }
  var dragEl, parentEl, ghostEl, rootEl, nextEl, lastDownEl, cloneEl, cloneHidden, oldIndex, newIndex, oldDraggableIndex, newDraggableIndex, activeGroup, putSortable, awaitingDragStarted = false, ignoreNextClick = false, sortables = [], tapEvt, touchEvt, lastDx, lastDy, tapDistanceLeft, tapDistanceTop, moved, lastTarget, lastDirection, pastFirstInvertThresh = false, isCircumstantialInvert = false, targetMoveDistance, ghostRelativeParent, ghostRelativeParentInitialScroll = [], _silent = false, savedInputChecked = [];
  var documentExists = typeof document !== "undefined", PositionGhostAbsolutely = IOS, CSSFloatProperty = Edge || IE11OrLess ? "cssFloat" : "float", supportDraggable = documentExists && !ChromeForAndroid && !IOS && "draggable" in document.createElement("div"), supportCssPointerEvents = function() {
    if (!documentExists) return;
    if (IE11OrLess) {
      return false;
    }
    var el = document.createElement("x");
    el.style.cssText = "pointer-events:auto";
    return el.style.pointerEvents === "auto";
  }(), _detectDirection = function _detectDirection2(el, options) {
    var elCSS = css(el), elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth), child1 = getChild(el, 0, options), child2 = getChild(el, 1, options), firstChildCSS = child1 && css(child1), secondChildCSS = child2 && css(child2), firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width, secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;
    if (elCSS.display === "flex") {
      return elCSS.flexDirection === "column" || elCSS.flexDirection === "column-reverse" ? "vertical" : "horizontal";
    }
    if (elCSS.display === "grid") {
      return elCSS.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
    }
    if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== "none") {
      var touchingSideChild2 = firstChildCSS["float"] === "left" ? "left" : "right";
      return child2 && (secondChildCSS.clear === "both" || secondChildCSS.clear === touchingSideChild2) ? "vertical" : "horizontal";
    }
    return child1 && (firstChildCSS.display === "block" || firstChildCSS.display === "flex" || firstChildCSS.display === "table" || firstChildCSS.display === "grid" || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === "none" || child2 && elCSS[CSSFloatProperty] === "none" && firstChildWidth + secondChildWidth > elWidth) ? "vertical" : "horizontal";
  }, _dragElInRowColumn = function _dragElInRowColumn2(dragRect, targetRect, vertical) {
    var dragElS1Opp = vertical ? dragRect.left : dragRect.top, dragElS2Opp = vertical ? dragRect.right : dragRect.bottom, dragElOppLength = vertical ? dragRect.width : dragRect.height, targetS1Opp = vertical ? targetRect.left : targetRect.top, targetS2Opp = vertical ? targetRect.right : targetRect.bottom, targetOppLength = vertical ? targetRect.width : targetRect.height;
    return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
  }, _detectNearestEmptySortable = function _detectNearestEmptySortable2(x, y) {
    var ret;
    sortables.some(function(sortable) {
      var threshold = sortable[expando].options.emptyInsertThreshold;
      if (!threshold || lastChild(sortable)) return;
      var rect = getRect(sortable), insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold, insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;
      if (insideHorizontally && insideVertically) {
        return ret = sortable;
      }
    });
    return ret;
  }, _prepareGroup = function _prepareGroup2(options) {
    function toFn(value, pull) {
      return function(to, from, dragEl2, evt) {
        var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;
        if (value == null && (pull || sameGroup)) {
          return true;
        } else if (value == null || value === false) {
          return false;
        } else if (pull && value === "clone") {
          return value;
        } else if (typeof value === "function") {
          return toFn(value(to, from, dragEl2, evt), pull)(to, from, dragEl2, evt);
        } else {
          var otherGroup = (pull ? to : from).options.group.name;
          return value === true || typeof value === "string" && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
        }
      };
    }
    var group = {};
    var originalGroup = options.group;
    if (!originalGroup || _typeof(originalGroup) != "object") {
      originalGroup = {
        name: originalGroup
      };
    }
    group.name = originalGroup.name;
    group.checkPull = toFn(originalGroup.pull, true);
    group.checkPut = toFn(originalGroup.put);
    group.revertClone = originalGroup.revertClone;
    options.group = group;
  }, _hideGhostForTarget = function _hideGhostForTarget2() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, "display", "none");
    }
  }, _unhideGhostForTarget = function _unhideGhostForTarget2() {
    if (!supportCssPointerEvents && ghostEl) {
      css(ghostEl, "display", "");
    }
  };
  if (documentExists) {
    document.addEventListener("click", function(evt) {
      if (ignoreNextClick) {
        evt.preventDefault();
        evt.stopPropagation && evt.stopPropagation();
        evt.stopImmediatePropagation && evt.stopImmediatePropagation();
        ignoreNextClick = false;
        return false;
      }
    }, true);
  }
  var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent2(evt) {
    if (dragEl) {
      evt = evt.touches ? evt.touches[0] : evt;
      var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);
      if (nearest) {
        var event = {};
        for (var i in evt) {
          if (evt.hasOwnProperty(i)) {
            event[i] = evt[i];
          }
        }
        event.target = event.rootEl = nearest;
        event.preventDefault = void 0;
        event.stopPropagation = void 0;
        nearest[expando]._onDragOver(event);
      }
    }
  };
  var _checkOutsideTargetEl = function _checkOutsideTargetEl2(evt) {
    if (dragEl) {
      dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
    }
  };
  function Sortable(el, options) {
    if (!(el && el.nodeType && el.nodeType === 1)) {
      throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
    }
    this.el = el;
    this.options = options = _extends({}, options);
    el[expando] = this;
    var defaults2 = {
      group: null,
      sort: true,
      disabled: false,
      store: null,
      handle: null,
      draggable: /^[uo]l$/i.test(el.nodeName) ? ">li" : ">*",
      swapThreshold: 1,
      // percentage; 0 <= x <= 1
      invertSwap: false,
      // invert always
      invertedSwapThreshold: null,
      // will be set to same as swapThreshold if default
      removeCloneOnHide: true,
      direction: function direction() {
        return _detectDirection(el, this.options);
      },
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      ignore: "a, img",
      filter: null,
      preventOnFilter: true,
      animation: 0,
      easing: null,
      setData: function setData(dataTransfer, dragEl2) {
        dataTransfer.setData("Text", dragEl2.textContent);
      },
      dropBubble: false,
      dragoverBubble: false,
      dataIdAttr: "data-id",
      delay: 0,
      delayOnTouchOnly: false,
      touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
      forceFallback: false,
      fallbackClass: "sortable-fallback",
      fallbackOnBody: false,
      fallbackTolerance: 0,
      fallbackOffset: {
        x: 0,
        y: 0
      },
      supportPointer: Sortable.supportPointer !== false && "PointerEvent" in window && !Safari,
      emptyInsertThreshold: 5
    };
    PluginManager.initializePlugins(this, el, defaults2);
    for (var name in defaults2) {
      !(name in options) && (options[name] = defaults2[name]);
    }
    _prepareGroup(options);
    for (var fn in this) {
      if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
        this[fn] = this[fn].bind(this);
      }
    }
    this.nativeDraggable = options.forceFallback ? false : supportDraggable;
    if (this.nativeDraggable) {
      this.options.touchStartThreshold = 1;
    }
    if (options.supportPointer) {
      on(el, "pointerdown", this._onTapStart);
    } else {
      on(el, "mousedown", this._onTapStart);
      on(el, "touchstart", this._onTapStart);
    }
    if (this.nativeDraggable) {
      on(el, "dragover", this);
      on(el, "dragenter", this);
    }
    sortables.push(this.el);
    options.store && options.store.get && this.sort(options.store.get(this) || []);
    _extends(this, AnimationStateManager());
  }
  Sortable.prototype = /** @lends Sortable.prototype */
  {
    constructor: Sortable,
    _isOutsideThisEl: function _isOutsideThisEl(target) {
      if (!this.el.contains(target) && target !== this.el) {
        lastTarget = null;
      }
    },
    _getDirection: function _getDirection(evt, target) {
      return typeof this.options.direction === "function" ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
    },
    _onTapStart: function _onTapStart(evt) {
      if (!evt.cancelable) return;
      var _this = this, el = this.el, options = this.options, preventOnFilter = options.preventOnFilter, type = evt.type, touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === "touch" && evt, target = (touch || evt).target, originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target, filter = options.filter;
      _saveInputCheckedState(el);
      if (dragEl) {
        return;
      }
      if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
        return;
      }
      if (originalTarget.isContentEditable) {
        return;
      }
      if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === "SELECT") {
        return;
      }
      target = closest(target, options.draggable, el, false);
      if (target && target.animated) {
        return;
      }
      if (lastDownEl === target) {
        return;
      }
      oldIndex = index$1(target);
      oldDraggableIndex = index$1(target, options.draggable);
      if (typeof filter === "function") {
        if (filter.call(this, evt, target, this)) {
          _dispatchEvent({
            sortable: _this,
            rootEl: originalTarget,
            name: "filter",
            targetEl: target,
            toEl: el,
            fromEl: el
          });
          pluginEvent("filter", _this, {
            evt
          });
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return;
        }
      } else if (filter) {
        filter = filter.split(",").some(function(criteria) {
          criteria = closest(originalTarget, criteria.trim(), el, false);
          if (criteria) {
            _dispatchEvent({
              sortable: _this,
              rootEl: criteria,
              name: "filter",
              targetEl: target,
              fromEl: el,
              toEl: el
            });
            pluginEvent("filter", _this, {
              evt
            });
            return true;
          }
        });
        if (filter) {
          preventOnFilter && evt.cancelable && evt.preventDefault();
          return;
        }
      }
      if (options.handle && !closest(originalTarget, options.handle, el, false)) {
        return;
      }
      this._prepareDragStart(evt, touch, target);
    },
    _prepareDragStart: function _prepareDragStart(evt, touch, target) {
      var _this = this, el = _this.el, options = _this.options, ownerDocument = el.ownerDocument, dragStartFn;
      if (target && !dragEl && target.parentNode === el) {
        var dragRect = getRect(target);
        rootEl = el;
        dragEl = target;
        parentEl = dragEl.parentNode;
        nextEl = dragEl.nextSibling;
        lastDownEl = target;
        activeGroup = options.group;
        Sortable.dragged = dragEl;
        tapEvt = {
          target: dragEl,
          clientX: (touch || evt).clientX,
          clientY: (touch || evt).clientY
        };
        tapDistanceLeft = tapEvt.clientX - dragRect.left;
        tapDistanceTop = tapEvt.clientY - dragRect.top;
        this._lastX = (touch || evt).clientX;
        this._lastY = (touch || evt).clientY;
        dragEl.style["will-change"] = "all";
        dragStartFn = function dragStartFn2() {
          pluginEvent("delayEnded", _this, {
            evt
          });
          if (Sortable.eventCanceled) {
            _this._onDrop();
            return;
          }
          _this._disableDelayedDragEvents();
          if (!FireFox && _this.nativeDraggable) {
            dragEl.draggable = true;
          }
          _this._triggerDragStart(evt, touch);
          _dispatchEvent({
            sortable: _this,
            name: "choose",
            originalEvent: evt
          });
          toggleClass(dragEl, options.chosenClass, true);
        };
        options.ignore.split(",").forEach(function(criteria) {
          find(dragEl, criteria.trim(), _disableDraggable);
        });
        on(ownerDocument, "dragover", nearestEmptyInsertDetectEvent);
        on(ownerDocument, "mousemove", nearestEmptyInsertDetectEvent);
        on(ownerDocument, "touchmove", nearestEmptyInsertDetectEvent);
        on(ownerDocument, "mouseup", _this._onDrop);
        on(ownerDocument, "touchend", _this._onDrop);
        on(ownerDocument, "touchcancel", _this._onDrop);
        if (FireFox && this.nativeDraggable) {
          this.options.touchStartThreshold = 4;
          dragEl.draggable = true;
        }
        pluginEvent("delayStart", this, {
          evt
        });
        if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
          if (Sortable.eventCanceled) {
            this._onDrop();
            return;
          }
          on(ownerDocument, "mouseup", _this._disableDelayedDrag);
          on(ownerDocument, "touchend", _this._disableDelayedDrag);
          on(ownerDocument, "touchcancel", _this._disableDelayedDrag);
          on(ownerDocument, "mousemove", _this._delayedDragTouchMoveHandler);
          on(ownerDocument, "touchmove", _this._delayedDragTouchMoveHandler);
          options.supportPointer && on(ownerDocument, "pointermove", _this._delayedDragTouchMoveHandler);
          _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
        } else {
          dragStartFn();
        }
      }
    },
    _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(e) {
      var touch = e.touches ? e.touches[0] : e;
      if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
        this._disableDelayedDrag();
      }
    },
    _disableDelayedDrag: function _disableDelayedDrag() {
      dragEl && _disableDraggable(dragEl);
      clearTimeout(this._dragStartTimer);
      this._disableDelayedDragEvents();
    },
    _disableDelayedDragEvents: function _disableDelayedDragEvents() {
      var ownerDocument = this.el.ownerDocument;
      off(ownerDocument, "mouseup", this._disableDelayedDrag);
      off(ownerDocument, "touchend", this._disableDelayedDrag);
      off(ownerDocument, "touchcancel", this._disableDelayedDrag);
      off(ownerDocument, "mousemove", this._delayedDragTouchMoveHandler);
      off(ownerDocument, "touchmove", this._delayedDragTouchMoveHandler);
      off(ownerDocument, "pointermove", this._delayedDragTouchMoveHandler);
    },
    _triggerDragStart: function _triggerDragStart(evt, touch) {
      touch = touch || evt.pointerType == "touch" && evt;
      if (!this.nativeDraggable || touch) {
        if (this.options.supportPointer) {
          on(document, "pointermove", this._onTouchMove);
        } else if (touch) {
          on(document, "touchmove", this._onTouchMove);
        } else {
          on(document, "mousemove", this._onTouchMove);
        }
      } else {
        on(dragEl, "dragend", this);
        on(rootEl, "dragstart", this._onDragStart);
      }
      try {
        if (document.selection) {
          _nextTick(function() {
            document.selection.empty();
          });
        } else {
          window.getSelection().removeAllRanges();
        }
      } catch (err) {
      }
    },
    _dragStarted: function _dragStarted(fallback, evt) {
      awaitingDragStarted = false;
      if (rootEl && dragEl) {
        pluginEvent("dragStarted", this, {
          evt
        });
        if (this.nativeDraggable) {
          on(document, "dragover", _checkOutsideTargetEl);
        }
        var options = this.options;
        !fallback && toggleClass(dragEl, options.dragClass, false);
        toggleClass(dragEl, options.ghostClass, true);
        Sortable.active = this;
        fallback && this._appendGhost();
        _dispatchEvent({
          sortable: this,
          name: "start",
          originalEvent: evt
        });
      } else {
        this._nulling();
      }
    },
    _emulateDragOver: function _emulateDragOver() {
      if (touchEvt) {
        this._lastX = touchEvt.clientX;
        this._lastY = touchEvt.clientY;
        _hideGhostForTarget();
        var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
        var parent = target;
        while (target && target.shadowRoot) {
          target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
          if (target === parent) break;
          parent = target;
        }
        dragEl.parentNode[expando]._isOutsideThisEl(target);
        if (parent) {
          do {
            if (parent[expando]) {
              var inserted = void 0;
              inserted = parent[expando]._onDragOver({
                clientX: touchEvt.clientX,
                clientY: touchEvt.clientY,
                target,
                rootEl: parent
              });
              if (inserted && !this.options.dragoverBubble) {
                break;
              }
            }
            target = parent;
          } while (parent = parent.parentNode);
        }
        _unhideGhostForTarget();
      }
    },
    _onTouchMove: function _onTouchMove(evt) {
      if (tapEvt) {
        var options = this.options, fallbackTolerance = options.fallbackTolerance, fallbackOffset = options.fallbackOffset, touch = evt.touches ? evt.touches[0] : evt, ghostMatrix = ghostEl && matrix(ghostEl, true), scaleX = ghostEl && ghostMatrix && ghostMatrix.a, scaleY = ghostEl && ghostMatrix && ghostMatrix.d, relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent), dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1), dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1);
        if (!Sortable.active && !awaitingDragStarted) {
          if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
            return;
          }
          this._onDragStart(evt, true);
        }
        if (ghostEl) {
          if (ghostMatrix) {
            ghostMatrix.e += dx - (lastDx || 0);
            ghostMatrix.f += dy - (lastDy || 0);
          } else {
            ghostMatrix = {
              a: 1,
              b: 0,
              c: 0,
              d: 1,
              e: dx,
              f: dy
            };
          }
          var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
          css(ghostEl, "webkitTransform", cssMatrix);
          css(ghostEl, "mozTransform", cssMatrix);
          css(ghostEl, "msTransform", cssMatrix);
          css(ghostEl, "transform", cssMatrix);
          lastDx = dx;
          lastDy = dy;
          touchEvt = touch;
        }
        evt.cancelable && evt.preventDefault();
      }
    },
    _appendGhost: function _appendGhost() {
      if (!ghostEl) {
        var container = this.options.fallbackOnBody ? document.body : rootEl, rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container), options = this.options;
        if (PositionGhostAbsolutely) {
          ghostRelativeParent = container;
          while (css(ghostRelativeParent, "position") === "static" && css(ghostRelativeParent, "transform") === "none" && ghostRelativeParent !== document) {
            ghostRelativeParent = ghostRelativeParent.parentNode;
          }
          if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
            if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
            rect.top += ghostRelativeParent.scrollTop;
            rect.left += ghostRelativeParent.scrollLeft;
          } else {
            ghostRelativeParent = getWindowScrollingElement();
          }
          ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
        }
        ghostEl = dragEl.cloneNode(true);
        toggleClass(ghostEl, options.ghostClass, false);
        toggleClass(ghostEl, options.fallbackClass, true);
        toggleClass(ghostEl, options.dragClass, true);
        css(ghostEl, "transition", "");
        css(ghostEl, "transform", "");
        css(ghostEl, "box-sizing", "border-box");
        css(ghostEl, "margin", 0);
        css(ghostEl, "top", rect.top);
        css(ghostEl, "left", rect.left);
        css(ghostEl, "width", rect.width);
        css(ghostEl, "height", rect.height);
        css(ghostEl, "opacity", "0.8");
        css(ghostEl, "position", PositionGhostAbsolutely ? "absolute" : "fixed");
        css(ghostEl, "zIndex", "100000");
        css(ghostEl, "pointerEvents", "none");
        Sortable.ghost = ghostEl;
        container.appendChild(ghostEl);
        css(ghostEl, "transform-origin", tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + "% " + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + "%");
      }
    },
    _onDragStart: function _onDragStart(evt, fallback) {
      var _this = this;
      var dataTransfer = evt.dataTransfer;
      var options = _this.options;
      pluginEvent("dragStart", this, {
        evt
      });
      if (Sortable.eventCanceled) {
        this._onDrop();
        return;
      }
      pluginEvent("setupClone", this);
      if (!Sortable.eventCanceled) {
        cloneEl = clone(dragEl);
        cloneEl.draggable = false;
        cloneEl.style["will-change"] = "";
        this._hideClone();
        toggleClass(cloneEl, this.options.chosenClass, false);
        Sortable.clone = cloneEl;
      }
      _this.cloneId = _nextTick(function() {
        pluginEvent("clone", _this);
        if (Sortable.eventCanceled) return;
        if (!_this.options.removeCloneOnHide) {
          rootEl.insertBefore(cloneEl, dragEl);
        }
        _this._hideClone();
        _dispatchEvent({
          sortable: _this,
          name: "clone"
        });
      });
      !fallback && toggleClass(dragEl, options.dragClass, true);
      if (fallback) {
        ignoreNextClick = true;
        _this._loopId = setInterval(_this._emulateDragOver, 50);
      } else {
        off(document, "mouseup", _this._onDrop);
        off(document, "touchend", _this._onDrop);
        off(document, "touchcancel", _this._onDrop);
        if (dataTransfer) {
          dataTransfer.effectAllowed = "move";
          options.setData && options.setData.call(_this, dataTransfer, dragEl);
        }
        on(document, "drop", _this);
        css(dragEl, "transform", "translateZ(0)");
      }
      awaitingDragStarted = true;
      _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
      on(document, "selectstart", _this);
      moved = true;
      if (Safari) {
        css(document.body, "user-select", "none");
      }
    },
    // Returns true - if no further action is needed (either inserted or another condition)
    _onDragOver: function _onDragOver(evt) {
      var el = this.el, target = evt.target, dragRect, targetRect, revert, options = this.options, group = options.group, activeSortable = Sortable.active, isOwner = activeGroup === group, canSort = options.sort, fromSortable = putSortable || activeSortable, vertical, _this = this, completedFired = false;
      if (_silent) return;
      function dragOverEvent(name, extra) {
        pluginEvent(name, _this, _objectSpread2({
          evt,
          isOwner,
          axis: vertical ? "vertical" : "horizontal",
          revert,
          dragRect,
          targetRect,
          canSort,
          fromSortable,
          target,
          completed,
          onMove: function onMove(target2, after2) {
            return _onMove(rootEl, el, dragEl, dragRect, target2, getRect(target2), evt, after2);
          },
          changed
        }, extra));
      }
      function capture() {
        dragOverEvent("dragOverAnimationCapture");
        _this.captureAnimationState();
        if (_this !== fromSortable) {
          fromSortable.captureAnimationState();
        }
      }
      function completed(insertion) {
        dragOverEvent("dragOverCompleted", {
          insertion
        });
        if (insertion) {
          if (isOwner) {
            activeSortable._hideClone();
          } else {
            activeSortable._showClone(_this);
          }
          if (_this !== fromSortable) {
            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
            toggleClass(dragEl, options.ghostClass, true);
          }
          if (putSortable !== _this && _this !== Sortable.active) {
            putSortable = _this;
          } else if (_this === Sortable.active && putSortable) {
            putSortable = null;
          }
          if (fromSortable === _this) {
            _this._ignoreWhileAnimating = target;
          }
          _this.animateAll(function() {
            dragOverEvent("dragOverAnimationComplete");
            _this._ignoreWhileAnimating = null;
          });
          if (_this !== fromSortable) {
            fromSortable.animateAll();
            fromSortable._ignoreWhileAnimating = null;
          }
        }
        if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
          lastTarget = null;
        }
        if (!options.dragoverBubble && !evt.rootEl && target !== document) {
          dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
          !insertion && nearestEmptyInsertDetectEvent(evt);
        }
        !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
        return completedFired = true;
      }
      function changed() {
        newIndex = index$1(dragEl);
        newDraggableIndex = index$1(dragEl, options.draggable);
        _dispatchEvent({
          sortable: _this,
          name: "change",
          toEl: el,
          newIndex,
          newDraggableIndex,
          originalEvent: evt
        });
      }
      if (evt.preventDefault !== void 0) {
        evt.cancelable && evt.preventDefault();
      }
      target = closest(target, options.draggable, el, true);
      dragOverEvent("dragOver");
      if (Sortable.eventCanceled) return completedFired;
      if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
        return completed(false);
      }
      ignoreNextClick = false;
      if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = parentEl !== rootEl) : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
        vertical = this._getDirection(evt, target) === "vertical";
        dragRect = getRect(dragEl);
        dragOverEvent("dragOverValid");
        if (Sortable.eventCanceled) return completedFired;
        if (revert) {
          parentEl = rootEl;
          capture();
          this._hideClone();
          dragOverEvent("revert");
          if (!Sortable.eventCanceled) {
            if (nextEl) {
              rootEl.insertBefore(dragEl, nextEl);
            } else {
              rootEl.appendChild(dragEl);
            }
          }
          return completed(true);
        }
        var elLastChild = lastChild(el, options.draggable);
        if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
          if (elLastChild === dragEl) {
            return completed(false);
          }
          if (elLastChild && el === evt.target) {
            target = elLastChild;
          }
          if (target) {
            targetRect = getRect(target);
          }
          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
            capture();
            el.appendChild(dragEl);
            parentEl = el;
            changed();
            return completed(true);
          }
        } else if (elLastChild && _ghostIsFirst(evt, vertical, this)) {
          var firstChild = getChild(el, 0, options, true);
          if (firstChild === dragEl) {
            return completed(false);
          }
          target = firstChild;
          targetRect = getRect(target);
          if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, false) !== false) {
            capture();
            el.insertBefore(dragEl, firstChild);
            parentEl = el;
            changed();
            return completed(true);
          }
        } else if (target.parentNode === el) {
          targetRect = getRect(target);
          var direction = 0, targetBeforeFirstSwap, differentLevel = dragEl.parentNode !== el, differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical), side1 = vertical ? "top" : "left", scrolledPastTop = isScrolledPast(target, "top", "top") || isScrolledPast(dragEl, "top", "top"), scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;
          if (lastTarget !== target) {
            targetBeforeFirstSwap = targetRect[side1];
            pastFirstInvertThresh = false;
            isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
          }
          direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
          var sibling;
          if (direction !== 0) {
            var dragIndex = index$1(dragEl);
            do {
              dragIndex -= direction;
              sibling = parentEl.children[dragIndex];
            } while (sibling && (css(sibling, "display") === "none" || sibling === ghostEl));
          }
          if (direction === 0 || sibling === target) {
            return completed(false);
          }
          lastTarget = target;
          lastDirection = direction;
          var nextSibling = target.nextElementSibling, after = false;
          after = direction === 1;
          var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);
          if (moveVector !== false) {
            if (moveVector === 1 || moveVector === -1) {
              after = moveVector === 1;
            }
            _silent = true;
            setTimeout(_unsilent, 30);
            capture();
            if (after && !nextSibling) {
              el.appendChild(dragEl);
            } else {
              target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
            }
            if (scrolledPastTop) {
              scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
            }
            parentEl = dragEl.parentNode;
            if (targetBeforeFirstSwap !== void 0 && !isCircumstantialInvert) {
              targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
            }
            changed();
            return completed(true);
          }
        }
        if (el.contains(dragEl)) {
          return completed(false);
        }
      }
      return false;
    },
    _ignoreWhileAnimating: null,
    _offMoveEvents: function _offMoveEvents() {
      off(document, "mousemove", this._onTouchMove);
      off(document, "touchmove", this._onTouchMove);
      off(document, "pointermove", this._onTouchMove);
      off(document, "dragover", nearestEmptyInsertDetectEvent);
      off(document, "mousemove", nearestEmptyInsertDetectEvent);
      off(document, "touchmove", nearestEmptyInsertDetectEvent);
    },
    _offUpEvents: function _offUpEvents() {
      var ownerDocument = this.el.ownerDocument;
      off(ownerDocument, "mouseup", this._onDrop);
      off(ownerDocument, "touchend", this._onDrop);
      off(ownerDocument, "pointerup", this._onDrop);
      off(ownerDocument, "touchcancel", this._onDrop);
      off(document, "selectstart", this);
    },
    _onDrop: function _onDrop(evt) {
      var el = this.el, options = this.options;
      newIndex = index$1(dragEl);
      newDraggableIndex = index$1(dragEl, options.draggable);
      pluginEvent("drop", this, {
        evt
      });
      parentEl = dragEl && dragEl.parentNode;
      newIndex = index$1(dragEl);
      newDraggableIndex = index$1(dragEl, options.draggable);
      if (Sortable.eventCanceled) {
        this._nulling();
        return;
      }
      awaitingDragStarted = false;
      isCircumstantialInvert = false;
      pastFirstInvertThresh = false;
      clearInterval(this._loopId);
      clearTimeout(this._dragStartTimer);
      _cancelNextTick(this.cloneId);
      _cancelNextTick(this._dragStartId);
      if (this.nativeDraggable) {
        off(document, "drop", this);
        off(el, "dragstart", this._onDragStart);
      }
      this._offMoveEvents();
      this._offUpEvents();
      if (Safari) {
        css(document.body, "user-select", "");
      }
      css(dragEl, "transform", "");
      if (evt) {
        if (moved) {
          evt.cancelable && evt.preventDefault();
          !options.dropBubble && evt.stopPropagation();
        }
        ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);
        if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== "clone") {
          cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
        }
        if (dragEl) {
          if (this.nativeDraggable) {
            off(dragEl, "dragend", this);
          }
          _disableDraggable(dragEl);
          dragEl.style["will-change"] = "";
          if (moved && !awaitingDragStarted) {
            toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
          }
          toggleClass(dragEl, this.options.chosenClass, false);
          _dispatchEvent({
            sortable: this,
            name: "unchoose",
            toEl: parentEl,
            newIndex: null,
            newDraggableIndex: null,
            originalEvent: evt
          });
          if (rootEl !== parentEl) {
            if (newIndex >= 0) {
              _dispatchEvent({
                rootEl: parentEl,
                name: "add",
                toEl: parentEl,
                fromEl: rootEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "remove",
                toEl: parentEl,
                originalEvent: evt
              });
              _dispatchEvent({
                rootEl: parentEl,
                name: "sort",
                toEl: parentEl,
                fromEl: rootEl,
                originalEvent: evt
              });
              _dispatchEvent({
                sortable: this,
                name: "sort",
                toEl: parentEl,
                originalEvent: evt
              });
            }
            putSortable && putSortable.save();
          } else {
            if (newIndex !== oldIndex) {
              if (newIndex >= 0) {
                _dispatchEvent({
                  sortable: this,
                  name: "update",
                  toEl: parentEl,
                  originalEvent: evt
                });
                _dispatchEvent({
                  sortable: this,
                  name: "sort",
                  toEl: parentEl,
                  originalEvent: evt
                });
              }
            }
          }
          if (Sortable.active) {
            if (newIndex == null || newIndex === -1) {
              newIndex = oldIndex;
              newDraggableIndex = oldDraggableIndex;
            }
            _dispatchEvent({
              sortable: this,
              name: "end",
              toEl: parentEl,
              originalEvent: evt
            });
            this.save();
          }
        }
      }
      this._nulling();
    },
    _nulling: function _nulling() {
      pluginEvent("nulling", this);
      rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
      savedInputChecked.forEach(function(el) {
        el.checked = true;
      });
      savedInputChecked.length = lastDx = lastDy = 0;
    },
    handleEvent: function handleEvent(evt) {
      switch (evt.type) {
        case "drop":
        case "dragend":
          this._onDrop(evt);
          break;
        case "dragenter":
        case "dragover":
          if (dragEl) {
            this._onDragOver(evt);
            _globalDragOver(evt);
          }
          break;
        case "selectstart":
          evt.preventDefault();
          break;
      }
    },
    /**
     * Serializes the item into an array of string.
     * @returns {String[]}
     */
    toArray: function toArray() {
      var order = [], el, children = this.el.children, i = 0, n = children.length, options = this.options;
      for (; i < n; i++) {
        el = children[i];
        if (closest(el, options.draggable, this.el, false)) {
          order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
        }
      }
      return order;
    },
    /**
     * Sorts the elements according to the array.
     * @param  {String[]}  order  order of the items
     */
    sort: function sort(order, useAnimation) {
      var items = {}, rootEl2 = this.el;
      this.toArray().forEach(function(id, i) {
        var el = rootEl2.children[i];
        if (closest(el, this.options.draggable, rootEl2, false)) {
          items[id] = el;
        }
      }, this);
      useAnimation && this.captureAnimationState();
      order.forEach(function(id) {
        if (items[id]) {
          rootEl2.removeChild(items[id]);
          rootEl2.appendChild(items[id]);
        }
      });
      useAnimation && this.animateAll();
    },
    /**
     * Save the current sorting
     */
    save: function save() {
      var store = this.options.store;
      store && store.set && store.set(this);
    },
    /**
     * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
     * @param   {HTMLElement}  el
     * @param   {String}       [selector]  default: `options.draggable`
     * @returns {HTMLElement|null}
     */
    closest: function closest$1(el, selector) {
      return closest(el, selector || this.options.draggable, this.el, false);
    },
    /**
     * Set/get option
     * @param   {string} name
     * @param   {*}      [value]
     * @returns {*}
     */
    option: function option(name, value) {
      var options = this.options;
      if (value === void 0) {
        return options[name];
      } else {
        var modifiedValue = PluginManager.modifyOption(this, name, value);
        if (typeof modifiedValue !== "undefined") {
          options[name] = modifiedValue;
        } else {
          options[name] = value;
        }
        if (name === "group") {
          _prepareGroup(options);
        }
      }
    },
    /**
     * Destroy
     */
    destroy: function destroy() {
      pluginEvent("destroy", this);
      var el = this.el;
      el[expando] = null;
      off(el, "mousedown", this._onTapStart);
      off(el, "touchstart", this._onTapStart);
      off(el, "pointerdown", this._onTapStart);
      if (this.nativeDraggable) {
        off(el, "dragover", this);
        off(el, "dragenter", this);
      }
      Array.prototype.forEach.call(el.querySelectorAll("[draggable]"), function(el2) {
        el2.removeAttribute("draggable");
      });
      this._onDrop();
      this._disableDelayedDragEvents();
      sortables.splice(sortables.indexOf(this.el), 1);
      this.el = el = null;
    },
    _hideClone: function _hideClone() {
      if (!cloneHidden) {
        pluginEvent("hideClone", this);
        if (Sortable.eventCanceled) return;
        css(cloneEl, "display", "none");
        if (this.options.removeCloneOnHide && cloneEl.parentNode) {
          cloneEl.parentNode.removeChild(cloneEl);
        }
        cloneHidden = true;
      }
    },
    _showClone: function _showClone(putSortable2) {
      if (putSortable2.lastPutMode !== "clone") {
        this._hideClone();
        return;
      }
      if (cloneHidden) {
        pluginEvent("showClone", this);
        if (Sortable.eventCanceled) return;
        if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
          rootEl.insertBefore(cloneEl, dragEl);
        } else if (nextEl) {
          rootEl.insertBefore(cloneEl, nextEl);
        } else {
          rootEl.appendChild(cloneEl);
        }
        if (this.options.group.revertClone) {
          this.animate(dragEl, cloneEl);
        }
        css(cloneEl, "display", "");
        cloneHidden = false;
      }
    }
  };
  function _globalDragOver(evt) {
    if (evt.dataTransfer) {
      evt.dataTransfer.dropEffect = "move";
    }
    evt.cancelable && evt.preventDefault();
  }
  function _onMove(fromEl, toEl, dragEl2, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
    var evt, sortable = fromEl[expando], onMoveFn = sortable.options.onMove, retVal;
    if (window.CustomEvent && !IE11OrLess && !Edge) {
      evt = new CustomEvent("move", {
        bubbles: true,
        cancelable: true
      });
    } else {
      evt = document.createEvent("Event");
      evt.initEvent("move", true, true);
    }
    evt.to = toEl;
    evt.from = fromEl;
    evt.dragged = dragEl2;
    evt.draggedRect = dragRect;
    evt.related = targetEl || toEl;
    evt.relatedRect = targetRect || getRect(toEl);
    evt.willInsertAfter = willInsertAfter;
    evt.originalEvent = originalEvent;
    fromEl.dispatchEvent(evt);
    if (onMoveFn) {
      retVal = onMoveFn.call(sortable, evt, originalEvent);
    }
    return retVal;
  }
  function _disableDraggable(el) {
    el.draggable = false;
  }
  function _unsilent() {
    _silent = false;
  }
  function _ghostIsFirst(evt, vertical, sortable) {
    var rect = getRect(getChild(sortable.el, 0, sortable.options, true));
    var spacer = 10;
    return vertical ? evt.clientX < rect.left - spacer || evt.clientY < rect.top && evt.clientX < rect.right : evt.clientY < rect.top - spacer || evt.clientY < rect.bottom && evt.clientX < rect.left;
  }
  function _ghostIsLast(evt, vertical, sortable) {
    var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
    var spacer = 10;
    return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
  }
  function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
    var mouseOnAxis = vertical ? evt.clientY : evt.clientX, targetLength = vertical ? targetRect.height : targetRect.width, targetS1 = vertical ? targetRect.top : targetRect.left, targetS2 = vertical ? targetRect.bottom : targetRect.right, invert = false;
    if (!invertSwap) {
      if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
        if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
          pastFirstInvertThresh = true;
        }
        if (!pastFirstInvertThresh) {
          if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance : mouseOnAxis > targetS2 - targetMoveDistance) {
            return -lastDirection;
          }
        } else {
          invert = true;
        }
      } else {
        if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
          return _getInsertDirection(target);
        }
      }
    }
    invert = invert || invertSwap;
    if (invert) {
      if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
        return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
      }
    }
    return 0;
  }
  function _getInsertDirection(target) {
    if (index$1(dragEl) < index$1(target)) {
      return 1;
    } else {
      return -1;
    }
  }
  function _generateId(el) {
    var str = el.tagName + el.className + el.src + el.href + el.textContent, i = str.length, sum = 0;
    while (i--) {
      sum += str.charCodeAt(i);
    }
    return sum.toString(36);
  }
  function _saveInputCheckedState(root2) {
    savedInputChecked.length = 0;
    var inputs = root2.getElementsByTagName("input");
    var idx = inputs.length;
    while (idx--) {
      var el = inputs[idx];
      el.checked && savedInputChecked.push(el);
    }
  }
  function _nextTick(fn) {
    return setTimeout(fn, 0);
  }
  function _cancelNextTick(id) {
    return clearTimeout(id);
  }
  if (documentExists) {
    on(document, "touchmove", function(evt) {
      if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
        evt.preventDefault();
      }
    });
  }
  Sortable.utils = {
    on,
    off,
    css,
    find,
    is: function is(el, selector) {
      return !!closest(el, selector, el, false);
    },
    extend,
    throttle,
    closest,
    toggleClass,
    clone,
    index: index$1,
    nextTick: _nextTick,
    cancelNextTick: _cancelNextTick,
    detectDirection: _detectDirection,
    getChild
  };
  Sortable.get = function(element) {
    return element[expando];
  };
  Sortable.mount = function() {
    for (var _len = arguments.length, plugins2 = new Array(_len), _key = 0; _key < _len; _key++) {
      plugins2[_key] = arguments[_key];
    }
    if (plugins2[0].constructor === Array) plugins2 = plugins2[0];
    plugins2.forEach(function(plugin) {
      if (!plugin.prototype || !plugin.prototype.constructor) {
        throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
      }
      if (plugin.utils) Sortable.utils = _objectSpread2(_objectSpread2({}, Sortable.utils), plugin.utils);
      PluginManager.mount(plugin);
    });
  };
  Sortable.create = function(el, options) {
    return new Sortable(el, options);
  };
  Sortable.version = version;
  var autoScrolls = [], scrollEl, scrollRootEl, scrolling = false, lastAutoScrollX, lastAutoScrollY, touchEvt$1, pointerElemChangedInterval;
  function AutoScrollPlugin() {
    function AutoScroll() {
      this.defaults = {
        scroll: true,
        forceAutoScrollFallback: false,
        scrollSensitivity: 30,
        scrollSpeed: 10,
        bubbleScroll: true
      };
      for (var fn in this) {
        if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
          this[fn] = this[fn].bind(this);
        }
      }
    }
    AutoScroll.prototype = {
      dragStarted: function dragStarted2(_ref) {
        var originalEvent = _ref.originalEvent;
        if (this.sortable.nativeDraggable) {
          on(document, "dragover", this._handleAutoScroll);
        } else {
          if (this.options.supportPointer) {
            on(document, "pointermove", this._handleFallbackAutoScroll);
          } else if (originalEvent.touches) {
            on(document, "touchmove", this._handleFallbackAutoScroll);
          } else {
            on(document, "mousemove", this._handleFallbackAutoScroll);
          }
        }
      },
      dragOverCompleted: function dragOverCompleted(_ref2) {
        var originalEvent = _ref2.originalEvent;
        if (!this.options.dragOverBubble && !originalEvent.rootEl) {
          this._handleAutoScroll(originalEvent);
        }
      },
      drop: function drop2() {
        if (this.sortable.nativeDraggable) {
          off(document, "dragover", this._handleAutoScroll);
        } else {
          off(document, "pointermove", this._handleFallbackAutoScroll);
          off(document, "touchmove", this._handleFallbackAutoScroll);
          off(document, "mousemove", this._handleFallbackAutoScroll);
        }
        clearPointerElemChangedInterval();
        clearAutoScrolls();
        cancelThrottle();
      },
      nulling: function nulling() {
        touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
        autoScrolls.length = 0;
      },
      _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
        this._handleAutoScroll(evt, true);
      },
      _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
        var _this = this;
        var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, elem = document.elementFromPoint(x, y);
        touchEvt$1 = evt;
        if (fallback || this.options.forceAutoScrollFallback || Edge || IE11OrLess || Safari) {
          autoScroll(evt, this.options, elem, fallback);
          var ogElemScroller = getParentAutoScrollElement(elem, true);
          if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
            pointerElemChangedInterval && clearPointerElemChangedInterval();
            pointerElemChangedInterval = setInterval(function() {
              var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);
              if (newElem !== ogElemScroller) {
                ogElemScroller = newElem;
                clearAutoScrolls();
              }
              autoScroll(evt, _this.options, newElem, fallback);
            }, 10);
            lastAutoScrollX = x;
            lastAutoScrollY = y;
          }
        } else {
          if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
            clearAutoScrolls();
            return;
          }
          autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
        }
      }
    };
    return _extends(AutoScroll, {
      pluginName: "scroll",
      initializeByDefault: true
    });
  }
  function clearAutoScrolls() {
    autoScrolls.forEach(function(autoScroll2) {
      clearInterval(autoScroll2.pid);
    });
    autoScrolls = [];
  }
  function clearPointerElemChangedInterval() {
    clearInterval(pointerElemChangedInterval);
  }
  var autoScroll = throttle(function(evt, options, rootEl2, isFallback) {
    if (!options.scroll) return;
    var x = (evt.touches ? evt.touches[0] : evt).clientX, y = (evt.touches ? evt.touches[0] : evt).clientY, sens = options.scrollSensitivity, speed = options.scrollSpeed, winScroller = getWindowScrollingElement();
    var scrollThisInstance = false, scrollCustomFn;
    if (scrollRootEl !== rootEl2) {
      scrollRootEl = rootEl2;
      clearAutoScrolls();
      scrollEl = options.scroll;
      scrollCustomFn = options.scrollFn;
      if (scrollEl === true) {
        scrollEl = getParentAutoScrollElement(rootEl2, true);
      }
    }
    var layersOut = 0;
    var currentParent = scrollEl;
    do {
      var el = currentParent, rect = getRect(el), top = rect.top, bottom = rect.bottom, left = rect.left, right = rect.right, width = rect.width, height = rect.height, canScrollX = void 0, canScrollY = void 0, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight, elCSS = css(el), scrollPosX = el.scrollLeft, scrollPosY = el.scrollTop;
      if (el === winScroller) {
        canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll" || elCSS.overflowX === "visible");
        canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll" || elCSS.overflowY === "visible");
      } else {
        canScrollX = width < scrollWidth && (elCSS.overflowX === "auto" || elCSS.overflowX === "scroll");
        canScrollY = height < scrollHeight && (elCSS.overflowY === "auto" || elCSS.overflowY === "scroll");
      }
      var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
      var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);
      if (!autoScrolls[layersOut]) {
        for (var i = 0; i <= layersOut; i++) {
          if (!autoScrolls[i]) {
            autoScrolls[i] = {};
          }
        }
      }
      if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
        autoScrolls[layersOut].el = el;
        autoScrolls[layersOut].vx = vx;
        autoScrolls[layersOut].vy = vy;
        clearInterval(autoScrolls[layersOut].pid);
        if (vx != 0 || vy != 0) {
          scrollThisInstance = true;
          autoScrolls[layersOut].pid = setInterval((function() {
            if (isFallback && this.layer === 0) {
              Sortable.active._onTouchMove(touchEvt$1);
            }
            var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
            var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;
            if (typeof scrollCustomFn === "function") {
              if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== "continue") {
                return;
              }
            }
            scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
          }).bind({
            layer: layersOut
          }), 24);
        }
      }
      layersOut++;
    } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));
    scrolling = scrollThisInstance;
  }, 30);
  var drop = function drop2(_ref) {
    var originalEvent = _ref.originalEvent, putSortable2 = _ref.putSortable, dragEl2 = _ref.dragEl, activeSortable = _ref.activeSortable, dispatchSortableEvent = _ref.dispatchSortableEvent, hideGhostForTarget = _ref.hideGhostForTarget, unhideGhostForTarget = _ref.unhideGhostForTarget;
    if (!originalEvent) return;
    var toSortable = putSortable2 || activeSortable;
    hideGhostForTarget();
    var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
    var target = document.elementFromPoint(touch.clientX, touch.clientY);
    unhideGhostForTarget();
    if (toSortable && !toSortable.el.contains(target)) {
      dispatchSortableEvent("spill");
      this.onSpill({
        dragEl: dragEl2,
        putSortable: putSortable2
      });
    }
  };
  function Revert() {
  }
  Revert.prototype = {
    startIndex: null,
    dragStart: function dragStart(_ref2) {
      var oldDraggableIndex2 = _ref2.oldDraggableIndex;
      this.startIndex = oldDraggableIndex2;
    },
    onSpill: function onSpill(_ref3) {
      var dragEl2 = _ref3.dragEl, putSortable2 = _ref3.putSortable;
      this.sortable.captureAnimationState();
      if (putSortable2) {
        putSortable2.captureAnimationState();
      }
      var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);
      if (nextSibling) {
        this.sortable.el.insertBefore(dragEl2, nextSibling);
      } else {
        this.sortable.el.appendChild(dragEl2);
      }
      this.sortable.animateAll();
      if (putSortable2) {
        putSortable2.animateAll();
      }
    },
    drop
  };
  _extends(Revert, {
    pluginName: "revertOnSpill"
  });
  function Remove() {
  }
  Remove.prototype = {
    onSpill: function onSpill(_ref4) {
      var dragEl2 = _ref4.dragEl, putSortable2 = _ref4.putSortable;
      var parentSortable = putSortable2 || this.sortable;
      parentSortable.captureAnimationState();
      dragEl2.parentNode && dragEl2.parentNode.removeChild(dragEl2);
      parentSortable.animateAll();
    },
    drop
  };
  _extends(Remove, {
    pluginName: "removeOnSpill"
  });
  var lastSwapEl;
  function SwapPlugin() {
    function Swap() {
      this.defaults = {
        swapClass: "sortable-swap-highlight"
      };
    }
    Swap.prototype = {
      dragStart: function dragStart(_ref) {
        var dragEl2 = _ref.dragEl;
        lastSwapEl = dragEl2;
      },
      dragOverValid: function dragOverValid(_ref2) {
        var completed = _ref2.completed, target = _ref2.target, onMove = _ref2.onMove, activeSortable = _ref2.activeSortable, changed = _ref2.changed, cancel = _ref2.cancel;
        if (!activeSortable.options.swap) return;
        var el = this.sortable.el, options = this.options;
        if (target && target !== el) {
          var prevSwapEl = lastSwapEl;
          if (onMove(target) !== false) {
            toggleClass(target, options.swapClass, true);
            lastSwapEl = target;
          } else {
            lastSwapEl = null;
          }
          if (prevSwapEl && prevSwapEl !== lastSwapEl) {
            toggleClass(prevSwapEl, options.swapClass, false);
          }
        }
        changed();
        completed(true);
        cancel();
      },
      drop: function drop2(_ref3) {
        var activeSortable = _ref3.activeSortable, putSortable2 = _ref3.putSortable, dragEl2 = _ref3.dragEl;
        var toSortable = putSortable2 || this.sortable;
        var options = this.options;
        lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);
        if (lastSwapEl && (options.swap || putSortable2 && putSortable2.options.swap)) {
          if (dragEl2 !== lastSwapEl) {
            toSortable.captureAnimationState();
            if (toSortable !== activeSortable) activeSortable.captureAnimationState();
            swapNodes(dragEl2, lastSwapEl);
            toSortable.animateAll();
            if (toSortable !== activeSortable) activeSortable.animateAll();
          }
        }
      },
      nulling: function nulling() {
        lastSwapEl = null;
      }
    };
    return _extends(Swap, {
      pluginName: "swap",
      eventProperties: function eventProperties() {
        return {
          swapItem: lastSwapEl
        };
      }
    });
  }
  function swapNodes(n1, n2) {
    var p1 = n1.parentNode, p2 = n2.parentNode, i1, i2;
    if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
    i1 = index$1(n1);
    i2 = index$1(n2);
    if (p1.isEqualNode(p2) && i1 < i2) {
      i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
  }
  var multiDragElements = [], multiDragClones = [], lastMultiDragSelect, multiDragSortable, initialFolding = false, folding = false, dragStarted = false, dragEl$1, clonesFromRect, clonesHidden;
  function MultiDragPlugin() {
    function MultiDrag(sortable) {
      for (var fn in this) {
        if (fn.charAt(0) === "_" && typeof this[fn] === "function") {
          this[fn] = this[fn].bind(this);
        }
      }
      if (sortable.options.supportPointer) {
        on(document, "pointerup", this._deselectMultiDrag);
      } else {
        on(document, "mouseup", this._deselectMultiDrag);
        on(document, "touchend", this._deselectMultiDrag);
      }
      on(document, "keydown", this._checkKeyDown);
      on(document, "keyup", this._checkKeyUp);
      this.defaults = {
        selectedClass: "sortable-selected",
        multiDragKey: null,
        setData: function setData(dataTransfer, dragEl2) {
          var data = "";
          if (multiDragElements.length && multiDragSortable === sortable) {
            multiDragElements.forEach(function(multiDragElement, i) {
              data += (!i ? "" : ", ") + multiDragElement.textContent;
            });
          } else {
            data = dragEl2.textContent;
          }
          dataTransfer.setData("Text", data);
        }
      };
    }
    MultiDrag.prototype = {
      multiDragKeyDown: false,
      isMultiDrag: false,
      delayStartGlobal: function delayStartGlobal(_ref) {
        var dragged = _ref.dragEl;
        dragEl$1 = dragged;
      },
      delayEnded: function delayEnded() {
        this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
      },
      setupClone: function setupClone(_ref2) {
        var sortable = _ref2.sortable, cancel = _ref2.cancel;
        if (!this.isMultiDrag) return;
        for (var i = 0; i < multiDragElements.length; i++) {
          multiDragClones.push(clone(multiDragElements[i]));
          multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
          multiDragClones[i].draggable = false;
          multiDragClones[i].style["will-change"] = "";
          toggleClass(multiDragClones[i], this.options.selectedClass, false);
          multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
        }
        sortable._hideClone();
        cancel();
      },
      clone: function clone2(_ref3) {
        var sortable = _ref3.sortable, rootEl2 = _ref3.rootEl, dispatchSortableEvent = _ref3.dispatchSortableEvent, cancel = _ref3.cancel;
        if (!this.isMultiDrag) return;
        if (!this.options.removeCloneOnHide) {
          if (multiDragElements.length && multiDragSortable === sortable) {
            insertMultiDragClones(true, rootEl2);
            dispatchSortableEvent("clone");
            cancel();
          }
        }
      },
      showClone: function showClone(_ref4) {
        var cloneNowShown = _ref4.cloneNowShown, rootEl2 = _ref4.rootEl, cancel = _ref4.cancel;
        if (!this.isMultiDrag) return;
        insertMultiDragClones(false, rootEl2);
        multiDragClones.forEach(function(clone2) {
          css(clone2, "display", "");
        });
        cloneNowShown();
        clonesHidden = false;
        cancel();
      },
      hideClone: function hideClone(_ref5) {
        var _this = this;
        _ref5.sortable;
        var cloneNowHidden = _ref5.cloneNowHidden, cancel = _ref5.cancel;
        if (!this.isMultiDrag) return;
        multiDragClones.forEach(function(clone2) {
          css(clone2, "display", "none");
          if (_this.options.removeCloneOnHide && clone2.parentNode) {
            clone2.parentNode.removeChild(clone2);
          }
        });
        cloneNowHidden();
        clonesHidden = true;
        cancel();
      },
      dragStartGlobal: function dragStartGlobal(_ref6) {
        _ref6.sortable;
        if (!this.isMultiDrag && multiDragSortable) {
          multiDragSortable.multiDrag._deselectMultiDrag();
        }
        multiDragElements.forEach(function(multiDragElement) {
          multiDragElement.sortableIndex = index$1(multiDragElement);
        });
        multiDragElements = multiDragElements.sort(function(a, b) {
          return a.sortableIndex - b.sortableIndex;
        });
        dragStarted = true;
      },
      dragStarted: function dragStarted2(_ref7) {
        var _this2 = this;
        var sortable = _ref7.sortable;
        if (!this.isMultiDrag) return;
        if (this.options.sort) {
          sortable.captureAnimationState();
          if (this.options.animation) {
            multiDragElements.forEach(function(multiDragElement) {
              if (multiDragElement === dragEl$1) return;
              css(multiDragElement, "position", "absolute");
            });
            var dragRect = getRect(dragEl$1, false, true, true);
            multiDragElements.forEach(function(multiDragElement) {
              if (multiDragElement === dragEl$1) return;
              setRect(multiDragElement, dragRect);
            });
            folding = true;
            initialFolding = true;
          }
        }
        sortable.animateAll(function() {
          folding = false;
          initialFolding = false;
          if (_this2.options.animation) {
            multiDragElements.forEach(function(multiDragElement) {
              unsetRect(multiDragElement);
            });
          }
          if (_this2.options.sort) {
            removeMultiDragElements();
          }
        });
      },
      dragOver: function dragOver(_ref8) {
        var target = _ref8.target, completed = _ref8.completed, cancel = _ref8.cancel;
        if (folding && ~multiDragElements.indexOf(target)) {
          completed(false);
          cancel();
        }
      },
      revert: function revert(_ref9) {
        var fromSortable = _ref9.fromSortable, rootEl2 = _ref9.rootEl, sortable = _ref9.sortable, dragRect = _ref9.dragRect;
        if (multiDragElements.length > 1) {
          multiDragElements.forEach(function(multiDragElement) {
            sortable.addAnimationState({
              target: multiDragElement,
              rect: folding ? getRect(multiDragElement) : dragRect
            });
            unsetRect(multiDragElement);
            multiDragElement.fromRect = dragRect;
            fromSortable.removeAnimationState(multiDragElement);
          });
          folding = false;
          insertMultiDragElements(!this.options.removeCloneOnHide, rootEl2);
        }
      },
      dragOverCompleted: function dragOverCompleted(_ref10) {
        var sortable = _ref10.sortable, isOwner = _ref10.isOwner, insertion = _ref10.insertion, activeSortable = _ref10.activeSortable, parentEl2 = _ref10.parentEl, putSortable2 = _ref10.putSortable;
        var options = this.options;
        if (insertion) {
          if (isOwner) {
            activeSortable._hideClone();
          }
          initialFolding = false;
          if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable2)) {
            var dragRectAbsolute = getRect(dragEl$1, false, true, true);
            multiDragElements.forEach(function(multiDragElement) {
              if (multiDragElement === dragEl$1) return;
              setRect(multiDragElement, dragRectAbsolute);
              parentEl2.appendChild(multiDragElement);
            });
            folding = true;
          }
          if (!isOwner) {
            if (!folding) {
              removeMultiDragElements();
            }
            if (multiDragElements.length > 1) {
              var clonesHiddenBefore = clonesHidden;
              activeSortable._showClone(sortable);
              if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
                multiDragClones.forEach(function(clone2) {
                  activeSortable.addAnimationState({
                    target: clone2,
                    rect: clonesFromRect
                  });
                  clone2.fromRect = clonesFromRect;
                  clone2.thisAnimationDuration = null;
                });
              }
            } else {
              activeSortable._showClone(sortable);
            }
          }
        }
      },
      dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
        var dragRect = _ref11.dragRect, isOwner = _ref11.isOwner, activeSortable = _ref11.activeSortable;
        multiDragElements.forEach(function(multiDragElement) {
          multiDragElement.thisAnimationDuration = null;
        });
        if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
          clonesFromRect = _extends({}, dragRect);
          var dragMatrix = matrix(dragEl$1, true);
          clonesFromRect.top -= dragMatrix.f;
          clonesFromRect.left -= dragMatrix.e;
        }
      },
      dragOverAnimationComplete: function dragOverAnimationComplete() {
        if (folding) {
          folding = false;
          removeMultiDragElements();
        }
      },
      drop: function drop2(_ref12) {
        var evt = _ref12.originalEvent, rootEl2 = _ref12.rootEl, parentEl2 = _ref12.parentEl, sortable = _ref12.sortable, dispatchSortableEvent = _ref12.dispatchSortableEvent, oldIndex2 = _ref12.oldIndex, putSortable2 = _ref12.putSortable;
        var toSortable = putSortable2 || this.sortable;
        if (!evt) return;
        var options = this.options, children = parentEl2.children;
        if (!dragStarted) {
          if (options.multiDragKey && !this.multiDragKeyDown) {
            this._deselectMultiDrag();
          }
          toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));
          if (!~multiDragElements.indexOf(dragEl$1)) {
            multiDragElements.push(dragEl$1);
            dispatchEvent({
              sortable,
              rootEl: rootEl2,
              name: "select",
              targetEl: dragEl$1
            });
            if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
              var lastIndex = index$1(lastMultiDragSelect), currentIndex = index$1(dragEl$1);
              if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
                var n, i;
                if (currentIndex > lastIndex) {
                  i = lastIndex;
                  n = currentIndex;
                } else {
                  i = currentIndex;
                  n = lastIndex + 1;
                }
                for (; i < n; i++) {
                  if (~multiDragElements.indexOf(children[i])) continue;
                  toggleClass(children[i], options.selectedClass, true);
                  multiDragElements.push(children[i]);
                  dispatchEvent({
                    sortable,
                    rootEl: rootEl2,
                    name: "select",
                    targetEl: children[i]
                  });
                }
              }
            } else {
              lastMultiDragSelect = dragEl$1;
            }
            multiDragSortable = toSortable;
          } else {
            multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
            lastMultiDragSelect = null;
            dispatchEvent({
              sortable,
              rootEl: rootEl2,
              name: "deselect",
              targetEl: dragEl$1
            });
          }
        }
        if (dragStarted && this.isMultiDrag) {
          folding = false;
          if ((parentEl2[expando].options.sort || parentEl2 !== rootEl2) && multiDragElements.length > 1) {
            var dragRect = getRect(dragEl$1), multiDragIndex = index$1(dragEl$1, ":not(." + this.options.selectedClass + ")");
            if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
            toSortable.captureAnimationState();
            if (!initialFolding) {
              if (options.animation) {
                dragEl$1.fromRect = dragRect;
                multiDragElements.forEach(function(multiDragElement) {
                  multiDragElement.thisAnimationDuration = null;
                  if (multiDragElement !== dragEl$1) {
                    var rect = folding ? getRect(multiDragElement) : dragRect;
                    multiDragElement.fromRect = rect;
                    toSortable.addAnimationState({
                      target: multiDragElement,
                      rect
                    });
                  }
                });
              }
              removeMultiDragElements();
              multiDragElements.forEach(function(multiDragElement) {
                if (children[multiDragIndex]) {
                  parentEl2.insertBefore(multiDragElement, children[multiDragIndex]);
                } else {
                  parentEl2.appendChild(multiDragElement);
                }
                multiDragIndex++;
              });
              if (oldIndex2 === index$1(dragEl$1)) {
                var update = false;
                multiDragElements.forEach(function(multiDragElement) {
                  if (multiDragElement.sortableIndex !== index$1(multiDragElement)) {
                    update = true;
                    return;
                  }
                });
                if (update) {
                  dispatchSortableEvent("update");
                }
              }
            }
            multiDragElements.forEach(function(multiDragElement) {
              unsetRect(multiDragElement);
            });
            toSortable.animateAll();
          }
          multiDragSortable = toSortable;
        }
        if (rootEl2 === parentEl2 || putSortable2 && putSortable2.lastPutMode !== "clone") {
          multiDragClones.forEach(function(clone2) {
            clone2.parentNode && clone2.parentNode.removeChild(clone2);
          });
        }
      },
      nullingGlobal: function nullingGlobal() {
        this.isMultiDrag = dragStarted = false;
        multiDragClones.length = 0;
      },
      destroyGlobal: function destroyGlobal() {
        this._deselectMultiDrag();
        off(document, "pointerup", this._deselectMultiDrag);
        off(document, "mouseup", this._deselectMultiDrag);
        off(document, "touchend", this._deselectMultiDrag);
        off(document, "keydown", this._checkKeyDown);
        off(document, "keyup", this._checkKeyUp);
      },
      _deselectMultiDrag: function _deselectMultiDrag(evt) {
        if (typeof dragStarted !== "undefined" && dragStarted) return;
        if (multiDragSortable !== this.sortable) return;
        if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return;
        if (evt && evt.button !== 0) return;
        while (multiDragElements.length) {
          var el = multiDragElements[0];
          toggleClass(el, this.options.selectedClass, false);
          multiDragElements.shift();
          dispatchEvent({
            sortable: this.sortable,
            rootEl: this.sortable.el,
            name: "deselect",
            targetEl: el
          });
        }
      },
      _checkKeyDown: function _checkKeyDown(evt) {
        if (evt.key === this.options.multiDragKey) {
          this.multiDragKeyDown = true;
        }
      },
      _checkKeyUp: function _checkKeyUp(evt) {
        if (evt.key === this.options.multiDragKey) {
          this.multiDragKeyDown = false;
        }
      }
    };
    return _extends(MultiDrag, {
      // Static methods & properties
      pluginName: "multiDrag",
      utils: {
        /**
         * Selects the provided multi-drag item
         * @param  {HTMLElement} el    The element to be selected
         */
        select: function select(el) {
          var sortable = el.parentNode[expando];
          if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;
          if (multiDragSortable && multiDragSortable !== sortable) {
            multiDragSortable.multiDrag._deselectMultiDrag();
            multiDragSortable = sortable;
          }
          toggleClass(el, sortable.options.selectedClass, true);
          multiDragElements.push(el);
        },
        /**
         * Deselects the provided multi-drag item
         * @param  {HTMLElement} el    The element to be deselected
         */
        deselect: function deselect(el) {
          var sortable = el.parentNode[expando], index2 = multiDragElements.indexOf(el);
          if (!sortable || !sortable.options.multiDrag || !~index2) return;
          toggleClass(el, sortable.options.selectedClass, false);
          multiDragElements.splice(index2, 1);
        }
      },
      eventProperties: function eventProperties() {
        var _this3 = this;
        var oldIndicies = [], newIndicies = [];
        multiDragElements.forEach(function(multiDragElement) {
          oldIndicies.push({
            multiDragElement,
            index: multiDragElement.sortableIndex
          });
          var newIndex2;
          if (folding && multiDragElement !== dragEl$1) {
            newIndex2 = -1;
          } else if (folding) {
            newIndex2 = index$1(multiDragElement, ":not(." + _this3.options.selectedClass + ")");
          } else {
            newIndex2 = index$1(multiDragElement);
          }
          newIndicies.push({
            multiDragElement,
            index: newIndex2
          });
        });
        return {
          items: _toConsumableArray(multiDragElements),
          clones: [].concat(multiDragClones),
          oldIndicies,
          newIndicies
        };
      },
      optionListeners: {
        multiDragKey: function multiDragKey(key) {
          key = key.toLowerCase();
          if (key === "ctrl") {
            key = "Control";
          } else if (key.length > 1) {
            key = key.charAt(0).toUpperCase() + key.substr(1);
          }
          return key;
        }
      }
    });
  }
  function insertMultiDragElements(clonesInserted, rootEl2) {
    multiDragElements.forEach(function(multiDragElement, i) {
      var target = rootEl2.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];
      if (target) {
        rootEl2.insertBefore(multiDragElement, target);
      } else {
        rootEl2.appendChild(multiDragElement);
      }
    });
  }
  function insertMultiDragClones(elementsInserted, rootEl2) {
    multiDragClones.forEach(function(clone2, i) {
      var target = rootEl2.children[clone2.sortableIndex + (elementsInserted ? Number(i) : 0)];
      if (target) {
        rootEl2.insertBefore(clone2, target);
      } else {
        rootEl2.appendChild(clone2);
      }
    });
  }
  function removeMultiDragElements() {
    multiDragElements.forEach(function(multiDragElement) {
      if (multiDragElement === dragEl$1) return;
      multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
    });
  }
  Sortable.mount(new AutoScrollPlugin());
  Sortable.mount(Remove, Revert);
  const sortable_esm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    MultiDrag: MultiDragPlugin,
    Sortable,
    Swap: SwapPlugin,
    default: Sortable
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$1 = /* @__PURE__ */ getAugmentedNamespace(sortable_esm);
  var vuedraggable_umd = vuedraggable_umd$1.exports;
  var hasRequiredVuedraggable_umd;
  function requireVuedraggable_umd() {
    if (hasRequiredVuedraggable_umd) return vuedraggable_umd$1.exports;
    hasRequiredVuedraggable_umd = 1;
    (function(module2, exports2) {
      (function webpackUniversalModuleDefinition(root2, factory) {
        module2.exports = factory(require$$0, require$$1);
      })(typeof self !== "undefined" ? self : vuedraggable_umd, function(__WEBPACK_EXTERNAL_MODULE__8bbf__, __WEBPACK_EXTERNAL_MODULE_a352__) {
        return (
          /******/
          function(modules) {
            var installedModules = {};
            function __webpack_require__(moduleId) {
              if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
              }
              var module3 = installedModules[moduleId] = {
                /******/
                i: moduleId,
                /******/
                l: false,
                /******/
                exports: {}
                /******/
              };
              modules[moduleId].call(module3.exports, module3, module3.exports, __webpack_require__);
              module3.l = true;
              return module3.exports;
            }
            __webpack_require__.m = modules;
            __webpack_require__.c = installedModules;
            __webpack_require__.d = function(exports3, name, getter) {
              if (!__webpack_require__.o(exports3, name)) {
                Object.defineProperty(exports3, name, { enumerable: true, get: getter });
              }
            };
            __webpack_require__.r = function(exports3) {
              if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports3, Symbol.toStringTag, { value: "Module" });
              }
              Object.defineProperty(exports3, "__esModule", { value: true });
            };
            __webpack_require__.t = function(value, mode) {
              if (mode & 1) value = __webpack_require__(value);
              if (mode & 8) return value;
              if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
              var ns = /* @__PURE__ */ Object.create(null);
              __webpack_require__.r(ns);
              Object.defineProperty(ns, "default", { enumerable: true, value });
              if (mode & 2 && typeof value != "string") for (var key in value) __webpack_require__.d(ns, key, (function(key2) {
                return value[key2];
              }).bind(null, key));
              return ns;
            };
            __webpack_require__.n = function(module3) {
              var getter = module3 && module3.__esModule ? (
                /******/
                function getDefault() {
                  return module3["default"];
                }
              ) : (
                /******/
                function getModuleExports() {
                  return module3;
                }
              );
              __webpack_require__.d(getter, "a", getter);
              return getter;
            };
            __webpack_require__.o = function(object, property) {
              return Object.prototype.hasOwnProperty.call(object, property);
            };
            __webpack_require__.p = "";
            return __webpack_require__(__webpack_require__.s = "fb15");
          }({
            /***/
            "00ee": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var wellKnownSymbol = __webpack_require__("b622");
                var TO_STRING_TAG = wellKnownSymbol("toStringTag");
                var test = {};
                test[TO_STRING_TAG] = "z";
                module3.exports = String(test) === "[object z]";
              }
            ),
            /***/
            "0366": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var aFunction = __webpack_require__("1c0b");
                module3.exports = function(fn, that, length) {
                  aFunction(fn);
                  if (that === void 0) return fn;
                  switch (length) {
                    case 0:
                      return function() {
                        return fn.call(that);
                      };
                    case 1:
                      return function(a) {
                        return fn.call(that, a);
                      };
                    case 2:
                      return function(a, b) {
                        return fn.call(that, a, b);
                      };
                    case 3:
                      return function(a, b, c) {
                        return fn.call(that, a, b, c);
                      };
                  }
                  return function() {
                    return fn.apply(that, arguments);
                  };
                };
              }
            ),
            /***/
            "057f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toIndexedObject = __webpack_require__("fc6a");
                var nativeGetOwnPropertyNames = __webpack_require__("241c").f;
                var toString = {}.toString;
                var windowNames = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
                var getWindowNames = function(it) {
                  try {
                    return nativeGetOwnPropertyNames(it);
                  } catch (error) {
                    return windowNames.slice();
                  }
                };
                module3.exports.f = function getOwnPropertyNames(it) {
                  return windowNames && toString.call(it) == "[object Window]" ? getWindowNames(it) : nativeGetOwnPropertyNames(toIndexedObject(it));
                };
              }
            ),
            /***/
            "06cf": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var propertyIsEnumerableModule = __webpack_require__("d1e7");
                var createPropertyDescriptor = __webpack_require__("5c6c");
                var toIndexedObject = __webpack_require__("fc6a");
                var toPrimitive = __webpack_require__("c04e");
                var has = __webpack_require__("5135");
                var IE8_DOM_DEFINE = __webpack_require__("0cfb");
                var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
                exports3.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
                  O = toIndexedObject(O);
                  P = toPrimitive(P, true);
                  if (IE8_DOM_DEFINE) try {
                    return nativeGetOwnPropertyDescriptor(O, P);
                  } catch (error) {
                  }
                  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
                };
              }
            ),
            /***/
            "0cfb": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var fails = __webpack_require__("d039");
                var createElement = __webpack_require__("cc12");
                module3.exports = !DESCRIPTORS && !fails(function() {
                  return Object.defineProperty(createElement("div"), "a", {
                    get: function() {
                      return 7;
                    }
                  }).a != 7;
                });
              }
            ),
            /***/
            "13d5": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $reduce = __webpack_require__("d58f").left;
                var arrayMethodIsStrict = __webpack_require__("a640");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var STRICT_METHOD = arrayMethodIsStrict("reduce");
                var USES_TO_LENGTH = arrayMethodUsesToLength("reduce", { 1: 0 });
                $({ target: "Array", proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
                  reduce: function reduce(callbackfn) {
                    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
                  }
                });
              }
            ),
            /***/
            "14c3": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var classof = __webpack_require__("c6b6");
                var regexpExec = __webpack_require__("9263");
                module3.exports = function(R, S) {
                  var exec = R.exec;
                  if (typeof exec === "function") {
                    var result = exec.call(R, S);
                    if (typeof result !== "object") {
                      throw TypeError("RegExp exec method returned something other than an Object or null");
                    }
                    return result;
                  }
                  if (classof(R) !== "RegExp") {
                    throw TypeError("RegExp#exec called on incompatible receiver");
                  }
                  return regexpExec.call(R, S);
                };
              }
            ),
            /***/
            "159b": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var DOMIterables = __webpack_require__("fdbc");
                var forEach = __webpack_require__("17c2");
                var createNonEnumerableProperty = __webpack_require__("9112");
                for (var COLLECTION_NAME in DOMIterables) {
                  var Collection = global2[COLLECTION_NAME];
                  var CollectionPrototype = Collection && Collection.prototype;
                  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
                    createNonEnumerableProperty(CollectionPrototype, "forEach", forEach);
                  } catch (error) {
                    CollectionPrototype.forEach = forEach;
                  }
                }
              }
            ),
            /***/
            "17c2": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $forEach = __webpack_require__("b727").forEach;
                var arrayMethodIsStrict = __webpack_require__("a640");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var STRICT_METHOD = arrayMethodIsStrict("forEach");
                var USES_TO_LENGTH = arrayMethodUsesToLength("forEach");
                module3.exports = !STRICT_METHOD || !USES_TO_LENGTH ? function forEach(callbackfn) {
                  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
                } : [].forEach;
              }
            ),
            /***/
            "1be4": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var getBuiltIn = __webpack_require__("d066");
                module3.exports = getBuiltIn("document", "documentElement");
              }
            ),
            /***/
            "1c0b": (
              /***/
              function(module3, exports3) {
                module3.exports = function(it) {
                  if (typeof it != "function") {
                    throw TypeError(String(it) + " is not a function");
                  }
                  return it;
                };
              }
            ),
            /***/
            "1c7e": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var wellKnownSymbol = __webpack_require__("b622");
                var ITERATOR = wellKnownSymbol("iterator");
                var SAFE_CLOSING = false;
                try {
                  var called = 0;
                  var iteratorWithReturn = {
                    next: function() {
                      return { done: !!called++ };
                    },
                    "return": function() {
                      SAFE_CLOSING = true;
                    }
                  };
                  iteratorWithReturn[ITERATOR] = function() {
                    return this;
                  };
                  Array.from(iteratorWithReturn, function() {
                    throw 2;
                  });
                } catch (error) {
                }
                module3.exports = function(exec, SKIP_CLOSING) {
                  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
                  var ITERATION_SUPPORT = false;
                  try {
                    var object = {};
                    object[ITERATOR] = function() {
                      return {
                        next: function() {
                          return { done: ITERATION_SUPPORT = true };
                        }
                      };
                    };
                    exec(object);
                  } catch (error) {
                  }
                  return ITERATION_SUPPORT;
                };
              }
            ),
            /***/
            "1d80": (
              /***/
              function(module3, exports3) {
                module3.exports = function(it) {
                  if (it == void 0) throw TypeError("Can't call method on " + it);
                  return it;
                };
              }
            ),
            /***/
            "1dde": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                var wellKnownSymbol = __webpack_require__("b622");
                var V8_VERSION = __webpack_require__("2d00");
                var SPECIES = wellKnownSymbol("species");
                module3.exports = function(METHOD_NAME) {
                  return V8_VERSION >= 51 || !fails(function() {
                    var array = [];
                    var constructor = array.constructor = {};
                    constructor[SPECIES] = function() {
                      return { foo: 1 };
                    };
                    return array[METHOD_NAME](Boolean).foo !== 1;
                  });
                };
              }
            ),
            /***/
            "23cb": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toInteger = __webpack_require__("a691");
                var max = Math.max;
                var min = Math.min;
                module3.exports = function(index2, length) {
                  var integer = toInteger(index2);
                  return integer < 0 ? max(integer + length, 0) : min(integer, length);
                };
              }
            ),
            /***/
            "23e7": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
                var createNonEnumerableProperty = __webpack_require__("9112");
                var redefine = __webpack_require__("6eeb");
                var setGlobal = __webpack_require__("ce4e");
                var copyConstructorProperties = __webpack_require__("e893");
                var isForced = __webpack_require__("94ca");
                module3.exports = function(options, source) {
                  var TARGET = options.target;
                  var GLOBAL = options.global;
                  var STATIC = options.stat;
                  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
                  if (GLOBAL) {
                    target = global2;
                  } else if (STATIC) {
                    target = global2[TARGET] || setGlobal(TARGET, {});
                  } else {
                    target = (global2[TARGET] || {}).prototype;
                  }
                  if (target) for (key in source) {
                    sourceProperty = source[key];
                    if (options.noTargetGet) {
                      descriptor = getOwnPropertyDescriptor(target, key);
                      targetProperty = descriptor && descriptor.value;
                    } else targetProperty = target[key];
                    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
                    if (!FORCED && targetProperty !== void 0) {
                      if (typeof sourceProperty === typeof targetProperty) continue;
                      copyConstructorProperties(sourceProperty, targetProperty);
                    }
                    if (options.sham || targetProperty && targetProperty.sham) {
                      createNonEnumerableProperty(sourceProperty, "sham", true);
                    }
                    redefine(target, key, sourceProperty, options);
                  }
                };
              }
            ),
            /***/
            "241c": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var internalObjectKeys = __webpack_require__("ca84");
                var enumBugKeys = __webpack_require__("7839");
                var hiddenKeys = enumBugKeys.concat("length", "prototype");
                exports3.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
                  return internalObjectKeys(O, hiddenKeys);
                };
              }
            ),
            /***/
            "25f0": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var redefine = __webpack_require__("6eeb");
                var anObject = __webpack_require__("825a");
                var fails = __webpack_require__("d039");
                var flags = __webpack_require__("ad6d");
                var TO_STRING = "toString";
                var RegExpPrototype = RegExp.prototype;
                var nativeToString = RegExpPrototype[TO_STRING];
                var NOT_GENERIC = fails(function() {
                  return nativeToString.call({ source: "a", flags: "b" }) != "/a/b";
                });
                var INCORRECT_NAME = nativeToString.name != TO_STRING;
                if (NOT_GENERIC || INCORRECT_NAME) {
                  redefine(RegExp.prototype, TO_STRING, function toString() {
                    var R = anObject(this);
                    var p = String(R.source);
                    var rf = R.flags;
                    var f = String(rf === void 0 && R instanceof RegExp && !("flags" in RegExpPrototype) ? flags.call(R) : rf);
                    return "/" + p + "/" + f;
                  }, { unsafe: true });
                }
              }
            ),
            /***/
            "2ca0": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var getOwnPropertyDescriptor = __webpack_require__("06cf").f;
                var toLength = __webpack_require__("50c4");
                var notARegExp = __webpack_require__("5a34");
                var requireObjectCoercible = __webpack_require__("1d80");
                var correctIsRegExpLogic = __webpack_require__("ab13");
                var IS_PURE = __webpack_require__("c430");
                var nativeStartsWith = "".startsWith;
                var min = Math.min;
                var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic("startsWith");
                var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function() {
                  var descriptor = getOwnPropertyDescriptor(String.prototype, "startsWith");
                  return descriptor && !descriptor.writable;
                }();
                $({ target: "String", proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
                  startsWith: function startsWith(searchString) {
                    var that = String(requireObjectCoercible(this));
                    notARegExp(searchString);
                    var index2 = toLength(min(arguments.length > 1 ? arguments[1] : void 0, that.length));
                    var search = String(searchString);
                    return nativeStartsWith ? nativeStartsWith.call(that, search, index2) : that.slice(index2, index2 + search.length) === search;
                  }
                });
              }
            ),
            /***/
            "2d00": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var userAgent2 = __webpack_require__("342f");
                var process = global2.process;
                var versions = process && process.versions;
                var v8 = versions && versions.v8;
                var match, version2;
                if (v8) {
                  match = v8.split(".");
                  version2 = match[0] + match[1];
                } else if (userAgent2) {
                  match = userAgent2.match(/Edge\/(\d+)/);
                  if (!match || match[1] >= 74) {
                    match = userAgent2.match(/Chrome\/(\d+)/);
                    if (match) version2 = match[1];
                  }
                }
                module3.exports = version2 && +version2;
              }
            ),
            /***/
            "342f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var getBuiltIn = __webpack_require__("d066");
                module3.exports = getBuiltIn("navigator", "userAgent") || "";
              }
            ),
            /***/
            "35a1": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var classof = __webpack_require__("f5df");
                var Iterators = __webpack_require__("3f8c");
                var wellKnownSymbol = __webpack_require__("b622");
                var ITERATOR = wellKnownSymbol("iterator");
                module3.exports = function(it) {
                  if (it != void 0) return it[ITERATOR] || it["@@iterator"] || Iterators[classof(it)];
                };
              }
            ),
            /***/
            "37e8": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var definePropertyModule = __webpack_require__("9bf2");
                var anObject = __webpack_require__("825a");
                var objectKeys = __webpack_require__("df75");
                module3.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
                  anObject(O);
                  var keys = objectKeys(Properties);
                  var length = keys.length;
                  var index2 = 0;
                  var key;
                  while (length > index2) definePropertyModule.f(O, key = keys[index2++], Properties[key]);
                  return O;
                };
              }
            ),
            /***/
            "3bbe": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isObject2 = __webpack_require__("861d");
                module3.exports = function(it) {
                  if (!isObject2(it) && it !== null) {
                    throw TypeError("Can't set " + String(it) + " as a prototype");
                  }
                  return it;
                };
              }
            ),
            /***/
            "3ca3": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var charAt = __webpack_require__("6547").charAt;
                var InternalStateModule = __webpack_require__("69f3");
                var defineIterator = __webpack_require__("7dd0");
                var STRING_ITERATOR = "String Iterator";
                var setInternalState = InternalStateModule.set;
                var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);
                defineIterator(String, "String", function(iterated) {
                  setInternalState(this, {
                    type: STRING_ITERATOR,
                    string: String(iterated),
                    index: 0
                  });
                }, function next() {
                  var state = getInternalState(this);
                  var string = state.string;
                  var index2 = state.index;
                  var point;
                  if (index2 >= string.length) return { value: void 0, done: true };
                  point = charAt(string, index2);
                  state.index += point.length;
                  return { value: point, done: false };
                });
              }
            ),
            /***/
            "3f8c": (
              /***/
              function(module3, exports3) {
                module3.exports = {};
              }
            ),
            /***/
            "4160": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var forEach = __webpack_require__("17c2");
                $({ target: "Array", proto: true, forced: [].forEach != forEach }, {
                  forEach
                });
              }
            ),
            /***/
            "428f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                module3.exports = global2;
              }
            ),
            /***/
            "44ad": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                var classof = __webpack_require__("c6b6");
                var split = "".split;
                module3.exports = fails(function() {
                  return !Object("z").propertyIsEnumerable(0);
                }) ? function(it) {
                  return classof(it) == "String" ? split.call(it, "") : Object(it);
                } : Object;
              }
            ),
            /***/
            "44d2": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var wellKnownSymbol = __webpack_require__("b622");
                var create = __webpack_require__("7c73");
                var definePropertyModule = __webpack_require__("9bf2");
                var UNSCOPABLES = wellKnownSymbol("unscopables");
                var ArrayPrototype = Array.prototype;
                if (ArrayPrototype[UNSCOPABLES] == void 0) {
                  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
                    configurable: true,
                    value: create(null)
                  });
                }
                module3.exports = function(key) {
                  ArrayPrototype[UNSCOPABLES][key] = true;
                };
              }
            ),
            /***/
            "44e7": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isObject2 = __webpack_require__("861d");
                var classof = __webpack_require__("c6b6");
                var wellKnownSymbol = __webpack_require__("b622");
                var MATCH = wellKnownSymbol("match");
                module3.exports = function(it) {
                  var isRegExp;
                  return isObject2(it) && ((isRegExp = it[MATCH]) !== void 0 ? !!isRegExp : classof(it) == "RegExp");
                };
              }
            ),
            /***/
            "4930": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                module3.exports = !!Object.getOwnPropertySymbols && !fails(function() {
                  return !String(Symbol());
                });
              }
            ),
            /***/
            "4d64": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toIndexedObject = __webpack_require__("fc6a");
                var toLength = __webpack_require__("50c4");
                var toAbsoluteIndex = __webpack_require__("23cb");
                var createMethod = function(IS_INCLUDES) {
                  return function($this, el, fromIndex) {
                    var O = toIndexedObject($this);
                    var length = toLength(O.length);
                    var index2 = toAbsoluteIndex(fromIndex, length);
                    var value;
                    if (IS_INCLUDES && el != el) while (length > index2) {
                      value = O[index2++];
                      if (value != value) return true;
                    }
                    else for (; length > index2; index2++) {
                      if ((IS_INCLUDES || index2 in O) && O[index2] === el) return IS_INCLUDES || index2 || 0;
                    }
                    return !IS_INCLUDES && -1;
                  };
                };
                module3.exports = {
                  // `Array.prototype.includes` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
                  includes: createMethod(true),
                  // `Array.prototype.indexOf` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
                  indexOf: createMethod(false)
                };
              }
            ),
            /***/
            "4de4": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $filter = __webpack_require__("b727").filter;
                var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("filter");
                var USES_TO_LENGTH = arrayMethodUsesToLength("filter");
                $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                  filter: function filter(callbackfn) {
                    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
                  }
                });
              }
            ),
            /***/
            "4df4": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var bind = __webpack_require__("0366");
                var toObject = __webpack_require__("7b0b");
                var callWithSafeIterationClosing = __webpack_require__("9bdd");
                var isArrayIteratorMethod = __webpack_require__("e95a");
                var toLength = __webpack_require__("50c4");
                var createProperty = __webpack_require__("8418");
                var getIteratorMethod = __webpack_require__("35a1");
                module3.exports = function from(arrayLike) {
                  var O = toObject(arrayLike);
                  var C = typeof this == "function" ? this : Array;
                  var argumentsLength = arguments.length;
                  var mapfn = argumentsLength > 1 ? arguments[1] : void 0;
                  var mapping = mapfn !== void 0;
                  var iteratorMethod = getIteratorMethod(O);
                  var index2 = 0;
                  var length, result, step, iterator, next, value;
                  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : void 0, 2);
                  if (iteratorMethod != void 0 && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
                    iterator = iteratorMethod.call(O);
                    next = iterator.next;
                    result = new C();
                    for (; !(step = next.call(iterator)).done; index2++) {
                      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index2], true) : step.value;
                      createProperty(result, index2, value);
                    }
                  } else {
                    length = toLength(O.length);
                    result = new C(length);
                    for (; length > index2; index2++) {
                      value = mapping ? mapfn(O[index2], index2) : O[index2];
                      createProperty(result, index2, value);
                    }
                  }
                  result.length = index2;
                  return result;
                };
              }
            ),
            /***/
            "4fad": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $entries = __webpack_require__("6f53").entries;
                $({ target: "Object", stat: true }, {
                  entries: function entries(O) {
                    return $entries(O);
                  }
                });
              }
            ),
            /***/
            "50c4": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toInteger = __webpack_require__("a691");
                var min = Math.min;
                module3.exports = function(argument) {
                  return argument > 0 ? min(toInteger(argument), 9007199254740991) : 0;
                };
              }
            ),
            /***/
            "5135": (
              /***/
              function(module3, exports3) {
                var hasOwnProperty2 = {}.hasOwnProperty;
                module3.exports = function(it, key) {
                  return hasOwnProperty2.call(it, key);
                };
              }
            ),
            /***/
            "5319": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fixRegExpWellKnownSymbolLogic = __webpack_require__("d784");
                var anObject = __webpack_require__("825a");
                var toObject = __webpack_require__("7b0b");
                var toLength = __webpack_require__("50c4");
                var toInteger = __webpack_require__("a691");
                var requireObjectCoercible = __webpack_require__("1d80");
                var advanceStringIndex = __webpack_require__("8aa5");
                var regExpExec = __webpack_require__("14c3");
                var max = Math.max;
                var min = Math.min;
                var floor = Math.floor;
                var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
                var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;
                var maybeToString = function(it) {
                  return it === void 0 ? it : String(it);
                };
                fixRegExpWellKnownSymbolLogic("replace", 2, function(REPLACE, nativeReplace, maybeCallNative, reason) {
                  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
                  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
                  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? "$" : "$0";
                  return [
                    // `String.prototype.replace` method
                    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
                    function replace(searchValue, replaceValue) {
                      var O = requireObjectCoercible(this);
                      var replacer = searchValue == void 0 ? void 0 : searchValue[REPLACE];
                      return replacer !== void 0 ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
                    },
                    // `RegExp.prototype[@@replace]` method
                    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
                    function(regexp, replaceValue) {
                      if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === "string" && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
                        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
                        if (res.done) return res.value;
                      }
                      var rx = anObject(regexp);
                      var S = String(this);
                      var functionalReplace = typeof replaceValue === "function";
                      if (!functionalReplace) replaceValue = String(replaceValue);
                      var global2 = rx.global;
                      if (global2) {
                        var fullUnicode = rx.unicode;
                        rx.lastIndex = 0;
                      }
                      var results = [];
                      while (true) {
                        var result = regExpExec(rx, S);
                        if (result === null) break;
                        results.push(result);
                        if (!global2) break;
                        var matchStr = String(result[0]);
                        if (matchStr === "") rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                      }
                      var accumulatedResult = "";
                      var nextSourcePosition = 0;
                      for (var i = 0; i < results.length; i++) {
                        result = results[i];
                        var matched = String(result[0]);
                        var position = max(min(toInteger(result.index), S.length), 0);
                        var captures = [];
                        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
                        var namedCaptures = result.groups;
                        if (functionalReplace) {
                          var replacerArgs = [matched].concat(captures, position, S);
                          if (namedCaptures !== void 0) replacerArgs.push(namedCaptures);
                          var replacement = String(replaceValue.apply(void 0, replacerArgs));
                        } else {
                          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                        }
                        if (position >= nextSourcePosition) {
                          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                          nextSourcePosition = position + matched.length;
                        }
                      }
                      return accumulatedResult + S.slice(nextSourcePosition);
                    }
                  ];
                  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
                    var tailPos = position + matched.length;
                    var m = captures.length;
                    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
                    if (namedCaptures !== void 0) {
                      namedCaptures = toObject(namedCaptures);
                      symbols = SUBSTITUTION_SYMBOLS;
                    }
                    return nativeReplace.call(replacement, symbols, function(match, ch) {
                      var capture;
                      switch (ch.charAt(0)) {
                        case "$":
                          return "$";
                        case "&":
                          return matched;
                        case "`":
                          return str.slice(0, position);
                        case "'":
                          return str.slice(tailPos);
                        case "<":
                          capture = namedCaptures[ch.slice(1, -1)];
                          break;
                        default:
                          var n = +ch;
                          if (n === 0) return match;
                          if (n > m) {
                            var f = floor(n / 10);
                            if (f === 0) return match;
                            if (f <= m) return captures[f - 1] === void 0 ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                            return match;
                          }
                          capture = captures[n - 1];
                      }
                      return capture === void 0 ? "" : capture;
                    });
                  }
                });
              }
            ),
            /***/
            "5692": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var IS_PURE = __webpack_require__("c430");
                var store = __webpack_require__("c6cd");
                (module3.exports = function(key, value) {
                  return store[key] || (store[key] = value !== void 0 ? value : {});
                })("versions", []).push({
                  version: "3.6.5",
                  mode: IS_PURE ? "pure" : "global",
                  copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
                });
              }
            ),
            /***/
            "56ef": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var getBuiltIn = __webpack_require__("d066");
                var getOwnPropertyNamesModule = __webpack_require__("241c");
                var getOwnPropertySymbolsModule = __webpack_require__("7418");
                var anObject = __webpack_require__("825a");
                module3.exports = getBuiltIn("Reflect", "ownKeys") || function ownKeys2(it) {
                  var keys = getOwnPropertyNamesModule.f(anObject(it));
                  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
                  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
                };
              }
            ),
            /***/
            "5a34": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isRegExp = __webpack_require__("44e7");
                module3.exports = function(it) {
                  if (isRegExp(it)) {
                    throw TypeError("The method doesn't accept regular expressions");
                  }
                  return it;
                };
              }
            ),
            /***/
            "5c6c": (
              /***/
              function(module3, exports3) {
                module3.exports = function(bitmap, value) {
                  return {
                    enumerable: !(bitmap & 1),
                    configurable: !(bitmap & 2),
                    writable: !(bitmap & 4),
                    value
                  };
                };
              }
            ),
            /***/
            "5db7": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var flattenIntoArray = __webpack_require__("a2bf");
                var toObject = __webpack_require__("7b0b");
                var toLength = __webpack_require__("50c4");
                var aFunction = __webpack_require__("1c0b");
                var arraySpeciesCreate = __webpack_require__("65f0");
                $({ target: "Array", proto: true }, {
                  flatMap: function flatMap(callbackfn) {
                    var O = toObject(this);
                    var sourceLen = toLength(O.length);
                    var A;
                    aFunction(callbackfn);
                    A = arraySpeciesCreate(O, 0);
                    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
                    return A;
                  }
                });
              }
            ),
            /***/
            "6547": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toInteger = __webpack_require__("a691");
                var requireObjectCoercible = __webpack_require__("1d80");
                var createMethod = function(CONVERT_TO_STRING) {
                  return function($this, pos) {
                    var S = String(requireObjectCoercible($this));
                    var position = toInteger(pos);
                    var size = S.length;
                    var first, second;
                    if (position < 0 || position >= size) return CONVERT_TO_STRING ? "" : void 0;
                    first = S.charCodeAt(position);
                    return first < 55296 || first > 56319 || position + 1 === size || (second = S.charCodeAt(position + 1)) < 56320 || second > 57343 ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 55296 << 10) + (second - 56320) + 65536;
                  };
                };
                module3.exports = {
                  // `String.prototype.codePointAt` method
                  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
                  codeAt: createMethod(false),
                  // `String.prototype.at` method
                  // https://github.com/mathiasbynens/String.prototype.at
                  charAt: createMethod(true)
                };
              }
            ),
            /***/
            "65f0": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isObject2 = __webpack_require__("861d");
                var isArray = __webpack_require__("e8b5");
                var wellKnownSymbol = __webpack_require__("b622");
                var SPECIES = wellKnownSymbol("species");
                module3.exports = function(originalArray, length) {
                  var C;
                  if (isArray(originalArray)) {
                    C = originalArray.constructor;
                    if (typeof C == "function" && (C === Array || isArray(C.prototype))) C = void 0;
                    else if (isObject2(C)) {
                      C = C[SPECIES];
                      if (C === null) C = void 0;
                    }
                  }
                  return new (C === void 0 ? Array : C)(length === 0 ? 0 : length);
                };
              }
            ),
            /***/
            "69f3": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var NATIVE_WEAK_MAP = __webpack_require__("7f9a");
                var global2 = __webpack_require__("da84");
                var isObject2 = __webpack_require__("861d");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var objectHas = __webpack_require__("5135");
                var sharedKey = __webpack_require__("f772");
                var hiddenKeys = __webpack_require__("d012");
                var WeakMap = global2.WeakMap;
                var set, get, has;
                var enforce = function(it) {
                  return has(it) ? get(it) : set(it, {});
                };
                var getterFor = function(TYPE) {
                  return function(it) {
                    var state;
                    if (!isObject2(it) || (state = get(it)).type !== TYPE) {
                      throw TypeError("Incompatible receiver, " + TYPE + " required");
                    }
                    return state;
                  };
                };
                if (NATIVE_WEAK_MAP) {
                  var store = new WeakMap();
                  var wmget = store.get;
                  var wmhas = store.has;
                  var wmset = store.set;
                  set = function(it, metadata) {
                    wmset.call(store, it, metadata);
                    return metadata;
                  };
                  get = function(it) {
                    return wmget.call(store, it) || {};
                  };
                  has = function(it) {
                    return wmhas.call(store, it);
                  };
                } else {
                  var STATE = sharedKey("state");
                  hiddenKeys[STATE] = true;
                  set = function(it, metadata) {
                    createNonEnumerableProperty(it, STATE, metadata);
                    return metadata;
                  };
                  get = function(it) {
                    return objectHas(it, STATE) ? it[STATE] : {};
                  };
                  has = function(it) {
                    return objectHas(it, STATE);
                  };
                }
                module3.exports = {
                  set,
                  get,
                  has,
                  enforce,
                  getterFor
                };
              }
            ),
            /***/
            "6eeb": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var has = __webpack_require__("5135");
                var setGlobal = __webpack_require__("ce4e");
                var inspectSource = __webpack_require__("8925");
                var InternalStateModule = __webpack_require__("69f3");
                var getInternalState = InternalStateModule.get;
                var enforceInternalState = InternalStateModule.enforce;
                var TEMPLATE = String(String).split("String");
                (module3.exports = function(O, key, value, options) {
                  var unsafe = options ? !!options.unsafe : false;
                  var simple = options ? !!options.enumerable : false;
                  var noTargetGet = options ? !!options.noTargetGet : false;
                  if (typeof value == "function") {
                    if (typeof key == "string" && !has(value, "name")) createNonEnumerableProperty(value, "name", key);
                    enforceInternalState(value).source = TEMPLATE.join(typeof key == "string" ? key : "");
                  }
                  if (O === global2) {
                    if (simple) O[key] = value;
                    else setGlobal(key, value);
                    return;
                  } else if (!unsafe) {
                    delete O[key];
                  } else if (!noTargetGet && O[key]) {
                    simple = true;
                  }
                  if (simple) O[key] = value;
                  else createNonEnumerableProperty(O, key, value);
                })(Function.prototype, "toString", function toString() {
                  return typeof this == "function" && getInternalState(this).source || inspectSource(this);
                });
              }
            ),
            /***/
            "6f53": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var objectKeys = __webpack_require__("df75");
                var toIndexedObject = __webpack_require__("fc6a");
                var propertyIsEnumerable = __webpack_require__("d1e7").f;
                var createMethod = function(TO_ENTRIES) {
                  return function(it) {
                    var O = toIndexedObject(it);
                    var keys = objectKeys(O);
                    var length = keys.length;
                    var i = 0;
                    var result = [];
                    var key;
                    while (length > i) {
                      key = keys[i++];
                      if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
                        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
                      }
                    }
                    return result;
                  };
                };
                module3.exports = {
                  // `Object.entries` method
                  // https://tc39.github.io/ecma262/#sec-object.entries
                  entries: createMethod(true),
                  // `Object.values` method
                  // https://tc39.github.io/ecma262/#sec-object.values
                  values: createMethod(false)
                };
              }
            ),
            /***/
            "73d9": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var addToUnscopables = __webpack_require__("44d2");
                addToUnscopables("flatMap");
              }
            ),
            /***/
            "7418": (
              /***/
              function(module3, exports3) {
                exports3.f = Object.getOwnPropertySymbols;
              }
            ),
            /***/
            "746f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var path = __webpack_require__("428f");
                var has = __webpack_require__("5135");
                var wrappedWellKnownSymbolModule = __webpack_require__("e538");
                var defineProperty = __webpack_require__("9bf2").f;
                module3.exports = function(NAME) {
                  var Symbol2 = path.Symbol || (path.Symbol = {});
                  if (!has(Symbol2, NAME)) defineProperty(Symbol2, NAME, {
                    value: wrappedWellKnownSymbolModule.f(NAME)
                  });
                };
              }
            ),
            /***/
            "7839": (
              /***/
              function(module3, exports3) {
                module3.exports = [
                  "constructor",
                  "hasOwnProperty",
                  "isPrototypeOf",
                  "propertyIsEnumerable",
                  "toLocaleString",
                  "toString",
                  "valueOf"
                ];
              }
            ),
            /***/
            "7b0b": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var requireObjectCoercible = __webpack_require__("1d80");
                module3.exports = function(argument) {
                  return Object(requireObjectCoercible(argument));
                };
              }
            ),
            /***/
            "7c73": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var anObject = __webpack_require__("825a");
                var defineProperties = __webpack_require__("37e8");
                var enumBugKeys = __webpack_require__("7839");
                var hiddenKeys = __webpack_require__("d012");
                var html = __webpack_require__("1be4");
                var documentCreateElement = __webpack_require__("cc12");
                var sharedKey = __webpack_require__("f772");
                var GT = ">";
                var LT = "<";
                var PROTOTYPE = "prototype";
                var SCRIPT = "script";
                var IE_PROTO = sharedKey("IE_PROTO");
                var EmptyConstructor = function() {
                };
                var scriptTag = function(content) {
                  return LT + SCRIPT + GT + content + LT + "/" + SCRIPT + GT;
                };
                var NullProtoObjectViaActiveX = function(activeXDocument2) {
                  activeXDocument2.write(scriptTag(""));
                  activeXDocument2.close();
                  var temp = activeXDocument2.parentWindow.Object;
                  activeXDocument2 = null;
                  return temp;
                };
                var NullProtoObjectViaIFrame = function() {
                  var iframe = documentCreateElement("iframe");
                  var JS = "java" + SCRIPT + ":";
                  var iframeDocument;
                  iframe.style.display = "none";
                  html.appendChild(iframe);
                  iframe.src = String(JS);
                  iframeDocument = iframe.contentWindow.document;
                  iframeDocument.open();
                  iframeDocument.write(scriptTag("document.F=Object"));
                  iframeDocument.close();
                  return iframeDocument.F;
                };
                var activeXDocument;
                var NullProtoObject = function() {
                  try {
                    activeXDocument = document.domain && new ActiveXObject("htmlfile");
                  } catch (error) {
                  }
                  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
                  var length = enumBugKeys.length;
                  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
                  return NullProtoObject();
                };
                hiddenKeys[IE_PROTO] = true;
                module3.exports = Object.create || function create(O, Properties) {
                  var result;
                  if (O !== null) {
                    EmptyConstructor[PROTOTYPE] = anObject(O);
                    result = new EmptyConstructor();
                    EmptyConstructor[PROTOTYPE] = null;
                    result[IE_PROTO] = O;
                  } else result = NullProtoObject();
                  return Properties === void 0 ? result : defineProperties(result, Properties);
                };
              }
            ),
            /***/
            "7dd0": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var createIteratorConstructor = __webpack_require__("9ed3");
                var getPrototypeOf = __webpack_require__("e163");
                var setPrototypeOf = __webpack_require__("d2bb");
                var setToStringTag = __webpack_require__("d44e");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var redefine = __webpack_require__("6eeb");
                var wellKnownSymbol = __webpack_require__("b622");
                var IS_PURE = __webpack_require__("c430");
                var Iterators = __webpack_require__("3f8c");
                var IteratorsCore = __webpack_require__("ae93");
                var IteratorPrototype = IteratorsCore.IteratorPrototype;
                var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
                var ITERATOR = wellKnownSymbol("iterator");
                var KEYS = "keys";
                var VALUES = "values";
                var ENTRIES = "entries";
                var returnThis = function() {
                  return this;
                };
                module3.exports = function(Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
                  createIteratorConstructor(IteratorConstructor, NAME, next);
                  var getIterationMethod = function(KIND) {
                    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
                    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
                    switch (KIND) {
                      case KEYS:
                        return function keys() {
                          return new IteratorConstructor(this, KIND);
                        };
                      case VALUES:
                        return function values() {
                          return new IteratorConstructor(this, KIND);
                        };
                      case ENTRIES:
                        return function entries() {
                          return new IteratorConstructor(this, KIND);
                        };
                    }
                    return function() {
                      return new IteratorConstructor(this);
                    };
                  };
                  var TO_STRING_TAG = NAME + " Iterator";
                  var INCORRECT_VALUES_NAME = false;
                  var IterablePrototype = Iterable.prototype;
                  var nativeIterator = IterablePrototype[ITERATOR] || IterablePrototype["@@iterator"] || DEFAULT && IterablePrototype[DEFAULT];
                  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
                  var anyNativeIterator = NAME == "Array" ? IterablePrototype.entries || nativeIterator : nativeIterator;
                  var CurrentIteratorPrototype, methods, KEY;
                  if (anyNativeIterator) {
                    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
                    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
                      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
                        if (setPrototypeOf) {
                          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
                        } else if (typeof CurrentIteratorPrototype[ITERATOR] != "function") {
                          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
                        }
                      }
                      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
                      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
                    }
                  }
                  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
                    INCORRECT_VALUES_NAME = true;
                    defaultIterator = function values() {
                      return nativeIterator.call(this);
                    };
                  }
                  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
                    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
                  }
                  Iterators[NAME] = defaultIterator;
                  if (DEFAULT) {
                    methods = {
                      values: getIterationMethod(VALUES),
                      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
                      entries: getIterationMethod(ENTRIES)
                    };
                    if (FORCED) for (KEY in methods) {
                      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                        redefine(IterablePrototype, KEY, methods[KEY]);
                      }
                    }
                    else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
                  }
                  return methods;
                };
              }
            ),
            /***/
            "7f9a": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var inspectSource = __webpack_require__("8925");
                var WeakMap = global2.WeakMap;
                module3.exports = typeof WeakMap === "function" && /native code/.test(inspectSource(WeakMap));
              }
            ),
            /***/
            "825a": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isObject2 = __webpack_require__("861d");
                module3.exports = function(it) {
                  if (!isObject2(it)) {
                    throw TypeError(String(it) + " is not an object");
                  }
                  return it;
                };
              }
            ),
            /***/
            "83ab": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                module3.exports = !fails(function() {
                  return Object.defineProperty({}, 1, { get: function() {
                    return 7;
                  } })[1] != 7;
                });
              }
            ),
            /***/
            "8418": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toPrimitive = __webpack_require__("c04e");
                var definePropertyModule = __webpack_require__("9bf2");
                var createPropertyDescriptor = __webpack_require__("5c6c");
                module3.exports = function(object, key, value) {
                  var propertyKey = toPrimitive(key);
                  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
                  else object[propertyKey] = value;
                };
              }
            ),
            /***/
            "861d": (
              /***/
              function(module3, exports3) {
                module3.exports = function(it) {
                  return typeof it === "object" ? it !== null : typeof it === "function";
                };
              }
            ),
            /***/
            "8875": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
                (function(root2, factory) {
                  {
                    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports3, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module3.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                  }
                })(typeof self !== "undefined" ? self : this, function() {
                  function getCurrentScript() {
                    var descriptor = Object.getOwnPropertyDescriptor(document, "currentScript");
                    if (!descriptor && "currentScript" in document && document.currentScript) {
                      return document.currentScript;
                    }
                    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
                      return document.currentScript;
                    }
                    try {
                      throw new Error();
                    } catch (err) {
                      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig, ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig, stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack), scriptLocation = stackDetails && stackDetails[1] || false, line = stackDetails && stackDetails[2] || false, currentLocation = document.location.href.replace(document.location.hash, ""), pageSource, inlineScriptSourceRegExp, inlineScriptSource, scripts = document.getElementsByTagName("script");
                      if (scriptLocation === currentLocation) {
                        pageSource = document.documentElement.outerHTML;
                        inlineScriptSourceRegExp = new RegExp("(?:[^\\n]+?\\n){0," + (line - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i");
                        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, "$1").trim();
                      }
                      for (var i = 0; i < scripts.length; i++) {
                        if (scripts[i].readyState === "interactive") {
                          return scripts[i];
                        }
                        if (scripts[i].src === scriptLocation) {
                          return scripts[i];
                        }
                        if (scriptLocation === currentLocation && scripts[i].innerHTML && scripts[i].innerHTML.trim() === inlineScriptSource) {
                          return scripts[i];
                        }
                      }
                      return null;
                    }
                  }
                  return getCurrentScript;
                });
              }
            ),
            /***/
            "8925": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var store = __webpack_require__("c6cd");
                var functionToString = Function.toString;
                if (typeof store.inspectSource != "function") {
                  store.inspectSource = function(it) {
                    return functionToString.call(it);
                  };
                }
                module3.exports = store.inspectSource;
              }
            ),
            /***/
            "8aa5": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var charAt = __webpack_require__("6547").charAt;
                module3.exports = function(S, index2, unicode) {
                  return index2 + (unicode ? charAt(S, index2).length : 1);
                };
              }
            ),
            /***/
            "8bbf": (
              /***/
              function(module3, exports3) {
                module3.exports = __WEBPACK_EXTERNAL_MODULE__8bbf__;
              }
            ),
            /***/
            "90e3": (
              /***/
              function(module3, exports3) {
                var id = 0;
                var postfix = Math.random();
                module3.exports = function(key) {
                  return "Symbol(" + String(key === void 0 ? "" : key) + ")_" + (++id + postfix).toString(36);
                };
              }
            ),
            /***/
            "9112": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var definePropertyModule = __webpack_require__("9bf2");
                var createPropertyDescriptor = __webpack_require__("5c6c");
                module3.exports = DESCRIPTORS ? function(object, key, value) {
                  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
                } : function(object, key, value) {
                  object[key] = value;
                  return object;
                };
              }
            ),
            /***/
            "9263": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var regexpFlags = __webpack_require__("ad6d");
                var stickyHelpers = __webpack_require__("9f7f");
                var nativeExec = RegExp.prototype.exec;
                var nativeReplace = String.prototype.replace;
                var patchedExec = nativeExec;
                var UPDATES_LAST_INDEX_WRONG = function() {
                  var re1 = /a/;
                  var re2 = /b*/g;
                  nativeExec.call(re1, "a");
                  nativeExec.call(re2, "a");
                  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
                }();
                var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;
                var NPCG_INCLUDED = /()??/.exec("")[1] !== void 0;
                var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;
                if (PATCH) {
                  patchedExec = function exec(str) {
                    var re = this;
                    var lastIndex, reCopy, match, i;
                    var sticky = UNSUPPORTED_Y && re.sticky;
                    var flags = regexpFlags.call(re);
                    var source = re.source;
                    var charsAdded = 0;
                    var strCopy = str;
                    if (sticky) {
                      flags = flags.replace("y", "");
                      if (flags.indexOf("g") === -1) {
                        flags += "g";
                      }
                      strCopy = String(str).slice(re.lastIndex);
                      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== "\n")) {
                        source = "(?: " + source + ")";
                        strCopy = " " + strCopy;
                        charsAdded++;
                      }
                      reCopy = new RegExp("^(?:" + source + ")", flags);
                    }
                    if (NPCG_INCLUDED) {
                      reCopy = new RegExp("^" + source + "$(?!\\s)", flags);
                    }
                    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
                    match = nativeExec.call(sticky ? reCopy : re, strCopy);
                    if (sticky) {
                      if (match) {
                        match.input = match.input.slice(charsAdded);
                        match[0] = match[0].slice(charsAdded);
                        match.index = re.lastIndex;
                        re.lastIndex += match[0].length;
                      } else re.lastIndex = 0;
                    } else if (UPDATES_LAST_INDEX_WRONG && match) {
                      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
                    }
                    if (NPCG_INCLUDED && match && match.length > 1) {
                      nativeReplace.call(match[0], reCopy, function() {
                        for (i = 1; i < arguments.length - 2; i++) {
                          if (arguments[i] === void 0) match[i] = void 0;
                        }
                      });
                    }
                    return match;
                  };
                }
                module3.exports = patchedExec;
              }
            ),
            /***/
            "94ca": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                var replacement = /#|\.prototype\./;
                var isForced = function(feature, detection) {
                  var value = data[normalize(feature)];
                  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == "function" ? fails(detection) : !!detection;
                };
                var normalize = isForced.normalize = function(string) {
                  return String(string).replace(replacement, ".").toLowerCase();
                };
                var data = isForced.data = {};
                var NATIVE = isForced.NATIVE = "N";
                var POLYFILL = isForced.POLYFILL = "P";
                module3.exports = isForced;
              }
            ),
            /***/
            "99af": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var fails = __webpack_require__("d039");
                var isArray = __webpack_require__("e8b5");
                var isObject2 = __webpack_require__("861d");
                var toObject = __webpack_require__("7b0b");
                var toLength = __webpack_require__("50c4");
                var createProperty = __webpack_require__("8418");
                var arraySpeciesCreate = __webpack_require__("65f0");
                var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
                var wellKnownSymbol = __webpack_require__("b622");
                var V8_VERSION = __webpack_require__("2d00");
                var IS_CONCAT_SPREADABLE = wellKnownSymbol("isConcatSpreadable");
                var MAX_SAFE_INTEGER = 9007199254740991;
                var MAXIMUM_ALLOWED_INDEX_EXCEEDED = "Maximum allowed index exceeded";
                var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function() {
                  var array = [];
                  array[IS_CONCAT_SPREADABLE] = false;
                  return array.concat()[0] !== array;
                });
                var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("concat");
                var isConcatSpreadable = function(O) {
                  if (!isObject2(O)) return false;
                  var spreadable = O[IS_CONCAT_SPREADABLE];
                  return spreadable !== void 0 ? !!spreadable : isArray(O);
                };
                var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;
                $({ target: "Array", proto: true, forced: FORCED }, {
                  concat: function concat(arg) {
                    var O = toObject(this);
                    var A = arraySpeciesCreate(O, 0);
                    var n = 0;
                    var i, k, length, len, E;
                    for (i = -1, length = arguments.length; i < length; i++) {
                      E = i === -1 ? O : arguments[i];
                      if (isConcatSpreadable(E)) {
                        len = toLength(E.length);
                        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
                      } else {
                        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                        createProperty(A, n++, E);
                      }
                    }
                    A.length = n;
                    return A;
                  }
                });
              }
            ),
            /***/
            "9bdd": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var anObject = __webpack_require__("825a");
                module3.exports = function(iterator, fn, value, ENTRIES) {
                  try {
                    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
                  } catch (error) {
                    var returnMethod = iterator["return"];
                    if (returnMethod !== void 0) anObject(returnMethod.call(iterator));
                    throw error;
                  }
                };
              }
            ),
            /***/
            "9bf2": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var IE8_DOM_DEFINE = __webpack_require__("0cfb");
                var anObject = __webpack_require__("825a");
                var toPrimitive = __webpack_require__("c04e");
                var nativeDefineProperty = Object.defineProperty;
                exports3.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
                  anObject(O);
                  P = toPrimitive(P, true);
                  anObject(Attributes);
                  if (IE8_DOM_DEFINE) try {
                    return nativeDefineProperty(O, P, Attributes);
                  } catch (error) {
                  }
                  if ("get" in Attributes || "set" in Attributes) throw TypeError("Accessors not supported");
                  if ("value" in Attributes) O[P] = Attributes.value;
                  return O;
                };
              }
            ),
            /***/
            "9ed3": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var IteratorPrototype = __webpack_require__("ae93").IteratorPrototype;
                var create = __webpack_require__("7c73");
                var createPropertyDescriptor = __webpack_require__("5c6c");
                var setToStringTag = __webpack_require__("d44e");
                var Iterators = __webpack_require__("3f8c");
                var returnThis = function() {
                  return this;
                };
                module3.exports = function(IteratorConstructor, NAME, next) {
                  var TO_STRING_TAG = NAME + " Iterator";
                  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
                  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
                  Iterators[TO_STRING_TAG] = returnThis;
                  return IteratorConstructor;
                };
              }
            ),
            /***/
            "9f7f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                function RE(s, f) {
                  return RegExp(s, f);
                }
                exports3.UNSUPPORTED_Y = fails(function() {
                  var re = RE("a", "y");
                  re.lastIndex = 2;
                  return re.exec("abcd") != null;
                });
                exports3.BROKEN_CARET = fails(function() {
                  var re = RE("^r", "gy");
                  re.lastIndex = 2;
                  return re.exec("str") != null;
                });
              }
            ),
            /***/
            "a2bf": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isArray = __webpack_require__("e8b5");
                var toLength = __webpack_require__("50c4");
                var bind = __webpack_require__("0366");
                var flattenIntoArray = function(target, original, source, sourceLen, start, depth, mapper, thisArg) {
                  var targetIndex = start;
                  var sourceIndex = 0;
                  var mapFn = mapper ? bind(mapper, thisArg, 3) : false;
                  var element;
                  while (sourceIndex < sourceLen) {
                    if (sourceIndex in source) {
                      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];
                      if (depth > 0 && isArray(element)) {
                        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
                      } else {
                        if (targetIndex >= 9007199254740991) throw TypeError("Exceed the acceptable array length");
                        target[targetIndex] = element;
                      }
                      targetIndex++;
                    }
                    sourceIndex++;
                  }
                  return targetIndex;
                };
                module3.exports = flattenIntoArray;
              }
            ),
            /***/
            "a352": (
              /***/
              function(module3, exports3) {
                module3.exports = __WEBPACK_EXTERNAL_MODULE_a352__;
              }
            ),
            /***/
            "a434": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var toAbsoluteIndex = __webpack_require__("23cb");
                var toInteger = __webpack_require__("a691");
                var toLength = __webpack_require__("50c4");
                var toObject = __webpack_require__("7b0b");
                var arraySpeciesCreate = __webpack_require__("65f0");
                var createProperty = __webpack_require__("8418");
                var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("splice");
                var USES_TO_LENGTH = arrayMethodUsesToLength("splice", { ACCESSORS: true, 0: 0, 1: 2 });
                var max = Math.max;
                var min = Math.min;
                var MAX_SAFE_INTEGER = 9007199254740991;
                var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = "Maximum allowed length exceeded";
                $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                  splice: function splice(start, deleteCount) {
                    var O = toObject(this);
                    var len = toLength(O.length);
                    var actualStart = toAbsoluteIndex(start, len);
                    var argumentsLength = arguments.length;
                    var insertCount, actualDeleteCount, A, k, from, to;
                    if (argumentsLength === 0) {
                      insertCount = actualDeleteCount = 0;
                    } else if (argumentsLength === 1) {
                      insertCount = 0;
                      actualDeleteCount = len - actualStart;
                    } else {
                      insertCount = argumentsLength - 2;
                      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
                    }
                    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
                      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
                    }
                    A = arraySpeciesCreate(O, actualDeleteCount);
                    for (k = 0; k < actualDeleteCount; k++) {
                      from = actualStart + k;
                      if (from in O) createProperty(A, k, O[from]);
                    }
                    A.length = actualDeleteCount;
                    if (insertCount < actualDeleteCount) {
                      for (k = actualStart; k < len - actualDeleteCount; k++) {
                        from = k + actualDeleteCount;
                        to = k + insertCount;
                        if (from in O) O[to] = O[from];
                        else delete O[to];
                      }
                      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
                    } else if (insertCount > actualDeleteCount) {
                      for (k = len - actualDeleteCount; k > actualStart; k--) {
                        from = k + actualDeleteCount - 1;
                        to = k + insertCount - 1;
                        if (from in O) O[to] = O[from];
                        else delete O[to];
                      }
                    }
                    for (k = 0; k < insertCount; k++) {
                      O[k + actualStart] = arguments[k + 2];
                    }
                    O.length = len - actualDeleteCount + insertCount;
                    return A;
                  }
                });
              }
            ),
            /***/
            "a4d3": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var global2 = __webpack_require__("da84");
                var getBuiltIn = __webpack_require__("d066");
                var IS_PURE = __webpack_require__("c430");
                var DESCRIPTORS = __webpack_require__("83ab");
                var NATIVE_SYMBOL = __webpack_require__("4930");
                var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
                var fails = __webpack_require__("d039");
                var has = __webpack_require__("5135");
                var isArray = __webpack_require__("e8b5");
                var isObject2 = __webpack_require__("861d");
                var anObject = __webpack_require__("825a");
                var toObject = __webpack_require__("7b0b");
                var toIndexedObject = __webpack_require__("fc6a");
                var toPrimitive = __webpack_require__("c04e");
                var createPropertyDescriptor = __webpack_require__("5c6c");
                var nativeObjectCreate = __webpack_require__("7c73");
                var objectKeys = __webpack_require__("df75");
                var getOwnPropertyNamesModule = __webpack_require__("241c");
                var getOwnPropertyNamesExternal = __webpack_require__("057f");
                var getOwnPropertySymbolsModule = __webpack_require__("7418");
                var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
                var definePropertyModule = __webpack_require__("9bf2");
                var propertyIsEnumerableModule = __webpack_require__("d1e7");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var redefine = __webpack_require__("6eeb");
                var shared = __webpack_require__("5692");
                var sharedKey = __webpack_require__("f772");
                var hiddenKeys = __webpack_require__("d012");
                var uid = __webpack_require__("90e3");
                var wellKnownSymbol = __webpack_require__("b622");
                var wrappedWellKnownSymbolModule = __webpack_require__("e538");
                var defineWellKnownSymbol = __webpack_require__("746f");
                var setToStringTag = __webpack_require__("d44e");
                var InternalStateModule = __webpack_require__("69f3");
                var $forEach = __webpack_require__("b727").forEach;
                var HIDDEN = sharedKey("hidden");
                var SYMBOL = "Symbol";
                var PROTOTYPE = "prototype";
                var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
                var setInternalState = InternalStateModule.set;
                var getInternalState = InternalStateModule.getterFor(SYMBOL);
                var ObjectPrototype = Object[PROTOTYPE];
                var $Symbol = global2.Symbol;
                var $stringify = getBuiltIn("JSON", "stringify");
                var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
                var nativeDefineProperty = definePropertyModule.f;
                var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
                var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
                var AllSymbols = shared("symbols");
                var ObjectPrototypeSymbols = shared("op-symbols");
                var StringToSymbolRegistry = shared("string-to-symbol-registry");
                var SymbolToStringRegistry = shared("symbol-to-string-registry");
                var WellKnownSymbolsStore = shared("wks");
                var QObject = global2.QObject;
                var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
                var setSymbolDescriptor = DESCRIPTORS && fails(function() {
                  return nativeObjectCreate(nativeDefineProperty({}, "a", {
                    get: function() {
                      return nativeDefineProperty(this, "a", { value: 7 }).a;
                    }
                  })).a != 7;
                }) ? function(O, P, Attributes) {
                  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
                  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
                  nativeDefineProperty(O, P, Attributes);
                  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
                    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
                  }
                } : nativeDefineProperty;
                var wrap = function(tag, description) {
                  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
                  setInternalState(symbol, {
                    type: SYMBOL,
                    tag,
                    description
                  });
                  if (!DESCRIPTORS) symbol.description = description;
                  return symbol;
                };
                var isSymbol2 = USE_SYMBOL_AS_UID ? function(it) {
                  return typeof it == "symbol";
                } : function(it) {
                  return Object(it) instanceof $Symbol;
                };
                var $defineProperty = function defineProperty(O, P, Attributes) {
                  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
                  anObject(O);
                  var key = toPrimitive(P, true);
                  anObject(Attributes);
                  if (has(AllSymbols, key)) {
                    if (!Attributes.enumerable) {
                      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
                      O[HIDDEN][key] = true;
                    } else {
                      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
                      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
                    }
                    return setSymbolDescriptor(O, key, Attributes);
                  }
                  return nativeDefineProperty(O, key, Attributes);
                };
                var $defineProperties = function defineProperties(O, Properties) {
                  anObject(O);
                  var properties = toIndexedObject(Properties);
                  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
                  $forEach(keys, function(key) {
                    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
                  });
                  return O;
                };
                var $create = function create(O, Properties) {
                  return Properties === void 0 ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
                };
                var $propertyIsEnumerable = function propertyIsEnumerable(V) {
                  var P = toPrimitive(V, true);
                  var enumerable = nativePropertyIsEnumerable.call(this, P);
                  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
                  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
                };
                var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
                  var it = toIndexedObject(O);
                  var key = toPrimitive(P, true);
                  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
                  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
                  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
                    descriptor.enumerable = true;
                  }
                  return descriptor;
                };
                var $getOwnPropertyNames = function getOwnPropertyNames(O) {
                  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
                  var result = [];
                  $forEach(names, function(key) {
                    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
                  });
                  return result;
                };
                var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
                  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
                  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
                  var result = [];
                  $forEach(names, function(key) {
                    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
                      result.push(AllSymbols[key]);
                    }
                  });
                  return result;
                };
                if (!NATIVE_SYMBOL) {
                  $Symbol = function Symbol2() {
                    if (this instanceof $Symbol) throw TypeError("Symbol is not a constructor");
                    var description = !arguments.length || arguments[0] === void 0 ? void 0 : String(arguments[0]);
                    var tag = uid(description);
                    var setter = function(value) {
                      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
                      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
                    };
                    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
                    return wrap(tag, description);
                  };
                  redefine($Symbol[PROTOTYPE], "toString", function toString() {
                    return getInternalState(this).tag;
                  });
                  redefine($Symbol, "withoutSetter", function(description) {
                    return wrap(uid(description), description);
                  });
                  propertyIsEnumerableModule.f = $propertyIsEnumerable;
                  definePropertyModule.f = $defineProperty;
                  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
                  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
                  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;
                  wrappedWellKnownSymbolModule.f = function(name) {
                    return wrap(wellKnownSymbol(name), name);
                  };
                  if (DESCRIPTORS) {
                    nativeDefineProperty($Symbol[PROTOTYPE], "description", {
                      configurable: true,
                      get: function description() {
                        return getInternalState(this).description;
                      }
                    });
                    if (!IS_PURE) {
                      redefine(ObjectPrototype, "propertyIsEnumerable", $propertyIsEnumerable, { unsafe: true });
                    }
                  }
                }
                $({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
                  Symbol: $Symbol
                });
                $forEach(objectKeys(WellKnownSymbolsStore), function(name) {
                  defineWellKnownSymbol(name);
                });
                $({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
                  // `Symbol.for` method
                  // https://tc39.github.io/ecma262/#sec-symbol.for
                  "for": function(key) {
                    var string = String(key);
                    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
                    var symbol = $Symbol(string);
                    StringToSymbolRegistry[string] = symbol;
                    SymbolToStringRegistry[symbol] = string;
                    return symbol;
                  },
                  // `Symbol.keyFor` method
                  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
                  keyFor: function keyFor(sym) {
                    if (!isSymbol2(sym)) throw TypeError(sym + " is not a symbol");
                    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
                  },
                  useSetter: function() {
                    USE_SETTER = true;
                  },
                  useSimple: function() {
                    USE_SETTER = false;
                  }
                });
                $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
                  // `Object.create` method
                  // https://tc39.github.io/ecma262/#sec-object.create
                  create: $create,
                  // `Object.defineProperty` method
                  // https://tc39.github.io/ecma262/#sec-object.defineproperty
                  defineProperty: $defineProperty,
                  // `Object.defineProperties` method
                  // https://tc39.github.io/ecma262/#sec-object.defineproperties
                  defineProperties: $defineProperties,
                  // `Object.getOwnPropertyDescriptor` method
                  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
                  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
                });
                $({ target: "Object", stat: true, forced: !NATIVE_SYMBOL }, {
                  // `Object.getOwnPropertyNames` method
                  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
                  getOwnPropertyNames: $getOwnPropertyNames,
                  // `Object.getOwnPropertySymbols` method
                  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
                  getOwnPropertySymbols: $getOwnPropertySymbols
                });
                $({ target: "Object", stat: true, forced: fails(function() {
                  getOwnPropertySymbolsModule.f(1);
                }) }, {
                  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
                    return getOwnPropertySymbolsModule.f(toObject(it));
                  }
                });
                if ($stringify) {
                  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function() {
                    var symbol = $Symbol();
                    return $stringify([symbol]) != "[null]" || $stringify({ a: symbol }) != "{}" || $stringify(Object(symbol)) != "{}";
                  });
                  $({ target: "JSON", stat: true, forced: FORCED_JSON_STRINGIFY }, {
                    // eslint-disable-next-line no-unused-vars
                    stringify: function stringify(it, replacer, space) {
                      var args = [it];
                      var index2 = 1;
                      var $replacer;
                      while (arguments.length > index2) args.push(arguments[index2++]);
                      $replacer = replacer;
                      if (!isObject2(replacer) && it === void 0 || isSymbol2(it)) return;
                      if (!isArray(replacer)) replacer = function(key, value) {
                        if (typeof $replacer == "function") value = $replacer.call(this, key, value);
                        if (!isSymbol2(value)) return value;
                      };
                      args[1] = replacer;
                      return $stringify.apply(null, args);
                    }
                  });
                }
                if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
                  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
                }
                setToStringTag($Symbol, SYMBOL);
                hiddenKeys[HIDDEN] = true;
              }
            ),
            /***/
            "a630": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var from = __webpack_require__("4df4");
                var checkCorrectnessOfIteration = __webpack_require__("1c7e");
                var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function(iterable) {
                  Array.from(iterable);
                });
                $({ target: "Array", stat: true, forced: INCORRECT_ITERATION }, {
                  from
                });
              }
            ),
            /***/
            "a640": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                module3.exports = function(METHOD_NAME, argument) {
                  var method = [][METHOD_NAME];
                  return !!method && fails(function() {
                    method.call(null, argument || function() {
                      throw 1;
                    }, 1);
                  });
                };
              }
            ),
            /***/
            "a691": (
              /***/
              function(module3, exports3) {
                var ceil = Math.ceil;
                var floor = Math.floor;
                module3.exports = function(argument) {
                  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
                };
              }
            ),
            /***/
            "ab13": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var wellKnownSymbol = __webpack_require__("b622");
                var MATCH = wellKnownSymbol("match");
                module3.exports = function(METHOD_NAME) {
                  var regexp = /./;
                  try {
                    "/./"[METHOD_NAME](regexp);
                  } catch (e) {
                    try {
                      regexp[MATCH] = false;
                      return "/./"[METHOD_NAME](regexp);
                    } catch (f) {
                    }
                  }
                  return false;
                };
              }
            ),
            /***/
            "ac1f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var exec = __webpack_require__("9263");
                $({ target: "RegExp", proto: true, forced: /./.exec !== exec }, {
                  exec
                });
              }
            ),
            /***/
            "ad6d": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var anObject = __webpack_require__("825a");
                module3.exports = function() {
                  var that = anObject(this);
                  var result = "";
                  if (that.global) result += "g";
                  if (that.ignoreCase) result += "i";
                  if (that.multiline) result += "m";
                  if (that.dotAll) result += "s";
                  if (that.unicode) result += "u";
                  if (that.sticky) result += "y";
                  return result;
                };
              }
            ),
            /***/
            "ae40": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var fails = __webpack_require__("d039");
                var has = __webpack_require__("5135");
                var defineProperty = Object.defineProperty;
                var cache = {};
                var thrower = function(it) {
                  throw it;
                };
                module3.exports = function(METHOD_NAME, options) {
                  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
                  if (!options) options = {};
                  var method = [][METHOD_NAME];
                  var ACCESSORS = has(options, "ACCESSORS") ? options.ACCESSORS : false;
                  var argument0 = has(options, 0) ? options[0] : thrower;
                  var argument1 = has(options, 1) ? options[1] : void 0;
                  return cache[METHOD_NAME] = !!method && !fails(function() {
                    if (ACCESSORS && !DESCRIPTORS) return true;
                    var O = { length: -1 };
                    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
                    else O[1] = 1;
                    method.call(O, argument0, argument1);
                  });
                };
              }
            ),
            /***/
            "ae93": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var getPrototypeOf = __webpack_require__("e163");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var has = __webpack_require__("5135");
                var wellKnownSymbol = __webpack_require__("b622");
                var IS_PURE = __webpack_require__("c430");
                var ITERATOR = wellKnownSymbol("iterator");
                var BUGGY_SAFARI_ITERATORS = false;
                var returnThis = function() {
                  return this;
                };
                var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
                if ([].keys) {
                  arrayIterator = [].keys();
                  if (!("next" in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
                  else {
                    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
                    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
                  }
                }
                if (IteratorPrototype == void 0) IteratorPrototype = {};
                if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
                  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
                }
                module3.exports = {
                  IteratorPrototype,
                  BUGGY_SAFARI_ITERATORS
                };
              }
            ),
            /***/
            "b041": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
                var classof = __webpack_require__("f5df");
                module3.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
                  return "[object " + classof(this) + "]";
                };
              }
            ),
            /***/
            "b0c0": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var DESCRIPTORS = __webpack_require__("83ab");
                var defineProperty = __webpack_require__("9bf2").f;
                var FunctionPrototype = Function.prototype;
                var FunctionPrototypeToString = FunctionPrototype.toString;
                var nameRE = /^\s*function ([^ (]*)/;
                var NAME = "name";
                if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
                  defineProperty(FunctionPrototype, NAME, {
                    configurable: true,
                    get: function() {
                      try {
                        return FunctionPrototypeToString.call(this).match(nameRE)[1];
                      } catch (error) {
                        return "";
                      }
                    }
                  });
                }
              }
            ),
            /***/
            "b622": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var shared = __webpack_require__("5692");
                var has = __webpack_require__("5135");
                var uid = __webpack_require__("90e3");
                var NATIVE_SYMBOL = __webpack_require__("4930");
                var USE_SYMBOL_AS_UID = __webpack_require__("fdbf");
                var WellKnownSymbolsStore = shared("wks");
                var Symbol2 = global2.Symbol;
                var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol2 : Symbol2 && Symbol2.withoutSetter || uid;
                module3.exports = function(name) {
                  if (!has(WellKnownSymbolsStore, name)) {
                    if (NATIVE_SYMBOL && has(Symbol2, name)) WellKnownSymbolsStore[name] = Symbol2[name];
                    else WellKnownSymbolsStore[name] = createWellKnownSymbol("Symbol." + name);
                  }
                  return WellKnownSymbolsStore[name];
                };
              }
            ),
            /***/
            "b64b": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var toObject = __webpack_require__("7b0b");
                var nativeKeys = __webpack_require__("df75");
                var fails = __webpack_require__("d039");
                var FAILS_ON_PRIMITIVES = fails(function() {
                  nativeKeys(1);
                });
                $({ target: "Object", stat: true, forced: FAILS_ON_PRIMITIVES }, {
                  keys: function keys(it) {
                    return nativeKeys(toObject(it));
                  }
                });
              }
            ),
            /***/
            "b727": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var bind = __webpack_require__("0366");
                var IndexedObject = __webpack_require__("44ad");
                var toObject = __webpack_require__("7b0b");
                var toLength = __webpack_require__("50c4");
                var arraySpeciesCreate = __webpack_require__("65f0");
                var push = [].push;
                var createMethod = function(TYPE) {
                  var IS_MAP = TYPE == 1;
                  var IS_FILTER = TYPE == 2;
                  var IS_SOME = TYPE == 3;
                  var IS_EVERY = TYPE == 4;
                  var IS_FIND_INDEX = TYPE == 6;
                  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
                  return function($this, callbackfn, that, specificCreate) {
                    var O = toObject($this);
                    var self2 = IndexedObject(O);
                    var boundFunction = bind(callbackfn, that, 3);
                    var length = toLength(self2.length);
                    var index2 = 0;
                    var create = specificCreate || arraySpeciesCreate;
                    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : void 0;
                    var value, result;
                    for (; length > index2; index2++) if (NO_HOLES || index2 in self2) {
                      value = self2[index2];
                      result = boundFunction(value, index2, O);
                      if (TYPE) {
                        if (IS_MAP) target[index2] = result;
                        else if (result) switch (TYPE) {
                          case 3:
                            return true;
                          // some
                          case 5:
                            return value;
                          // find
                          case 6:
                            return index2;
                          // findIndex
                          case 2:
                            push.call(target, value);
                        }
                        else if (IS_EVERY) return false;
                      }
                    }
                    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
                  };
                };
                module3.exports = {
                  // `Array.prototype.forEach` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
                  forEach: createMethod(0),
                  // `Array.prototype.map` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.map
                  map: createMethod(1),
                  // `Array.prototype.filter` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
                  filter: createMethod(2),
                  // `Array.prototype.some` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.some
                  some: createMethod(3),
                  // `Array.prototype.every` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.every
                  every: createMethod(4),
                  // `Array.prototype.find` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.find
                  find: createMethod(5),
                  // `Array.prototype.findIndex` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
                  findIndex: createMethod(6)
                };
              }
            ),
            /***/
            "c04e": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var isObject2 = __webpack_require__("861d");
                module3.exports = function(input, PREFERRED_STRING) {
                  if (!isObject2(input)) return input;
                  var fn, val;
                  if (PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject2(val = fn.call(input))) return val;
                  if (typeof (fn = input.valueOf) == "function" && !isObject2(val = fn.call(input))) return val;
                  if (!PREFERRED_STRING && typeof (fn = input.toString) == "function" && !isObject2(val = fn.call(input))) return val;
                  throw TypeError("Can't convert object to primitive value");
                };
              }
            ),
            /***/
            "c430": (
              /***/
              function(module3, exports3) {
                module3.exports = false;
              }
            ),
            /***/
            "c6b6": (
              /***/
              function(module3, exports3) {
                var toString = {}.toString;
                module3.exports = function(it) {
                  return toString.call(it).slice(8, -1);
                };
              }
            ),
            /***/
            "c6cd": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var setGlobal = __webpack_require__("ce4e");
                var SHARED = "__core-js_shared__";
                var store = global2[SHARED] || setGlobal(SHARED, {});
                module3.exports = store;
              }
            ),
            /***/
            "c740": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $findIndex = __webpack_require__("b727").findIndex;
                var addToUnscopables = __webpack_require__("44d2");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var FIND_INDEX = "findIndex";
                var SKIPS_HOLES = true;
                var USES_TO_LENGTH = arrayMethodUsesToLength(FIND_INDEX);
                if (FIND_INDEX in []) Array(1)[FIND_INDEX](function() {
                  SKIPS_HOLES = false;
                });
                $({ target: "Array", proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH }, {
                  findIndex: function findIndex(callbackfn) {
                    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
                  }
                });
                addToUnscopables(FIND_INDEX);
              }
            ),
            /***/
            "c8ba": (
              /***/
              function(module3, exports3) {
                var g;
                g = /* @__PURE__ */ function() {
                  return this;
                }();
                try {
                  g = g || new Function("return this")();
                } catch (e) {
                  if (typeof window === "object") g = window;
                }
                module3.exports = g;
              }
            ),
            /***/
            "c975": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $indexOf = __webpack_require__("4d64").indexOf;
                var arrayMethodIsStrict = __webpack_require__("a640");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var nativeIndexOf = [].indexOf;
                var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
                var STRICT_METHOD = arrayMethodIsStrict("indexOf");
                var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 });
                $({ target: "Array", proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
                  indexOf: function indexOf(searchElement) {
                    return NEGATIVE_ZERO ? nativeIndexOf.apply(this, arguments) || 0 : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : void 0);
                  }
                });
              }
            ),
            /***/
            "ca84": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var has = __webpack_require__("5135");
                var toIndexedObject = __webpack_require__("fc6a");
                var indexOf = __webpack_require__("4d64").indexOf;
                var hiddenKeys = __webpack_require__("d012");
                module3.exports = function(object, names) {
                  var O = toIndexedObject(object);
                  var i = 0;
                  var result = [];
                  var key;
                  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
                  while (names.length > i) if (has(O, key = names[i++])) {
                    ~indexOf(result, key) || result.push(key);
                  }
                  return result;
                };
              }
            ),
            /***/
            "caad": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $includes = __webpack_require__("4d64").includes;
                var addToUnscopables = __webpack_require__("44d2");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var USES_TO_LENGTH = arrayMethodUsesToLength("indexOf", { ACCESSORS: true, 1: 0 });
                $({ target: "Array", proto: true, forced: !USES_TO_LENGTH }, {
                  includes: function includes(el) {
                    return $includes(this, el, arguments.length > 1 ? arguments[1] : void 0);
                  }
                });
                addToUnscopables("includes");
              }
            ),
            /***/
            "cc12": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var isObject2 = __webpack_require__("861d");
                var document2 = global2.document;
                var EXISTS = isObject2(document2) && isObject2(document2.createElement);
                module3.exports = function(it) {
                  return EXISTS ? document2.createElement(it) : {};
                };
              }
            ),
            /***/
            "ce4e": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var createNonEnumerableProperty = __webpack_require__("9112");
                module3.exports = function(key, value) {
                  try {
                    createNonEnumerableProperty(global2, key, value);
                  } catch (error) {
                    global2[key] = value;
                  }
                  return value;
                };
              }
            ),
            /***/
            "d012": (
              /***/
              function(module3, exports3) {
                module3.exports = {};
              }
            ),
            /***/
            "d039": (
              /***/
              function(module3, exports3) {
                module3.exports = function(exec) {
                  try {
                    return !!exec();
                  } catch (error) {
                    return true;
                  }
                };
              }
            ),
            /***/
            "d066": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var path = __webpack_require__("428f");
                var global2 = __webpack_require__("da84");
                var aFunction = function(variable) {
                  return typeof variable == "function" ? variable : void 0;
                };
                module3.exports = function(namespace, method) {
                  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global2[namespace]) : path[namespace] && path[namespace][method] || global2[namespace] && global2[namespace][method];
                };
              }
            ),
            /***/
            "d1e7": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
                var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
                var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);
                exports3.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
                  var descriptor = getOwnPropertyDescriptor(this, V);
                  return !!descriptor && descriptor.enumerable;
                } : nativePropertyIsEnumerable;
              }
            ),
            /***/
            "d28b": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var defineWellKnownSymbol = __webpack_require__("746f");
                defineWellKnownSymbol("iterator");
              }
            ),
            /***/
            "d2bb": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var anObject = __webpack_require__("825a");
                var aPossiblePrototype = __webpack_require__("3bbe");
                module3.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
                  var CORRECT_SETTER = false;
                  var test = {};
                  var setter;
                  try {
                    setter = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set;
                    setter.call(test, []);
                    CORRECT_SETTER = test instanceof Array;
                  } catch (error) {
                  }
                  return function setPrototypeOf(O, proto) {
                    anObject(O);
                    aPossiblePrototype(proto);
                    if (CORRECT_SETTER) setter.call(O, proto);
                    else O.__proto__ = proto;
                    return O;
                  };
                }() : void 0);
              }
            ),
            /***/
            "d3b7": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
                var redefine = __webpack_require__("6eeb");
                var toString = __webpack_require__("b041");
                if (!TO_STRING_TAG_SUPPORT) {
                  redefine(Object.prototype, "toString", toString, { unsafe: true });
                }
              }
            ),
            /***/
            "d44e": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var defineProperty = __webpack_require__("9bf2").f;
                var has = __webpack_require__("5135");
                var wellKnownSymbol = __webpack_require__("b622");
                var TO_STRING_TAG = wellKnownSymbol("toStringTag");
                module3.exports = function(it, TAG, STATIC) {
                  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
                    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
                  }
                };
              }
            ),
            /***/
            "d58f": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var aFunction = __webpack_require__("1c0b");
                var toObject = __webpack_require__("7b0b");
                var IndexedObject = __webpack_require__("44ad");
                var toLength = __webpack_require__("50c4");
                var createMethod = function(IS_RIGHT) {
                  return function(that, callbackfn, argumentsLength, memo) {
                    aFunction(callbackfn);
                    var O = toObject(that);
                    var self2 = IndexedObject(O);
                    var length = toLength(O.length);
                    var index2 = IS_RIGHT ? length - 1 : 0;
                    var i = IS_RIGHT ? -1 : 1;
                    if (argumentsLength < 2) while (true) {
                      if (index2 in self2) {
                        memo = self2[index2];
                        index2 += i;
                        break;
                      }
                      index2 += i;
                      if (IS_RIGHT ? index2 < 0 : length <= index2) {
                        throw TypeError("Reduce of empty array with no initial value");
                      }
                    }
                    for (; IS_RIGHT ? index2 >= 0 : length > index2; index2 += i) if (index2 in self2) {
                      memo = callbackfn(memo, self2[index2], index2, O);
                    }
                    return memo;
                  };
                };
                module3.exports = {
                  // `Array.prototype.reduce` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
                  left: createMethod(false),
                  // `Array.prototype.reduceRight` method
                  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
                  right: createMethod(true)
                };
              }
            ),
            /***/
            "d784": (
              /***/
              function(module3, exports3, __webpack_require__) {
                __webpack_require__("ac1f");
                var redefine = __webpack_require__("6eeb");
                var fails = __webpack_require__("d039");
                var wellKnownSymbol = __webpack_require__("b622");
                var regexpExec = __webpack_require__("9263");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var SPECIES = wellKnownSymbol("species");
                var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function() {
                  var re = /./;
                  re.exec = function() {
                    var result = [];
                    result.groups = { a: "7" };
                    return result;
                  };
                  return "".replace(re, "$<a>") !== "7";
                });
                var REPLACE_KEEPS_$0 = function() {
                  return "a".replace(/./, "$0") === "$0";
                }();
                var REPLACE = wellKnownSymbol("replace");
                var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function() {
                  if (/./[REPLACE]) {
                    return /./[REPLACE]("a", "$0") === "";
                  }
                  return false;
                }();
                var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function() {
                  var re = /(?:)/;
                  var originalExec = re.exec;
                  re.exec = function() {
                    return originalExec.apply(this, arguments);
                  };
                  var result = "ab".split(re);
                  return result.length !== 2 || result[0] !== "a" || result[1] !== "b";
                });
                module3.exports = function(KEY, length, exec, sham) {
                  var SYMBOL = wellKnownSymbol(KEY);
                  var DELEGATES_TO_SYMBOL = !fails(function() {
                    var O = {};
                    O[SYMBOL] = function() {
                      return 7;
                    };
                    return ""[KEY](O) != 7;
                  });
                  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function() {
                    var execCalled = false;
                    var re = /a/;
                    if (KEY === "split") {
                      re = {};
                      re.constructor = {};
                      re.constructor[SPECIES] = function() {
                        return re;
                      };
                      re.flags = "";
                      re[SYMBOL] = /./[SYMBOL];
                    }
                    re.exec = function() {
                      execCalled = true;
                      return null;
                    };
                    re[SYMBOL]("");
                    return !execCalled;
                  });
                  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === "replace" && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === "split" && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
                    var nativeRegExpMethod = /./[SYMBOL];
                    var methods = exec(SYMBOL, ""[KEY], function(nativeMethod, regexp, str, arg2, forceStringMethod) {
                      if (regexp.exec === regexpExec) {
                        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                        }
                        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                      }
                      return { done: false };
                    }, {
                      REPLACE_KEEPS_$0,
                      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
                    });
                    var stringMethod = methods[0];
                    var regexMethod = methods[1];
                    redefine(String.prototype, KEY, stringMethod);
                    redefine(
                      RegExp.prototype,
                      SYMBOL,
                      length == 2 ? function(string, arg) {
                        return regexMethod.call(string, this, arg);
                      } : function(string) {
                        return regexMethod.call(string, this);
                      }
                    );
                  }
                  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], "sham", true);
                };
              }
            ),
            /***/
            "d81d": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var $map = __webpack_require__("b727").map;
                var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("map");
                var USES_TO_LENGTH = arrayMethodUsesToLength("map");
                $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                  map: function map(callbackfn) {
                    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : void 0);
                  }
                });
              }
            ),
            /***/
            "da84": (
              /***/
              function(module3, exports3, __webpack_require__) {
                (function(global2) {
                  var check = function(it) {
                    return it && it.Math == Math && it;
                  };
                  module3.exports = // eslint-disable-next-line no-undef
                  check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof global2 == "object" && global2) || // eslint-disable-next-line no-new-func
                  Function("return this")();
                }).call(this, __webpack_require__("c8ba"));
              }
            ),
            /***/
            "dbb4": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var DESCRIPTORS = __webpack_require__("83ab");
                var ownKeys2 = __webpack_require__("56ef");
                var toIndexedObject = __webpack_require__("fc6a");
                var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
                var createProperty = __webpack_require__("8418");
                $({ target: "Object", stat: true, sham: !DESCRIPTORS }, {
                  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
                    var O = toIndexedObject(object);
                    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
                    var keys = ownKeys2(O);
                    var result = {};
                    var index2 = 0;
                    var key, descriptor;
                    while (keys.length > index2) {
                      descriptor = getOwnPropertyDescriptor(O, key = keys[index2++]);
                      if (descriptor !== void 0) createProperty(result, key, descriptor);
                    }
                    return result;
                  }
                });
              }
            ),
            /***/
            "dbf1": (
              /***/
              function(module3, __webpack_exports__, __webpack_require__) {
                (function(global2) {
                  __webpack_require__.d(__webpack_exports__, "a", function() {
                    return console2;
                  });
                  function getConsole() {
                    if (typeof window !== "undefined") {
                      return window.console;
                    }
                    return global2.console;
                  }
                  var console2 = getConsole();
                }).call(this, __webpack_require__("c8ba"));
              }
            ),
            /***/
            "ddb0": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var global2 = __webpack_require__("da84");
                var DOMIterables = __webpack_require__("fdbc");
                var ArrayIteratorMethods = __webpack_require__("e260");
                var createNonEnumerableProperty = __webpack_require__("9112");
                var wellKnownSymbol = __webpack_require__("b622");
                var ITERATOR = wellKnownSymbol("iterator");
                var TO_STRING_TAG = wellKnownSymbol("toStringTag");
                var ArrayValues = ArrayIteratorMethods.values;
                for (var COLLECTION_NAME in DOMIterables) {
                  var Collection = global2[COLLECTION_NAME];
                  var CollectionPrototype = Collection && Collection.prototype;
                  if (CollectionPrototype) {
                    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
                      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
                    } catch (error) {
                      CollectionPrototype[ITERATOR] = ArrayValues;
                    }
                    if (!CollectionPrototype[TO_STRING_TAG]) {
                      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
                    }
                    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
                      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
                        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
                      } catch (error) {
                        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
                      }
                    }
                  }
                }
              }
            ),
            /***/
            "df75": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var internalObjectKeys = __webpack_require__("ca84");
                var enumBugKeys = __webpack_require__("7839");
                module3.exports = Object.keys || function keys(O) {
                  return internalObjectKeys(O, enumBugKeys);
                };
              }
            ),
            /***/
            "e01a": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var DESCRIPTORS = __webpack_require__("83ab");
                var global2 = __webpack_require__("da84");
                var has = __webpack_require__("5135");
                var isObject2 = __webpack_require__("861d");
                var defineProperty = __webpack_require__("9bf2").f;
                var copyConstructorProperties = __webpack_require__("e893");
                var NativeSymbol = global2.Symbol;
                if (DESCRIPTORS && typeof NativeSymbol == "function" && (!("description" in NativeSymbol.prototype) || // Safari 12 bug
                NativeSymbol().description !== void 0)) {
                  var EmptyStringDescriptionStore = {};
                  var SymbolWrapper = function Symbol2() {
                    var description = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]);
                    var result = this instanceof SymbolWrapper ? new NativeSymbol(description) : description === void 0 ? NativeSymbol() : NativeSymbol(description);
                    if (description === "") EmptyStringDescriptionStore[result] = true;
                    return result;
                  };
                  copyConstructorProperties(SymbolWrapper, NativeSymbol);
                  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
                  symbolPrototype.constructor = SymbolWrapper;
                  var symbolToString = symbolPrototype.toString;
                  var native = String(NativeSymbol("test")) == "Symbol(test)";
                  var regexp = /^Symbol\((.*)\)[^)]+$/;
                  defineProperty(symbolPrototype, "description", {
                    configurable: true,
                    get: function description() {
                      var symbol = isObject2(this) ? this.valueOf() : this;
                      var string = symbolToString.call(symbol);
                      if (has(EmptyStringDescriptionStore, symbol)) return "";
                      var desc = native ? string.slice(7, -1) : string.replace(regexp, "$1");
                      return desc === "" ? void 0 : desc;
                    }
                  });
                  $({ global: true, forced: true }, {
                    Symbol: SymbolWrapper
                  });
                }
              }
            ),
            /***/
            "e163": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var has = __webpack_require__("5135");
                var toObject = __webpack_require__("7b0b");
                var sharedKey = __webpack_require__("f772");
                var CORRECT_PROTOTYPE_GETTER = __webpack_require__("e177");
                var IE_PROTO = sharedKey("IE_PROTO");
                var ObjectPrototype = Object.prototype;
                module3.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function(O) {
                  O = toObject(O);
                  if (has(O, IE_PROTO)) return O[IE_PROTO];
                  if (typeof O.constructor == "function" && O instanceof O.constructor) {
                    return O.constructor.prototype;
                  }
                  return O instanceof Object ? ObjectPrototype : null;
                };
              }
            ),
            /***/
            "e177": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var fails = __webpack_require__("d039");
                module3.exports = !fails(function() {
                  function F() {
                  }
                  F.prototype.constructor = null;
                  return Object.getPrototypeOf(new F()) !== F.prototype;
                });
              }
            ),
            /***/
            "e260": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var toIndexedObject = __webpack_require__("fc6a");
                var addToUnscopables = __webpack_require__("44d2");
                var Iterators = __webpack_require__("3f8c");
                var InternalStateModule = __webpack_require__("69f3");
                var defineIterator = __webpack_require__("7dd0");
                var ARRAY_ITERATOR = "Array Iterator";
                var setInternalState = InternalStateModule.set;
                var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);
                module3.exports = defineIterator(Array, "Array", function(iterated, kind) {
                  setInternalState(this, {
                    type: ARRAY_ITERATOR,
                    target: toIndexedObject(iterated),
                    // target
                    index: 0,
                    // next index
                    kind
                    // kind
                  });
                }, function() {
                  var state = getInternalState(this);
                  var target = state.target;
                  var kind = state.kind;
                  var index2 = state.index++;
                  if (!target || index2 >= target.length) {
                    state.target = void 0;
                    return { value: void 0, done: true };
                  }
                  if (kind == "keys") return { value: index2, done: false };
                  if (kind == "values") return { value: target[index2], done: false };
                  return { value: [index2, target[index2]], done: false };
                }, "values");
                Iterators.Arguments = Iterators.Array;
                addToUnscopables("keys");
                addToUnscopables("values");
                addToUnscopables("entries");
              }
            ),
            /***/
            "e439": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var fails = __webpack_require__("d039");
                var toIndexedObject = __webpack_require__("fc6a");
                var nativeGetOwnPropertyDescriptor = __webpack_require__("06cf").f;
                var DESCRIPTORS = __webpack_require__("83ab");
                var FAILS_ON_PRIMITIVES = fails(function() {
                  nativeGetOwnPropertyDescriptor(1);
                });
                var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;
                $({ target: "Object", stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
                  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
                    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
                  }
                });
              }
            ),
            /***/
            "e538": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var wellKnownSymbol = __webpack_require__("b622");
                exports3.f = wellKnownSymbol;
              }
            ),
            /***/
            "e893": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var has = __webpack_require__("5135");
                var ownKeys2 = __webpack_require__("56ef");
                var getOwnPropertyDescriptorModule = __webpack_require__("06cf");
                var definePropertyModule = __webpack_require__("9bf2");
                module3.exports = function(target, source) {
                  var keys = ownKeys2(source);
                  var defineProperty = definePropertyModule.f;
                  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
                  for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
                  }
                };
              }
            ),
            /***/
            "e8b5": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var classof = __webpack_require__("c6b6");
                module3.exports = Array.isArray || function isArray(arg) {
                  return classof(arg) == "Array";
                };
              }
            ),
            /***/
            "e95a": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var wellKnownSymbol = __webpack_require__("b622");
                var Iterators = __webpack_require__("3f8c");
                var ITERATOR = wellKnownSymbol("iterator");
                var ArrayPrototype = Array.prototype;
                module3.exports = function(it) {
                  return it !== void 0 && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
                };
              }
            ),
            /***/
            "f5df": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var TO_STRING_TAG_SUPPORT = __webpack_require__("00ee");
                var classofRaw = __webpack_require__("c6b6");
                var wellKnownSymbol = __webpack_require__("b622");
                var TO_STRING_TAG = wellKnownSymbol("toStringTag");
                var CORRECT_ARGUMENTS = classofRaw(/* @__PURE__ */ function() {
                  return arguments;
                }()) == "Arguments";
                var tryGet = function(it, key) {
                  try {
                    return it[key];
                  } catch (error) {
                  }
                };
                module3.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function(it) {
                  var O, tag, result;
                  return it === void 0 ? "Undefined" : it === null ? "Null" : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == "string" ? tag : CORRECT_ARGUMENTS ? classofRaw(O) : (result = classofRaw(O)) == "Object" && typeof O.callee == "function" ? "Arguments" : result;
                };
              }
            ),
            /***/
            "f772": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var shared = __webpack_require__("5692");
                var uid = __webpack_require__("90e3");
                var keys = shared("keys");
                module3.exports = function(key) {
                  return keys[key] || (keys[key] = uid(key));
                };
              }
            ),
            /***/
            "fb15": (
              /***/
              function(module3, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                if (typeof window !== "undefined") {
                  var currentScript = window.document.currentScript;
                  {
                    var getCurrentScript = __webpack_require__("8875");
                    currentScript = getCurrentScript();
                    if (!("currentScript" in document)) {
                      Object.defineProperty(document, "currentScript", { get: getCurrentScript });
                    }
                  }
                  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
                  if (src) {
                    __webpack_require__.p = src[1];
                  }
                }
                __webpack_require__("99af");
                __webpack_require__("4de4");
                __webpack_require__("4160");
                __webpack_require__("c975");
                __webpack_require__("d81d");
                __webpack_require__("a434");
                __webpack_require__("159b");
                __webpack_require__("a4d3");
                __webpack_require__("e439");
                __webpack_require__("dbb4");
                __webpack_require__("b64b");
                function _defineProperty2(obj, key, value) {
                  if (key in obj) {
                    Object.defineProperty(obj, key, {
                      value,
                      enumerable: true,
                      configurable: true,
                      writable: true
                    });
                  } else {
                    obj[key] = value;
                  }
                  return obj;
                }
                function ownKeys2(object, enumerableOnly) {
                  var keys = Object.keys(object);
                  if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly) symbols = symbols.filter(function(sym) {
                      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                    });
                    keys.push.apply(keys, symbols);
                  }
                  return keys;
                }
                function _objectSpread22(target) {
                  for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                      ownKeys2(Object(source), true).forEach(function(key) {
                        _defineProperty2(target, key, source[key]);
                      });
                    } else if (Object.getOwnPropertyDescriptors) {
                      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
                    } else {
                      ownKeys2(Object(source)).forEach(function(key) {
                        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
                      });
                    }
                  }
                  return target;
                }
                function _arrayWithHoles(arr) {
                  if (Array.isArray(arr)) return arr;
                }
                __webpack_require__("e01a");
                __webpack_require__("d28b");
                __webpack_require__("e260");
                __webpack_require__("d3b7");
                __webpack_require__("3ca3");
                __webpack_require__("ddb0");
                function _iterableToArrayLimit(arr, i) {
                  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
                  var _arr = [];
                  var _n = true;
                  var _d = false;
                  var _e = void 0;
                  try {
                    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                      _arr.push(_s.value);
                      if (i && _arr.length === i) break;
                    }
                  } catch (err) {
                    _d = true;
                    _e = err;
                  } finally {
                    try {
                      if (!_n && _i["return"] != null) _i["return"]();
                    } finally {
                      if (_d) throw _e;
                    }
                  }
                  return _arr;
                }
                __webpack_require__("a630");
                __webpack_require__("fb6a");
                __webpack_require__("b0c0");
                __webpack_require__("25f0");
                function _arrayLikeToArray2(arr, len) {
                  if (len == null || len > arr.length) len = arr.length;
                  for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                  }
                  return arr2;
                }
                function _unsupportedIterableToArray2(o, minLen) {
                  if (!o) return;
                  if (typeof o === "string") return _arrayLikeToArray2(o, minLen);
                  var n = Object.prototype.toString.call(o).slice(8, -1);
                  if (n === "Object" && o.constructor) n = o.constructor.name;
                  if (n === "Map" || n === "Set") return Array.from(o);
                  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray2(o, minLen);
                }
                function _nonIterableRest() {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }
                function _slicedToArray(arr, i) {
                  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray2(arr, i) || _nonIterableRest();
                }
                function _arrayWithoutHoles2(arr) {
                  if (Array.isArray(arr)) return _arrayLikeToArray2(arr);
                }
                function _iterableToArray2(iter) {
                  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
                }
                function _nonIterableSpread2() {
                  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }
                function _toConsumableArray2(arr) {
                  return _arrayWithoutHoles2(arr) || _iterableToArray2(arr) || _unsupportedIterableToArray2(arr) || _nonIterableSpread2();
                }
                var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_ = __webpack_require__("a352");
                var external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default = /* @__PURE__ */ __webpack_require__.n(external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_);
                function removeNode(node) {
                  if (node.parentElement !== null) {
                    node.parentElement.removeChild(node);
                  }
                }
                function insertNodeAt(fatherNode, node, position) {
                  var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
                  fatherNode.insertBefore(node, refNode);
                }
                var console2 = __webpack_require__("dbf1");
                __webpack_require__("13d5");
                __webpack_require__("4fad");
                __webpack_require__("ac1f");
                __webpack_require__("5319");
                function cached(fn) {
                  var cache = /* @__PURE__ */ Object.create(null);
                  return function cachedFn(str) {
                    var hit = cache[str];
                    return hit || (cache[str] = fn(str));
                  };
                }
                var regex = /-(\w)/g;
                var camelize = cached(function(str) {
                  return str.replace(regex, function(_, c) {
                    return c.toUpperCase();
                  });
                });
                __webpack_require__("5db7");
                __webpack_require__("73d9");
                var manageAndEmit = ["Start", "Add", "Remove", "Update", "End"];
                var emit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
                var manage = ["Move"];
                var eventHandlerNames = [manage, manageAndEmit, emit].flatMap(function(events2) {
                  return events2;
                }).map(function(evt) {
                  return "on".concat(evt);
                });
                var events = {
                  manage,
                  manageAndEmit,
                  emit
                };
                function isReadOnly(eventName) {
                  return eventHandlerNames.indexOf(eventName) !== -1;
                }
                __webpack_require__("caad");
                __webpack_require__("2ca0");
                var tags = ["a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "math", "menu", "menuitem", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr"];
                function isHtmlTag(name) {
                  return tags.includes(name);
                }
                function isTransition(name) {
                  return ["transition-group", "TransitionGroup"].includes(name);
                }
                function isHtmlAttribute(value) {
                  return ["id", "class", "role", "style"].includes(value) || value.startsWith("data-") || value.startsWith("aria-") || value.startsWith("on");
                }
                function project(entries) {
                  return entries.reduce(function(res, _ref) {
                    var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
                    res[key] = value;
                    return res;
                  }, {});
                }
                function getComponentAttributes(_ref3) {
                  var $attrs = _ref3.$attrs, _ref3$componentData = _ref3.componentData, componentData = _ref3$componentData === void 0 ? {} : _ref3$componentData;
                  var attributes = project(Object.entries($attrs).filter(function(_ref4) {
                    var _ref5 = _slicedToArray(_ref4, 2), key = _ref5[0];
                    _ref5[1];
                    return isHtmlAttribute(key);
                  }));
                  return _objectSpread22(_objectSpread22({}, attributes), componentData);
                }
                function createSortableOption(_ref6) {
                  var $attrs = _ref6.$attrs, callBackBuilder = _ref6.callBackBuilder;
                  var options = project(getValidSortableEntries($attrs));
                  Object.entries(callBackBuilder).forEach(function(_ref7) {
                    var _ref8 = _slicedToArray(_ref7, 2), eventType = _ref8[0], eventBuilder = _ref8[1];
                    events[eventType].forEach(function(event) {
                      options["on".concat(event)] = eventBuilder(event);
                    });
                  });
                  var draggable2 = "[data-draggable]".concat(options.draggable || "");
                  return _objectSpread22(_objectSpread22({}, options), {}, {
                    draggable: draggable2
                  });
                }
                function getValidSortableEntries(value) {
                  return Object.entries(value).filter(function(_ref9) {
                    var _ref10 = _slicedToArray(_ref9, 2), key = _ref10[0];
                    _ref10[1];
                    return !isHtmlAttribute(key);
                  }).map(function(_ref11) {
                    var _ref12 = _slicedToArray(_ref11, 2), key = _ref12[0], value2 = _ref12[1];
                    return [camelize(key), value2];
                  }).filter(function(_ref13) {
                    var _ref14 = _slicedToArray(_ref13, 2), key = _ref14[0];
                    _ref14[1];
                    return !isReadOnly(key);
                  });
                }
                __webpack_require__("c740");
                function _classCallCheck(instance, Constructor) {
                  if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                  }
                }
                function _defineProperties(target, props2) {
                  for (var i = 0; i < props2.length; i++) {
                    var descriptor = props2[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                  }
                }
                function _createClass(Constructor, protoProps, staticProps) {
                  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                  return Constructor;
                }
                var getHtmlElementFromNode = function getHtmlElementFromNode2(_ref) {
                  var el = _ref.el;
                  return el;
                };
                var addContext = function addContext2(domElement, context) {
                  return domElement.__draggable_context = context;
                };
                var getContext = function getContext2(domElement) {
                  return domElement.__draggable_context;
                };
                var componentStructure_ComponentStructure = /* @__PURE__ */ function() {
                  function ComponentStructure(_ref2) {
                    var _ref2$nodes = _ref2.nodes, header = _ref2$nodes.header, defaultNodes = _ref2$nodes.default, footer = _ref2$nodes.footer, root2 = _ref2.root, realList = _ref2.realList;
                    _classCallCheck(this, ComponentStructure);
                    this.defaultNodes = defaultNodes;
                    this.children = [].concat(_toConsumableArray2(header), _toConsumableArray2(defaultNodes), _toConsumableArray2(footer));
                    this.externalComponent = root2.externalComponent;
                    this.rootTransition = root2.transition;
                    this.tag = root2.tag;
                    this.realList = realList;
                  }
                  _createClass(ComponentStructure, [{
                    key: "render",
                    value: function render(h, attributes) {
                      var tag = this.tag, children = this.children, _isRootComponent = this._isRootComponent;
                      var option = !_isRootComponent ? children : {
                        default: function _default() {
                          return children;
                        }
                      };
                      return h(tag, attributes, option);
                    }
                  }, {
                    key: "updated",
                    value: function updated() {
                      var defaultNodes = this.defaultNodes, realList = this.realList;
                      defaultNodes.forEach(function(node, index2) {
                        addContext(getHtmlElementFromNode(node), {
                          element: realList[index2],
                          index: index2
                        });
                      });
                    }
                  }, {
                    key: "getUnderlyingVm",
                    value: function getUnderlyingVm(domElement) {
                      return getContext(domElement);
                    }
                  }, {
                    key: "getVmIndexFromDomIndex",
                    value: function getVmIndexFromDomIndex(domIndex, element) {
                      var defaultNodes = this.defaultNodes;
                      var length = defaultNodes.length;
                      var domChildren = element.children;
                      var domElement = domChildren.item(domIndex);
                      if (domElement === null) {
                        return length;
                      }
                      var context = getContext(domElement);
                      if (context) {
                        return context.index;
                      }
                      if (length === 0) {
                        return 0;
                      }
                      var firstDomListElement = getHtmlElementFromNode(defaultNodes[0]);
                      var indexFirstDomListElement = _toConsumableArray2(domChildren).findIndex(function(element2) {
                        return element2 === firstDomListElement;
                      });
                      return domIndex < indexFirstDomListElement ? 0 : length;
                    }
                  }, {
                    key: "_isRootComponent",
                    get: function get() {
                      return this.externalComponent || this.rootTransition;
                    }
                  }]);
                  return ComponentStructure;
                }();
                var external_commonjs_vue_commonjs2_vue_root_Vue_ = __webpack_require__("8bbf");
                function getSlot(slots, key) {
                  var slotValue = slots[key];
                  return slotValue ? slotValue() : [];
                }
                function computeNodes(_ref) {
                  var $slots = _ref.$slots, realList = _ref.realList, getKey = _ref.getKey;
                  var normalizedList = realList || [];
                  var _map = ["header", "footer"].map(function(name) {
                    return getSlot($slots, name);
                  }), _map2 = _slicedToArray(_map, 2), header = _map2[0], footer = _map2[1];
                  var item = $slots.item;
                  if (!item) {
                    throw new Error("draggable element must have an item slot");
                  }
                  var defaultNodes = normalizedList.flatMap(function(element, index2) {
                    return item({
                      element,
                      index: index2
                    }).map(function(node) {
                      node.key = getKey(element);
                      node.props = _objectSpread22(_objectSpread22({}, node.props || {}), {}, {
                        "data-draggable": true
                      });
                      return node;
                    });
                  });
                  if (defaultNodes.length !== normalizedList.length) {
                    throw new Error("Item slot must have only one child");
                  }
                  return {
                    header,
                    footer,
                    default: defaultNodes
                  };
                }
                function getRootInformation(tag) {
                  var transition = isTransition(tag);
                  var externalComponent = !isHtmlTag(tag) && !transition;
                  return {
                    transition,
                    externalComponent,
                    tag: externalComponent ? Object(external_commonjs_vue_commonjs2_vue_root_Vue_["resolveComponent"])(tag) : transition ? external_commonjs_vue_commonjs2_vue_root_Vue_["TransitionGroup"] : tag
                  };
                }
                function computeComponentStructure(_ref2) {
                  var $slots = _ref2.$slots, tag = _ref2.tag, realList = _ref2.realList, getKey = _ref2.getKey;
                  var nodes = computeNodes({
                    $slots,
                    realList,
                    getKey
                  });
                  var root2 = getRootInformation(tag);
                  return new componentStructure_ComponentStructure({
                    nodes,
                    root: root2,
                    realList
                  });
                }
                function _emit(evtName, evtData) {
                  var _this = this;
                  Object(external_commonjs_vue_commonjs2_vue_root_Vue_["nextTick"])(function() {
                    return _this.$emit(evtName.toLowerCase(), evtData);
                  });
                }
                function _manage(evtName) {
                  var _this2 = this;
                  return function(evtData, originalElement) {
                    if (_this2.realList !== null) {
                      return _this2["onDrag".concat(evtName)](evtData, originalElement);
                    }
                  };
                }
                function _manageAndEmit(evtName) {
                  var _this3 = this;
                  var delegateCallBack = _manage.call(this, evtName);
                  return function(evtData, originalElement) {
                    delegateCallBack.call(_this3, evtData, originalElement);
                    _emit.call(_this3, evtName, evtData);
                  };
                }
                var draggingElement = null;
                var props = {
                  list: {
                    type: Array,
                    required: false,
                    default: null
                  },
                  modelValue: {
                    type: Array,
                    required: false,
                    default: null
                  },
                  itemKey: {
                    type: [String, Function],
                    required: true
                  },
                  clone: {
                    type: Function,
                    default: function _default(original) {
                      return original;
                    }
                  },
                  tag: {
                    type: String,
                    default: "div"
                  },
                  move: {
                    type: Function,
                    default: null
                  },
                  componentData: {
                    type: Object,
                    required: false,
                    default: null
                  }
                };
                var emits = ["update:modelValue", "change"].concat(_toConsumableArray2([].concat(_toConsumableArray2(events.manageAndEmit), _toConsumableArray2(events.emit)).map(function(evt) {
                  return evt.toLowerCase();
                })));
                var draggableComponent = Object(external_commonjs_vue_commonjs2_vue_root_Vue_["defineComponent"])({
                  name: "draggable",
                  inheritAttrs: false,
                  props,
                  emits,
                  data: function data() {
                    return {
                      error: false
                    };
                  },
                  render: function render() {
                    try {
                      this.error = false;
                      var $slots = this.$slots, $attrs = this.$attrs, tag = this.tag, componentData = this.componentData, realList = this.realList, getKey = this.getKey;
                      var componentStructure = computeComponentStructure({
                        $slots,
                        tag,
                        realList,
                        getKey
                      });
                      this.componentStructure = componentStructure;
                      var attributes = getComponentAttributes({
                        $attrs,
                        componentData
                      });
                      return componentStructure.render(external_commonjs_vue_commonjs2_vue_root_Vue_["h"], attributes);
                    } catch (err) {
                      this.error = true;
                      return Object(external_commonjs_vue_commonjs2_vue_root_Vue_["h"])("pre", {
                        style: {
                          color: "red"
                        }
                      }, err.stack);
                    }
                  },
                  created: function created() {
                    if (this.list !== null && this.modelValue !== null) {
                      console2[
                        "a"
                        /* console */
                      ].error("modelValue and list props are mutually exclusive! Please set one or another.");
                    }
                  },
                  mounted: function mounted() {
                    var _this4 = this;
                    if (this.error) {
                      return;
                    }
                    var $attrs = this.$attrs, $el = this.$el, componentStructure = this.componentStructure;
                    componentStructure.updated();
                    var sortableOptions = createSortableOption({
                      $attrs,
                      callBackBuilder: {
                        manageAndEmit: function manageAndEmit2(event) {
                          return _manageAndEmit.call(_this4, event);
                        },
                        emit: function emit2(event) {
                          return _emit.bind(_this4, event);
                        },
                        manage: function manage2(event) {
                          return _manage.call(_this4, event);
                        }
                      }
                    });
                    var targetDomElement = $el.nodeType === 1 ? $el : $el.parentElement;
                    this._sortable = new external_commonjs_sortablejs_commonjs2_sortablejs_amd_sortablejs_root_Sortable_default.a(targetDomElement, sortableOptions);
                    this.targetDomElement = targetDomElement;
                    targetDomElement.__draggable_component__ = this;
                  },
                  updated: function updated() {
                    this.componentStructure.updated();
                  },
                  beforeUnmount: function beforeUnmount() {
                    if (this._sortable !== void 0) this._sortable.destroy();
                  },
                  computed: {
                    realList: function realList() {
                      var list = this.list;
                      return list ? list : this.modelValue;
                    },
                    getKey: function getKey() {
                      var itemKey = this.itemKey;
                      if (typeof itemKey === "function") {
                        return itemKey;
                      }
                      return function(element) {
                        return element[itemKey];
                      };
                    }
                  },
                  watch: {
                    $attrs: {
                      handler: function handler(newOptionValue) {
                        var _sortable = this._sortable;
                        if (!_sortable) return;
                        getValidSortableEntries(newOptionValue).forEach(function(_ref) {
                          var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
                          _sortable.option(key, value);
                        });
                      },
                      deep: true
                    }
                  },
                  methods: {
                    getUnderlyingVm: function getUnderlyingVm(domElement) {
                      return this.componentStructure.getUnderlyingVm(domElement) || null;
                    },
                    getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(htmElement) {
                      return htmElement.__draggable_component__;
                    },
                    emitChanges: function emitChanges2(evt) {
                      var _this5 = this;
                      Object(external_commonjs_vue_commonjs2_vue_root_Vue_["nextTick"])(function() {
                        return _this5.$emit("change", evt);
                      });
                    },
                    alterList: function alterList(onList) {
                      if (this.list) {
                        onList(this.list);
                        return;
                      }
                      var newList = _toConsumableArray2(this.modelValue);
                      onList(newList);
                      this.$emit("update:modelValue", newList);
                    },
                    spliceList: function spliceList() {
                      var _arguments = arguments;
                      var spliceList2 = function spliceList3(list) {
                        return list.splice.apply(list, _toConsumableArray2(_arguments));
                      };
                      this.alterList(spliceList2);
                    },
                    updatePosition: function updatePosition(oldIndex2, newIndex2) {
                      var updatePosition2 = function updatePosition3(list) {
                        return list.splice(newIndex2, 0, list.splice(oldIndex2, 1)[0]);
                      };
                      this.alterList(updatePosition2);
                    },
                    getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(_ref3) {
                      var to = _ref3.to, related = _ref3.related;
                      var component = this.getUnderlyingPotencialDraggableComponent(to);
                      if (!component) {
                        return {
                          component
                        };
                      }
                      var list = component.realList;
                      var context = {
                        list,
                        component
                      };
                      if (to !== related && list) {
                        var destination = component.getUnderlyingVm(related) || {};
                        return _objectSpread22(_objectSpread22({}, destination), context);
                      }
                      return context;
                    },
                    getVmIndexFromDomIndex: function getVmIndexFromDomIndex(domIndex) {
                      return this.componentStructure.getVmIndexFromDomIndex(domIndex, this.targetDomElement);
                    },
                    onDragStart: function onDragStart(evt) {
                      this.context = this.getUnderlyingVm(evt.item);
                      evt.item._underlying_vm_ = this.clone(this.context.element);
                      draggingElement = evt.item;
                    },
                    onDragAdd: function onDragAdd(evt) {
                      var element = evt.item._underlying_vm_;
                      if (element === void 0) {
                        return;
                      }
                      removeNode(evt.item);
                      var newIndex2 = this.getVmIndexFromDomIndex(evt.newIndex);
                      this.spliceList(newIndex2, 0, element);
                      var added = {
                        element,
                        newIndex: newIndex2
                      };
                      this.emitChanges({
                        added
                      });
                    },
                    onDragRemove: function onDragRemove(evt) {
                      insertNodeAt(this.$el, evt.item, evt.oldIndex);
                      if (evt.pullMode === "clone") {
                        removeNode(evt.clone);
                        return;
                      }
                      var _this$context = this.context, oldIndex2 = _this$context.index, element = _this$context.element;
                      this.spliceList(oldIndex2, 1);
                      var removed = {
                        element,
                        oldIndex: oldIndex2
                      };
                      this.emitChanges({
                        removed
                      });
                    },
                    onDragUpdate: function onDragUpdate(evt) {
                      removeNode(evt.item);
                      insertNodeAt(evt.from, evt.item, evt.oldIndex);
                      var oldIndex2 = this.context.index;
                      var newIndex2 = this.getVmIndexFromDomIndex(evt.newIndex);
                      this.updatePosition(oldIndex2, newIndex2);
                      var moved2 = {
                        element: this.context.element,
                        oldIndex: oldIndex2,
                        newIndex: newIndex2
                      };
                      this.emitChanges({
                        moved: moved2
                      });
                    },
                    computeFutureIndex: function computeFutureIndex(relatedContext, evt) {
                      if (!relatedContext.element) {
                        return 0;
                      }
                      var domChildren = _toConsumableArray2(evt.to.children).filter(function(el) {
                        return el.style["display"] !== "none";
                      });
                      var currentDomIndex = domChildren.indexOf(evt.related);
                      var currentIndex = relatedContext.component.getVmIndexFromDomIndex(currentDomIndex);
                      var draggedInList = domChildren.indexOf(draggingElement) !== -1;
                      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
                    },
                    onDragMove: function onDragMove(evt, originalEvent) {
                      var move = this.move, realList = this.realList;
                      if (!move || !realList) {
                        return true;
                      }
                      var relatedContext = this.getRelatedContextFromMoveEvent(evt);
                      var futureIndex = this.computeFutureIndex(relatedContext, evt);
                      var draggedContext = _objectSpread22(_objectSpread22({}, this.context), {}, {
                        futureIndex
                      });
                      var sendEvent = _objectSpread22(_objectSpread22({}, evt), {}, {
                        relatedContext,
                        draggedContext
                      });
                      return move(sendEvent, originalEvent);
                    },
                    onDragEnd: function onDragEnd() {
                      draggingElement = null;
                    }
                  }
                });
                var vuedraggable = draggableComponent;
                __webpack_exports__["default"] = vuedraggable;
              }
            ),
            /***/
            "fb6a": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var $ = __webpack_require__("23e7");
                var isObject2 = __webpack_require__("861d");
                var isArray = __webpack_require__("e8b5");
                var toAbsoluteIndex = __webpack_require__("23cb");
                var toLength = __webpack_require__("50c4");
                var toIndexedObject = __webpack_require__("fc6a");
                var createProperty = __webpack_require__("8418");
                var wellKnownSymbol = __webpack_require__("b622");
                var arrayMethodHasSpeciesSupport = __webpack_require__("1dde");
                var arrayMethodUsesToLength = __webpack_require__("ae40");
                var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport("slice");
                var USES_TO_LENGTH = arrayMethodUsesToLength("slice", { ACCESSORS: true, 0: 0, 1: 2 });
                var SPECIES = wellKnownSymbol("species");
                var nativeSlice = [].slice;
                var max = Math.max;
                $({ target: "Array", proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
                  slice: function slice(start, end) {
                    var O = toIndexedObject(this);
                    var length = toLength(O.length);
                    var k = toAbsoluteIndex(start, length);
                    var fin = toAbsoluteIndex(end === void 0 ? length : end, length);
                    var Constructor, result, n;
                    if (isArray(O)) {
                      Constructor = O.constructor;
                      if (typeof Constructor == "function" && (Constructor === Array || isArray(Constructor.prototype))) {
                        Constructor = void 0;
                      } else if (isObject2(Constructor)) {
                        Constructor = Constructor[SPECIES];
                        if (Constructor === null) Constructor = void 0;
                      }
                      if (Constructor === Array || Constructor === void 0) {
                        return nativeSlice.call(O, k, fin);
                      }
                    }
                    result = new (Constructor === void 0 ? Array : Constructor)(max(fin - k, 0));
                    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
                    result.length = n;
                    return result;
                  }
                });
              }
            ),
            /***/
            "fc6a": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var IndexedObject = __webpack_require__("44ad");
                var requireObjectCoercible = __webpack_require__("1d80");
                module3.exports = function(it) {
                  return IndexedObject(requireObjectCoercible(it));
                };
              }
            ),
            /***/
            "fdbc": (
              /***/
              function(module3, exports3) {
                module3.exports = {
                  CSSRuleList: 0,
                  CSSStyleDeclaration: 0,
                  CSSValueList: 0,
                  ClientRectList: 0,
                  DOMRectList: 0,
                  DOMStringList: 0,
                  DOMTokenList: 1,
                  DataTransferItemList: 0,
                  FileList: 0,
                  HTMLAllCollection: 0,
                  HTMLCollection: 0,
                  HTMLFormElement: 0,
                  HTMLSelectElement: 0,
                  MediaList: 0,
                  MimeTypeArray: 0,
                  NamedNodeMap: 0,
                  NodeList: 1,
                  PaintRequestList: 0,
                  Plugin: 0,
                  PluginArray: 0,
                  SVGLengthList: 0,
                  SVGNumberList: 0,
                  SVGPathSegList: 0,
                  SVGPointList: 0,
                  SVGStringList: 0,
                  SVGTransformList: 0,
                  SourceBufferList: 0,
                  StyleSheetList: 0,
                  TextTrackCueList: 0,
                  TextTrackList: 0,
                  TouchList: 0
                };
              }
            ),
            /***/
            "fdbf": (
              /***/
              function(module3, exports3, __webpack_require__) {
                var NATIVE_SYMBOL = __webpack_require__("4930");
                module3.exports = NATIVE_SYMBOL && !Symbol.sham && typeof Symbol.iterator == "symbol";
              }
            )
            /******/
          })["default"]
        );
      });
    })(vuedraggable_umd$1);
    return vuedraggable_umd$1.exports;
  }
  var vuedraggable_umdExports = requireVuedraggable_umd();
  const draggable = /* @__PURE__ */ getDefaultExportFromCjs(vuedraggable_umdExports);
  const _hoisted_1$c = {
    key: 0,
    class: "block-content"
  };
  const _hoisted_2$a = {
    key: 0,
    class: "loading-state"
  };
  const _sfc_main$d = /* @__PURE__ */ require$$0.defineComponent({
    __name: "BlockItem",
    props: {
      item: {},
      isExpanded: { type: Boolean },
      loading: { type: Boolean },
      fields: {},
      disabled: { type: Boolean },
      compactMode: { type: Boolean },
      usageData: {}
    },
    emits: ["toggle-expand", "update-item"],
    setup(__props) {
      const props = __props;
      const itemData = require$$0.computed(() => props.item.item || props.item);
      return (_ctx, _cache) => {
        const _component_v_progress_circular = require$$0.resolveComponent("v-progress-circular");
        const _component_v_notice = require$$0.resolveComponent("v-notice");
        const _component_v_form = require$$0.resolveComponent("v-form");
        return require$$0.openBlock(), require$$0.createElementBlock("div", {
          class: require$$0.normalizeClass(["block-item", {
            expanded: _ctx.isExpanded,
            compact: _ctx.compactMode,
            disabled: _ctx.disabled
          }])
        }, [
          require$$0.createElementVNode("div", {
            class: "block-header",
            onClick: _cache[0] || (_cache[0] = ($event) => !_ctx.disabled && _ctx.$emit("toggle-expand"))
          }, [
            require$$0.renderSlot(_ctx.$slots, "header", {}, void 0, true)
          ]),
          require$$0.createVNode(require$$0.Transition, { name: "expand" }, {
            default: require$$0.withCtx(() => [
              _ctx.isExpanded ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1$c, [
                _ctx.loading ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_2$a, [
                  require$$0.createVNode(_component_v_progress_circular, { indeterminate: "" })
                ])) : (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key: 1 }, [
                  _ctx.usageData && _ctx.usageData.usageCount > 0 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_notice, {
                    key: 0,
                    type: "warning",
                    icon: "warning",
                    class: "usage-warning"
                  }, {
                    default: require$$0.withCtx(() => [
                      require$$0.createElementVNode("div", null, [
                        _ctx.usageData.externalCount > 0 && _ctx.usageData.internalCount > 0 ? (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key: 0 }, [
                          require$$0.createTextVNode(" Used in " + require$$0.toDisplayString(_ctx.usageData.externalCount) + " other " + require$$0.toDisplayString(_ctx.usageData.externalCount === 1 ? "place" : "places") + " and " + require$$0.toDisplayString(_ctx.usageData.internalCount) + " more " + require$$0.toDisplayString(_ctx.usageData.internalCount === 1 ? "time" : "times") + " in this page ", 1)
                        ], 64)) : _ctx.usageData.externalCount > 0 ? (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key: 1 }, [
                          require$$0.createTextVNode(" Used in " + require$$0.toDisplayString(_ctx.usageData.externalCount) + " other " + require$$0.toDisplayString(_ctx.usageData.externalCount === 1 ? "place" : "places"), 1)
                        ], 64)) : (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key: 2 }, [
                          require$$0.createTextVNode(" Used " + require$$0.toDisplayString(_ctx.usageData.internalCount) + " more " + require$$0.toDisplayString(_ctx.usageData.internalCount === 1 ? "time" : "times") + " in this page ", 1)
                        ], 64)),
                        _cache[2] || (_cache[2] = require$$0.createTextVNode(" - changes will affect all references "))
                      ])
                    ]),
                    _: 1
                  })) : require$$0.createCommentVNode("", true),
                  require$$0.createVNode(_component_v_form, {
                    "initial-values": itemData.value,
                    fields: _ctx.fields,
                    "model-value": itemData.value,
                    "primary-key": itemData.value.id,
                    disabled: _ctx.disabled,
                    badge: null,
                    autofocus: false,
                    "show-validation-errors": false,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update-item", $event))
                  }, null, 8, ["initial-values", "fields", "model-value", "primary-key", "disabled"])
                ], 64)),
                require$$0.renderSlot(_ctx.$slots, "nested-blocks", {}, void 0, true)
              ])) : require$$0.createCommentVNode("", true)
            ]),
            _: 3
          })
        ], 2);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const BlockItem = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-833a9ad9"]]);
  const _hoisted_1$b = { class: "icon-wrapper" };
  const _hoisted_2$9 = {
    key: 0,
    class: "new-indicator"
  };
  const _hoisted_3$6 = {
    key: 1,
    class: "dirty-indicator"
  };
  const _hoisted_4$5 = { class: "block-info" };
  const _hoisted_5$5 = { class: "block-main" };
  const _hoisted_6$5 = { class: "block-title" };
  const _hoisted_7$5 = {
    key: 0,
    class: "item-id"
  };
  const _hoisted_8$5 = { class: "block-actions" };
  const _hoisted_9$5 = { class: "expand-icon-container" };
  const _sfc_main$c = /* @__PURE__ */ require$$0.defineComponent({
    __name: "BlockHeader",
    props: {
      sortable: { type: Boolean },
      disabled: { type: Boolean },
      collectionIcon: {},
      isNew: { type: Boolean },
      isDirty: { type: Boolean },
      title: {},
      collectionName: {},
      showItemId: { type: Boolean },
      itemId: {},
      isExpanded: { type: Boolean },
      usageCount: {},
      usageData: {}
    },
    emits: ["toggle-expand"],
    setup(__props) {
      const props = __props;
      const usageTooltip = require$$0.computed(() => {
        if (!props.usageData) {
          return `This item is used in ${props.usageCount} ${props.usageCount === 1 ? "place" : "places"}`;
        }
        const { externalCount, internalCount } = props.usageData;
        if (externalCount > 0 && internalCount > 0) {
          return `Used in ${externalCount} other ${externalCount === 1 ? "place" : "places"} and ${internalCount} more ${internalCount === 1 ? "time" : "times"} in this page`;
        } else if (externalCount > 0) {
          return `Used in ${externalCount} other ${externalCount === 1 ? "place" : "places"}`;
        } else {
          return `Used ${internalCount} more ${internalCount === 1 ? "time" : "times"} in this page`;
        }
      });
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _directive_tooltip = require$$0.resolveDirective("tooltip");
        return require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, null, [
          _ctx.sortable && !_ctx.disabled ? (require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
            key: 0,
            name: "drag_indicator",
            class: "drag-handle",
            onClick: _cache[0] || (_cache[0] = require$$0.withModifiers(() => {
            }, ["stop"]))
          })) : require$$0.createCommentVNode("", true),
          require$$0.createElementVNode("div", _hoisted_1$b, [
            require$$0.createVNode(_component_v_icon, {
              name: _ctx.collectionIcon || "box",
              class: "collection-icon"
            }, null, 8, ["name"]),
            _ctx.isNew ? require$$0.withDirectives((require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_2$9, null, 512)), [
              [_directive_tooltip, "New block"]
            ]) : _ctx.isDirty ? require$$0.withDirectives((require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_3$6, null, 512)), [
              [_directive_tooltip, "Unsaved changes"]
            ]) : require$$0.createCommentVNode("", true)
          ]),
          require$$0.createElementVNode("div", _hoisted_4$5, [
            require$$0.createElementVNode("div", _hoisted_5$5, [
              require$$0.createElementVNode("span", _hoisted_6$5, require$$0.toDisplayString(_ctx.title), 1),
              require$$0.createVNode(_component_v_chip, {
                "x-small": "",
                outline: "",
                class: "collection-chip"
              }, {
                default: require$$0.withCtx(() => [
                  require$$0.createTextVNode(require$$0.toDisplayString(_ctx.collectionName), 1)
                ]),
                _: 1
              }),
              _ctx.showItemId && !_ctx.isNew ? (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_7$5, " ID: " + require$$0.toDisplayString(_ctx.itemId), 1)) : require$$0.createCommentVNode("", true),
              _ctx.usageCount && _ctx.usageCount > 0 ? require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
                key: 1,
                "x-small": "",
                class: "usage-indicator"
              }, {
                default: require$$0.withCtx(() => [
                  require$$0.createVNode(_component_v_icon, {
                    name: "link",
                    "x-small": ""
                  }),
                  require$$0.createTextVNode(" " + require$$0.toDisplayString(_ctx.usageCount), 1)
                ]),
                _: 1
              })), [
                [_directive_tooltip, usageTooltip.value]
              ]) : require$$0.createCommentVNode("", true)
            ]),
            require$$0.renderSlot(_ctx.$slots, "status", {}, void 0, true)
          ]),
          require$$0.createElementVNode("div", _hoisted_8$5, [
            require$$0.createElementVNode("div", _hoisted_9$5, [
              _ctx.isExpanded ? (require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
                key: 0,
                name: "unfold_less",
                class: "expand-indicator",
                onClick: _cache[1] || (_cache[1] = require$$0.withModifiers(($event) => _ctx.$emit("toggle-expand"), ["stop"]))
              })) : require$$0.createCommentVNode("", true)
            ]),
            require$$0.renderSlot(_ctx.$slots, "actions", {}, void 0, true)
          ])
        ], 64);
      };
    }
  });
  const BlockHeader = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-e8967dea"]]);
  const _hoisted_1$a = ["onClick"];
  const _hoisted_2$8 = { class: "status-text" };
  const _sfc_main$b = /* @__PURE__ */ require$$0.defineComponent({
    __name: "BlockStatus",
    props: {
      hasStatus: { type: Boolean },
      compactMode: { type: Boolean },
      currentStatus: {},
      statusLabel: {},
      statuses: {}
    },
    emits: ["update-status"],
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_v_list_item_icon = require$$0.resolveComponent("v-list-item-icon");
        const _component_v_list_item_content = require$$0.resolveComponent("v-list-item-content");
        const _component_v_list_item = require$$0.resolveComponent("v-list-item");
        const _component_v_list = require$$0.resolveComponent("v-list");
        const _component_v_menu = require$$0.resolveComponent("v-menu");
        return _ctx.hasStatus && !_ctx.compactMode ? (require$$0.openBlock(), require$$0.createBlock(_component_v_menu, {
          key: 0,
          placement: "bottom",
          "show-arrow": ""
        }, {
          activator: require$$0.withCtx(({ toggle }) => [
            require$$0.createElementVNode("div", {
              class: "status-display",
              onClick: require$$0.withModifiers(toggle, ["stop"])
            }, [
              require$$0.createElementVNode("span", {
                class: require$$0.normalizeClass(["status-dot", `status-${_ctx.currentStatus}`])
              }, null, 2),
              require$$0.createElementVNode("span", _hoisted_2$8, require$$0.toDisplayString(_ctx.statusLabel), 1)
            ], 8, _hoisted_1$a)
          ]),
          default: require$$0.withCtx(() => [
            require$$0.createVNode(_component_v_list, null, {
              default: require$$0.withCtx(() => [
                (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.statuses, (status) => {
                  return require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                    key: status.value,
                    active: _ctx.currentStatus === status.value,
                    clickable: "",
                    onClick: ($event) => _ctx.$emit("update-status", status.value)
                  }, {
                    default: require$$0.withCtx(() => [
                      require$$0.createVNode(_component_v_list_item_icon, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createElementVNode("span", {
                            class: require$$0.normalizeClass(["status-dot", `status-${status.value}`])
                          }, null, 2)
                        ]),
                        _: 2
                      }, 1024),
                      require$$0.createVNode(_component_v_list_item_content, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createTextVNode(require$$0.toDisplayString(status.label), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1032, ["active", "onClick"]);
                }), 128))
              ]),
              _: 1
            })
          ]),
          _: 1
        })) : require$$0.createCommentVNode("", true);
      };
    }
  });
  const _sfc_main$a = /* @__PURE__ */ require$$0.defineComponent({
    __name: "BlockActions",
    props: {
      allowDuplicate: { type: Boolean },
      allowDelete: { type: Boolean },
      isDirty: { type: Boolean }
    },
    emits: ["duplicate", "discard-changes", "unlink", "delete"],
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_button = require$$0.resolveComponent("v-button");
        const _component_v_list_item_icon = require$$0.resolveComponent("v-list-item-icon");
        const _component_v_list_item_content = require$$0.resolveComponent("v-list-item-content");
        const _component_v_list_item = require$$0.resolveComponent("v-list-item");
        const _component_v_divider = require$$0.resolveComponent("v-divider");
        const _component_v_list = require$$0.resolveComponent("v-list");
        const _component_v_menu = require$$0.resolveComponent("v-menu");
        const _directive_tooltip = require$$0.resolveDirective("tooltip");
        return require$$0.openBlock(), require$$0.createBlock(_component_v_menu, {
          placement: "bottom-end",
          "show-arrow": ""
        }, {
          activator: require$$0.withCtx(({ toggle }) => [
            require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
              "x-small": "",
              icon: "",
              secondary: "",
              onClick: require$$0.withModifiers(toggle, ["stop"])
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, { name: "more_vert" })
              ]),
              _: 2
            }, 1032, ["onClick"])), [
              [_directive_tooltip, "More options"]
            ])
          ]),
          default: require$$0.withCtx(() => [
            require$$0.createVNode(_component_v_list, null, {
              default: require$$0.withCtx(() => [
                _ctx.allowDuplicate ? (require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                  key: 0,
                  clickable: "",
                  onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("duplicate"))
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_list_item_icon, null, {
                      default: require$$0.withCtx(() => [
                        require$$0.createVNode(_component_v_icon, { name: "content_copy" })
                      ]),
                      _: 1
                    }),
                    require$$0.createVNode(_component_v_list_item_content, null, {
                      default: require$$0.withCtx(() => _cache[4] || (_cache[4] = [
                        require$$0.createTextVNode("Duplicate")
                      ])),
                      _: 1,
                      __: [4]
                    })
                  ]),
                  _: 1
                })) : require$$0.createCommentVNode("", true),
                require$$0.createVNode(_component_v_list_item, {
                  clickable: "",
                  disabled: !_ctx.isDirty,
                  onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("discard-changes"))
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_list_item_icon, null, {
                      default: require$$0.withCtx(() => [
                        require$$0.createVNode(_component_v_icon, { name: "undo" })
                      ]),
                      _: 1
                    }),
                    require$$0.createVNode(_component_v_list_item_content, null, {
                      default: require$$0.withCtx(() => _cache[5] || (_cache[5] = [
                        require$$0.createTextVNode("Discard Changes")
                      ])),
                      _: 1,
                      __: [5]
                    })
                  ]),
                  _: 1
                }, 8, ["disabled"]),
                require$$0.createVNode(_component_v_list_item, {
                  clickable: "",
                  onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("unlink"))
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_list_item_icon, null, {
                      default: require$$0.withCtx(() => [
                        require$$0.createVNode(_component_v_icon, { name: "link_off" })
                      ]),
                      _: 1
                    }),
                    require$$0.createVNode(_component_v_list_item_content, null, {
                      default: require$$0.withCtx(() => _cache[6] || (_cache[6] = [
                        require$$0.createTextVNode("Unlink")
                      ])),
                      _: 1,
                      __: [6]
                    })
                  ]),
                  _: 1
                }),
                _ctx.allowDelete ? (require$$0.openBlock(), require$$0.createBlock(_component_v_divider, { key: 1 })) : require$$0.createCommentVNode("", true),
                _ctx.allowDelete ? (require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                  key: 2,
                  clickable: "",
                  class: "danger",
                  onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("delete"))
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_list_item_icon, null, {
                      default: require$$0.withCtx(() => [
                        require$$0.createVNode(_component_v_icon, { name: "delete" })
                      ]),
                      _: 1
                    }),
                    require$$0.createVNode(_component_v_list_item_content, null, {
                      default: require$$0.withCtx(() => _cache[7] || (_cache[7] = [
                        require$$0.createTextVNode("Delete")
                      ])),
                      _: 1,
                      __: [7]
                    })
                  ]),
                  _: 1
                })) : require$$0.createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  });
  const _hoisted_1$9 = {
    key: 0,
    class: "nested-blocks"
  };
  const _hoisted_2$7 = { class: "nested-header" };
  const _hoisted_3$5 = { class: "nested-title" };
  const _hoisted_4$4 = { class: "nested-items" };
  const _hoisted_5$4 = { class: "nested-block-header" };
  const _hoisted_6$4 = { class: "block-label" };
  const _hoisted_7$4 = { class: "block-collection" };
  const _hoisted_8$4 = {
    key: 0,
    class: "nested-block-content"
  };
  const _hoisted_9$4 = { class: "field-value" };
  const _sfc_main$9 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "NestedBlocks",
    props: {
      blocks: {},
      title: {},
      depth: { default: 0 }
    },
    setup(__props) {
      const props = __props;
      const expandedNested = require$$0.ref([]);
      function getBlockKey(block, index2) {
        return `${block.id || index2}_${props.depth}`;
      }
      function toggleNested(key) {
        const index2 = expandedNested.value.indexOf(key);
        if (index2 > -1) {
          expandedNested.value.splice(index2, 1);
        } else {
          expandedNested.value.push(key);
        }
      }
      function getBlockIcon(block) {
        const icons = {
          content_headline: "title",
          content_text: "text_fields",
          content_image: "image",
          content_wysiwig: "edit_note",
          content_button: "smart_button"
        };
        return icons[block.collection] || "widgets";
      }
      function getBlockLabel(block) {
        if (!block.item) return `Block #${block.id}`;
        const title = extractItemTitle(block);
        return title !== "Untitled Block" ? title : `${block.collection} #${block.id}`;
      }
      function getBlockFields(block) {
        if (!block.item || typeof block.item !== "object") return [];
        return Object.keys(block.item).filter((key) => !["id", "status", "sort", "user_created", "date_created", "user_updated", "date_updated"].includes(key)).filter((key) => !isM2AField(block.item[key])).map((key) => ({ field: key, name: formatFieldName(key) }));
      }
      function getFieldValue(block, field) {
        const value = block.item?.[field];
        if (value === null || value === void 0) return "-";
        if (typeof value === "object") return JSON.stringify(value);
        return value;
      }
      function isM2AField(value) {
        return Array.isArray(value) && value.length > 0 && value[0]?.collection && value[0]?.item;
      }
      function formatFieldName(name) {
        return name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      }
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _component_nested_blocks = require$$0.resolveComponent("nested-blocks", true);
        const _component_v_button = require$$0.resolveComponent("v-button");
        return _ctx.blocks && _ctx.blocks.length > 0 ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1$9, [
          require$$0.createElementVNode("div", _hoisted_2$7, [
            require$$0.createVNode(_component_v_icon, {
              name: "subdirectory_arrow_right",
              small: ""
            }),
            require$$0.createElementVNode("span", _hoisted_3$5, require$$0.toDisplayString(_ctx.title), 1),
            require$$0.createVNode(_component_v_chip, { "x-small": "" }, {
              default: require$$0.withCtx(() => [
                require$$0.createTextVNode(require$$0.toDisplayString(_ctx.blocks.length), 1)
              ]),
              _: 1
            })
          ]),
          require$$0.createElementVNode("div", _hoisted_4$4, [
            (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.blocks, (block, index2) => {
              return require$$0.openBlock(), require$$0.createElementBlock("div", {
                key: getBlockKey(block, index2),
                class: "nested-block-item"
              }, [
                require$$0.createElementVNode("div", _hoisted_5$4, [
                  require$$0.createVNode(_component_v_icon, {
                    name: getBlockIcon(block),
                    small: ""
                  }, null, 8, ["name"]),
                  require$$0.createElementVNode("span", _hoisted_6$4, require$$0.toDisplayString(getBlockLabel(block)), 1),
                  require$$0.createElementVNode("span", _hoisted_7$4, require$$0.toDisplayString(block.collection), 1)
                ]),
                expandedNested.value.includes(getBlockKey(block, index2)) ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_8$4, [
                  (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(getBlockFields(block), (field) => {
                    return require$$0.openBlock(), require$$0.createElementBlock("div", {
                      key: field.field,
                      class: "nested-field"
                    }, [
                      require$$0.createElementVNode("label", null, require$$0.toDisplayString(field.name || field.field), 1),
                      require$$0.createElementVNode("div", _hoisted_9$4, require$$0.toDisplayString(getFieldValue(block, field.field)), 1)
                    ]);
                  }), 128)),
                  (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(block.item, (value, key) => {
                    return require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key }, [
                      isM2AField(value) ? (require$$0.openBlock(), require$$0.createBlock(_component_nested_blocks, {
                        key: 0,
                        blocks: value,
                        title: formatFieldName(String(key)),
                        depth: _ctx.depth + 1
                      }, null, 8, ["blocks", "title", "depth"])) : require$$0.createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ])) : require$$0.createCommentVNode("", true),
                require$$0.createVNode(_component_v_button, {
                  "x-small": "",
                  text: "",
                  onClick: ($event) => toggleNested(getBlockKey(block, index2))
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createTextVNode(require$$0.toDisplayString(expandedNested.value.includes(getBlockKey(block, index2)) ? "Collapse" : "Expand"), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"])
              ]);
            }), 128))
          ])
        ])) : require$$0.createCommentVNode("", true);
      };
    }
  });
  const NestedBlocks = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-f6af34f2"]]);
  const _hoisted_1$8 = { class: "block-list" };
  const _hoisted_2$6 = {
    key: 1,
    class: "empty-state"
  };
  const _sfc_main$8 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "BlockList",
    props: {
      modelValue: {},
      expandedItems: {},
      loading: {},
      sortable: { type: Boolean },
      disabled: { type: Boolean },
      compactMode: { type: Boolean },
      showItemId: { type: Boolean },
      allowDuplicate: { type: Boolean },
      allowDelete: { type: Boolean },
      availableStatuses: {},
      expandableBlocks: {}
    },
    emits: ["update:modelValue", "toggle-expand", "update-item", "update-status", "duplicate", "discard-changes", "unlink", "delete", "sort"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const itemsModel = require$$0.computed({
        get: () => props.modelValue,
        set: (val) => emit("update:modelValue", val)
      });
      const emit = __emit;
      const getItemId = (item) => props.expandableBlocks.getItemId(item);
      const getActualItemId2 = (item) => props.expandableBlocks.getActualItemId(item);
      const isNewItem = (item) => props.expandableBlocks.isNewItem(item);
      const isBlockDirty = (itemId, itemData) => props.expandableBlocks.isBlockDirty(itemId, itemData);
      const getItemTitle = (item) => props.expandableBlocks.getItemTitle(item);
      const getCollectionName = (item) => props.expandableBlocks.getCollectionName(item);
      const getCollectionIcon = (item) => props.expandableBlocks.getCollectionIcon(item);
      const getFieldsForItem = (item) => props.expandableBlocks.getFieldsForItem(item);
      const hasStatusField = (item) => props.expandableBlocks.hasStatusField(item);
      const getItemStatus = (item) => props.expandableBlocks.getItemStatus(item);
      const getStatusLabel = (status) => props.expandableBlocks.getStatusLabel(status);
      const hasNestedM2A = (item) => props.expandableBlocks.hasNestedM2A(item);
      const getM2AFields = (item) => props.expandableBlocks.getM2AFields(item);
      const formatFieldName = (fieldName) => props.expandableBlocks.formatFieldName(fieldName);
      const getBlockUsageData = (item) => props.expandableBlocks.getBlockUsageData(item);
      return (_ctx, _cache) => {
        return require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1$8, [
          _ctx.modelValue && _ctx.modelValue.length > 0 ? (require$$0.openBlock(), require$$0.createBlock(require$$0.unref(draggable), {
            key: 0,
            modelValue: itemsModel.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => itemsModel.value = $event),
            disabled: !_ctx.sortable || _ctx.disabled,
            "item-key": "id",
            handle: ".drag-handle",
            animation: 200,
            onEnd: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("sort"))
          }, {
            item: require$$0.withCtx(({ element: item, index: index2 }) => [
              require$$0.createVNode(BlockItem, {
                item,
                "is-expanded": _ctx.expandedItems.includes(getItemId(item)),
                loading: _ctx.loading[getItemId(item)] || false,
                fields: getFieldsForItem(item),
                disabled: _ctx.disabled,
                "compact-mode": _ctx.compactMode,
                "usage-data": getBlockUsageData(item),
                onToggleExpand: ($event) => _ctx.$emit("toggle-expand", getItemId(item)),
                onUpdateItem: ($event) => _ctx.$emit("update-item", index2, $event)
              }, {
                header: require$$0.withCtx(() => [
                  require$$0.createVNode(BlockHeader, {
                    sortable: _ctx.sortable,
                    disabled: _ctx.disabled,
                    "collection-icon": getCollectionIcon(item),
                    "is-new": isNewItem(item),
                    "is-dirty": isBlockDirty(getItemId(item), item.item),
                    title: getItemTitle(item),
                    "collection-name": getCollectionName(item),
                    "show-item-id": _ctx.showItemId,
                    "item-id": getActualItemId2(item),
                    "is-expanded": _ctx.expandedItems.includes(getItemId(item)),
                    "usage-count": getBlockUsageData(item)?.usageCount || 0,
                    "usage-data": getBlockUsageData(item),
                    onToggleExpand: ($event) => _ctx.$emit("toggle-expand", getItemId(item))
                  }, {
                    status: require$$0.withCtx(() => [
                      hasStatusField(item) ? (require$$0.openBlock(), require$$0.createBlock(_sfc_main$b, {
                        key: 0,
                        "has-status": true,
                        "compact-mode": _ctx.compactMode,
                        "current-status": getItemStatus(item),
                        "status-label": getStatusLabel(getItemStatus(item)),
                        statuses: _ctx.availableStatuses,
                        onUpdateStatus: ($event) => _ctx.$emit("update-status", item, index2, $event)
                      }, null, 8, ["compact-mode", "current-status", "status-label", "statuses", "onUpdateStatus"])) : require$$0.createCommentVNode("", true)
                    ]),
                    actions: require$$0.withCtx(() => [
                      require$$0.createVNode(_sfc_main$a, {
                        "allow-duplicate": _ctx.allowDuplicate,
                        "allow-delete": _ctx.allowDelete,
                        "is-dirty": isBlockDirty(getItemId(item), item.item),
                        onDuplicate: ($event) => _ctx.$emit("duplicate", item, index2),
                        onDiscardChanges: ($event) => _ctx.$emit("discard-changes", item, index2),
                        onUnlink: ($event) => _ctx.$emit("unlink", item, index2),
                        onDelete: ($event) => _ctx.$emit("delete", item, index2)
                      }, null, 8, ["allow-duplicate", "allow-delete", "is-dirty", "onDuplicate", "onDiscardChanges", "onUnlink", "onDelete"])
                    ]),
                    _: 2
                  }, 1032, ["sortable", "disabled", "collection-icon", "is-new", "is-dirty", "title", "collection-name", "show-item-id", "item-id", "is-expanded", "usage-count", "usage-data", "onToggleExpand"])
                ]),
                "nested-blocks": require$$0.withCtx(() => [
                  hasNestedM2A(item) ? (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, { key: 0 }, require$$0.renderList(getM2AFields(item), (fieldValue, fieldName) => {
                    return require$$0.openBlock(), require$$0.createElementBlock("div", { key: fieldName }, [
                      fieldValue && fieldValue.length > 0 ? (require$$0.openBlock(), require$$0.createBlock(NestedBlocks, {
                        key: 0,
                        blocks: fieldValue,
                        title: formatFieldName(fieldName)
                      }, null, 8, ["blocks", "title"])) : require$$0.createCommentVNode("", true)
                    ]);
                  }), 128)) : require$$0.createCommentVNode("", true)
                ]),
                _: 2
              }, 1032, ["item", "is-expanded", "loading", "fields", "disabled", "compact-mode", "usage-data", "onToggleExpand", "onUpdateItem"])
            ]),
            _: 1
          }, 8, ["modelValue", "disabled"])) : !_ctx.disabled ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_2$6, _cache[2] || (_cache[2] = [
            require$$0.createElementVNode("p", null, "No blocks yet", -1)
          ]))) : require$$0.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _hoisted_1$7 = { class: "add-block-wrapper" };
  const _hoisted_2$5 = {
    key: 0,
    class: "button-group"
  };
  const _hoisted_3$4 = {
    key: 1,
    class: "max-blocks-message"
  };
  const _sfc_main$7 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "AddBlockButton",
    props: {
      disabled: { type: Boolean },
      collections: {},
      canAdd: { type: Boolean }
    },
    emits: ["add-item", "add-existing"],
    setup(__props) {
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_button = require$$0.resolveComponent("v-button");
        const _component_v_list_item_icon = require$$0.resolveComponent("v-list-item-icon");
        const _component_v_list_item_content = require$$0.resolveComponent("v-list-item-content");
        const _component_v_list_item = require$$0.resolveComponent("v-list-item");
        const _component_v_list = require$$0.resolveComponent("v-list");
        const _component_v_menu = require$$0.resolveComponent("v-menu");
        return require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1$7, [
          _ctx.canAdd && !_ctx.disabled ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_2$5, [
            _ctx.collections.length === 1 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
              key: 0,
              class: "add-block-button",
              disabled: _ctx.disabled,
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("add-item", _ctx.collections[0].collection))
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, { name: "add" }),
                _cache[1] || (_cache[1] = require$$0.createTextVNode(" Create New "))
              ]),
              _: 1,
              __: [1]
            }, 8, ["disabled"])) : _ctx.collections.length > 1 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_menu, {
              key: 1,
              placement: "bottom",
              "show-arrow": ""
            }, {
              activator: require$$0.withCtx(({ toggle }) => [
                require$$0.createVNode(_component_v_button, {
                  class: "add-block-button with-dropdown",
                  disabled: _ctx.disabled,
                  onClick: toggle
                }, {
                  default: require$$0.withCtx(() => [
                    _cache[2] || (_cache[2] = require$$0.createElementVNode("span", null, "Create New", -1)),
                    require$$0.createVNode(_component_v_icon, { name: "arrow_drop_down" })
                  ]),
                  _: 2,
                  __: [2]
                }, 1032, ["disabled", "onClick"])
              ]),
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_list, null, {
                  default: require$$0.withCtx(() => [
                    (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.collections, (collection) => {
                      return require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                        key: collection.collection,
                        clickable: "",
                        onClick: ($event) => _ctx.$emit("add-item", collection.collection)
                      }, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_list_item_icon, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createVNode(_component_v_icon, {
                                name: collection.icon || "box"
                              }, null, 8, ["name"])
                            ]),
                            _: 2
                          }, 1024),
                          require$$0.createVNode(_component_v_list_item_content, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createTextVNode(require$$0.toDisplayString(collection.name || collection.collection), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : require$$0.createCommentVNode("", true),
            require$$0.createVNode(_component_v_menu, {
              placement: "bottom",
              "show-arrow": ""
            }, {
              activator: require$$0.withCtx(({ toggle }) => [
                require$$0.createVNode(_component_v_button, {
                  class: "add-block-button add-existing-button with-dropdown",
                  disabled: _ctx.disabled,
                  onClick: toggle
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_icon, { name: "link" }),
                    _cache[3] || (_cache[3] = require$$0.createElementVNode("span", null, "Add Existing", -1)),
                    require$$0.createVNode(_component_v_icon, { name: "arrow_drop_down" })
                  ]),
                  _: 2,
                  __: [3]
                }, 1032, ["disabled", "onClick"])
              ]),
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_list, null, {
                  default: require$$0.withCtx(() => [
                    (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.collections, (collection) => {
                      return require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                        key: collection.collection,
                        clickable: "",
                        onClick: ($event) => _ctx.$emit("add-existing", collection.collection)
                      }, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_list_item_icon, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createVNode(_component_v_icon, {
                                name: collection.icon || "box"
                              }, null, 8, ["name"])
                            ]),
                            _: 2
                          }, 1024),
                          require$$0.createVNode(_component_v_list_item_content, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createTextVNode(require$$0.toDisplayString(collection.name || collection.collection), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ])) : !_ctx.canAdd && !_ctx.disabled ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_3$4, [
            require$$0.createVNode(_component_v_icon, {
              name: "info",
              "x-small": ""
            }),
            _cache[4] || (_cache[4] = require$$0.createElementVNode("span", null, "Maximum blocks reached", -1))
          ])) : require$$0.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _hoisted_1$6 = { class: "tag-field" };
  const _hoisted_2$4 = { class: "tag-operator" };
  const _hoisted_3$3 = {
    key: 0,
    class: "tag-value-edit"
  };
  const _hoisted_4$3 = ["onKeyup", "onBlur"];
  const _hoisted_5$3 = {
    key: 1,
    class: "tag-value"
  };
  const _hoisted_6$3 = { key: 1 };
  const _hoisted_7$3 = ["placeholder"];
  const _hoisted_8$3 = { class: "input-icons" };
  const _hoisted_9$3 = { class: "search-icon-wrapper" };
  const _hoisted_10$3 = {
    key: 2,
    class: "result-count-badge"
  };
  const _hoisted_11$3 = {
    key: 0,
    class: "autocomplete-dropdown"
  };
  const _hoisted_12$3 = ["onClick"];
  const _hoisted_13$2 = { class: "suggestion-field" };
  const _hoisted_14$1 = { class: "suggestion-hint" };
  const _sfc_main$6 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "SearchTagInput",
    props: {
      modelValue: {},
      placeholder: { default: "Search items..." },
      loading: { type: Boolean, default: false },
      showHelp: { type: Boolean, default: false },
      availableFields: { default: () => [] },
      totalItems: {}
    },
    emits: ["update:modelValue", "toggle-help", "focus", "blur", "tag-added", "tag-removed"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const logger2 = createScopedLogger("SearchTagInput");
      const props = __props;
      const emit = __emit;
      const inputRef = require$$0.ref();
      const currentInput = require$$0.ref("");
      const searchTags = require$$0.ref([]);
      const showAutocomplete = require$$0.ref(false);
      const selectedSuggestionIndex = require$$0.ref(-1);
      const editingValueIndex = require$$0.ref(null);
      const editValue = require$$0.ref("");
      const editValueInputs = require$$0.ref([]);
      const focusedTagIndex = require$$0.ref(null);
      const operators = {
        "=%": { display: " contains ", filter: "_contains" },
        "!~": { display: " not contains ", filter: "_ncontains" },
        "=": { display: " = ", filter: "_eq" },
        "~": { display: " ~ ", filter: "_contains" },
        "!=": { display: " ≠ ", filter: "_neq" },
        ">": { display: " > ", filter: "_gt" },
        "<": { display: " < ", filter: "_lt" },
        ">=": { display: " ≥ ", filter: "_gte" },
        "<=": { display: " ≤ ", filter: "_lte" },
        "^": { display: " starts with ", filter: "_starts_with" },
        "$": { display: " ends with ", filter: "_ends_with" },
        "empty": { display: " is empty ", filter: "_empty" },
        "!empty": { display: " not empty ", filter: "_nempty" },
        "null": { display: " is null ", filter: "_null" },
        "!null": { display: " not null ", filter: "_nnull" }
      };
      const sortedOperators = Object.keys(operators).sort((a, b) => b.length - a.length);
      const suggestions = require$$0.computed(() => {
        if (!currentInput.value || currentInput.value.includes("=") || currentInput.value.includes("~")) {
          return [];
        }
        const input = currentInput.value.toLowerCase();
        return props.availableFields.filter((field) => field.field.toLowerCase().includes(input)).map((field) => ({
          field: field.field,
          type: field.type || "text"
        })).slice(0, 5);
      });
      const searchQuery = require$$0.computed(() => {
        const parts = [];
        searchTags.value.forEach((tag) => {
          if (tag.type === "search") {
            parts.push(tag.raw);
          } else if (tag.type === "logical") {
            parts.push(tag.logicalOp || "");
          }
        });
        if (currentInput.value) {
          parts.push(currentInput.value);
        }
        return parts.join(" ");
      });
      const showHint = require$$0.computed(() => {
        return searchTags.value.length === 0 && currentInput.value.includes("~");
      });
      function getPlaceholder() {
        if (searchTags.value.length === 0) {
          if (defaultLogicalOp.value) {
            return `Next items will be combined with ${defaultLogicalOp.value}`;
          }
          if (showHint.value) {
            return "Press Enter to create tag";
          }
          return props.placeholder;
        }
        return "";
      }
      require$$0.watch(() => props.modelValue, (newValue) => {
        if (newValue !== searchQuery.value) {
          parseExistingQuery(newValue);
        }
      });
      function focusInput() {
        inputRef.value?.focus();
      }
      function handleContainerClick(event) {
        if (editingValueIndex.value !== null) {
          return;
        }
        focusInput();
      }
      function handleKeydown(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          if (focusedTagIndex.value !== null) {
            startEditValue(focusedTagIndex.value);
          } else if (selectedSuggestionIndex.value >= 0) {
            selectSuggestion(suggestions.value[selectedSuggestionIndex.value]);
          } else {
            parseAndAddTag();
          }
        } else if (event.key === "Backspace" && !currentInput.value && searchTags.value.length > 0) {
          if (focusedTagIndex.value !== null) {
            removeTag(focusedTagIndex.value);
          } else {
            removeTag(searchTags.value.length - 1);
          }
        } else if (event.key === "Delete" && focusedTagIndex.value !== null) {
          removeTag(focusedTagIndex.value);
        } else if (event.key === "Tab") {
          if (searchTags.value.length > 0) {
            event.preventDefault();
            if (event.shiftKey) {
              if (focusedTagIndex.value === null || focusedTagIndex.value === 0) {
                focusedTagIndex.value = searchTags.value.length - 1;
              } else {
                focusedTagIndex.value--;
              }
            } else {
              if (focusedTagIndex.value === null || focusedTagIndex.value === searchTags.value.length - 1) {
                focusedTagIndex.value = 0;
              } else {
                focusedTagIndex.value++;
              }
            }
          }
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          selectedSuggestionIndex.value = Math.min(selectedSuggestionIndex.value + 1, suggestions.value.length - 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          selectedSuggestionIndex.value = Math.max(selectedSuggestionIndex.value - 1, -1);
        } else if (event.key === "Escape") {
          showAutocomplete.value = false;
          selectedSuggestionIndex.value = -1;
          focusedTagIndex.value = null;
        }
      }
      function handleInput() {
        showAutocomplete.value = true;
        selectedSuggestionIndex.value = -1;
        updateModelValue();
      }
      function selectSuggestion(suggestion) {
        currentInput.value = suggestion.field + "=";
        showAutocomplete.value = false;
        selectedSuggestionIndex.value = -1;
        inputRef.value?.focus();
      }
      function parseAndAddTag() {
        const input = currentInput.value.trim();
        if (!input) return;
        if (input === "AND" || input === "OR") {
          addLogicalOperator(input);
          currentInput.value = "";
          return;
        }
        if (defaultLogicalOp.value && searchTags.value.length > 0) {
          const lastTag = searchTags.value[searchTags.value.length - 1];
          if (lastTag.type !== "logical") {
            const logicalTag = {
              type: "logical",
              logicalOp: defaultLogicalOp.value,
              raw: defaultLogicalOp.value
            };
            searchTags.value.push(logicalTag);
          }
        }
        for (const op of sortedOperators) {
          const config = operators[op];
          const regex = new RegExp(`^([^${op}]+)${op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(.+)$`);
          const match = input.match(regex);
          if (match) {
            const [, field, value] = match;
            const tag2 = {
              type: "search",
              field: field.trim(),
              operator: op,
              operatorDisplay: config.display,
              value: value.trim(),
              raw: input
            };
            searchTags.value.push(tag2);
            emit("tag-added", tag2);
            currentInput.value = "";
            updateModelValue();
            return;
          }
        }
        const tag = {
          type: "search",
          field: "",
          operator: "",
          operatorDisplay: "",
          value: input,
          raw: input
        };
        searchTags.value.push(tag);
        emit("tag-added", tag);
        currentInput.value = "";
        updateModelValue();
      }
      function removeTag(index2) {
        const removed = searchTags.value.splice(index2, 1)[0];
        emit("tag-removed", removed, index2);
        if (focusedTagIndex.value !== null) {
          if (focusedTagIndex.value === index2) {
            focusedTagIndex.value = null;
          } else if (focusedTagIndex.value > index2) {
            focusedTagIndex.value--;
          }
        }
        updateModelValue();
      }
      function clearAll() {
        searchTags.value = [];
        currentInput.value = "";
        defaultLogicalOp.value = null;
        updateModelValue();
      }
      function startEditValue(index2) {
        const tag = searchTags.value[index2];
        if (tag.type === "search") {
          editValue.value = tag.value || "";
          editingValueIndex.value = index2;
          require$$0.nextTick(() => {
            const input = editValueInputs.value[index2];
            if (input) {
              input.focus();
              input.select();
            }
          });
        }
      }
      function saveEditValue(index2) {
        const tag = searchTags.value[index2];
        if (tag.type === "search") {
          tag.value = editValue.value;
          tag.raw = `${tag.field}${tag.operator}${editValue.value}`;
          editingValueIndex.value = null;
          updateModelValue();
        }
      }
      function cancelEditValue() {
        editingValueIndex.value = null;
        editValue.value = "";
      }
      function handleDragChange() {
        updateModelValue();
        focusedTagIndex.value = null;
      }
      function updateModelValue() {
        emit("update:modelValue", searchQuery.value);
      }
      function parseExistingQuery(query) {
        searchTags.value = [];
        if (!query) {
          currentInput.value = "";
          return;
        }
        const tokens = query.split(/\s+/);
        let pendingInput = "";
        for (const token of tokens) {
          if (token === "AND" || token === "OR") {
            if (pendingInput.trim()) {
              parseAndAddTag();
            }
            if (searchTags.value.length > 0) {
              const lastTag = searchTags.value[searchTags.value.length - 1];
              if (lastTag.type !== "logical") {
                searchTags.value.push({
                  type: "logical",
                  logicalOp: token,
                  raw: token
                });
              }
            }
            pendingInput = "";
          } else {
            pendingInput += (pendingInput ? " " : "") + token;
          }
        }
        currentInput.value = pendingInput;
      }
      function getFieldAtCursor() {
        if (!inputRef.value) return null;
        const cursorPos = inputRef.value.selectionStart || 0;
        const text = currentInput.value;
        let start = cursorPos;
        let end = cursorPos;
        while (start > 0 && /\w/.test(text[start - 1])) {
          start--;
        }
        while (end < text.length && /\w/.test(text[end])) {
          end++;
        }
        if (start < end) {
          let hasOperator = false;
          for (const op of sortedOperators) {
            if (text.substring(end, end + op.length) === op) {
              hasOperator = true;
              break;
            }
          }
          return {
            field: text.substring(start, end),
            start,
            end,
            hasOperator
          };
        }
        return null;
      }
      function getOperatorAfterPosition(position) {
        const text = currentInput.value;
        for (const op of sortedOperators) {
          if (text.substring(position, position + op.length) === op) {
            return {
              operator: op,
              start: position,
              end: position + op.length
            };
          }
        }
        return null;
      }
      function getOperatorBeforeCursor() {
        if (!inputRef.value) return null;
        const cursorPos = inputRef.value.selectionStart || 0;
        const text = currentInput.value;
        for (const op of sortedOperators) {
          const opLength = op.length;
          if (cursorPos >= opLength) {
            const possibleOp = text.substring(cursorPos - opLength, cursorPos);
            if (possibleOp === op) {
              return {
                operator: op,
                start: cursorPos - opLength,
                end: cursorPos
              };
            }
          }
        }
        return null;
      }
      function getFieldBeforeOperator(operatorStart) {
        const text = currentInput.value;
        let end = operatorStart;
        let start = end;
        while (start > 0 && /\s/.test(text[start - 1])) {
          start--;
        }
        end = start;
        while (start > 0 && /\w/.test(text[start - 1])) {
          start--;
        }
        if (start < end) {
          return {
            field: text.substring(start, end),
            start,
            end
          };
        }
        return null;
      }
      function handleTagClick(index2) {
        if (searchTags.value[index2].type === "search") {
          focusedTagIndex.value = focusedTagIndex.value === index2 ? null : index2;
        }
      }
      function replaceFieldInFocusedTag(newField) {
        if (focusedTagIndex.value !== null && searchTags.value[focusedTagIndex.value]) {
          const tag = searchTags.value[focusedTagIndex.value];
          if (tag.type === "search") {
            tag.field = newField;
            tag.raw = `${newField}${tag.operator}${tag.value}`;
          }
        }
      }
      function replaceOperatorInFocusedTag(newOperator) {
        if (focusedTagIndex.value !== null && searchTags.value[focusedTagIndex.value]) {
          const tag = searchTags.value[focusedTagIndex.value];
          if (tag.type === "search") {
            tag.operator = newOperator;
            tag.operatorDisplay = operators[newOperator]?.display || newOperator;
            tag.raw = `${tag.field}${newOperator}${tag.value}`;
          }
        }
      }
      function getOperatorAtCursor() {
        if (!inputRef.value) return null;
        const cursorPos = inputRef.value.selectionStart || 0;
        const text = currentInput.value;
        for (const op of sortedOperators) {
          const opLength = op.length;
          if (cursorPos >= opLength) {
            const possibleOp = text.substring(cursorPos - opLength, cursorPos);
            if (possibleOp === op) {
              return {
                operator: op,
                start: cursorPos - opLength,
                end: cursorPos
              };
            }
          }
          for (let i = 0; i < opLength; i++) {
            const start = cursorPos - i;
            if (start >= 0 && start + opLength <= text.length) {
              const possibleOp = text.substring(start, start + opLength);
              if (possibleOp === op) {
                return {
                  operator: op,
                  start,
                  end: start + opLength
                };
              }
            }
          }
        }
        return null;
      }
      function addFieldToSearch(field) {
        if (focusedTagIndex.value !== null) {
          replaceFieldInFocusedTag(field);
          updateModelValue();
          return;
        }
        const operatorBeforeCursor = getOperatorBeforeCursor();
        if (operatorBeforeCursor) {
          const fieldBeforeOp = getFieldBeforeOperator(operatorBeforeCursor.start);
          if (fieldBeforeOp) {
            const before = currentInput.value.substring(0, fieldBeforeOp.start);
            const after = currentInput.value.substring(operatorBeforeCursor.end);
            currentInput.value = before + field + operatorBeforeCursor.operator + after;
            require$$0.nextTick(() => {
              if (inputRef.value) {
                const newPos = fieldBeforeOp.start + field.length + operatorBeforeCursor.operator.length;
                inputRef.value.setSelectionRange(newPos, newPos);
              }
            });
            focusInput();
            return;
          }
        }
        const fieldInfo = getFieldAtCursor();
        if (fieldInfo) {
          const before = currentInput.value.substring(0, fieldInfo.start);
          const after = currentInput.value.substring(fieldInfo.end);
          const needsOperator = !fieldInfo.hasOperator;
          currentInput.value = before + field + (needsOperator ? "=" : "") + after;
          require$$0.nextTick(() => {
            if (inputRef.value) {
              const newPos = fieldInfo.start + field.length + (needsOperator ? 1 : 0);
              inputRef.value.setSelectionRange(newPos, newPos);
            }
          });
        } else {
          if (inputRef.value) {
            const cursorPos = inputRef.value.selectionStart || currentInput.value.length;
            const before = currentInput.value.substring(0, cursorPos);
            const after = currentInput.value.substring(cursorPos);
            const prefix = before.length > 0 && !before.endsWith(" ") ? " " : "";
            currentInput.value = before + prefix + field + "=" + after;
            require$$0.nextTick(() => {
              if (inputRef.value) {
                const newPos = cursorPos + prefix.length + field.length + 1;
                inputRef.value.setSelectionRange(newPos, newPos);
              }
            });
          } else {
            currentInput.value = field + "=";
          }
        }
        focusInput();
      }
      const defaultLogicalOp = require$$0.ref(null);
      function addLogicalOperator(op) {
        logger2.debug("addLogicalOperator called", { op, currentTags: searchTags.value });
        if (searchTags.value.length === 0) {
          if (defaultLogicalOp.value === op) {
            defaultLogicalOp.value = null;
          } else {
            defaultLogicalOp.value = op;
          }
          logger2.debug("Set default logical operator", { defaultLogicalOp: defaultLogicalOp.value });
          currentInput.value = "";
          focusInput();
          updateModelValue();
          return;
        }
        const lastTag = searchTags.value[searchTags.value.length - 1];
        if (lastTag.type === "logical") {
          lastTag.logicalOp = op;
          lastTag.raw = op;
          updateModelValue();
          return;
        }
        const tag = {
          type: "logical",
          logicalOp: op,
          raw: op
        };
        logger2.debug("Adding logical tag", { tag });
        searchTags.value.push(tag);
        updateModelValue();
        focusInput();
      }
      function addOperatorToSearch(operator) {
        if (focusedTagIndex.value !== null) {
          replaceOperatorInFocusedTag(operator);
          updateModelValue();
          return;
        }
        const fieldInfo = getFieldAtCursor();
        if (fieldInfo) {
          const operatorAfterField = getOperatorAfterPosition(fieldInfo.end);
          if (operatorAfterField) {
            const before = currentInput.value.substring(0, operatorAfterField.start);
            const after = currentInput.value.substring(operatorAfterField.end);
            currentInput.value = before + operator + after;
            require$$0.nextTick(() => {
              if (inputRef.value) {
                const newPos = operatorAfterField.start + operator.length;
                inputRef.value.setSelectionRange(newPos, newPos);
              }
            });
          } else {
            const before = currentInput.value.substring(0, fieldInfo.end);
            const after = currentInput.value.substring(fieldInfo.end);
            currentInput.value = before + operator + after;
            require$$0.nextTick(() => {
              if (inputRef.value) {
                const newPos = fieldInfo.end + operator.length;
                inputRef.value.setSelectionRange(newPos, newPos);
              }
            });
          }
        } else {
          const operatorInfo = getOperatorAtCursor();
          if (operatorInfo) {
            const before = currentInput.value.substring(0, operatorInfo.start);
            const after = currentInput.value.substring(operatorInfo.end);
            currentInput.value = before + operator + after;
            require$$0.nextTick(() => {
              if (inputRef.value) {
                const newPos = operatorInfo.start + operator.length;
                inputRef.value.setSelectionRange(newPos, newPos);
              }
            });
          } else {
            if (inputRef.value) {
              const cursorPos = inputRef.value.selectionStart || currentInput.value.length;
              const before = currentInput.value.substring(0, cursorPos);
              const after = currentInput.value.substring(cursorPos);
              currentInput.value = before + operator + after;
              require$$0.nextTick(() => {
                if (inputRef.value) {
                  const newPos = cursorPos + operator.length;
                  inputRef.value.setSelectionRange(newPos, newPos);
                }
              });
            } else {
              currentInput.value += operator;
            }
          }
        }
        focusInput();
      }
      __expose({
        addFieldToSearch,
        addOperatorToSearch,
        addLogicalOperator,
        focusInput,
        defaultLogicalOp
      });
      return (_ctx, _cache) => {
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_progress_circular = require$$0.resolveComponent("v-progress-circular");
        const _directive_tooltip = require$$0.resolveDirective("tooltip");
        return require$$0.openBlock(), require$$0.createElementBlock("div", {
          class: "search-tag-input",
          onClick: _cache[8] || (_cache[8] = require$$0.withModifiers(($event) => focusedTagIndex.value = null, ["self"]))
        }, [
          require$$0.createElementVNode("div", {
            class: "tag-input-container",
            onClick: handleContainerClick
          }, [
            defaultLogicalOp.value && searchTags.value.length === 0 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
              key: 0,
              "x-small": "",
              label: "",
              class: require$$0.normalizeClass(["default-logical-op", defaultLogicalOp.value === "AND" ? "and-op" : "or-op"])
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createTextVNode(require$$0.toDisplayString(defaultLogicalOp.value), 1)
              ]),
              _: 1
            }, 8, ["class"])) : require$$0.createCommentVNode("", true),
            require$$0.createVNode(require$$0.unref(draggable), {
              modelValue: searchTags.value,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => searchTags.value = $event),
              "item-key": "raw",
              animation: 150,
              delay: 50,
              "delay-on-touch-only": true,
              handle: ".drag-handle",
              onChange: handleDragChange,
              class: "tags-draggable"
            }, {
              item: require$$0.withCtx(({ element: tag, index: index2 }) => [
                require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
                  "x-small": "",
                  label: "",
                  close: tag.type === "search",
                  class: require$$0.normalizeClass([
                    "search-tag",
                    tag.type === "logical" ? "logical-tag" : "",
                    focusedTagIndex.value === index2 ? "focused" : "",
                    "draggable-tag"
                  ]),
                  onClose: ($event) => removeTag(index2),
                  onClick: ($event) => handleTagClick(index2),
                  onDblclick: ($event) => tag.type === "search" && startEditValue(index2)
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_icon, {
                      name: "drag_indicator",
                      "x-small": "",
                      class: "drag-handle",
                      onClick: _cache[0] || (_cache[0] = require$$0.withModifiers(() => {
                      }, ["stop"]))
                    }),
                    tag.type === "search" ? (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key: 0 }, [
                      require$$0.createElementVNode("span", _hoisted_1$6, require$$0.toDisplayString(tag.field), 1),
                      require$$0.createElementVNode("span", _hoisted_2$4, require$$0.toDisplayString(tag.operatorDisplay), 1),
                      editingValueIndex.value === index2 ? (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_3$3, [
                        require$$0.withDirectives(require$$0.createElementVNode("input", {
                          ref: (el) => {
                            if (el) editValueInputs.value[index2] = el;
                          },
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => editValue.value = $event),
                          onKeyup: [
                            require$$0.withKeys(($event) => saveEditValue(index2), ["enter"]),
                            require$$0.withKeys(cancelEditValue, ["esc"])
                          ],
                          onBlur: ($event) => saveEditValue(index2),
                          onClick: _cache[2] || (_cache[2] = require$$0.withModifiers(() => {
                          }, ["stop"])),
                          class: "inline-edit-input"
                        }, null, 40, _hoisted_4$3), [
                          [require$$0.vModelText, editValue.value]
                        ])
                      ])) : (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_5$3, require$$0.toDisplayString(tag.value), 1))
                    ], 64)) : tag.type === "logical" ? (require$$0.openBlock(), require$$0.createElementBlock("strong", _hoisted_6$3, require$$0.toDisplayString(tag.logicalOp), 1)) : require$$0.createCommentVNode("", true)
                  ]),
                  _: 2
                }, 1032, ["close", "class", "onClose", "onClick", "onDblclick"])), [
                  [_directive_tooltip, tag.type === "search" ? "Click to focus • Double-click to edit value • Drag to reorder" : ""]
                ])
              ]),
              _: 1
            }, 8, ["modelValue"]),
            require$$0.withDirectives(require$$0.createElementVNode("input", {
              ref_key: "inputRef",
              ref: inputRef,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => currentInput.value = $event),
              type: "text",
              class: "tag-input",
              placeholder: getPlaceholder(),
              onKeydown: handleKeydown,
              onInput: handleInput,
              onFocus: _cache[5] || (_cache[5] = ($event) => emit("focus")),
              onBlur: _cache[6] || (_cache[6] = ($event) => emit("blur"))
            }, null, 40, _hoisted_7$3), [
              [require$$0.vModelText, currentInput.value]
            ]),
            require$$0.createElementVNode("div", _hoisted_8$3, [
              require$$0.createElementVNode("div", _hoisted_9$3, [
                _ctx.loading ? (require$$0.openBlock(), require$$0.createBlock(_component_v_progress_circular, {
                  key: 0,
                  indeterminate: "",
                  "x-small": ""
                })) : (require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
                  key: 1,
                  name: "search"
                })),
                _ctx.showHelp && _ctx.totalItems !== null && _ctx.totalItems !== void 0 && _ctx.totalItems > 0 ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_10$3, require$$0.toDisplayString(_ctx.totalItems > 999 ? "999+" : _ctx.totalItems), 1)) : require$$0.createCommentVNode("", true)
              ]),
              searchTags.value.length > 0 || currentInput.value ? (require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
                key: 0,
                name: "close",
                clickable: "",
                onClick: clearAll
              })) : require$$0.createCommentVNode("", true),
              require$$0.createVNode(_component_v_icon, {
                name: "help_outline",
                clickable: "",
                onClick: _cache[7] || (_cache[7] = ($event) => emit("toggle-help")),
                class: require$$0.normalizeClass({ "rotated": _ctx.showHelp })
              }, null, 8, ["class"])
            ])
          ]),
          require$$0.createVNode(require$$0.Transition, { name: "fade" }, {
            default: require$$0.withCtx(() => [
              showAutocomplete.value && suggestions.value.length > 0 ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_11$3, [
                (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(suggestions.value, (suggestion, index2) => {
                  return require$$0.openBlock(), require$$0.createElementBlock("div", {
                    key: index2,
                    class: require$$0.normalizeClass(["suggestion-item", { active: selectedSuggestionIndex.value === index2 }]),
                    onClick: ($event) => selectSuggestion(suggestion)
                  }, [
                    require$$0.createVNode(_component_v_icon, {
                      name: "text_fields",
                      "x-small": ""
                    }),
                    require$$0.createElementVNode("span", _hoisted_13$2, require$$0.toDisplayString(suggestion.field), 1),
                    require$$0.createElementVNode("span", _hoisted_14$1, require$$0.toDisplayString(suggestion.type), 1)
                  ], 10, _hoisted_12$3);
                }), 128))
              ])) : require$$0.createCommentVNode("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const SearchTagInput = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-7b903d50"]]);
  const _hoisted_1$5 = { class: "search-container" };
  const _hoisted_2$3 = {
    key: 0,
    class: "search-help-panel"
  };
  const _hoisted_3$2 = { class: "search-help-content" };
  const _hoisted_4$2 = {
    key: 0,
    class: "search-help-section"
  };
  const _hoisted_5$2 = { class: "field-chips" };
  const _hoisted_6$2 = { class: "field-type" };
  const _hoisted_7$2 = { class: "field-type" };
  const _hoisted_8$2 = { class: "search-help-section" };
  const _hoisted_9$2 = { class: "operators-grid" };
  const _hoisted_10$2 = ["onClick"];
  const _hoisted_11$2 = { class: "operator-info" };
  const _hoisted_12$2 = { class: "operator-name" };
  const _hoisted_13$1 = { class: "operator-example" };
  const _hoisted_14 = { class: "search-help-section" };
  const _hoisted_15 = { class: "logical-operators-grid" };
  const _hoisted_16 = { class: "logical-examples" };
  const _hoisted_17 = {
    key: 0,
    class: "info-note"
  };
  const _sfc_main$5 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "ItemSearchPanel",
    props: {
      searchQuery: {},
      loading: { type: Boolean, default: false },
      showHelp: { type: Boolean, default: false },
      availableFields: { default: () => [] },
      translationInfo: {},
      totalItems: {}
    },
    emits: ["update:search-query", "update:show-help", "search"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const nonTranslatableFields = require$$0.computed(() => {
        if (!props.translationInfo?.translationFields) {
          return props.availableFields;
        }
        const translatableFieldNames = props.translationInfo.translationFields.map((tf) => tf.field);
        return props.availableFields.filter((field) => !translatableFieldNames.includes(field.field));
      });
      const searchTagInputRef = require$$0.ref();
      const searchOperators = [
        { symbol: "=", name: "Exact match", example: "status=published" },
        { symbol: "~", name: "Contains", example: "title~product" },
        { symbol: "!~", name: "Not contains", example: "title!~draft" },
        { symbol: "!=", name: "Not equals", example: "status!=archived" },
        { symbol: ">", name: "Greater than", example: "sort>10" },
        { symbol: "<", name: "Less than", example: "price<100" },
        { symbol: ">=", name: "Greater or equal", example: "quantity>=5" },
        { symbol: "<=", name: "Less or equal", example: "stock<=20" },
        { symbol: "^", name: "Starts with", example: "name^John" },
        { symbol: "$", name: "Ends with", example: "email$@gmail.com" },
        { symbol: "=%", name: "Contains (alt)", example: "name=%john%" },
        { symbol: "empty", name: "Is empty", example: "description=empty" },
        { symbol: "!empty", name: "Not empty", example: "image!empty" },
        { symbol: "null", name: "Is null", example: "deleted_at=null" },
        { symbol: "!null", name: "Not null", example: "image!null" }
      ];
      function handleSearchUpdate(value) {
        emit("update:search-query", value);
        emit("search", value);
      }
      function addFieldToSearch(field) {
        searchTagInputRef.value?.addFieldToSearch(field);
      }
      function addOperatorToSearch(operator) {
        searchTagInputRef.value?.addOperatorToSearch(operator);
      }
      function addLogicalOperator(op) {
        if (searchTagInputRef.value) {
          searchTagInputRef.value.addLogicalOperator(op);
        }
      }
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _component_v_button = require$$0.resolveComponent("v-button");
        return require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1$5, [
          require$$0.createVNode(SearchTagInput, {
            ref_key: "searchTagInputRef",
            ref: searchTagInputRef,
            class: "search-input",
            "model-value": _ctx.searchQuery,
            loading: _ctx.loading,
            "show-help": _ctx.showHelp,
            "available-fields": _ctx.availableFields,
            "total-items": _ctx.totalItems,
            placeholder: "Search items...",
            "onUpdate:modelValue": handleSearchUpdate,
            onToggleHelp: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:show-help", !_ctx.showHelp))
          }, null, 8, ["model-value", "loading", "show-help", "available-fields", "total-items"]),
          require$$0.createVNode(require$$0.Transition, { name: "expand" }, {
            default: require$$0.withCtx(() => [
              _ctx.showHelp ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_2$3, [
                require$$0.createElementVNode("div", _hoisted_3$2, [
                  nonTranslatableFields.value.length > 0 || _ctx.translationInfo?.translationFields?.length > 0 ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_4$2, [
                    _cache[3] || (_cache[3] = require$$0.createElementVNode("h4", null, "Available Fields", -1)),
                    require$$0.createElementVNode("div", _hoisted_5$2, [
                      (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(nonTranslatableFields.value, (field) => {
                        return require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
                          key: field.field,
                          "x-small": "",
                          label: "",
                          clickable: "",
                          class: "field-chip",
                          onClick: ($event) => addFieldToSearch(field.field)
                        }, {
                          default: require$$0.withCtx(() => [
                            require$$0.createVNode(_component_v_icon, {
                              name: "text_fields",
                              "x-small": ""
                            }),
                            require$$0.createTextVNode(" " + require$$0.toDisplayString(field.field) + " ", 1),
                            require$$0.createElementVNode("span", _hoisted_6$2, require$$0.toDisplayString(field.type), 1)
                          ]),
                          _: 2
                        }, 1032, ["onClick"]);
                      }), 128)),
                      (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.translationInfo?.translationFields || [], (field) => {
                        return require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
                          key: `translations.${field.field}`,
                          "x-small": "",
                          label: "",
                          clickable: "",
                          class: "field-chip translation-field-chip",
                          onClick: ($event) => addFieldToSearch(`translations.${field.field}`)
                        }, {
                          default: require$$0.withCtx(() => [
                            require$$0.createVNode(_component_v_icon, {
                              name: "translate",
                              "x-small": ""
                            }),
                            require$$0.createTextVNode(" " + require$$0.toDisplayString(field.field) + " ", 1),
                            require$$0.createElementVNode("span", _hoisted_7$2, require$$0.toDisplayString(field.type), 1)
                          ]),
                          _: 2
                        }, 1032, ["onClick"]);
                      }), 128))
                    ])
                  ])) : require$$0.createCommentVNode("", true),
                  require$$0.createElementVNode("div", _hoisted_8$2, [
                    _cache[4] || (_cache[4] = require$$0.createElementVNode("h4", null, "Search Operators", -1)),
                    require$$0.createElementVNode("div", _hoisted_9$2, [
                      (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(searchOperators, (op, index2) => {
                        return require$$0.createElementVNode("div", {
                          key: index2,
                          class: "operator-item",
                          onClick: ($event) => addOperatorToSearch(op.symbol)
                        }, [
                          require$$0.createVNode(_component_v_button, {
                            "x-small": "",
                            secondary: "",
                            class: "operator-button"
                          }, {
                            default: require$$0.withCtx(() => [
                              require$$0.createTextVNode(require$$0.toDisplayString(op.symbol), 1)
                            ]),
                            _: 2
                          }, 1024),
                          require$$0.createElementVNode("div", _hoisted_11$2, [
                            require$$0.createElementVNode("div", _hoisted_12$2, require$$0.toDisplayString(op.name), 1),
                            require$$0.createElementVNode("div", _hoisted_13$1, require$$0.toDisplayString(op.example), 1)
                          ])
                        ], 8, _hoisted_10$2);
                      }), 64))
                    ])
                  ]),
                  require$$0.createElementVNode("div", _hoisted_14, [
                    _cache[12] || (_cache[12] = require$$0.createElementVNode("h4", null, "Logical Operators", -1)),
                    require$$0.createElementVNode("div", _hoisted_15, [
                      require$$0.createElementVNode("button", {
                        type: "button",
                        class: require$$0.normalizeClass(["logical-operator-button and-button", { active: searchTagInputRef.value?.defaultLogicalOp?.value === "AND" }]),
                        onClick: _cache[1] || (_cache[1] = ($event) => addLogicalOperator("AND"))
                      }, " AND ", 2),
                      require$$0.createElementVNode("button", {
                        type: "button",
                        class: require$$0.normalizeClass(["logical-operator-button or-button", { active: searchTagInputRef.value?.defaultLogicalOp?.value === "OR" }]),
                        onClick: _cache[2] || (_cache[2] = ($event) => addLogicalOperator("OR"))
                      }, " OR ", 2)
                    ]),
                    require$$0.createElementVNode("div", _hoisted_16, [
                      _cache[11] || (_cache[11] = require$$0.createElementVNode("p", null, "Combine multiple search criteria:", -1)),
                      require$$0.createElementVNode("ul", null, [
                        _cache[6] || (_cache[6] = require$$0.createElementVNode("li", null, [
                          require$$0.createElementVNode("code", null, "title=Book AND status=published")
                        ], -1)),
                        _cache[7] || (_cache[7] = require$$0.createElementVNode("li", null, [
                          require$$0.createElementVNode("code", null, "category=tech OR category=news")
                        ], -1)),
                        _cache[8] || (_cache[8] = require$$0.createElementVNode("li", null, [
                          require$$0.createTextVNode("Press "),
                          require$$0.createElementVNode("strong", null, "Enter"),
                          require$$0.createTextVNode(" after a search to create a tag")
                        ], -1)),
                        _cache[9] || (_cache[9] = require$$0.createElementVNode("li", null, "Click AND/OR before adding tags to set default combination", -1)),
                        _cache[10] || (_cache[10] = require$$0.createElementVNode("li", null, "Double-click tags to edit them", -1)),
                        !searchTagInputRef.value?.defaultLogicalOp?.value ? (require$$0.openBlock(), require$$0.createElementBlock("li", _hoisted_17, [
                          require$$0.createVNode(_component_v_icon, {
                            name: "info",
                            "x-small": ""
                          }),
                          _cache[5] || (_cache[5] = require$$0.createTextVNode(" Default combination is AND "))
                        ])) : require$$0.createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  _cache[13] || (_cache[13] = require$$0.createElementVNode("div", { class: "search-help-tips" }, [
                    require$$0.createElementVNode("strong", null, "Tips:"),
                    require$$0.createTextVNode(" Click a field to start searching • Click an operator to add it • Use AND/OR to combine criteria ")
                  ], -1))
                ])
              ])) : require$$0.createCommentVNode("", true)
            ]),
            _: 1
          })
        ]);
      };
    }
  });
  const _hoisted_1$4 = { class: "field-display" };
  const _hoisted_2$2 = {
    key: 2,
    class: "wysiwyg-field"
  };
  const _hoisted_3$1 = { class: "field-value" };
  const _hoisted_4$1 = { class: "wysiwyg-popover" };
  const _hoisted_5$1 = ["innerHTML"];
  const _hoisted_6$1 = {
    key: 3,
    class: "field-value"
  };
  const _hoisted_7$1 = {
    key: 4,
    class: "image-field"
  };
  const _hoisted_8$1 = { class: "image-preview" };
  const _hoisted_9$1 = ["src", "alt"];
  const _hoisted_10$1 = {
    key: 5,
    class: "json-field"
  };
  const _hoisted_11$1 = { class: "json-popover" };
  const _hoisted_12$1 = {
    key: 6,
    class: "field-value"
  };
  const _sfc_main$4 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "FieldDisplay",
    props: {
      value: {},
      field: {},
      fieldInfo: {},
      maxLength: { default: 100 }
    },
    setup(__props) {
      const props = __props;
      const fieldType = require$$0.computed(() => props.fieldInfo?.type || typeof props.value);
      const fieldInterface = require$$0.computed(() => props.fieldInfo?.interface);
      const fieldDisplay = require$$0.computed(() => props.fieldInfo?.display);
      const isSelectDropdown = require$$0.computed(
        () => fieldInterface.value === "select-dropdown"
      );
      const isWysiwyg = require$$0.computed(
        () => fieldInterface.value === "input-rich-text-html" || fieldInterface.value === "input-rich-text-md" || fieldDisplay.value === "formatted-value"
      );
      const isDateField = require$$0.computed(
        () => fieldType.value === "date" || fieldType.value === "dateTime" || fieldType.value === "timestamp"
      );
      const isJsonField = require$$0.computed(
        () => fieldType.value === "json" || typeof props.value === "object" && props.value !== null && !Array.isArray(props.value)
      );
      const isImageField = require$$0.computed(
        () => fieldInterface.value === "file-image" || fieldInterface.value === "file" || fieldType.value === "uuid" && props.field.includes("image") || typeof props.value === "string" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(props.value)
      );
      const displayValue = require$$0.computed(() => {
        if (props.value === null || props.value === void 0) return "";
        if (typeof props.value === "object") return JSON.stringify(props.value);
        return String(props.value);
      });
      const truncatedValue = require$$0.computed(() => {
        if (displayValue.value.length <= props.maxLength) return displayValue.value;
        return displayValue.value.substring(0, props.maxLength) + "...";
      });
      const selectedChoice = require$$0.computed(() => {
        if (!isSelectDropdown.value) return null;
        const choices = props.fieldInfo?.options?.choices;
        if (!choices) {
          return null;
        }
        if (Array.isArray(choices)) {
          const found = choices.find((choice) => choice.value === props.value);
          return found || null;
        } else if (typeof choices === "object") {
          const choice = choices[props.value];
          if (!choice) {
            return null;
          }
          if (typeof choice === "string") {
            return { text: choice, value: props.value };
          }
          return choice;
        }
        return null;
      });
      const strippedHtml = require$$0.computed(() => {
        if (!isWysiwyg.value) return displayValue.value;
        const tmp = document.createElement("div");
        tmp.innerHTML = displayValue.value;
        const text = tmp.textContent || tmp.innerText || "";
        if (text.length > props.maxLength) {
          return text.substring(0, props.maxLength) + "...";
        }
        return text;
      });
      const sanitizedHtml = require$$0.computed(() => {
        if (!isWysiwyg.value) return "";
        return displayValue.value;
      });
      const hasLongContent = require$$0.computed(() => {
        if (!isWysiwyg.value) return false;
        const tmp = document.createElement("div");
        tmp.innerHTML = displayValue.value;
        const text = tmp.textContent || tmp.innerText || "";
        return text.length > props.maxLength;
      });
      const formattedJson = require$$0.computed(() => {
        if (!isJsonField.value) return "";
        try {
          return JSON.stringify(props.value, null, 2);
        } catch {
          return String(props.value);
        }
      });
      function formatDate(value) {
        if (!value) return "";
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) return String(value);
          if (fieldType.value === "date") {
            return date.toLocaleDateString();
          } else {
            return date.toLocaleString();
          }
        } catch {
          return String(value);
        }
      }
      const imageUrl = require$$0.computed(() => {
        if (!props.value) return "";
        if (fieldType.value === "uuid" || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(props.value)) {
          return `/assets/${props.value}?fit=cover&width=150&height=150&quality=80`;
        }
        if (typeof props.value === "string" && (props.value.startsWith("http") || props.value.startsWith("/"))) {
          return props.value;
        }
        return "";
      });
      require$$0.computed(() => {
        if (!props.value) return "";
        if (typeof props.value === "string") {
          const parts = props.value.split("/");
          return parts[parts.length - 1] || props.value;
        }
        return String(props.value);
      });
      const imageTooltipContent = require$$0.computed(() => {
        if (!imageUrl.value) return "";
        return {
          content: `<img src="${imageUrl.value}" style="max-width: 300px; max-height: 300px;" />`,
          html: true,
          delay: 300
        };
      });
      function handleImageError(event) {
        const img = event.target;
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"%3E%3Cpath fill="%23999" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/%3E%3C/svg%3E';
      }
      return (_ctx, _cache) => {
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_button = require$$0.resolveComponent("v-button");
        const _component_v_menu = require$$0.resolveComponent("v-menu");
        const _directive_tooltip = require$$0.resolveDirective("tooltip");
        return require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1$4, [
          fieldType.value === "boolean" ? (require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
            key: 0,
            "x-small": "",
            class: require$$0.normalizeClass(_ctx.value ? "boolean-true" : "boolean-false")
          }, {
            default: require$$0.withCtx(() => [
              require$$0.createTextVNode(require$$0.toDisplayString(_ctx.value ? "Yes" : "No"), 1)
            ]),
            _: 1
          }, 8, ["class"])) : isSelectDropdown.value && props.value ? (require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
            key: 1,
            "x-small": "",
            class: "select-chip"
          }, {
            default: require$$0.withCtx(() => [
              selectedChoice.value?.icon ? (require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
                key: 0,
                name: selectedChoice.value.icon,
                "x-small": "",
                class: "choice-icon"
              }, null, 8, ["name"])) : require$$0.createCommentVNode("", true),
              require$$0.createTextVNode(" " + require$$0.toDisplayString(selectedChoice.value?.text || props.value), 1)
            ]),
            _: 1
          })) : isWysiwyg.value ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_2$2, [
            require$$0.createElementVNode("span", _hoisted_3$1, require$$0.toDisplayString(strippedHtml.value), 1),
            hasLongContent.value ? (require$$0.openBlock(), require$$0.createBlock(_component_v_menu, {
              key: 0,
              placement: "bottom",
              "show-arrow": "",
              "close-on-content-click": false
            }, {
              activator: require$$0.withCtx(({ toggle }) => [
                require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
                  "x-small": "",
                  icon: "",
                  secondary: "",
                  onClick: toggle,
                  class: "expand-button"
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_icon, {
                      name: "expand_more",
                      "x-small": ""
                    })
                  ]),
                  _: 2
                }, 1032, ["onClick"])), [
                  [
                    _directive_tooltip,
                    "Show full content",
                    void 0,
                    { top: true }
                  ]
                ])
              ]),
              default: require$$0.withCtx(() => [
                require$$0.createElementVNode("div", _hoisted_4$1, [
                  require$$0.createElementVNode("div", {
                    class: "wysiwyg-content",
                    innerHTML: sanitizedHtml.value
                  }, null, 8, _hoisted_5$1)
                ])
              ]),
              _: 1
            })) : require$$0.createCommentVNode("", true)
          ])) : isDateField.value ? (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_6$1, require$$0.toDisplayString(formatDate(_ctx.value)), 1)) : isImageField.value ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_7$1, [
            require$$0.withDirectives((require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_8$1, [
              require$$0.createElementVNode("img", {
                src: imageUrl.value,
                alt: _ctx.field,
                onError: handleImageError
              }, null, 40, _hoisted_9$1)
            ])), [
              [
                _directive_tooltip,
                imageTooltipContent.value,
                void 0,
                { top: true }
              ]
            ])
          ])) : isJsonField.value ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_10$1, [
            require$$0.createVNode(_component_v_chip, {
              "x-small": "",
              class: "json-chip"
            }, {
              default: require$$0.withCtx(() => _cache[0] || (_cache[0] = [
                require$$0.createTextVNode(" JSON ")
              ])),
              _: 1,
              __: [0]
            }),
            require$$0.createVNode(_component_v_menu, {
              placement: "bottom",
              "show-arrow": "",
              "close-on-content-click": false
            }, {
              activator: require$$0.withCtx(({ toggle }) => [
                require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
                  "x-small": "",
                  icon: "",
                  secondary: "",
                  onClick: toggle,
                  class: "json-button"
                }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_icon, {
                      name: "code",
                      "x-small": ""
                    })
                  ]),
                  _: 2
                }, 1032, ["onClick"])), [
                  [
                    _directive_tooltip,
                    "Show JSON content",
                    void 0,
                    { top: true }
                  ]
                ])
              ]),
              default: require$$0.withCtx(() => [
                require$$0.createElementVNode("div", _hoisted_11$1, [
                  require$$0.createElementVNode("pre", null, require$$0.toDisplayString(formattedJson.value), 1)
                ])
              ]),
              _: 1
            })
          ])) : require$$0.withDirectives((require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_12$1, [
            require$$0.createTextVNode(require$$0.toDisplayString(truncatedValue.value), 1)
          ])), [
            [_directive_tooltip, displayValue.value.length > _ctx.maxLength ? displayValue.value : null]
          ])
        ]);
      };
    }
  });
  const FieldDisplay = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-6c75e0c8"]]);
  const _hoisted_1$3 = { class: "usage-popover-content" };
  const _sfc_main$3 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "UsagePopover",
    props: {
      itemRelations: {},
      itemId: {},
      placement: { default: "bottom" }
    },
    emits: ["item-click"],
    setup(__props) {
      const props = __props;
      const { useCollectionsStore } = extensionsSdk.useStores();
      const collectionsStore = useCollectionsStore();
      const relations = require$$0.computed(() => props.itemRelations || []);
      const totalCount = require$$0.computed(() => {
        return relations.value.reduce((total, usage) => total + usage.count, 0);
      });
      function getItemTitle(item) {
        return extractItemTitle(item) || `ID: ${item.id}`;
      }
      function getCollectionIcon(collection) {
        const collectionInfo = collectionsStore.getCollection(collection);
        return collectionInfo?.meta?.icon || "box";
      }
      function capitalizeField(fieldName) {
        return fieldName.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      }
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _component_v_list_item_icon = require$$0.resolveComponent("v-list-item-icon");
        const _component_v_list_item_title = require$$0.resolveComponent("v-list-item-title");
        const _component_v_list_item_content = require$$0.resolveComponent("v-list-item-content");
        const _component_v_list_item = require$$0.resolveComponent("v-list-item");
        const _component_v_divider = require$$0.resolveComponent("v-divider");
        const _component_v_list_item_subtitle = require$$0.resolveComponent("v-list-item-subtitle");
        const _component_v_list = require$$0.resolveComponent("v-list");
        const _component_v_menu = require$$0.resolveComponent("v-menu");
        return require$$0.openBlock(), require$$0.createBlock(_component_v_menu, {
          placement: _ctx.placement,
          "show-arrow": "",
          class: "usage-popover"
        }, {
          activator: require$$0.withCtx(({ toggle }) => [
            require$$0.createVNode(_component_v_chip, {
              "x-small": "",
              class: "usage-chip",
              onClick: require$$0.withModifiers(toggle, ["stop"])
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, {
                  name: "link",
                  "x-small": ""
                }),
                require$$0.createTextVNode(" " + require$$0.toDisplayString(totalCount.value), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])
          ]),
          default: require$$0.withCtx(() => [
            require$$0.createElementVNode("div", _hoisted_1$3, [
              require$$0.createVNode(_component_v_list, { class: "usage-popover-list" }, {
                default: require$$0.withCtx(() => [
                  require$$0.createVNode(_component_v_list_item, { disabled: "" }, {
                    default: require$$0.withCtx(() => [
                      require$$0.createVNode(_component_v_list_item_icon, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_icon, { name: "info" })
                        ]),
                        _: 1
                      }),
                      require$$0.createVNode(_component_v_list_item_content, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_list_item_title, null, {
                            default: require$$0.withCtx(() => _cache[0] || (_cache[0] = [
                              require$$0.createTextVNode("This item is used in:")
                            ])),
                            _: 1,
                            __: [0]
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  require$$0.createVNode(_component_v_divider),
                  (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(relations.value, (usage) => {
                    return require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, {
                      key: `${usage.collection}-${usage.field}`
                    }, [
                      require$$0.createVNode(_component_v_list_item, { class: "collection-header" }, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_list_item_icon, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createVNode(_component_v_icon, {
                                name: getCollectionIcon(usage.collection),
                                small: ""
                              }, null, 8, ["name"])
                            ]),
                            _: 2
                          }, 1024),
                          require$$0.createVNode(_component_v_list_item_content, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createVNode(_component_v_list_item_title, null, {
                                default: require$$0.withCtx(() => [
                                  require$$0.createTextVNode(require$$0.toDisplayString(capitalizeField(usage.collection)) + " ", 1),
                                  require$$0.createVNode(_component_v_chip, {
                                    "x-small": "",
                                    label: ""
                                  }, {
                                    default: require$$0.withCtx(() => [
                                      require$$0.createTextVNode(require$$0.toDisplayString(usage.count), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(usage.items.slice(0, 5), (usedIn) => {
                        return require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                          key: usedIn.id,
                          class: "usage-item",
                          clickable: "",
                          onClick: ($event) => _ctx.$emit("item-click", { collection: usage.collection, item: usedIn })
                        }, {
                          default: require$$0.withCtx(() => [
                            require$$0.createVNode(_component_v_list_item_content, null, {
                              default: require$$0.withCtx(() => [
                                require$$0.createVNode(_component_v_list_item_title, { class: "usage-item-title" }, {
                                  default: require$$0.withCtx(() => [
                                    require$$0.createTextVNode(require$$0.toDisplayString(getItemTitle(usedIn)), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                usedIn.path ? (require$$0.openBlock(), require$$0.createBlock(_component_v_list_item_subtitle, { key: 0 }, {
                                  default: require$$0.withCtx(() => [
                                    require$$0.createTextVNode(require$$0.toDisplayString(usedIn.path), 1)
                                  ]),
                                  _: 2
                                }, 1024)) : require$$0.createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1032, ["onClick"]);
                      }), 128)),
                      usage.count > 5 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                        key: 0,
                        disabled: "",
                        class: "more-items"
                      }, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_list_item_content, null, {
                            default: require$$0.withCtx(() => [
                              require$$0.createVNode(_component_v_list_item_title, null, {
                                default: require$$0.withCtx(() => [
                                  require$$0.createTextVNode(" ... and " + require$$0.toDisplayString(usage.count - 5) + " more ", 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)) : require$$0.createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ]),
                _: 1
              })
            ])
          ]),
          _: 1
        }, 8, ["placement"]);
      };
    }
  });
  const UsagePopover = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-6b7ba61d"]]);
  const _hoisted_1$2 = { class: "field-selector-header" };
  const _hoisted_2$1 = { class: "field-name" };
  const _sfc_main$2 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "FieldSettingsMenu",
    props: {
      availableFields: { default: () => [] },
      displayFields: { default: () => [] },
      selectedLanguage: {},
      availableLanguages: {},
      translationInfo: {},
      loading: { type: Boolean, default: false },
      isFieldTranslatable: {}
    },
    emits: ["toggle-field", "change-language"],
    setup(__props) {
      const props = __props;
      function isTranslatable(field) {
        if (props.isFieldTranslatable) {
          return props.isFieldTranslatable(field.field);
        }
        return field.translatable || false;
      }
      function capitalizeField(fieldName) {
        return fieldName.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      }
      return (_ctx, _cache) => {
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_button = require$$0.resolveComponent("v-button");
        const _component_v_list_item_content = require$$0.resolveComponent("v-list-item-content");
        const _component_v_list_item = require$$0.resolveComponent("v-list-item");
        const _component_v_select = require$$0.resolveComponent("v-select");
        const _component_v_divider = require$$0.resolveComponent("v-divider");
        const _component_v_progress_circular = require$$0.resolveComponent("v-progress-circular");
        const _component_v_checkbox = require$$0.resolveComponent("v-checkbox");
        const _component_v_list_item_icon = require$$0.resolveComponent("v-list-item-icon");
        const _component_v_list_item_title = require$$0.resolveComponent("v-list-item-title");
        const _component_v_list = require$$0.resolveComponent("v-list");
        const _component_v_menu = require$$0.resolveComponent("v-menu");
        const _directive_tooltip = require$$0.resolveDirective("tooltip");
        return require$$0.openBlock(), require$$0.createBlock(_component_v_menu, {
          placement: "bottom-end",
          "show-arrow": "",
          "close-on-content-click": false
        }, {
          activator: require$$0.withCtx(({ toggle }) => [
            require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
              icon: "",
              secondary: "",
              onClick: toggle
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, { name: "settings" })
              ]),
              _: 2
            }, 1032, ["onClick"])), [
              [
                _directive_tooltip,
                "Display Settings",
                void 0,
                { bottom: true }
              ]
            ])
          ]),
          default: require$$0.withCtx(() => [
            require$$0.createVNode(_component_v_list, { class: "field-selector-list" }, {
              default: require$$0.withCtx(() => [
                _ctx.translationInfo?.hasTranslations ? (require$$0.openBlock(), require$$0.createElementBlock(require$$0.Fragment, { key: 0 }, [
                  require$$0.createVNode(_component_v_list_item, { disabled: "" }, {
                    default: require$$0.withCtx(() => [
                      require$$0.createVNode(_component_v_list_item_content, null, {
                        default: require$$0.withCtx(() => _cache[2] || (_cache[2] = [
                          require$$0.createElementVNode("div", { class: "field-selector-header" }, "Language", -1)
                        ])),
                        _: 1,
                        __: [2]
                      })
                    ]),
                    _: 1
                  }),
                  require$$0.createVNode(_component_v_list_item, null, {
                    default: require$$0.withCtx(() => [
                      require$$0.createVNode(_component_v_list_item_content, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_select, {
                            "model-value": _ctx.selectedLanguage,
                            items: _ctx.availableLanguages || [],
                            "item-text": "name",
                            "item-value": "code",
                            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.$emit("change-language", $event))
                          }, null, 8, ["model-value", "items"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  require$$0.createVNode(_component_v_divider)
                ], 64)) : require$$0.createCommentVNode("", true),
                require$$0.createVNode(_component_v_list_item, { disabled: "" }, {
                  default: require$$0.withCtx(() => [
                    require$$0.createVNode(_component_v_list_item_content, null, {
                      default: require$$0.withCtx(() => [
                        require$$0.createElementVNode("div", _hoisted_1$2, [
                          _cache[3] || (_cache[3] = require$$0.createTextVNode(" Select fields to display ")),
                          _ctx.loading ? (require$$0.openBlock(), require$$0.createBlock(_component_v_progress_circular, {
                            key: 0,
                            indeterminate: "",
                            "x-small": ""
                          })) : require$$0.createCommentVNode("", true)
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                require$$0.createVNode(_component_v_divider),
                (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.availableFields, (field) => {
                  return require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                    key: field.field,
                    clickable: "",
                    onClick: ($event) => _ctx.$emit("toggle-field", field.field)
                  }, {
                    default: require$$0.withCtx(() => [
                      require$$0.createVNode(_component_v_list_item_icon, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_checkbox, {
                            "model-value": _ctx.displayFields.includes(field.field),
                            "onUpdate:modelValue": ($event) => _ctx.$emit("toggle-field", field.field),
                            onClick: _cache[1] || (_cache[1] = require$$0.withModifiers(() => {
                            }, ["stop"]))
                          }, null, 8, ["model-value", "onUpdate:modelValue"])
                        ]),
                        _: 2
                      }, 1024),
                      require$$0.createVNode(_component_v_list_item_content, null, {
                        default: require$$0.withCtx(() => [
                          require$$0.createVNode(_component_v_list_item_title, { class: "field-selector-title" }, {
                            default: require$$0.withCtx(() => [
                              require$$0.createElementVNode("span", _hoisted_2$1, require$$0.toDisplayString(capitalizeField(field.name || field.field)), 1),
                              isTranslatable(field) ? require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
                                key: 0,
                                name: "translate",
                                small: "",
                                class: "translation-icon"
                              }, null, 512)), [
                                [
                                  _directive_tooltip,
                                  "This field is translatable",
                                  void 0,
                                  { top: true }
                                ]
                              ]) : require$$0.createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1032, ["onClick"]);
                }), 128))
              ]),
              _: 1
            })
          ]),
          _: 1
        });
      };
    }
  });
  function useUserPresets() {
    const api = extensionsSdk.useApi();
    const displayFieldsCache = require$$0.ref({});
    const selectedLanguageCache = require$$0.ref({});
    const loading = require$$0.ref(false);
    const error = require$$0.ref(null);
    const presetIds = require$$0.ref({});
    function getPresetCollection(collection) {
      return `expandable_blocks_fields_${collection}`;
    }
    async function loadPresets() {
      loading.value = true;
      error.value = null;
      try {
        logDebug("Loading user presets");
        const response = await api.get("/presets", {
          params: {
            filter: {
              collection: {
                _starts_with: "expandable_blocks_fields_"
              }
            },
            fields: ["id", "collection", "layout_options"]
          }
        });
        logDebug("Presets API response", {
          hasData: !!response.data?.data,
          presetsCount: response.data?.data?.length || 0
        });
        const presets = response.data?.data || [];
        displayFieldsCache.value = {};
        selectedLanguageCache.value = {};
        presetIds.value = {};
        presets.forEach((preset) => {
          if (preset.collection && preset.layout_options) {
            const actualCollection = preset.collection.replace("expandable_blocks_fields_", "");
            if (preset.layout_options.displayFields) {
              displayFieldsCache.value[actualCollection] = preset.layout_options.displayFields;
            }
            if (preset.layout_options.selectedLanguage) {
              selectedLanguageCache.value[actualCollection] = preset.layout_options.selectedLanguage;
            }
            presetIds.value[actualCollection] = preset.id;
            logDebug("Loaded preset for collection", {
              collection: actualCollection,
              fields: preset.layout_options.displayFields,
              language: preset.layout_options.selectedLanguage,
              presetId: preset.id
            });
          }
        });
        logDebug("User presets loaded", {
          collections: Object.keys(displayFieldsCache.value)
        });
      } catch (err) {
        error.value = "Failed to load user presets";
        logError("Failed to load user presets", err);
      } finally {
        loading.value = false;
      }
    }
    async function savePresetData(collection, data) {
      loading.value = true;
      error.value = null;
      try {
        const presetCollection = getPresetCollection(collection);
        const presetId = presetIds.value[collection];
        logDebug("Saving preset data", {
          collection,
          presetCollection,
          data,
          hasPresetId: !!presetId
        });
        const layoutOptions = {};
        if (data.displayFields !== void 0) {
          layoutOptions.displayFields = data.displayFields;
        } else if (displayFieldsCache.value[collection]) {
          layoutOptions.displayFields = displayFieldsCache.value[collection];
        }
        if (data.selectedLanguage !== void 0) {
          layoutOptions.selectedLanguage = data.selectedLanguage;
        } else if (selectedLanguageCache.value[collection]) {
          layoutOptions.selectedLanguage = selectedLanguageCache.value[collection];
        }
        const presetData = {
          collection: presetCollection,
          layout_options: layoutOptions,
          // Required fields for preset
          icon: "box",
          layout: "table"
        };
        let response;
        if (presetId) {
          response = await api.patch(`/presets/${presetId}`, {
            layout_options: layoutOptions
          });
          logDebug("Updated existing preset", { presetId, layoutOptions });
        } else {
          response = await api.post("/presets", presetData);
          if (response.data?.data?.id) {
            presetIds.value[collection] = response.data.data.id;
            logDebug("Created new preset", {
              presetId: response.data.data.id,
              layoutOptions
            });
          }
        }
        if (data.displayFields !== void 0) {
          displayFieldsCache.value[collection] = data.displayFields;
        }
        if (data.selectedLanguage !== void 0) {
          selectedLanguageCache.value[collection] = data.selectedLanguage;
        }
      } catch (err) {
        error.value = "Failed to save preset data";
        logError("Failed to save preset data", err);
        throw err;
      } finally {
        loading.value = false;
      }
    }
    async function saveDisplayFields(collection, fields) {
      return savePresetData(collection, { displayFields: fields });
    }
    const debouncedSave = debounce(saveDisplayFields, 500);
    function getDisplayFields(collection) {
      const fields = displayFieldsCache.value[collection] || [];
      logDebug("Getting display fields", {
        collection,
        fields,
        allCollections: Object.keys(displayFieldsCache.value)
      });
      return fields;
    }
    async function setDisplayFields(collection, fields) {
      displayFieldsCache.value[collection] = fields;
      try {
        await debouncedSave(collection, fields);
      } catch (err) {
        logWarn("Failed to persist display fields", { collection, fields });
      }
    }
    async function toggleDisplayField(collection, field) {
      const currentFields = getDisplayFields(collection);
      const index2 = currentFields.indexOf(field);
      let newFields;
      if (index2 > -1) {
        newFields = currentFields.filter((f) => f !== field);
      } else {
        newFields = [...currentFields, field];
      }
      await setDisplayFields(collection, newFields);
    }
    function getSelectedLanguage(collection) {
      const language = selectedLanguageCache.value[collection] || null;
      logDebug("Getting selected language", {
        collection,
        language,
        allCollections: Object.keys(selectedLanguageCache.value)
      });
      return language;
    }
    async function saveSelectedLanguage(collection, language) {
      selectedLanguageCache.value[collection] = language;
      try {
        await debouncedSaveLanguage(collection, language);
      } catch (err) {
        logWarn("Failed to persist selected language", { collection, language });
      }
    }
    const debouncedSaveLanguage = debounce(
      (collection, language) => savePresetData(collection, { selectedLanguage: language }),
      500
    );
    async function migrateFromLocalStorage() {
      try {
        logDebug("Checking for localStorage data to migrate");
        const migratedCollections = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("displayFields_")) {
            const collection = key.replace("displayFields_", "");
            const savedFields = localStorage.getItem(key);
            if (savedFields) {
              try {
                const fields = JSON.parse(savedFields);
                if (Array.isArray(fields)) {
                  await saveDisplayFields(collection, fields);
                  migratedCollections.push(collection);
                }
              } catch (err) {
                logWarn("Failed to parse localStorage data", { key, error: err });
              }
            }
          }
        }
        if (migratedCollections.length > 0) {
          logDebug("Migrated localStorage data to presets", {
            collections: migratedCollections
          });
          migratedCollections.forEach((collection) => {
            localStorage.removeItem(`displayFields_${collection}`);
          });
        }
      } catch (err) {
        logError("Failed to migrate localStorage data", err);
      }
    }
    async function initialize() {
      await loadPresets();
      const hasLocalStorageData = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).some((key) => key?.startsWith("displayFields_"));
      if (hasLocalStorageData) {
        await migrateFromLocalStorage();
      }
    }
    return {
      // State
      displayFieldsCache,
      selectedLanguageCache,
      loading,
      error,
      // Methods
      loadPresets,
      saveDisplayFields,
      getDisplayFields,
      setDisplayFields,
      toggleDisplayField,
      getSelectedLanguage,
      saveSelectedLanguage,
      initialize
    };
  }
  const _hoisted_1$1 = { class: "drawer-collection-body" };
  const _hoisted_2 = { class: "search-info-bar" };
  const _hoisted_3 = { class: "results-info" };
  const _hoisted_4 = { key: 0 };
  const _hoisted_5 = { key: 1 };
  const _hoisted_6 = {
    key: 2,
    class: "selection-info-inline"
  };
  const _hoisted_7 = { class: "pagination-controls" };
  const _hoisted_8 = { class: "item-title-row" };
  const _hoisted_9 = { class: "item-title" };
  const _hoisted_10 = {
    key: 0,
    class: "usage-warning"
  };
  const _hoisted_11 = {
    key: 1,
    class: "item-fields"
  };
  const _hoisted_12 = { class: "field-label" };
  const _hoisted_13 = {
    key: 0,
    class: "empty-state-hint"
  };
  const _sfc_main$1 = /* @__PURE__ */ require$$0.defineComponent({
    __name: "ItemSelectorDrawer",
    props: {
      open: { type: Boolean },
      collection: {},
      collectionName: {},
      collectionIcon: {},
      items: {},
      loading: { type: Boolean, default: false },
      loadingDetails: { type: Boolean },
      currentPage: {},
      itemsPerPage: {},
      totalItems: {},
      availableFields: {},
      itemRelations: {},
      loadingRelations: { type: Boolean },
      apiError: {},
      translationInfo: {},
      selectedLanguage: {},
      availableLanguages: {},
      getTranslatedFieldValue: {},
      isFieldTranslatable: {}
    },
    emits: ["close", "confirm", "confirmCopy", "search", "update:current-page", "update:selected-language"],
    setup(__props, { emit: __emit }) {
      const logger2 = createScopedLogger("ItemSelectorDrawer");
      const userPresets = useUserPresets();
      const props = __props;
      const emit = __emit;
      const selectedItems = require$$0.ref([]);
      const searchQuery = require$$0.ref("");
      const displayFields = require$$0.ref([]);
      const selectedLanguageLocal = require$$0.ref("");
      const showSearchHelp = require$$0.ref(false);
      const preferencesInitialized = require$$0.ref(false);
      require$$0.watch(() => props.availableFields, (fields) => {
        logger2.debug("availableFields changed", { fields });
      });
      require$$0.watch(() => props.translationInfo, (info) => {
        logger2.debug("translationInfo changed", { info });
      });
      require$$0.watch(() => props.isFieldTranslatable, (fn) => {
        logger2.debug("isFieldTranslatable function changed", { exists: !!fn });
      });
      require$$0.watch(() => props.itemRelations, (relations) => {
        logger2.debug("itemRelations changed", {
          relations,
          hasRelations: !!relations,
          itemsWithRelations: relations ? Object.keys(relations).length : 0
        });
      }, { immediate: true });
      const collectionIcon = require$$0.computed(() => props.collectionIcon || "box");
      const collectionName = require$$0.computed(() => props.collectionName || props.collection || "Items");
      const totalPages = require$$0.computed(() => {
        if (!props.totalItems || !props.itemsPerPage) return 1;
        return Math.ceil(props.totalItems / props.itemsPerPage);
      });
      const currentPageLocal = require$$0.computed({
        get: () => props.currentPage || 1,
        set: (value) => emit("update:current-page", value)
      });
      function handleClose() {
        emit("close");
      }
      function deselectAll() {
        selectedItems.value = [];
      }
      function isSelected(item) {
        const itemId = item.id || item;
        return selectedItems.value.includes(itemId);
      }
      function toggleSelection(item) {
        const itemId = item.id || item;
        const index2 = selectedItems.value.indexOf(itemId);
        if (index2 > -1) {
          selectedItems.value.splice(index2, 1);
        } else {
          selectedItems.value.push(itemId);
        }
      }
      function handleConfirm() {
        const selectedFullItems = selectedItems.value.map((itemId) => props.items.find((item) => item.id === itemId)).filter((item) => item !== void 0);
        emit("confirm", selectedFullItems);
      }
      function handleConfirmCopy() {
        const selectedFullItems = selectedItems.value.map((itemId) => props.items.find((item) => item.id === itemId)).filter((item) => item !== void 0);
        emit("confirmCopy", selectedFullItems);
      }
      async function toggleFieldDisplay(field) {
        const isTranslatable = props.isFieldTranslatable ? props.isFieldTranslatable(field) : false;
        logger2.debug("Field translatable check", { field, isTranslatable });
        const index2 = displayFields.value.indexOf(field);
        if (index2 > -1) {
          displayFields.value.splice(index2, 1);
        } else {
          displayFields.value.push(field);
        }
        if (props.collection) {
          try {
            await userPresets.setDisplayFields(props.collection, displayFields.value);
          } catch (err) {
          }
        }
      }
      function getFieldLabel(field) {
        const fieldInfo = props.availableFields?.find((f) => f.field === field);
        return fieldInfo?.name || field;
      }
      function getFieldInfo(field) {
        return props.availableFields?.find((f) => f.field === field);
      }
      function getFieldValue(value) {
        if (value === null || value === void 0) return "";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
      }
      function capitalizeField(fieldName) {
        return fieldName.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
      }
      function getTotalUsageCount(itemId) {
        const relations = props.itemRelations?.[itemId];
        if (!relations) return 0;
        return relations.reduce((total, usage) => total + usage.count, 0);
      }
      function getTranslatedValue(item, field) {
        if (props.getTranslatedFieldValue) {
          return props.getTranslatedFieldValue(item, field);
        }
        return getFieldValue(item[field]);
      }
      function handleUsageItemClick(payload) {
        logger2.debug("Usage item clicked", payload);
      }
      async function handleLanguageChange(language) {
        selectedLanguageLocal.value = language;
        emit("update:selected-language", language);
        if (props.collection) {
          try {
            await userPresets.saveSelectedLanguage(props.collection, language);
            logger2.debug("Saved language preference", { collection: props.collection, language });
          } catch (err) {
            logger2.error("Failed to save language preference", err);
          }
        }
      }
      require$$0.watch(() => props.open, async (isOpen) => {
        if (isOpen) {
          selectedItems.value = [];
          searchQuery.value = "";
          showSearchHelp.value = false;
          if (!preferencesInitialized.value) {
            try {
              logger2.debug("Initializing presets on drawer open");
              await userPresets.initialize();
              preferencesInitialized.value = true;
            } catch (err) {
              logger2.error("Failed to initialize presets on drawer open", err);
            }
          }
          if (props.collection && preferencesInitialized.value) {
            const fields = userPresets.getDisplayFields(props.collection);
            displayFields.value = fields;
            const savedLanguage = userPresets.getSelectedLanguage(props.collection);
            if (savedLanguage) {
              selectedLanguageLocal.value = savedLanguage;
            } else if (props.selectedLanguage) {
              selectedLanguageLocal.value = props.selectedLanguage;
            }
            logger2.debug("Loaded preferences on drawer open", {
              collection: props.collection,
              fields,
              language: selectedLanguageLocal.value
            });
          }
        }
      });
      require$$0.watch(() => props.collection, async (collection) => {
        selectedItems.value = [];
        searchQuery.value = "";
        showSearchHelp.value = false;
        if (collection && preferencesInitialized.value) {
          const fields = userPresets.getDisplayFields(collection);
          displayFields.value = fields;
          const savedLanguage = userPresets.getSelectedLanguage(collection);
          if (savedLanguage) {
            selectedLanguageLocal.value = savedLanguage;
          } else if (props.selectedLanguage) {
            selectedLanguageLocal.value = props.selectedLanguage;
          }
          logger2.debug("Loaded preferences on collection change", {
            collection,
            fields,
            language: selectedLanguageLocal.value
          });
        }
      });
      require$$0.watch(() => props.selectedLanguage, (newLanguage) => {
        if (newLanguage && newLanguage !== selectedLanguageLocal.value && !preferencesInitialized.value) {
          selectedLanguageLocal.value = newLanguage;
        }
      });
      require$$0.onMounted(async () => {
        try {
          await userPresets.initialize();
          preferencesInitialized.value = true;
          if (props.collection) {
            displayFields.value = userPresets.getDisplayFields(props.collection);
            const savedLanguage = userPresets.getSelectedLanguage(props.collection);
            if (savedLanguage) {
              selectedLanguageLocal.value = savedLanguage;
            } else if (props.selectedLanguage) {
              selectedLanguageLocal.value = props.selectedLanguage;
            }
          }
        } catch (err) {
          logger2.error("Failed to initialize user presets", err);
        }
      });
      return (_ctx, _cache) => {
        const _component_v_breadcrumb = require$$0.resolveComponent("v-breadcrumb");
        const _component_v_icon = require$$0.resolveComponent("v-icon");
        const _component_v_button = require$$0.resolveComponent("v-button");
        const _component_v_pagination = require$$0.resolveComponent("v-pagination");
        const _component_v_checkbox = require$$0.resolveComponent("v-checkbox");
        const _component_v_list_item_icon = require$$0.resolveComponent("v-list-item-icon");
        const _component_v_chip = require$$0.resolveComponent("v-chip");
        const _component_v_list_item_content = require$$0.resolveComponent("v-list-item-content");
        const _component_v_list_item = require$$0.resolveComponent("v-list-item");
        const _component_v_list = require$$0.resolveComponent("v-list");
        const _component_v_notice = require$$0.resolveComponent("v-notice");
        const _component_v_drawer = require$$0.resolveComponent("v-drawer");
        const _directive_tooltip = require$$0.resolveDirective("tooltip");
        return require$$0.openBlock(), require$$0.createBlock(_component_v_drawer, {
          "model-value": _ctx.open,
          class: "item-selector-drawer",
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.$emit("close")),
          onCancel: handleClose,
          icon: collectionIcon.value,
          title: "Select Item(s)",
          "small-header": false,
          "header-shadow": false
        }, {
          subtitle: require$$0.withCtx(() => [
            require$$0.createVNode(_component_v_breadcrumb, {
              items: [{ name: collectionName.value, disabled: true }]
            }, null, 8, ["items"])
          ]),
          "title-outer:prepend": require$$0.withCtx(() => [
            require$$0.createVNode(_component_v_button, {
              class: "header-icon",
              rounded: "",
              icon: "",
              secondary: "",
              disabled: ""
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, { name: collectionIcon.value }, null, 8, ["name"])
              ]),
              _: 1
            })
          ]),
          actions: require$$0.withCtx(() => [
            require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
              disabled: selectedItems.value.length === 0,
              kind: "warning",
              icon: "",
              onClick: handleConfirmCopy
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, { name: "content_copy" })
              ]),
              _: 1
            }, 8, ["disabled"])), [
              [
                _directive_tooltip,
                "Creates an independent copy of the selected item. Changes to the copy will not affect the original.",
                void 0,
                { top: true }
              ]
            ]),
            require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_button, {
              disabled: selectedItems.value.length === 0,
              icon: "",
              onClick: handleConfirm
            }, {
              default: require$$0.withCtx(() => [
                require$$0.createVNode(_component_v_icon, { name: "link" })
              ]),
              _: 1
            }, 8, ["disabled"])), [
              [
                _directive_tooltip,
                "Adds a reference to the selected item. Changes to the item will affect all places where it is used.",
                void 0,
                { left: true }
              ]
            ])
          ]),
          default: require$$0.withCtx(() => [
            require$$0.createElementVNode("div", _hoisted_1$1, [
              require$$0.createVNode(_sfc_main$5, {
                "search-query": searchQuery.value,
                "onUpdate:searchQuery": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
                "show-help": showSearchHelp.value,
                "onUpdate:showHelp": _cache[1] || (_cache[1] = ($event) => showSearchHelp.value = $event),
                loading: _ctx.loading,
                "available-fields": _ctx.availableFields,
                "translation-info": _ctx.translationInfo,
                "total-items": _ctx.totalItems,
                onSearch: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("search", $event))
              }, null, 8, ["search-query", "show-help", "loading", "available-fields", "translation-info", "total-items"]),
              require$$0.createElementVNode("div", _hoisted_2, [
                require$$0.createElementVNode("div", _hoisted_3, [
                  searchQuery.value ? (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_4, " Showing " + require$$0.toDisplayString(_ctx.totalItems) + ' results for "' + require$$0.toDisplayString(searchQuery.value) + '" ', 1)) : _ctx.totalItems !== null ? (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_5, require$$0.toDisplayString(_ctx.totalItems) + " " + require$$0.toDisplayString(_ctx.totalItems === 1 ? "item" : "items"), 1)) : require$$0.createCommentVNode("", true),
                  selectedItems.value.length > 0 ? (require$$0.openBlock(), require$$0.createElementBlock("span", _hoisted_6, [
                    require$$0.createTextVNode(" - " + require$$0.toDisplayString(selectedItems.value.length) + " selected (", 1),
                    require$$0.createElementVNode("a", {
                      class: "deselect-link",
                      onClick: deselectAll
                    }, "Deselect all"),
                    _cache[7] || (_cache[7] = require$$0.createTextVNode(") "))
                  ])) : require$$0.createCommentVNode("", true)
                ]),
                require$$0.createElementVNode("div", _hoisted_7, [
                  _ctx.totalItems > _ctx.itemsPerPage && totalPages.value > 1 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_pagination, {
                    key: 0,
                    modelValue: currentPageLocal.value,
                    "onUpdate:modelValue": [
                      _cache[3] || (_cache[3] = ($event) => currentPageLocal.value = $event),
                      _cache[4] || (_cache[4] = ($event) => emit("update:current-page", $event))
                    ],
                    length: totalPages.value,
                    "total-visible": 3,
                    "show-first-last": true
                  }, null, 8, ["modelValue", "length"])) : require$$0.createCommentVNode("", true),
                  require$$0.createVNode(_sfc_main$2, {
                    "available-fields": _ctx.availableFields,
                    "display-fields": displayFields.value,
                    "selected-language": selectedLanguageLocal.value,
                    "available-languages": _ctx.availableLanguages,
                    "translation-info": _ctx.translationInfo,
                    loading: require$$0.unref(userPresets).loading.value,
                    "is-field-translatable": _ctx.isFieldTranslatable,
                    onToggleField: toggleFieldDisplay,
                    onChangeLanguage: handleLanguageChange
                  }, null, 8, ["available-fields", "display-fields", "selected-language", "available-languages", "translation-info", "loading", "is-field-translatable"])
                ])
              ]),
              _ctx.items.length > 0 ? (require$$0.openBlock(), require$$0.createBlock(_component_v_list, {
                key: 0,
                class: "items-list"
              }, {
                default: require$$0.withCtx(() => [
                  (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(_ctx.items, (item) => {
                    return require$$0.openBlock(), require$$0.createBlock(_component_v_list_item, {
                      key: item.id || item,
                      clickable: "",
                      active: isSelected(item),
                      onClick: ($event) => toggleSelection(item),
                      class: "custom-list-item"
                    }, {
                      default: require$$0.withCtx(() => [
                        require$$0.createVNode(_component_v_list_item_icon, null, {
                          default: require$$0.withCtx(() => [
                            require$$0.createVNode(_component_v_checkbox, {
                              "model-value": isSelected(item),
                              onClick: _cache[5] || (_cache[5] = require$$0.withModifiers(() => {
                              }, ["stop"])),
                              "onUpdate:modelValue": ($event) => toggleSelection(item)
                            }, null, 8, ["model-value", "onUpdate:modelValue"])
                          ]),
                          _: 2
                        }, 1024),
                        require$$0.createVNode(_component_v_list_item_content, null, {
                          default: require$$0.withCtx(() => [
                            require$$0.createElementVNode("div", _hoisted_8, [
                              item.status ? require$$0.withDirectives((require$$0.openBlock(), require$$0.createElementBlock("span", {
                                key: 0,
                                class: require$$0.normalizeClass(["status-dot", `status-${item.status}`])
                              }, null, 2)), [
                                [
                                  _directive_tooltip,
                                  capitalizeField(item.status),
                                  void 0,
                                  { top: true }
                                ]
                              ]) : require$$0.createCommentVNode("", true),
                              require$$0.createElementVNode("span", _hoisted_9, require$$0.toDisplayString(require$$0.unref(extractItemTitle)(item)), 1),
                              item.id ? (require$$0.openBlock(), require$$0.createBlock(_component_v_chip, {
                                key: 1,
                                "x-small": "",
                                label: "",
                                class: "item-id-badge"
                              }, {
                                default: require$$0.withCtx(() => [
                                  require$$0.createTextVNode(" ID: " + require$$0.toDisplayString(item.id), 1)
                                ]),
                                _: 2
                              }, 1024)) : require$$0.createCommentVNode("", true),
                              _ctx.itemRelations && _ctx.itemRelations[item.id] ? (require$$0.openBlock(), require$$0.createBlock(UsagePopover, {
                                key: 2,
                                "item-relations": _ctx.itemRelations[item.id],
                                "item-id": item.id,
                                onItemClick: handleUsageItemClick
                              }, null, 8, ["item-relations", "item-id"])) : require$$0.createCommentVNode("", true)
                            ]),
                            _ctx.itemRelations && _ctx.itemRelations[item.id] ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_10, [
                              require$$0.createVNode(_component_v_icon, {
                                name: "warning",
                                "x-small": ""
                              }),
                              require$$0.createElementVNode("span", null, "Used in " + require$$0.toDisplayString(getTotalUsageCount(item.id)) + " place" + require$$0.toDisplayString(getTotalUsageCount(item.id) > 1 ? "s" : "") + " - changes will affect all references", 1)
                            ])) : require$$0.createCommentVNode("", true),
                            displayFields.value.length > 0 ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_11, [
                              (require$$0.openBlock(true), require$$0.createElementBlock(require$$0.Fragment, null, require$$0.renderList(displayFields.value, (field) => {
                                return require$$0.openBlock(), require$$0.createElementBlock("div", {
                                  key: field,
                                  class: "field-item"
                                }, [
                                  require$$0.createElementVNode("span", _hoisted_12, [
                                    require$$0.createTextVNode(require$$0.toDisplayString(capitalizeField(getFieldLabel(field))) + " ", 1),
                                    (_ctx.isFieldTranslatable ? _ctx.isFieldTranslatable(field) : false) ? require$$0.withDirectives((require$$0.openBlock(), require$$0.createBlock(_component_v_icon, {
                                      key: 0,
                                      name: "translate",
                                      "x-small": "",
                                      class: "field-translation-icon"
                                    }, null, 512)), [
                                      [
                                        _directive_tooltip,
                                        "This field is translatable",
                                        void 0,
                                        { top: true }
                                      ]
                                    ]) : require$$0.createCommentVNode("", true),
                                    _cache[8] || (_cache[8] = require$$0.createTextVNode(": "))
                                  ]),
                                  require$$0.createVNode(FieldDisplay, {
                                    value: getTranslatedValue(item, field),
                                    field,
                                    "field-info": getFieldInfo(field),
                                    "max-length": 100
                                  }, null, 8, ["value", "field", "field-info"])
                                ]);
                              }), 128))
                            ])) : require$$0.createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1032, ["active", "onClick"]);
                  }), 128))
                ]),
                _: 1
              })) : _ctx.apiError ? (require$$0.openBlock(), require$$0.createBlock(_component_v_notice, {
                key: 1,
                type: "danger",
                icon: "error"
              }, {
                default: require$$0.withCtx(() => [
                  require$$0.createElementVNode("div", null, require$$0.toDisplayString(_ctx.apiError), 1)
                ]),
                _: 1
              })) : (require$$0.openBlock(), require$$0.createBlock(_component_v_notice, {
                key: 2,
                icon: searchQuery.value ? "search_off" : "inbox"
              }, {
                default: require$$0.withCtx(() => [
                  require$$0.createElementVNode("div", null, require$$0.toDisplayString(searchQuery.value ? "No items found matching your search" : "No items available"), 1),
                  searchQuery.value ? (require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_13, _cache[9] || (_cache[9] = [
                    require$$0.createElementVNode("br", null, null, -1),
                    require$$0.createTextVNode("Try adjusting your search terms")
                  ]))) : require$$0.createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["icon"]))
            ])
          ]),
          _: 1
        }, 8, ["model-value", "icon"]);
      };
    }
  });
  const ItemSelectorDrawer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-908138fb"]]);
  const _hoisted_1 = { class: "expandable-blocks" };
  const _sfc_main = /* @__PURE__ */ require$$0.defineComponent({
    __name: "interface",
    props: {
      value: {},
      options: {},
      disabled: { type: Boolean },
      field: {},
      collection: {},
      primaryKey: {}
    },
    emits: ["input"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const values = require$$0.inject("values", require$$0.ref({}));
      const initialValues = require$$0.inject("initialValues", require$$0.ref({}));
      const { value: modelValue, collection, field, primaryKey, disabled, options } = require$$0.toRefs(props);
      const expandableBlocks = useExpandableBlocks(
        props,
        (event, value) => emit(event, value),
        values,
        initialValues
      );
      const {
        // State
        items,
        expandedItems,
        loading,
        deleteDialog,
        mergedOptions,
        availableStatuses,
        allowedCollections,
        // Computed
        sortable,
        shouldShowItemId,
        canAddMoreBlocks,
        // Methods
        initialize,
        getItemId,
        getActualItemId: getActualItemId2,
        isNewItem,
        isBlockDirty,
        getItemTitle,
        getCollectionName,
        getCollectionIcon,
        getFieldsForItem,
        toggleExpand,
        updateItem,
        addNewItem,
        addExistingItems,
        addAsNewItems,
        showDeleteDialog,
        unlinkItem,
        confirmDeleteItem,
        duplicateItem,
        discardChanges,
        updateItemStatus,
        onSort,
        hasStatusField,
        getItemStatus,
        getStatusLabel,
        hasNestedM2A,
        getM2AFields,
        formatFieldName,
        loadBlockUsageData
      } = expandableBlocks;
      const api = extensionsSdk.useApi();
      const itemSelector = useItemSelector(api);
      function handleItemSelection(selectedItems) {
        if (selectedItems.length > 0 && itemSelector.selectedCollection.value) {
          addExistingItems(itemSelector.selectedCollection.value, selectedItems);
        }
        itemSelector.close();
      }
      function handleItemSelectionAsCopy(selectedItems) {
        if (selectedItems.length > 0 && itemSelector.selectedCollection.value) {
          addAsNewItems(itemSelector.selectedCollection.value, selectedItems);
        }
        itemSelector.close();
      }
      require$$0.watch(items, debounce(async (newItems, oldItems) => {
        if (newItems && oldItems && newItems.length !== oldItems.length) {
          await loadBlockUsageData();
        }
      }, 1e3));
      require$$0.onMounted(async () => {
        await initialize();
        await loadBlockUsageData();
      });
      return (_ctx, _cache) => {
        const _component_v_card_title = require$$0.resolveComponent("v-card-title");
        const _component_v_card_text = require$$0.resolveComponent("v-card-text");
        const _component_v_button = require$$0.resolveComponent("v-button");
        const _component_v_card_actions = require$$0.resolveComponent("v-card-actions");
        const _component_v_card = require$$0.resolveComponent("v-card");
        const _component_v_dialog = require$$0.resolveComponent("v-dialog");
        return require$$0.openBlock(), require$$0.createElementBlock("div", _hoisted_1, [
          require$$0.createVNode(_sfc_main$8, {
            modelValue: require$$0.unref(items),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => require$$0.isRef(items) ? items.value = $event : null),
            "expanded-items": require$$0.unref(expandedItems),
            loading: require$$0.unref(loading),
            sortable: require$$0.unref(sortable),
            disabled: require$$0.unref(disabled),
            "compact-mode": require$$0.unref(mergedOptions)?.compactMode,
            "show-item-id": require$$0.unref(shouldShowItemId),
            "allow-duplicate": require$$0.unref(mergedOptions)?.isAllowedDuplicate !== false,
            "allow-delete": require$$0.unref(mergedOptions)?.isAllowedDelete !== false,
            "available-statuses": require$$0.unref(availableStatuses),
            "expandable-blocks": require$$0.unref(expandableBlocks),
            onToggleExpand: require$$0.unref(toggleExpand),
            onUpdateItem: require$$0.unref(updateItem),
            onUpdateStatus: require$$0.unref(updateItemStatus),
            onDuplicate: require$$0.unref(duplicateItem),
            onDiscardChanges: require$$0.unref(discardChanges),
            onUnlink: require$$0.unref(unlinkItem),
            onDelete: require$$0.unref(showDeleteDialog),
            onSort: require$$0.unref(onSort)
          }, null, 8, ["modelValue", "expanded-items", "loading", "sortable", "disabled", "compact-mode", "show-item-id", "allow-duplicate", "allow-delete", "available-statuses", "expandable-blocks", "onToggleExpand", "onUpdateItem", "onUpdateStatus", "onDuplicate", "onDiscardChanges", "onUnlink", "onDelete", "onSort"]),
          require$$0.createVNode(_sfc_main$7, {
            disabled: require$$0.unref(disabled),
            collections: require$$0.unref(allowedCollections),
            "can-add": require$$0.unref(canAddMoreBlocks),
            onAddItem: require$$0.unref(addNewItem),
            onAddExisting: require$$0.unref(itemSelector).open
          }, null, 8, ["disabled", "collections", "can-add", "onAddItem", "onAddExisting"]),
          require$$0.createVNode(ItemSelectorDrawer, {
            open: require$$0.unref(itemSelector).isOpen.value,
            collection: require$$0.unref(itemSelector).selectedCollection.value,
            "collection-name": require$$0.unref(itemSelector).selectedCollectionName.value,
            "collection-icon": require$$0.unref(itemSelector).selectedCollectionIcon.value,
            items: require$$0.unref(itemSelector).availableItems.value,
            loading: require$$0.unref(itemSelector).loading.value,
            "loading-details": require$$0.unref(itemSelector).loadingDetails.value,
            "current-page": require$$0.unref(itemSelector).currentPage.value,
            "items-per-page": require$$0.unref(itemSelector).itemsPerPage.value,
            "total-items": require$$0.unref(itemSelector).totalItems.value,
            "available-fields": require$$0.unref(itemSelector).availableFields.value,
            "item-relations": require$$0.unref(itemSelector).itemRelations.value,
            "translation-info": require$$0.unref(itemSelector).translationInfo.value,
            "selected-language": require$$0.unref(itemSelector).selectedLanguage.value,
            "available-languages": require$$0.unref(itemSelector).availableLanguages.value,
            "get-translated-field-value": require$$0.unref(itemSelector).getTranslatedFieldValue,
            "is-field-translatable": require$$0.unref(itemSelector).isFieldTranslatable,
            "api-error": require$$0.unref(itemSelector).apiError.value,
            onClose: require$$0.unref(itemSelector).close,
            onConfirm: handleItemSelection,
            onConfirmCopy: handleItemSelectionAsCopy,
            onSearch: require$$0.unref(itemSelector).handleSearch,
            "onUpdate:currentPage": require$$0.unref(itemSelector).handlePageChange,
            "onUpdate:selectedLanguage": _cache[1] || (_cache[1] = (lang) => require$$0.unref(itemSelector).selectedLanguage.value = lang)
          }, null, 8, ["open", "collection", "collection-name", "collection-icon", "items", "loading", "loading-details", "current-page", "items-per-page", "total-items", "available-fields", "item-relations", "translation-info", "selected-language", "available-languages", "get-translated-field-value", "is-field-translatable", "api-error", "onClose", "onSearch", "onUpdate:currentPage"]),
          require$$0.createVNode(_component_v_dialog, {
            "model-value": require$$0.unref(deleteDialog),
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => deleteDialog.value = $event)
          }, {
            default: require$$0.withCtx(() => [
              require$$0.createVNode(_component_v_card, null, {
                default: require$$0.withCtx(() => [
                  require$$0.createVNode(_component_v_card_title, null, {
                    default: require$$0.withCtx(() => _cache[4] || (_cache[4] = [
                      require$$0.createTextVNode("Delete Block")
                    ])),
                    _: 1,
                    __: [4]
                  }),
                  require$$0.createVNode(_component_v_card_text, null, {
                    default: require$$0.withCtx(() => _cache[5] || (_cache[5] = [
                      require$$0.createTextVNode(" Are you sure you want to delete this block? This action cannot be undone. ")
                    ])),
                    _: 1,
                    __: [5]
                  }),
                  require$$0.createVNode(_component_v_card_actions, null, {
                    default: require$$0.withCtx(() => [
                      require$$0.createVNode(_component_v_button, {
                        secondary: "",
                        onClick: _cache[2] || (_cache[2] = ($event) => deleteDialog.value = false)
                      }, {
                        default: require$$0.withCtx(() => _cache[6] || (_cache[6] = [
                          require$$0.createTextVNode("Cancel")
                        ])),
                        _: 1,
                        __: [6]
                      }),
                      require$$0.createVNode(_component_v_button, {
                        danger: "",
                        onClick: require$$0.unref(confirmDeleteItem)
                      }, {
                        default: require$$0.withCtx(() => _cache[7] || (_cache[7] = [
                          require$$0.createTextVNode("Delete")
                        ])),
                        _: 1,
                        __: [7]
                      }, 8, ["onClick"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["model-value"])
        ]);
      };
    }
  });
  const InterfaceComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c46ea694"]]);
  const index = extensionsSdk.defineInterface({
    id: "expandable-blocks",
    name: "Expandable Blocks",
    icon: "dashboard_customize",
    description: "M2A interface with inline expandable editing",
    component: InterfaceComponent,
    types: ["alias"],
    localTypes: ["m2a"],
    group: "relational",
    relational: true,
    options: ({ relations, field, collections, stores }) => {
      const rels = relations || {};
      const fieldMeta = field || {};
      fieldMeta.field;
      const { useCollections } = stores || {};
      const collectionsStore = useCollections ? useCollections() : null;
      let allowedCollections = [];
      if (rels.m2o?.meta?.one_allowed_collections) {
        allowedCollections = rels.m2o.meta.one_allowed_collections;
      }
      const getAllAvailableCollections = () => {
        if (!collectionsStore) {
          return [];
        }
        const allCollections = collectionsStore.collections || [];
        return allCollections.filter((col) => {
          return !col.collection.startsWith("directus_") && col.meta?.hidden !== true && col.collection !== "extra_undefined";
        }).map((col) => {
          const displayName = col.meta?.display_template || col.meta?.name || col.name || col.collection.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
          return {
            text: displayName,
            value: col.collection
          };
        }).sort((a, b) => a.text.localeCompare(b.text));
      };
      const allowedChoices = Array.isArray(allowedCollections) && allowedCollections.length > 0 ? allowedCollections.map((collectionName) => ({
        text: collectionName.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "),
        value: collectionName
      })) : getAllAvailableCollections();
      const isNewField = allowedCollections.length === 0;
      const getCollectionNote = () => {
        if (allowedCollections.length > 0) {
          return "Select which collections to allow as blocks. Leave empty to use all M2A configured collections.";
        }
        return "This field will automatically use all collections configured in the M2A relationship after saving.";
      };
      const baseOptions = [
        {
          field: "enableSorting",
          name: "Enable Sorting",
          type: "boolean",
          meta: {
            interface: "boolean",
            options: {
              label: "Allow drag & drop reordering"
            },
            width: "half",
            note: "Allow users to reorder blocks by dragging and dropping them"
          },
          schema: {
            default_value: true
          }
        },
        {
          field: "showItemId",
          name: "Show Item ID",
          type: "boolean",
          meta: {
            interface: "boolean",
            options: {
              label: "Display the item ID in block headers"
            },
            width: "half",
            note: "Shows the actual item ID (not junction ID) in the block header"
          },
          schema: {
            default_value: true
          }
        },
        /*
        {
          field: 'startExpanded',
          name: 'Start Expanded',
          type: 'boolean',
          meta: {
            interface: 'boolean',
            options: {
              label: 'Expand all blocks by default'
            },
            width: 'half',
            note: 'When enabled, all blocks will be expanded when the page loads'
          },
          schema: {
            default_value: false
          }
        },
        */
        {
          field: "accordionMode",
          name: "Accordion Mode",
          type: "boolean",
          meta: {
            interface: "boolean",
            options: {
              label: "Only allow one expanded block at a time"
            },
            width: "half",
            note: "When enabled, expanding one block will automatically collapse all others"
          },
          schema: {
            default_value: false
          }
        },
        {
          field: "showFieldsFilter",
          name: "Show Only Specific Fields",
          type: "json",
          meta: {
            interface: "tags",
            options: {
              placeholder: "Enter field names..."
            },
            width: "full",
            note: "Specify which fields to display in the inline editor. Leave empty to show all editable fields"
          },
          schema: {
            default_value: null
          }
        },
        /*
        {
          field: 'compactMode',
          name: 'Compact Mode',
          type: 'boolean',
          meta: {
            interface: 'boolean',
            options: {
              label: 'Use compact display'
            },
            width: 'half',
            note: 'Reduces the height of block headers and hides some metadata for a more compact view'
          },
          schema: {
            default_value: false
          }
        },
        */
        {
          field: "isAllowedDelete",
          name: "Allow Delete",
          type: "boolean",
          meta: {
            interface: "boolean",
            options: {
              label: "Allow users to delete blocks"
            },
            width: "half",
            note: "When disabled, users cannot delete existing blocks"
          },
          schema: {
            default_value: true
          }
        },
        {
          field: "isAllowedDuplicate",
          name: "Allow Duplicate",
          type: "boolean",
          meta: {
            interface: "boolean",
            options: {
              label: "Allow users to duplicate blocks"
            },
            width: "half",
            note: "When disabled, users cannot duplicate existing blocks"
          },
          schema: {
            default_value: true
          }
        },
        {
          field: "maxBlocks",
          name: "Maximum Blocks",
          type: "integer",
          meta: {
            interface: "input",
            options: {
              placeholder: "Leave empty for unlimited",
              min: 0
            },
            width: "half",
            note: "Maximum number of blocks allowed. Leave empty for unlimited blocks"
          },
          schema: {
            default_value: null
          }
        }
      ];
      if (!isNewField) {
        baseOptions.push({
          field: "allowedCollections",
          name: "Allowed Collections",
          type: "json",
          meta: {
            width: "full",
            interface: "select-multiple-checkbox",
            options: {
              choices: allowedChoices
            },
            note: getCollectionNote()
          },
          schema: {
            default_value: null
          }
        });
      }
      return baseOptions;
    }
  });
  return index;
});
//# sourceMappingURL=index.umd.cjs.map
