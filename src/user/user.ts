/**
 * User provider interface — the fleet's platform-agnostic notion of "who is
 * the current user", independent of how they authenticated (Firebase, a crypto
 * wallet, or anything else).
 *
 * @ai-context Dependency-injection seam so libraries (e.g. subscription_lib)
 * can read the current user without depending on a specific auth library.
 * @ai-pattern Singleton with an app-provided implementation + a built-in
 * mutable default the app can simply push state into.
 */

/** The current user's identity + login state, as any auth system maps it. */
export interface UserProvider {
  /**
   * The current user's id — a Firebase uid, a wallet address, etc. — or
   * `undefined` when there is no user at all.
   */
  getUserId(): string | undefined;
  /**
   * Whether the current user is "logged in": a real, identified account rather
   * than an anonymous/guest session. (Firebase: a non-anonymous user. Wallet:
   * a connected wallet.) An anonymous user may have a `userId` but be `false`.
   */
  isLoggedIn(): boolean;
  /**
   * Subscribe to changes in user id / login state. Returns an unsubscribe.
   */
  subscribe(listener: () => void): () => void;
}

/** The pushable snapshot an app sets via `setCurrentUser`. */
export interface CurrentUser {
  userId: string | undefined;
  isLoggedIn: boolean;
}
