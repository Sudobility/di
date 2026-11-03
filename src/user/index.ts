/**
 * User provider module exports.
 *
 * @ai-context Platform-agnostic current-user seam for dependency injection.
 */

export { type UserProvider, type CurrentUser } from './user.js';
export {
  setUserProvider,
  getUserProvider,
  setCurrentUser,
  resetUserProvider,
} from './user-singleton.js';
