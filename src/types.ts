/**
 * Core type definitions for dependency injection interfaces
 * Platform-agnostic types that work across web and React Native
 *
 * @ai-context Core types and enums for cross-platform dependency injection
 * @ai-platform Universal compatibility (Web, React Native, Node.js)
 * @ai-pattern Type definitions with runtime enum support
 */

// Import utility types from @sudobility/types (used internally, not re-exported)
import type { Optional } from '@sudobility/types';

/**
 * Environment variables interface with typed NODE_ENV and flexible additional properties.
 *
 * @ai-interface-type Configuration Data Type
 * @ai-pattern Flexible configuration with typed common properties
 * @ai-security Environment variables may contain sensitive data
 */
export interface EnvironmentVariables {
  /** Node.js environment setting with strict typing */
  NODE_ENV?: Optional<'development' | 'production' | 'test'>;
  /** Additional environment variables with flexible string keys */
  [key: string]: Optional<string>;
}

/**
 * Environment provider interface for accessing and validating environment configuration.
 *
 * Provides type-safe access to environment variables with runtime environment detection.
 * Essential for configuration management across different deployment environments.
 *
 * @ai-interface-type Service Provider
 * @ai-pattern Environment abstraction with type safety
 * @ai-use-case Configuration management, environment detection
 *
 * @example
 * ```typescript
 * class NodeEnvProvider implements EnvProvider {
 *   get(key: string, defaultValue?: string) {
 *     return process.env[key] ?? defaultValue;
 *   }
 *   isDevelopment() { return this.get('NODE_ENV') === 'development'; }
 * }
 * ```
 */
export interface EnvProvider {
  /**
   * Get environment variable with type-safe key access.
   *
   * @param key Environment variable key (typed when using EnvironmentVariables keys)
   * @param defaultValue Default value if environment variable is not set
   * @returns Environment variable value or default
   *
   * @ai-pattern Type-safe configuration access
   * @ai-generics Uses generic constraints for type safety
   */
  get<K extends keyof EnvironmentVariables>(
    key: K,
    defaultValue?: Optional<string>
  ): Optional<EnvironmentVariables[K] | string>;

  /**
   * Check if currently running in development environment.
   *
   * @returns true if NODE_ENV is 'development'
   * @ai-pattern Environment detection
   */
  isDevelopment(): boolean;

  /**
   * Check if currently running in production environment.
   *
   * @returns true if NODE_ENV is 'production'
   * @ai-pattern Environment detection
   */
  isProduction(): boolean;

  /**
   * Check if currently running in test environment.
   *
   * @returns true if NODE_ENV is 'test'
   * @ai-pattern Environment detection
   */
  isTest(): boolean;

  /**
   * Get all environment variables as a typed object.
   *
   * @returns Complete environment variables object
   * @ai-pattern Bulk configuration access
   * @ai-security Be cautious when exposing all environment variables
   */
  getAll(): EnvironmentVariables;
}

/**
 * Firebase service configuration interface.
 *
 * Contains all necessary configuration for Firebase services including
 * authentication, analytics, messaging, and web push notifications.
 *
 * @ai-interface-type Configuration Data Type
 * @ai-service Firebase configuration
 * @ai-security Contains sensitive API keys and configuration data
 * @ai-platform Works across web and React Native Firebase SDKs
 */
export interface FirebaseConfig {
  /** Firebase project API key */
  apiKey: string;
  /** Firebase authentication domain */
  authDomain: string;
  /** Firebase project ID */
  projectId: string;
  /** Firebase storage bucket URL */
  storageBucket: string;
  /** Firebase Cloud Messaging sender ID */
  messagingSenderId: string;
  /** Firebase application ID */
  appId: string;
  /** Google Analytics measurement ID (optional) */
  measurementId?: Optional<string>;
  /** VAPID key for web push notifications (optional) */
  vapidKey?: Optional<string>;
}

/**
 * Main application configuration interface.
 *
 * Centralizes all application configuration including API endpoints,
 * service keys, and feature flags. Designed for email/communication
 * applications with blockchain wallet integration.
 *
 * @ai-interface-type Configuration Data Type
 * @ai-pattern Centralized application configuration
 * @ai-security Contains multiple sensitive API keys and tokens
 * @ai-domain Email applications with blockchain/crypto integration
 *
 * @example
 * ```typescript
 * const config: AppConfig = {
 *   wildDuckBackendUrl: 'https://api.myemailapp.com',
 *   indexerBackendUrl: 'https://indexer.myapp.com',
 *   // ... other required configuration
 * };
 * ```
 */
export interface AppConfig {
  /** Backend API URL for WildDuck email server */
  wildDuckBackendUrl: string;
  /** Backend URL for blockchain/crypto indexer service */
  indexerBackendUrl: string;

  /** WalletConnect project ID for crypto wallet integration */
  walletConnectProjectId: string;
  /** Privy application ID for authentication service */
  privyAppId: string;

  /** Complete Firebase service configuration */
  firebase: FirebaseConfig;

  /** Whether to use Cloudflare Worker for proxy/caching */
  useCloudflareWorker: boolean;
  /** Cloudflare Worker URL when enabled */
  cloudflareWorkerUrl: string;

  /** Enable mock/fallback services for development/testing */
  useMockFallback: boolean;
}

/**
 * Flexible analytics event properties interface.
 *
 * Supports arbitrary key-value pairs for analytics event metadata
 * with common data types used in analytics tracking.
 *
 * @ai-interface-type Data Container
 * @ai-pattern Flexible properties with common analytics data types
 * @ai-analytics Event metadata and context information
 */
export interface AnalyticsEventProperties {
  /** Flexible analytics properties supporting common data types */
  [key: string]: Optional<string | number | boolean>;
}
