/**
 * Mock implementations for environment interfaces.
 *
 * @ai-context Test mocks for EnvProvider, EnvFactory, EnvUtils
 * @ai-usage Use in unit tests to mock environment configuration
 */

import type { Optional } from '@sudobility/types';
import type {
  EnvProvider,
  AppConfig,
  EnvironmentVariables,
  FirebaseConfig,
  EnvFactory,
  EnvUtils,
} from '../env.js';

/**
 * Mock implementation of EnvProvider for testing.
 *
 * @example
 * ```typescript
 * const mockEnv = new MockEnvProvider({ NODE_ENV: 'test', API_URL: 'http://localhost' });
 * expect(mockEnv.isTest()).toBe(true);
 * expect(mockEnv.get('API_URL')).toBe('http://localhost');
 * ```
 */
export class MockEnvProvider implements EnvProvider {
  private variables: EnvironmentVariables;

  constructor(variables: EnvironmentVariables = { NODE_ENV: 'test' }) {
    this.variables = variables;
  }

  get<K extends keyof EnvironmentVariables>(
    key: K,
    defaultValue?: Optional<string>
  ): Optional<EnvironmentVariables[K] | string> {
    const value = this.variables[key as string];
    return value !== undefined ? value : defaultValue;
  }

  isDevelopment(): boolean {
    return this.variables.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return this.variables.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return this.variables.NODE_ENV === 'test';
  }

  getAll(): EnvironmentVariables {
    return { ...this.variables };
  }

  // Test helper methods

  /**
   * Set an environment variable for testing
   */
  setVariable(key: string, value: Optional<string>): void {
    this.variables[key] = value;
  }

  /**
   * Reset to initial state
   */
  reset(variables: EnvironmentVariables = { NODE_ENV: 'test' }): void {
    this.variables = variables;
  }
}

/**
 * Creates a default mock FirebaseConfig for testing.
 */
export function createMockFirebaseConfig(
  overrides: Partial<FirebaseConfig> = {}
): FirebaseConfig {
  return {
    apiKey: 'mock-api-key',
    authDomain: 'mock-project.firebaseapp.com',
    projectId: 'mock-project',
    storageBucket: 'mock-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
    measurementId: 'G-MOCK123',
    vapidKey: 'mock-vapid-key',
    ...overrides,
  };
}

/**
 * Creates a default mock AppConfig for testing.
 */
export function createMockAppConfig(
  overrides: Partial<AppConfig> = {}
): AppConfig {
  return {
    wildDuckBackendUrl: 'http://localhost:3000',
    indexerBackendUrl: 'http://localhost:3001',
    walletConnectProjectId: 'mock-walletconnect-id',
    privyAppId: 'mock-privy-id',
    firebase: createMockFirebaseConfig(overrides.firebase),
    useCloudflareWorker: false,
    cloudflareWorkerUrl: 'http://localhost:8787',
    useMockFallback: true,
    ...overrides,
  };
}

/**
 * Mock implementation of EnvFactory for testing.
 *
 * @example
 * ```typescript
 * const factory = new MockEnvFactory();
 * const provider = factory.createEnvProvider();
 * const config = factory.createAppConfig(provider);
 * ```
 */
export class MockEnvFactory implements EnvFactory {
  private platform: 'web' | 'react-native' | 'node' = 'node';
  private envProvider: MockEnvProvider;
  private appConfig: AppConfig;

  constructor(
    variables: EnvironmentVariables = { NODE_ENV: 'test' },
    configOverrides: Partial<AppConfig> = {}
  ) {
    this.envProvider = new MockEnvProvider(variables);
    this.appConfig = createMockAppConfig(configOverrides);
  }

  createEnvProvider(): EnvProvider {
    return this.envProvider;
  }

  createAppConfig(_envProvider: EnvProvider): AppConfig {
    return this.appConfig;
  }

  detectPlatform(): 'web' | 'react-native' | 'node' {
    return this.platform;
  }

  // Test helper methods

  /**
   * Set the platform for testing
   */
  setPlatform(platform: 'web' | 'react-native' | 'node'): void {
    this.platform = platform;
  }

  /**
   * Update the app config for testing
   */
  setAppConfig(config: Partial<AppConfig>): void {
    this.appConfig = { ...this.appConfig, ...config };
  }

  /**
   * Get the underlying MockEnvProvider for direct manipulation
   */
  getEnvProvider(): MockEnvProvider {
    return this.envProvider;
  }
}

/**
 * Mock implementation of EnvUtils for testing.
 *
 * @example
 * ```typescript
 * const utils = new MockEnvUtils({ NODE_ENV: 'development' });
 * expect(utils.isDevelopment()).toBe(true);
 * ```
 */
export class MockEnvUtils implements EnvUtils {
  private variables: EnvironmentVariables;

  constructor(variables: EnvironmentVariables = { NODE_ENV: 'test' }) {
    this.variables = variables;
  }

  isDevelopment(): boolean {
    return this.variables.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return this.variables.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return this.variables.NODE_ENV === 'test';
  }

  get(key: string, defaultValue?: Optional<string>): Optional<string> {
    const value = this.variables[key];
    return value !== undefined ? value : defaultValue;
  }

  // Test helper methods

  /**
   * Set an environment variable for testing
   */
  setVariable(key: string, value: Optional<string>): void {
    this.variables[key] = value;
  }

  /**
   * Reset to initial state
   */
  reset(variables: EnvironmentVariables = { NODE_ENV: 'test' }): void {
    this.variables = variables;
  }
}
