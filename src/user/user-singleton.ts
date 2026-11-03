/**
 * User provider singleton.
 *
 * Most apps just push the current user with `setCurrentUser({ userId,
 * isLoggedIn })` from wherever they know it (a Firebase auth effect, a wallet
 * connection effect, …) and read it back through `getUserProvider()`. Apps with
 * their own reactive source may register a custom `UserProvider` via
 * `setUserProvider()`.
 *
 * @example
 * ```typescript
 * // Firebase app, at the auth boundary:
 * setCurrentUser({ userId: user?.uid, isLoggedIn: isRealUser(user) });
 * // Wallet app:
 * setCurrentUser({ userId: walletAddress, isLoggedIn: isConnected });
 * // Any library:
 * const uid = getUserProvider().getUserId();
 * ```
 */

import type { CurrentUser, UserProvider } from './user.js';

/** Built-in provider that holds a pushed snapshot and notifies subscribers. */
class MutableUserProvider implements UserProvider {
  private state: CurrentUser = { userId: undefined, isLoggedIn: false };
  private readonly listeners = new Set<() => void>();

  getUserId(): string | undefined {
    return this.state.userId;
  }

  isLoggedIn(): boolean {
    return this.state.isLoggedIn;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  set(next: CurrentUser): void {
    if (
      this.state.userId === next.userId &&
      this.state.isLoggedIn === next.isLoggedIn
    ) {
      return;
    }
    this.state = next;
    for (const listener of this.listeners) listener();
  }
}

const defaultProvider = new MutableUserProvider();
let provider: UserProvider | null = null;

/**
 * Register a custom user provider (e.g. one wrapping an existing reactive auth
 * source). Optional — apps that push via `setCurrentUser` don't need this.
 */
export function setUserProvider(implementation: UserProvider): void {
  provider = implementation;
}

/** Get the active user provider (the registered one, or the built-in default). */
export function getUserProvider(): UserProvider {
  return provider ?? defaultProvider;
}

/**
 * Push the current user into the built-in provider. No-op if a custom provider
 * was registered (set it through your own provider instead).
 */
export function setCurrentUser(next: CurrentUser): void {
  defaultProvider.set(next);
}

/** Reset to the built-in provider with no user (for testing / sign-out teardown). */
export function resetUserProvider(): void {
  provider = null;
  defaultProvider.set({ userId: undefined, isLoggedIn: false });
}
