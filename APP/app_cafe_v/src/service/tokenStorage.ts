const TOKEN_KEY = '@token';

type TokenStorage = {
  get: () => Promise<string | null>;
  set: (value: string) => Promise<void>;
  clear: () => Promise<void>;
};

// Works in native + web. Avoids crashing when AsyncStorage native module is unavailable.
export const tokenStorage: TokenStorage = {
  async get() {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      try {
        return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
      } catch {
        return null;
      }
    }
  },

  async set(value: string) {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem(TOKEN_KEY, value);
      return;
    } catch {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(TOKEN_KEY, value);
      } catch {
        // ignore
      }
    }
  },

  async clear() {
    return this.set('');
  },
};

