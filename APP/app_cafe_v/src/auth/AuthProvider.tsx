import { router } from 'expo-router';
import { createContext, type ReactNode, type RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { tokenStorage } from '@/src/service/tokenStorage';

const AuthContext = createContext<{
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  token: RefObject<string | null> | null;
  isLoading: boolean;
}>({
  signIn: async () => undefined,
  signOut: async () => undefined,
  token: null,
  isLoading: true,
});

export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const tokenRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await tokenStorage.get();
      tokenRef.current = token && token.length > 0 ? token : null;
      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (token: string) => {
    await tokenStorage.set(token);
    tokenRef.current = token;
    router.replace('/');
  }, []);

  const signOut = useCallback(async () => {
    await tokenStorage.clear();
    tokenRef.current = null;
    router.replace('/login');
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, token: tokenRef, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

