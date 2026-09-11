
import { reactive, watch } from 'vue'
import { SESSION_STORAGE_KEY, isTokenExpired } from './session.utils'

const savedSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
const initialData =
  savedSession ? JSON.parse(savedSession)
    : {
      user: '',
      token: '',
      expireAt: null,
      isAuthenticated: false,
      theme: 1 // light
    }

const sessionState = reactive(initialData)

watch(
  sessionState,
  (newValue) => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newValue))
  },
  { deep: true }
)


/**
 * Session management object.
 * Provides methods to manage user session, including login, logout, and session state retrieval.
 * All of the session data is stored in the browser's sessionStorage and is reactive within the application.
 * Any get will check for session expiration and automatically log out the user if the session has expired.
 */
const session = {
  login(userData, tokenData, expireAt) {
    sessionState.user = userData
    sessionState.token = tokenData
    sessionState.expireAt = expireAt
    sessionState.isAuthenticated = true
  },
  logout() {
    sessionState.user = null
    sessionState.token = null
    sessionState.expireAt = null
    sessionState.isAuthenticated = false
    sessionStorage.removeItem(SESSION_STORAGE_KEY) // Clear storage completely
  },
  /**
   * Get the current session state.
   * This method also checks if the session has expired and logs out the user if it has.
   * @returns {object} The session state.
   */
  get() {
    if (isTokenExpired(sessionState.expireAt)) {
      console.warn('Session has expired. Logging out.');
      session.logout();
    }
    return sessionState;
  },
  /**
   * Get the user of the session.
   * @returns {object|null} The user, or null if not set.
   */
  getUser() {
    return session.get().user;
  },
  /**
   * Get the token of the session.
   * @returns {string|null} The token, or null if not set.
   */
  getToken() {
    return session.get().token;
  },
  /**
   * Check if the user is authenticated.
   * This method also checks if the session has expired and logs out the user if it has.
   * @returns {boolean} True if authenticated, false otherwise.
   */
  isAuthenticated() {
    return session.get().isAuthenticated;
  },
  /**
   * Get the expiration time of the session.
   * @returns {Date|null} The expiration time, or null if not set.
   */
  getExpireAt() {
    return session.get().expireAt;
  },
}

export default session;