import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when localStorage has no posts', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Hello world',
          authorId: 'user1',
          authorName: 'User One',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Another Post',
          content: 'More content',
          authorId: 'user2',
          authorName: 'User Two',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted data', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('handles localStorage unavailability gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      const result = getPosts();
      expect(result).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Hello world',
          authorId: 'user1',
          authorName: 'User One',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      savePosts(posts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('overwrites existing posts in localStorage', () => {
      const initialPosts = [{ id: '1', title: 'Old Post' }];
      localStorage.setItem('writespace_posts', JSON.stringify(initialPosts));

      const newPosts = [{ id: '2', title: 'New Post' }];
      savePosts(newPosts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(newPosts);
      expect(stored).toHaveLength(1);
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('handles localStorage unavailability gracefully on save', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      expect(() => savePosts([{ id: '1' }])).not.toThrow();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when localStorage has no users', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns parsed users array from localStorage', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'u2',
          displayName: 'Bob',
          username: 'bob',
          password: 'pass456',
          role: 'admin',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted user data', () => {
      localStorage.setItem('writespace_users', '<<<corrupted>>>');

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('handles localStorage unavailability gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      const result = getUsers();
      expect(result).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      saveUsers(users);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('overwrites existing users in localStorage', () => {
      const initialUsers = [{ id: 'u1', username: 'old' }];
      localStorage.setItem('writespace_users', JSON.stringify(initialUsers));

      const newUsers = [{ id: 'u2', username: 'new' }];
      saveUsers(newUsers);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(newUsers);
      expect(stored).toHaveLength(1);
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });

    it('handles localStorage unavailability gracefully on save', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      expect(() => saveUsers([{ id: 'u1' }])).not.toThrow();
    });
  });

  describe('savePosts and getPosts round-trip', () => {
    it('retrieves the same data that was saved', () => {
      const posts = [
        {
          id: 'p1',
          title: 'Round Trip Post',
          content: 'Testing round trip',
          authorId: 'user1',
          authorName: 'Tester',
          createdAt: '2024-06-15T12:00:00.000Z',
        },
      ];

      savePosts(posts);
      const result = getPosts();

      expect(result).toEqual(posts);
    });
  });

  describe('saveUsers and getUsers round-trip', () => {
    it('retrieves the same data that was saved', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Round Trip User',
          username: 'roundtrip',
          password: 'secret',
          role: 'user',
          createdAt: '2024-06-15T12:00:00.000Z',
        },
      ];

      saveUsers(users);
      const result = getUsers();

      expect(result).toEqual(users);
    });
  });
});