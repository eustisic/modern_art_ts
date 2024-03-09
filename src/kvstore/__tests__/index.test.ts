import KeyValueStore from "..";


describe("KeyValueStore", () => {
  let store: KeyValueStore<number, string>
  beforeEach(() => {
    store = new KeyValueStore<number, string>()
  }) 

  it('should set and get a value by key', () => {
    store.set(1, 'one');
    expect(store.get(1)).toBe('one');
  });

  it('should return undefined for a non-existent key', () => {
    expect(store.get(2)).toBeUndefined();
  });

  it('should overwrite previous value with same key', () => {
    store.set(1, 'one');
    store.set(1, 'uno');
    expect(store.get(1)).toBe('uno');
  });

  it('should check if a key exists', () => {
    store.set(1, 'one');
    expect(store.has(1)).toBeTruthy();
    expect(store.has(2)).toBeFalsy();
  });

  it('should delete a key-value pair', () => {
    store.set(1, 'one');
    const result = store.delete(1);
    expect(result).toBeTruthy();
    expect(store.get(1)).toBeUndefined();
  });

  it('should clear all key-value pairs', () => {
    store.set(1, 'one');
    store.set(2, 'two');
    store.clear();
    expect(store.get(1)).toBeUndefined();
    expect(store.get(2)).toBeUndefined();
  });

  it('should return iterable keys', () => {
    store.set(1, 'one');
    store.set(2, 'two');
    const keys = Array.from(store.keys());
    expect(keys).toEqual([1, 2]);
  });

  it('should return iterable values', () => {
    store.set(1, 'one');
    store.set(2, 'two');
    const values = Array.from(store.values());
    expect(values).toEqual(['one', 'two']);
  });
})