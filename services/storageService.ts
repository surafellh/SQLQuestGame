
import { UserProfile } from '../types';

const STORAGE_KEY_USERS = 'sqlquest_users';
const STORAGE_KEY_SESSION = 'sqlquest_session_email';

// Specific admin to auto-seed ensures you always have access
const ADMIN_EMAIL = 'srflhb22@gmail.com';

export const storageService = {
  /**
   * Loads users from local storage (or Cloud in future).
   * Automatically re-creates the primary admin account if missing.
   */
  getUsers: (): UserProfile[] => {
    let users: UserProfile[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        users = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load users", e);
    }

    // Auto-seed admin if missing (Ensures persistence for the requested user)
    if (!users.find(u => u.email === ADMIN_EMAIL)) {
      const adminUser: UserProfile = {
        id: 'admin_permanent',
        email: ADMIN_EMAIL,
        name: 'Super Admin',
        role: 'admin',
        level: 50,
        xp: 50000,
        stars: 100,
        completedChallenges: [],
        joinDate: new Date().toISOString(),
        avatar: 'bg-gradient-to-tr from-red-600 to-orange-600',
        theme: 'midnight'
      };
      users.push(adminUser);
      // Save back immediately so it persists
      try {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
      } catch (e) {}
    }
    
    return users;
  },

  /**
   * Saves the user list to storage.
   */
  saveUsers: (users: UserProfile[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users", e);
    }
  },

  /**
   * Retrieves the currently logged in user based on session token (email).
   */
  getSessionUser: (users: UserProfile[]): UserProfile | null => {
    try {
      const email = localStorage.getItem(STORAGE_KEY_SESSION);
      if (email) {
        return users.find(u => u.email === email) || null;
      }
    } catch (e) {}
    return null;
  },

  /**
   * Sets the active session.
   */
  setSessionUser: (user: UserProfile | null) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_SESSION, user.email);
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch (e) {}
  }
};
