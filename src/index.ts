/**
 * @johnqh/di - Platform-agnostic dependency injection interfaces
 *
 * This library provides abstract TypeScript interfaces for dependency injection
 * patterns that work across web and React Native platforms.
 */

// Core types and enums
export * from './types.js';

// Environment interfaces
export * from './env.js';

// Analytics interfaces
export * from './analytics/analytics.js';
export * from './analytics/platform-analytics.js';

// Navigation interfaces
export * from './navigation/navigation.js';

// Network interfaces
export * from './network/platform-network.js';

// Notification interfaces
export * from './notification/notification.js';
export * from './notification/platform-notifications.js';

// Storage interfaces
export * from './storage/storage.js';

// Info interfaces
export * from './info/index.js';

// Alert interfaces
export * from './alert/index.js';

// Current-user provider (platform-agnostic: Firebase, wallet, …)
export * from './user/index.js';

// Theme interfaces
export * from './theme/platform-theme.js';

// Logging interfaces
export * from './logging/index.js';

// React hooks
export * from './hooks/index.js';

// Utility functions
export * from './utils/index.js';

// Mock implementations for testing
export * from './mocks/index.js';
