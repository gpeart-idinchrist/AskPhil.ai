import type { DataStore } from "../types.js";
/** Load the data store from disk (or return defaults) */
export declare function loadStore(): DataStore;
/** Persist the data store to disk */
export declare function saveStore(store: DataStore): void;
/** Helper: paginate an array of items */
export declare function paginate<T>(items: T[], offset: number, limit: number): {
    items: T[];
    total: number;
    count: number;
    has_more: boolean;
    next_offset?: number;
};
//# sourceMappingURL=storage.d.ts.map