import NodeCache from 'node-cache';

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl === undefined) {
      return this.cache.set(key, value);
    }
    return this.cache.set(key, value, ttl);
  }
}

export const cacheService = new CacheService(); 
