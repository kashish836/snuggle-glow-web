/**
 * Client-Side Rate Limiting Module
 * 
 * SECURITY: Implements rate limiting for client-side protection
 * - IP-based limiting (simulated via fingerprint)
 * - User-based limiting
 * - Graceful 429 responses with retry-after
 * - Exponential backoff for repeat offenders
 * 
 * NOTE: This is client-side rate limiting for UX protection.
 * Server-side rate limiting should also be implemented for true security.
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Block duration in milliseconds when limit exceeded */
  blockDurationMs: number;
  /** Whether to use exponential backoff for repeat offenders */
  exponentialBackoff?: boolean;
}

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

/**
 * Sensible defaults for different endpoint types
 * SECURITY: Conservative limits to prevent abuse
 */
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Auth endpoints - strict limits to prevent brute force
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
    exponentialBackoff: true,
  },
  // Profile updates - moderate limits
  profile: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 60 * 1000, // 1 minute
  },
  // Contact form - prevent spam
  contact: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
    exponentialBackoff: true,
  },
  // General API calls
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
    blockDurationMs: 60 * 1000, // 1 minute
  },
  // Newsletter signup
  newsletter: {
    maxRequests: 2,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
};

// ============================================================================
// RATE LIMITER CLASS
// ============================================================================

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: number | null = null;

  constructor() {
    // Clean up expired entries every minute
    if (typeof window !== 'undefined') {
      this.cleanupInterval = window.setInterval(() => this.cleanup(), 60 * 1000);
    }
  }

  /**
   * Generates a unique key for rate limiting
   * Combines endpoint, optional user ID, and browser fingerprint
   */
  private generateKey(endpoint: string, userId?: string): string {
    const fingerprint = this.getBrowserFingerprint();
    const userPart = userId ? `user:${userId}` : 'anon';
    return `${endpoint}:${userPart}:${fingerprint}`;
  }

  /**
   * Simple browser fingerprint for client-side tracking
   * SECURITY: Not for security-critical decisions, just UX rate limiting
   */
  private getBrowserFingerprint(): string {
    if (typeof window === 'undefined') return 'server';
    
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
    ];
    
    // Simple hash
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Checks if a request should be allowed
   * Returns rate limit result with retry-after if blocked
   */
  check(
    endpoint: string,
    config: RateLimitConfig = RATE_LIMIT_CONFIGS.api,
    userId?: string
  ): RateLimitResult {
    const key = this.generateKey(endpoint, userId);
    const now = Date.now();
    const entry = this.store.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
      const retryAfterSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfter: retryAfterSeconds,
        message: `Too many requests. Please try again in ${this.formatDuration(retryAfterSeconds)}.`,
      };
    }

    // Reset or create entry if window expired
    if (!entry || now - entry.firstRequest > config.windowMs) {
      this.store.set(key, {
        count: 1,
        firstRequest: now,
        lastRequest: now,
        blocked: false,
      });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
      };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      // Calculate block duration with optional exponential backoff
      let blockDuration = config.blockDurationMs;
      if (config.exponentialBackoff && entry.blocked) {
        // Double block time for repeat offenders (max 1 hour)
        blockDuration = Math.min(blockDuration * 2, 60 * 60 * 1000);
      }

      const blockedUntil = now + blockDuration;
      const retryAfterSeconds = Math.ceil(blockDuration / 1000);

      this.store.set(key, {
        ...entry,
        blocked: true,
        blockedUntil,
        lastRequest: now,
      });

      return {
        allowed: false,
        remaining: 0,
        retryAfter: retryAfterSeconds,
        message: `Too many requests. Please try again in ${this.formatDuration(retryAfterSeconds)}.`,
      };
    }

    // Increment counter
    this.store.set(key, {
      ...entry,
      count: entry.count + 1,
      lastRequest: now,
    });

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count - 1,
    };
  }

  /**
   * Formats duration in human-readable format
   */
  private formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
    return `${Math.ceil(seconds / 3600)} hours`;
  }

  /**
   * Cleans up expired entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 60 * 1000; // 1 hour

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastRequest > maxAge) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Resets rate limit for a specific endpoint/user
   * Useful for successful password changes, etc.
   */
  reset(endpoint: string, userId?: string): void {
    const key = this.generateKey(endpoint, userId);
    this.store.delete(key);
  }

  /**
   * Destroys the rate limiter and cleans up
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// ============================================================================
// TYPES & EXPORTS
// ============================================================================

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Number of requests remaining in the window */
  remaining: number;
  /** Seconds until the rate limit resets (if blocked) */
  retryAfter?: number;
  /** User-friendly message (if blocked) */
  message?: string;
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * React hook for rate limiting
 */
export function useRateLimit() {
  return {
    check: (
      endpoint: string,
      config?: RateLimitConfig,
      userId?: string
    ): RateLimitResult => rateLimiter.check(endpoint, config, userId),
    reset: (endpoint: string, userId?: string) => rateLimiter.reset(endpoint, userId),
    configs: RATE_LIMIT_CONFIGS,
  };
}
