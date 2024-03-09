"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KVSTORE = void 0;
class KeyValueStore {
    constructor() {
        this.store = new Map();
    }
    // Sets the value for the key in the store
    set(key, value) {
        this.store.set(key, value);
    }
    // Gets the value associated with the key
    get(key) {
        return this.store.get(key);
    }
    // Checks if the key exists in the store
    has(key) {
        return this.store.has(key);
    }
    // Removes the value associated with the key
    delete(key) {
        return this.store.delete(key);
    }
    // Clears all key-value pairs in the store
    clear() {
        this.store.clear();
    }
    // Optionally, expose the keys or values
    keys() {
        return this.store.keys();
    }
    values() {
        return this.store.values();
    }
}
exports.KVSTORE = new KeyValueStore();
exports.default = KeyValueStore;
