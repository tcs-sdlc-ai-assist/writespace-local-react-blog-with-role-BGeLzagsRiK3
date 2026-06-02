import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, setSession, clearSession } from './auth';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns null when localStorage contains corrupted session data', () => {
      localStorage.setItem('writespace_session', '{not valid json!!!');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage throws an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns session with admin role correctly', () => {
      const session = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
      expect(result.role).toBe('admin');
    });
  });

  describe('setSession', () => {
    it('saves session object to localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };

      setSession(session);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('overwrites existing session in localStorage', () => {
      const initialSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(initialSession));

      const newSession = {
        userId: 'user2',
        username: 'bob',
        displayName: 'Bob',
        role: 'admin',
      };
      setSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
    });

    it('handles localStorage unavailability gracefully on save', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      expect(() =>
        setSession({
          userId: 'user1',
          username: 'alice',
          displayName: 'Alice',
          role: 'user',
        })
      ).not.toThrow();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const session = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('handles localStorage unavailability gracefully on clear', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      expect(() => clearSession()).not.toThrow();
    });
  });

  describe('setSession and getSession round-trip', () => {
    it('retrieves the same session that was saved', () => {
      const session = {
        userId: 'user1',
        username: 'roundtrip',
        displayName: 'Round Trip User',
        role: 'user',
      };

      setSession(session);
      const result = getSession();

      expect(result).toEqual(session);
    });
  });

  describe('clearSession and getSession round-trip', () => {
    it('returns null after session is cleared', () => {
      const session = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };

      setSession(session);
      expect(getSession()).toEqual(session);

      clearSession();
      expect(getSession()).toBeNull();
    });
  });
});