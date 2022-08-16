export class IMap<K, V> {
  private _defaultValue: V;
  private _map: Map<K, V>;

  constructor(entries?: readonly (readonly [K, V])[] | null, defaultValue?: V) {
    this._map = new Map(entries);
    this._defaultValue = defaultValue as V;
  }

  getValue(key: K): V {
    return this.has(key) ? (this._map.get(key) as V) : this._defaultValue;
  }

  clear(): void {
    this._map.clear();
  }

  delete(key: K): boolean {
    return this._map.delete(key);
  }

  has(key: K): boolean {
    return this._map.has(key);
  }

  set(key: K, value: V): Map<K, V> {
    return this._map.set(key, value);
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown
  ): void {
    return this.forEach(callbackfn, thisArg);
  }
}
