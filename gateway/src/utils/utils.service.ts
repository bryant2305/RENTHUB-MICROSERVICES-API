import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class UtilsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOrSetCache(key: string, fetchData: () => Promise<any>) {
    const cachedData = await this.cacheManager.get(key);
    if (cachedData) {
      return cachedData;
    }

    const data = await fetchData();
    if (data) {
      await this.cacheManager.set(key, data, 60); // O usa un TTL dinámico
    }

    return data;
  }
}
