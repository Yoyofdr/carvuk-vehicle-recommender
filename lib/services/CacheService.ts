import Redis from 'ioredis'

export class CacheService {
  private static instance: CacheService
  private redis: Redis | null = null
  private isEnabled: boolean = process.env.ENABLE_CACHE === 'true'

  private constructor() {
    if (this.isEnabled && process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL)
        this.redis.on('connect', () => {
          console.log('✅ Redis connected successfully')
        })
        this.redis.on('error', (err) => {
          console.error('❌ Redis connection error:', err)
          this.isEnabled = false
        })
      } catch (error) {
        console.error('Failed to initialize Redis:', error)
        this.isEnabled = false
      }
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.isEnabled || !this.redis) return null

    try {
      const value = await this.redis.get(key)
      if (value) {
        return JSON.parse(value) as T
      }
      return null
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    if (!this.isEnabled || !this.redis) return false

    try {
      const serialized = JSON.stringify(value)
      const defaultTTL = parseInt(process.env.REDIS_CACHE_TTL || '3600')
      const expiry = ttl || defaultTTL

      await this.redis.setex(key, expiry, serialized)
      return true
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.redis) return false

    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Clear all cache matching a pattern
   */
  async clearPattern(pattern: string): Promise<boolean> {
    if (!this.isEnabled || !this.redis) return false

    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
      return true
    } catch (error) {
      console.error(`Cache clear pattern error for ${pattern}:`, error)
      return false
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.redis) return false

    try {
      const exists = await this.redis.exists(key)
      return exists === 1
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get or set cache with callback
   */
  async getOrSet<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key)
    if (cached !== null) {
      console.log(`Cache hit for key: ${key}`)
      return cached
    }

    // Fetch fresh data
    console.log(`Cache miss for key: ${key}. Fetching fresh data...`)
    const freshData = await fetchCallback()

    // Store in cache for next time
    await this.set(key, freshData, ttl)

    return freshData
  }

  /**
   * Cache key generators
   */
  static generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `carvuk:${prefix}:${parts.join(':')}`
  }

  static vehicleKey(vehicleId: string): string {
    return this.generateKey('vehicle', vehicleId)
  }

  static vehicleSearchKey(filters: Record<string, any>): string {
    const filterStr = Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&')
    return this.generateKey('search', filterStr)
  }

  static valuationKey(vehicleId: string, date?: string): string {
    const dateStr = date || new Date().toISOString().split('T')[0]
    return this.generateKey('valuation', vehicleId, dateStr)
  }

  static customerPreferencesKey(customerId: string): string {
    return this.generateKey('customer:preferences', customerId)
  }

  static leadKey(leadId: string): string {
    return this.generateKey('lead', leadId)
  }
}

// Cache TTL configurations in seconds
export const CACHE_TTL = {
  VEHICLES: parseInt(process.env.CACHE_TTL_VEHICLES || '86400'), // 24 hours
  VALUATIONS: parseInt(process.env.CACHE_TTL_VALUATIONS || '3600'), // 1 hour
  SEARCH_RESULTS: parseInt(process.env.CACHE_TTL_SEARCH_RESULTS || '1800'), // 30 minutes
  CUSTOMER_PREFERENCES: 7200, // 2 hours
  LEADS: 300, // 5 minutes
}

// Export singleton instance
export const cache = CacheService.getInstance()