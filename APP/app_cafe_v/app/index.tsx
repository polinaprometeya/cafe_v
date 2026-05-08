import { Redirect } from 'expo-router';

import { useAuthSession } from '@/src/auth/AuthProvider';

export default function Index() {
  const { token, isLoading } = useAuthSession();
  const isAuthed = !!token?.current;

  if (isLoading) return null;

  // Logged out: always go to login when hitting "/"
  if (!isAuthed) return <Redirect href="/login" />;

  // Logged in: send into the tab group
  return <Redirect href="/(tabs)" />;
}

