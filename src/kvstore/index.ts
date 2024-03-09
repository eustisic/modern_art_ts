class KeyValueStore<K, V> {
  private store: Map<K, V>;

  constructor() {
    this.store = new Map<K, V>();
  }

  // Sets the value for the key in the store
  public set(key: K, value: V): void {
    this.store.set(key, value);
  }

  // Gets the value associated with the key
  public get(key: K): V | undefined {
    return this.store.get(key);
  }

  // Checks if the key exists in the store
  public has(key: K): boolean {
    return this.store.has(key);
  }

  // Removes the value associated with the key
  public delete(key: K): boolean {
    return this.store.delete(key);
  }

  // Clears all key-value pairs in the store
  public clear(): void {
    this.store.clear();
  }

  // Optionally, expose the keys or values
  public keys(): IterableIterator<K> {
    return this.store.keys();
  }

  public values(): IterableIterator<V> {
    return this.store.values();
  }
}

export const KVSTORE = new KeyValueStore<string, string>()

export default KeyValueStore